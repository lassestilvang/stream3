// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, Film, Bookmark, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { signIn, signOut } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="text-xl font-bold">MovieTracker</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <div className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </div>
            </Link>
            <Link
              href="/watched"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/watched") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <div className="flex items-center gap-1">
                <Film className="h-4 w-4" />
                <span>Watched</span>
              </div>
            </Link>
            <Link
              href="/watchlist"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/watchlist")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              <div className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                <span>Watchlist</span>
              </div>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                aria-label="Sign out"
              >
                <User className="h-5 w-5" />
              </Button>
              <span className="hidden sm:block text-sm font-medium">
                {user.name || user.email}
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button onClick={() => signIn()} variant="default">
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t p-4">
        <div className="flex justify-around">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 ${
              isActive("/") ? "text-primary" : ""
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            href="/watched"
            className={`flex flex-col items-center gap-1 ${
              isActive("/watched") ? "text-primary" : ""
            }`}
          >
            <Film className="h-5 w-5" />
            <span className="text-xs">Watched</span>
          </Link>
          <Link
            href="/watchlist"
            className={`flex flex-col items-center gap-1 ${
              isActive("/watchlist") ? "text-primary" : ""
            }`}
          >
            <Bookmark className="h-5 w-5" />
            <span className="text-xs">List</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
