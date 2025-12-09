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
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
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
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
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
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => onInterestToggle(interest)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }
                  `}
                >
                  #{interest}
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
