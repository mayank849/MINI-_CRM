"use client"

import Link from "next/link";
import { MoonIcon, SunIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

export function MainNav() {
  const { theme, setTheme } = useTheme();
  const { status } = useSession();

  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/dashboard" className="font-semibold">
        ClientNest
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {status === "authenticated" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        )}
      </div>
    </div>
  );
}
