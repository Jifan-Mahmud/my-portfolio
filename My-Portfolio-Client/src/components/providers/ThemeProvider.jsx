"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { PreloaderProvider } from "@/context/PreloaderContext";

export function Providers({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <PreloaderProvider>
        <ToastProvider placement="top-right" />
        {children}
      </PreloaderProvider>
    </NextThemesProvider>
  );
}
