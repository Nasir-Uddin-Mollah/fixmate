"use client";

import { AlertCircleIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-red-100 bg-card p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircleIcon className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {error.message || "We could not load this dashboard section. Please try again."}
      </p>
      <Button onClick={reset} className="mt-6 bg-blue-600 hover:bg-blue-700">
        <RotateCcwIcon className="size-4" />
        Try again
      </Button>
    </div>
  );
};

export default DashboardError;
