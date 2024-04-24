"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import * as React from "react";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
