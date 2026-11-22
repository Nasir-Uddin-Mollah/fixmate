import { Search, Clock, Wrench, CreditCard } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Explore verified repair services for smartphones, laptops, ACs, and home appliances by category, price, or location.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a Request",
    description:
      "Describe the problem, choose your preferred service date, and provide your address for home visit or shop drop-off.",
    icon: Clock,
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description:
      "Track progress in real-time as the technician accepts the job, starts work, and marks it completed with the final amount.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Inspect the repaired device to your full satisfaction, then pay securely online using Stripe with complete peace of mind.",
    icon: CreditCard,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-gray-50/70 py-16 border-y border-gray-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Simple 4-Step Process
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How FixMate Works
          </p>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            A transparent, risk-free workflow designed to protect customers and empower
            skilled technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-2xl font-black text-gray-200">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
