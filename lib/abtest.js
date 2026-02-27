/**
 * Lightweight A/B testing for ad placements.
 *
 * Usage:
 *   const variant = useABTest('blog-ad-format', ['auto', 'large-rectangle', 'rectangle']);
 *   <AdSlot format={variant} />
 *
 * How it works:
 * - Assigns users to a random variant on first visit, persists in localStorage
 * - Same user always sees the same variant (stable across sessions)
 * - Sends the active variant to Google Analytics as a custom event for analysis
 */
import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'ab_';

function getOrAssign(testName, variants) {
  if (typeof window === 'undefined') return variants[0];

  const key = STORAGE_PREFIX + testName;
  try {
    const stored = localStorage.getItem(key);
    if (stored && variants.includes(stored)) return stored;

    const chosen = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(key, chosen);
    return chosen;
  } catch {
    return variants[0];
  }
}

export function useABTest(testName, variants) {
  const [variant, setVariant] = useState(variants[0]);

  useEffect(() => {
    const chosen = getOrAssign(testName, variants);
    setVariant(chosen);

    // Report to Google Analytics
    window.gtag?.('event', 'ab_test', {
      test_name: testName,
      variant: chosen,
    });
  }, [testName]);

  return variant;
}
