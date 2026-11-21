import Link from "next/link";
import { WrenchIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works / About", href: "/about" },
];

const POPULAR_CATEGORIES = [
  { label: "Smartphone Repair", href: "/services?category=Smartphone" },
  { label: "Laptop & PC Servicing", href: "/services?category=Laptop%20%26%20PC" },
  { label: "AC Servicing", href: "/services?category=AC" },
  { label: "Refrigerator Repair", href: "/services?category=Refrigerator" },
  { label: "TV & Entertainment", href: "/services?category=TV" },
  { label: "Washing Machine", href: "/services?category=Washing%20Machine" },
  { label: "Electrical Wiring", href: "/services?category=Electrical" },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity"
            >
              <span className="flex items-center justify-center rounded-lg bg-blue-600 p-1.5 text-white">
                <WrenchIcon className="size-5" />
              </span>
              <span>
                Fix<span className="text-blue-600">Mate</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600">
              FixMate is an on-demand device & home appliance repair booking platform.
              Connect with verified technicians, track your repair step by step,
              and pay securely only after the job is completed.
            </p>
            {/* Social Links (including the new X logo) */}
            <div className="flex items-center gap-3 pt-2">
              {/* X (formerly Twitter) new logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-black transition-colors"
                aria-label="Follow us on X"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-blue-700 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sign-in"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Technician Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Join as Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {POPULAR_CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="size-4 shrink-0 text-blue-600 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-blue-600" />
                <a
                  href="tel:+8801700000000"
                  className="hover:text-blue-600 transition-colors"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="size-4 shrink-0 text-blue-600" />
                <a
                  href="mailto:support@fixmate.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  support@fixmate.com
                </a>
              </li>
              <li className="pt-2 text-xs text-gray-500">
                Service Hours: 9:00 AM – 9:00 PM (Every day)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p suppressHydrationWarning>
            © {CURRENT_YEAR} FixMate. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-700 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/about" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-gray-700 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
