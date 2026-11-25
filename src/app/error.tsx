"use client";

import Link from "next/link";
import { AlertCircleIcon, HouseIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const RootError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
          <AlertCircleIcon className="size-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <HouseIcon className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RootError;
