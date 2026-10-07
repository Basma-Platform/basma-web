import { useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * useUrlFilters — URL-synced filter state for React Router v6/v7.
 *
 * ✅ Reads from URL on every render (no caching, no effects)
 * ✅ Writes to URL via functional setSearchParams
 * ✅ Compatible with React Router v7 startTransition
 * ✅ No `useEffect` — prevents infinite render loops
 *
 * ⚠️ IMPORTANT: `defaults` MUST be a stable object reference.
 *    Declare it OUTSIDE the component:
 *
 *    const DEFAULT_FILTERS = { status: 'all', page: 1 };
 *    function MyPage() {
 *      const { filters, setFilter } = useUrlFilters(DEFAULT_FILTERS);
 *    }
 *
 *    If you can't hoist it, wrap it in `useMemo` or `useRef`:
 *
 *    const defaults = useRef({ status: 'all', page: 1 }).current;
 *
 *    Violating this rule will cause filter values to reset on every render.
 */
export function useUrlFilters<T extends Record<string, unknown>>(
  defaults: T
) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Freeze the default keys & values ONCE
  //    Prevents dependency churn even if `defaults` identity changes
  const frozenRef = useRef<{
    keys: string[];
    values: T;
    signature: string;
  } | null>(null);

  // Compute a stable signature of the current defaults
  const signature = useMemo(() => {
    return JSON.stringify(defaults);
  }, [defaults]);

  // Refresh frozen snapshot ONLY if the actual values changed
  if (!frozenRef.current || frozenRef.current.signature !== signature) {
    frozenRef.current = {
      keys: Object.keys(defaults),
      values: { ...defaults },
      signature,
    };
  }

  const { keys: defaultKeys, values: defaultValues } = frozenRef.current;

  // ============================================
  // Parse URL → filters object
  // Depends on searchParams.toString() (primitive — stable)
  // ============================================
  const searchParamsString = searchParams.toString();

  const filters = useMemo(() => {
    const result = { ...defaultValues } as Record<string, unknown>;
    const params = new URLSearchParams(searchParamsString);

    for (const key of defaultKeys) {
      const raw = params.get(key);
      if (raw === null) continue;

      const defaultValue = defaultValues[key as keyof T];

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
  }, [searchParamsString, defaultKeys, defaultValues]);

  // ============================================
  // setFilter — single value
  // ============================================
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K] | null | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === defaultValues[key]
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
    [setSearchParams, defaultValues]
  );

  // ============================================
  // setFilters — multiple values at once
  // ============================================
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
              value === defaultValues[key as keyof T]
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
    [setSearchParams, defaultValues]
  );

  // ============================================
  // clearFilters — remove all keys
  // ============================================
  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // ============================================
  // hasActiveFilters
  // ============================================
  const hasActiveFilters = useMemo(() => {
    return defaultKeys.some(
      (key) => filters[key as keyof T] !== defaultValues[key as keyof T]
    );
  }, [filters, defaultKeys, defaultValues]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}

export default useUrlFilters;