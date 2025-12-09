import React from 'react';
import { X, Filter, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  selectedInterests: string[];
  onCategoryToggle: (category: string) => void;
  onInterestToggle: (interest: string) => void;
  onClearAll: () => void;
  onApply: () => void;
  availableCategories: string[];
  availableInterests: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  selectedInterests,
  onCategoryToggle,
  onInterestToggle,
  onClearAll,
  onApply,
  availableCategories,
  availableInterests,
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedInterests.length > 0;

  // Generate a deterministic color for each interest based on its hash
  const getInterestColor = (interest: string): string => {
    const colors = [
      'from-purple-500 to-purple-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600',
      'from-rose-500 to-rose-600',
      'from-violet-500 to-violet-600',
      'from-fuchsia-500 to-fuchsia-600',
      'from-sky-500 to-sky-600',
      'from-emerald-500 to-emerald-600',
      'from-amber-500 to-amber-600',
      'from-lime-500 to-lime-600',
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < interest.length; i++) {
      hash = interest.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold">Filter Content</DialogTitle>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategories.length + selectedInterests.length}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          {/* Categories Section */}
          {availableCategories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryToggle(category)}
                      className={`
                        px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-200 whitespace-nowrap
                        ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 transform'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }
                      `}
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {availableInterests.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Interests & Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const colorGradient = getInterestColor(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => onInterestToggle(interest)}
                      className={`
                        px-3 py-1 rounded-full font-medium text-xs transition-all duration-200 whitespace-nowrap
                        ${
                          isSelected
                            ? `bg-gradient-to-r ${colorGradient} text-white shadow-md hover:shadow-lg hover:scale-105 transform`
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }
                      `}
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={!hasActiveFilters}
            className="text-gray-600 dark:text-gray-400 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
