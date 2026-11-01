"use client";

import { createContext, useContext, useState } from "react";

const PreloaderContext = createContext({
  isLoaded: true,
  setIsLoaded: () => {},
});

export function PreloaderProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <PreloaderContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export const usePreloader = () => useContext(PreloaderContext);
