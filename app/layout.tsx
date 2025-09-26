import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Tracker",
  description: "Track your watched movies and TV shows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <footer className="py-6 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Movie Tracker. All rights reserved.</p>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
