'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers/providers";
import { LoginProvider } from "./LoginState/logincontext";
import { ThemeProvider } from "./Providers/theme";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/store";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <style>
        @import
        url('https://fonts.googleapis.com/css?family=Poppins:400,700,900');
      </style>
      <body className={inter.className}>
        <Providers>
          <PersistGate loading={null} persistor={persistor}>
            <LoginProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </LoginProvider>
          </PersistGate>
        </Providers>
      </body>
    </html>
  );
}
