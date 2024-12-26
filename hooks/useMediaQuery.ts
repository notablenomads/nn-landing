import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);

        // Create media query list
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        // Define callback
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add event listener
        mediaQuery.addEventListener('change', handler);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, [query]);

    // Return false during SSR, actual value after mounting
    return mounted ? matches : false;
}