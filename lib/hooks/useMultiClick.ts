import { useCallback, useEffect, useRef } from 'react';

/**
 * Counts rapid successive clicks and reports the total once the gesture
 * settles, so callers can distinguish between single, double and triple taps.
 */
export function useMultiClick(onSettle: (count: number) => void, windowMs = 450) {
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const registerClick = useCallback(() => {
    countRef.current += 1;
    clearTimer();
    timerRef.current = setTimeout(() => {
      const count = countRef.current;
      countRef.current = 0;
      timerRef.current = null;
      onSettle(count);
    }, windowMs);
  }, [clearTimer, onSettle, windowMs]);

  useEffect(() => clearTimer, [clearTimer]);

  return registerClick;
}
