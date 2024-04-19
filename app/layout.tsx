import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octopus",
  description: "Your 8 arms planer",
  icons: {
    icon: [
      {                // light & dark moods
        media: "(prefers-color-scheme: light)",
        url:  "/octoput-light.png",  // thing in the public folder no need to write public they are under the slash.
        href: "/octoput-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url:  "/octoput-dark.png",  
        href: "/octoput-dark.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
        {children}
      </body>
    </html>
  );
}
