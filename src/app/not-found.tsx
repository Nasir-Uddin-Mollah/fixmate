import Link from "next/link";
import { WrenchIcon } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
        <WrenchIcon className="size-7" />
      </span>
      <p className="mt-6 text-sm font-bold tracking-wider text-blue-600 uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
