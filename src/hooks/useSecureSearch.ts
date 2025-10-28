// src/hooks/useSecureSearch.ts - Secure Search Hook
// Provides a secure interface for search functionality with validation and rate limiting

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  secureSearchValidation,
  encodeSearchQuery,
  searchRateLimiter,
  SEARCH_SECURITY_CONFIG,
  ValidationResult,
} from '@/utils/search.security';

export interface SearchState {
  query: string;
  isValid: boolean;
  isSearching: boolean;
  errors: string[];
  warnings: string[];
  remainingSearches: number;
}

export interface UseSecureSearchReturn {
  // State
  searchState: SearchState;

  // Methods
  setQuery: (query: string) => void;
  validateQuery: () => ValidationResult & { rateLimited: boolean };
  performSearch: (redirectPath?: string) => void;
  clearSearch: () => void;

  // Helpers
  canSearch: boolean;
  isRateLimited: boolean;
}

export interface UseSecureSearchOptions {
  autoValidate?: boolean;
  onSearchSuccess?: (query: string) => void;
  onSearchError?: (errors: string[]) => void;
  debounceMs?: number;
}

/**
 * Custom hook for secure search functionality
 */
export function useSecureSearch(options: UseSecureSearchOptions = {}): UseSecureSearchReturn {
  const {
    autoValidate = true,
    onSearchSuccess,
    onSearchError,
    debounceMs = 300,
  } = options;

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isValid: false,
    isSearching: false,
    errors: [],
    warnings: [],
    remainingSearches: SEARCH_SECURITY_CONFIG.MAX_SEARCHES_PER_MINUTE,
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update remaining searches count
   */
  const updateRemainingSearches = useCallback(() => {
    const remaining = searchRateLimiter.getRemainingSearches();
    setSearchState(prev => ({ ...prev, remainingSearches: remaining }));
  }, []);

  /**
   * Validate current query
   */
  const validateQuery = useCallback((): ValidationResult & { rateLimited: boolean } => {
    const validation = secureSearchValidation(searchState.query, user?.id);

    setSearchState(prev => ({
      ...prev,
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      remainingSearches: searchRateLimiter.getRemainingSearches(),
    }));

    return validation;
  }, [searchState.query, user?.id]);

  /**
   * Set search query with optional auto-validation
   */
  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));

    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Auto-validate with debounce
    if (autoValidate && query.trim()) {
      debounceTimer.current = setTimeout(() => {
        const validation = secureSearchValidation(query, user?.id);

        setSearchState(prev => ({
          ...prev,
          query,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          remainingSearches: searchRateLimiter.getRemainingSearches(),
        }));
      }, debounceMs);
    } else if (!query.trim()) {
      // Clear validation for empty query
      setSearchState(prev => ({
        ...prev,
        query,
        isValid: false,
        errors: [],
        warnings: [],
      }));
    }
  }, [autoValidate, debounceMs, user?.id]);

  /**
   * Perform search with security checks
   */
  const performSearch = useCallback((redirectPath: string = '/browse') => {
    // Check authentication
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: `${redirectPath}?q=${encodeURIComponent(searchState.query)}` },
          message: 'Please sign in to search content',
        },
      });
      return;
    }

    setSearchState(prev => ({ ...prev, isSearching: true }));

    // Validate query
    const validation = secureSearchValidation(searchState.query, user?.id);

    if (!validation.isValid) {
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        isValid: false,
        errors: validation.errors,
        warnings: validation.warnings,
        remainingSearches: searchRateLimiter.getRemainingSearches(),
      }));

      // Callback for errors
      if (onSearchError) {
        onSearchError(validation.errors);
      }

      return;
    }

    try {
      // Encode and navigate
      const encodedQuery = encodeSearchQuery(validation.sanitized);
      const searchUrl = `${redirectPath}?q=${encodedQuery}`;

      // Update state
      setSearchState(prev => ({
        ...prev,
        query: validation.sanitized,
        isSearching: false,
        isValid: true,
        errors: [],
        warnings: validation.warnings,
        remainingSearches: searchRateLimiter.getRemainingSearches(),
      }));

      // Callback for success
      if (onSearchSuccess) {
        onSearchSuccess(validation.sanitized);
      }

      // Navigate to search results
      navigate(searchUrl);
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        isValid: false,
        errors: ['Failed to perform search. Please try again.'],
        remainingSearches: searchRateLimiter.getRemainingSearches(),
      }));

      if (onSearchError) {
        onSearchError(['Failed to perform search. Please try again.']);
      }
    }
  }, [searchState.query, isAuthenticated, user?.id, navigate, onSearchSuccess, onSearchError]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      isValid: false,
      isSearching: false,
      errors: [],
      warnings: [],
      remainingSearches: searchRateLimiter.getRemainingSearches(),
    });

    // Clear debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  /**
   * Update remaining searches periodically
   */
  useEffect(() => {
    const interval = setInterval(updateRemainingSearches, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [updateRemainingSearches]);

  /**
   * Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Computed properties
  const canSearch = searchState.query.trim().length > 0 &&
                    !searchState.isSearching &&
                    searchState.remainingSearches > 0;

  const isRateLimited = searchRateLimiter.isRateLimited();

  return {
    searchState,
    setQuery,
    validateQuery,
    performSearch,
    clearSearch,
    canSearch,
    isRateLimited,
  };
}

export default useSecureSearch;
