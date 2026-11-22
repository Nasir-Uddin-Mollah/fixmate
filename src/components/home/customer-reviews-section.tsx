import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Tanvir Rahman",
    area: "Dhanmondi, Dhaka",
    role: "Smartphone Customer",
    comment:
      "My iPhone 14 screen was completely shattered. The technician arrived on time, replaced it in 45 minutes, and I only paid after testing touch sensitivity. Amazing experience!",
    rating: 5,
  },
  {
    name: "Sabrina Mostafa",
    area: "Gulshan, Dhaka",
    role: "AC Servicing Customer",
    comment:
      "The master wash for my Daikin AC was spotless. What gave me total confidence was the transparent status pipeline and paying through Stripe only after everything was done.",
    rating: 5,
  },
  {
    name: "Arif Hossain",
    area: "Uttara, Dhaka",
    role: "Laptop Owner",
    comment:
      "Fixed my Dell XPS thermal throttling and replaced the battery. Fair pricing, no hidden costs, and friendly communication throughout.",
    rating: 5,
  },
];

const CustomerReviewsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Customer Reviews
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Trusted by Thousands
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Hear from people who repaired their phones, laptops, and appliances with FixMate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-gray-600 italic">
                &ldquo;{t.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.area}</p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-blue-600">
                {t.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
