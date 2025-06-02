"use client"
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          ClientNest <span className="text-primary">Campaign Manager</span>
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          Create targeted marketing campaigns, segment your audience, and track delivery metrics all in one place.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          {status === "loading" ? (
            <Button size="lg" disabled>
              Loading...
            </Button>
          ) : status === "unauthenticated" ? (
            <Button size="lg" onClick={() => signIn()}>
              Sign in with Google
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
