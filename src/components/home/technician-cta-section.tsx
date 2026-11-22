import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

const TechnicianCtaSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950 p-8 sm:p-12 lg:p-16 text-white shadow-xl">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
            <Users className="size-3.5" />
            <span>For Repair Technicians</span>
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Are You a Skilled Technician? Join FixMate Today.
          </h2>

          <p className="text-sm text-gray-300 sm:text-base leading-relaxed">
            Showcase your repair services, receive incoming customer requests in your area,
            manage your pipeline, and get paid securely. Grow your repair business with us.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <span>Register as Technician</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/80 px-6 py-3.5 text-sm font-semibold text-gray-200 hover:bg-gray-800 transition-colors"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicianCtaSection;
