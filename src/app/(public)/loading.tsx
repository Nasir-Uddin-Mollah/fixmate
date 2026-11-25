import { Skeleton } from "@/components/ui/skeleton";

const PublicLoading = () => {
  return (
    <div className="bg-muted/30">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="mt-4 h-10 w-full max-w-xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-lg" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicLoading;
