// src/components/community/CommunityFiltersBar.tsx
import { CommunityFilters, CommunityCategory } from '@/types/community.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Clock, TrendingUp, Star, Calendar } from 'lucide-react';

interface CommunityFiltersBarProps {
  filters: CommunityFilters;
  onFilterChange: (key: keyof CommunityFilters, value: any) => void;
  categories: CommunityCategory[];
}

export const CommunityFiltersBar: React.FC<CommunityFiltersBarProps> = ({
  filters,
  onFilterChange,
  categories
}) => {
  const sortOptions = [
    { value: 'hot', label: 'Hot', icon: TrendingUp },
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'top', label: 'Top', icon: Star },
    { value: 'oldest', label: 'Oldest', icon: Calendar },
  ];

  const timeRangeOptions = [
    { value: 'hour', label: 'Past Hour' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gradient-card rounded-2xl border border-border/20">
      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
        <Tabs value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value as CommunityFilters['sortBy'])}>
          <TabsList className="h-9">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TabsTrigger key={option.value} value={option.value} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {option.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Time Range (only show for 'top' sort) */}
      {filters.sortBy === 'top' && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Time:</span>
          <Select value={filters.timeRange} onValueChange={(value) => onFilterChange('timeRange', value)}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Additional Filters */}
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onFilterChange('showAnonymous', !filters.showAnonymous)}
            >
              {filters.showAnonymous ? 'Hide' : 'Show'} Anonymous Posts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
