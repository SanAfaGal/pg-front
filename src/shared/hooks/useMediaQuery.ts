import { useState, useEffect } from 'react';

/**
 * Hook to detect device type based on screen size
 * Uses Tailwind breakpoints:
 * - Mobile: < 640px (default)
 * - Tablet: 640px - 1024px (sm to lg)
 * - Desktop: >= 1024px (lg+)
 */
export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Mobile: < 640px
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    // Tablet: 640px - 1023px
    const tabletQuery = window.matchMedia('(min-width: 640px) and (max-width: 1023px)');
    // Desktop: >= 1024px
    const desktopQuery = window.matchMedia('(min-width: 1024px)');

    const updateMatches = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    // Set initial values
    updateMatches();

    // Add listeners for changes
    mobileQuery.addEventListener('change', updateMatches);
    tabletQuery.addEventListener('change', updateMatches);
    desktopQuery.addEventListener('change', updateMatches);

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', updateMatches);
      tabletQuery.removeEventListener('change', updateMatches);
      desktopQuery.removeEventListener('change', updateMatches);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
  };
};

