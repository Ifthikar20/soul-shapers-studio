import React from 'react';
import { X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContentFiltersProps {
  selectedCategories: string[];
  selectedInterests: string[];
  onCategoryToggle: (category: string) => void;
  onInterestToggle: (interest: string) => void;
  onClearAll: () => void;
  availableCategories: string[];
  availableInterests: string[];
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  selectedCategories,
  selectedInterests,
  onCategoryToggle,
  onInterestToggle,
  onClearAll,
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Filter Content
          </h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {selectedCategories.length + selectedInterests.length} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories Section */}
      {availableCategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
            Categories
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => onCategoryToggle(category)}
                  className={`
                    px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 whitespace-nowrap
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transform'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
            Interests & Topics
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              const colorGradient = getInterestColor(interest);
              return (
                <button
                  key={interest}
                  onClick={() => onInterestToggle(interest)}
                  className={`
                    px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap
                    ${
                      isSelected
                        ? `bg-gradient-to-r ${colorGradient} text-white shadow-lg hover:shadow-xl hover:scale-105 transform`
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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

      {/* Empty State */}
      {availableCategories.length === 0 && availableInterests.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No filters available
        </div>
      )}
    </div>
  );
};

export default ContentFilters;
