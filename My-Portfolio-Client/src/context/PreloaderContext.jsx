"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PreloaderContext = createContext({
  isLoaded: false,
  setIsLoaded: () => {},
});

export function PreloaderProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Failsafe timer: ensures content becomes visible even in edge cases
    const timer = setTimeout(() => {
      setIsLoaded((prev) => (prev ? prev : true));
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export const usePreloader = () => useContext(PreloaderContext);
