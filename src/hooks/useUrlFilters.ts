import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Shared hook to sync filter state with URL query params.
 *
 * - Reads initial values from URL on mount
 * - Updates URL when filters change (replace, not push)
 * - Supports string, number, boolean values
 * - Skips redundant updates (prevents infinite loops)
 *
 * @example
 * const { filters, setFilter, clearFilters, hasActiveFilters } = useUrlFilters({
 *   status: 'all',
 *   priority: 'all',
 *   page: 1,
 * });
 * // URL: ?status=pending&page=2 → filters.status === 'pending', filters.page === 2
 */
export function useUrlFilters<T extends Record<string, unknown>>(
  defaults: T
) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Stable ref to defaults (avoid effect deps churn)
  const defaultsRef = useRef(defaults);
  useEffect(() => {
    defaultsRef.current = defaults;
  });

  // Parse URL params → filter object
  const filters = useMemo(() => {
    const result: any = { ...defaultsRef.current };

    for (const key of Object.keys(defaultsRef.current)) {
      const raw = searchParams.get(key);
      if (raw === null) continue;

      const defaultValue = defaultsRef.current[key];

      if (typeof defaultValue === 'number') {
        const num = Number(raw);
        if (!isNaN(num)) result[key] = num;
      } else if (typeof defaultValue === 'boolean') {
        result[key] = raw === 'true' || raw === '1';
      } else {
        result[key] = raw;
      }
    }

    return result as T;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Set a single filter
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K] | null | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === defaultsRef.current[key]
          ) {
            next.delete(String(key));
          } else {
            next.set(String(key), String(value));
          }

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Set multiple filters at once
  const setFilters = useCallback(
    (patch: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          for (const [key, value] of Object.entries(patch)) {
            if (
              value === null ||
              value === undefined ||
              value === '' ||
              value === defaultsRef.current[key as keyof T]
            ) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Clear all filters (remove from URL)
  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // True if any filter differs from default
  const hasActiveFilters = useMemo(() => {
    return (Object.keys(defaultsRef.current) as Array<keyof T>).some(
      (key) => filters[key] !== defaultsRef.current[key]
    );
  }, [filters]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}

export default useUrlFilters;