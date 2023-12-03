// useMediaQuery.js
import { useEffect, useState } from 'react';

export function useMediaQuery(query: any) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleResize = () => {
      setMatches(mediaQueryList.matches);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial match state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [query]);

  return matches;
}
