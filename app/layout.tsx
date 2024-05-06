import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octopus",
  description: "Your 8 arms planer",
  icons: {
    icon: [
      {
        // light & dark moods
        media: "(prefers-color-scheme: light)",
        url: "/octoput-light.png", // thing in the public folder no need to write public they are under the slash.
        href: "/octoput-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/octoput-dark.png",
        href: "/octoput-dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning to igonre  warning about server rendered elements being hydrated twice , hydration warnings
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="octopus-theme"
          >
            <Toaster position="bottom-center"/>
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
