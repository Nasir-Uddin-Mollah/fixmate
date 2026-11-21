"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  WrenchIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/app/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const email = (data.email as string)?.trim();
    const password = data.password as string;

    if (!email || !password) {
      toast.add({
        title: "Missing Credentials",
        description: "Please enter both your email and password.",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.add({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.add({
          title: "Sign In Failed",
          description:
            res.error.message || "Invalid email or password. Please try again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      toast.add({
        title: "Signed In Successfully",
        description: "Welcome back to FixMate!",
        type: "success",
      });

      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        const userRole = (res.data?.user as { role?: string })?.role;
        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "technician") {
          router.push("/dashboard/technician");
        } else {
          router.push("/dashboard/customer");
        }
      }

      router.refresh();
    } catch {
      toast.add({
        title: "Error",
        description:
          "Unable to sign in. Please verify your credentials and try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/dashboard/customer",
      });
    } catch {
      toast.add({
        title: "Google Sign-In Failed",
        description: "Could not complete Google authentication.",
        type: "error",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50/60 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-gray-900"
          >
            <span className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white">
              <WrenchIcon className="size-5" />
            </span>
            <span>
              Fix<span className="text-blue-600">Mate</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your FixMate dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <MailIcon className="size-4" />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-9 h-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LockIcon className="size-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="size-5" />
            <span>
              {googleLoading ? "Connecting..." : "Sign in with Google"}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
