import { useRef, useState, useCallback } from 'react';

const DISTANCE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.3; // px/ms

export default function useSwipeGesture({ onSwipeUp, onSwipeDown }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      locked: null, // null = undecided, 'vertical' = tracking, 'horizontal' = ignore
    };
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;

    // Decide axis lock on first significant movement
    if (touchRef.current.locked === null) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx > 10 || absDy > 10) {
        touchRef.current.locked = absDy >= absDx ? 'vertical' : 'horizontal';
      }
    }

    if (touchRef.current.locked === 'vertical') {
      setDragOffset(dy);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchRef.current) return;
    const { startTime, locked } = touchRef.current;
    const elapsed = Date.now() - startTime;
    const velocity = Math.abs(dragOffset) / elapsed;

    if (locked === 'vertical') {
      const passedThreshold =
        Math.abs(dragOffset) > DISTANCE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

      if (passedThreshold) {
        if (dragOffset < 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }

    touchRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  }, [dragOffset, onSwipeUp, onSwipeDown]);

  return { onTouchStart, onTouchMove, onTouchEnd, dragOffset, isDragging };
}
