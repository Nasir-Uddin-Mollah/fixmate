import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import HowItWorksSection from "@/components/home/how-it-works-section";
import WhyFixMateSection from "@/components/home/why-fixmate-section";

const VALUES = [
  {
    title: "Transparency First",
    description:
      "Clear starting prices, honest timelines, and a status you can track at every step.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Expertise",
    description:
      "Every technician and service listing is reviewed by our admin team before it goes live.",
    icon: BadgeCheck,
  },
  {
    title: "Customer First",
    description:
      "You inspect the completed repair and only then decide to pay. Your satisfaction comes first.",
    icon: HeartHandshake,
  },
  {
    title: "Secure Payments",
    description:
      "Stripe-powered checkout keeps every transaction safe, simple, and traceable.",
    icon: CreditCard,
  },
];

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-blue-950/50 dark:via-background dark:to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-300">
              <Sparkles className="size-3.5" />
              About FixMate
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Repairs should be{" "}
              <span className="text-blue-600 dark:text-blue-400">simple, honest</span> and stress-free.
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              FixMate was built to remove the guesswork from device and appliance repair.
              We connect you with verified technicians, show you the price upfront, and
              let you pay only after the job is done right.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse Services
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#our-story"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story + Mission / Vision */}
      <section id="our-story" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Story
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Born from a simple frustration
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Finding a trustworthy repair technician used to mean endless phone calls,
                unclear quotes, and the worry of paying before knowing whether the device
                was actually fixed.
              </p>
              <p>
                We started FixMate to change that. Today, customers can compare approved
                services, book in a few clicks, follow the job pipeline in real time, and
                pay securely only after everything is complete.
              </p>
              <p>
                At the same time, skilled technicians get a simple way to showcase their
                work, reach customers in their area, and grow with every completed repair.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                <Target className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To make reliable repair service accessible to everyone through verified
                technicians, transparent pricing, and a process that puts the customer in
                control from request to payment.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Eye className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To become the most trusted repair platform in Bangladesh — where every
                device gets expert care and every technician gets the recognition they
                deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reused home sections: process + trust/stats */}
      <HowItWorksSection />
      <WhyFixMateSection />

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            What We Stand For
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            The FixMate Promise
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Four principles guide every repair that happens on our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{value.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950 p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              <Wrench className="size-3.5" />
              Let&apos;s get it fixed
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your device deserves an expert.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Browse approved services from verified technicians and book your repair in
              minutes — with payment only after the work is complete.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Find a Service
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
