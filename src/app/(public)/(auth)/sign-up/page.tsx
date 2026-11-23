"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  WrenchIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
  XCircleIcon,
  UserCheckIcon,
  HardHatIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signUp, signIn } from "@/app/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const name = (data.name as string)?.trim();
    const email = (data.email as string)?.trim();
    const pwd = data.password as string;

    if (!name || !email || !pwd) {
      toast.add({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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

    if (!isPasswordValid) {
      toast.add({
        title: "Invalid Password",
        description: "Please meet all password requirements before submitting.",
        type: "error",
      });
      return;
    }

    const safeRole = role === "technician" ? "technician" : "customer";

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password: pwd,
        role: safeRole,
      });

      if (res.error) {
        toast.add({
          title: "Sign Up Failed",
          description: res.error.message || "Email may already be registered.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      toast.add({
        title: "Welcome to FixMate!",
        description: "Your account has been created successfully.",
        type: "success",
      });

      const redirectPath =
        safeRole === "technician"
          ? "/dashboard/technician"
          : "/dashboard/customer";

      router.push(redirectPath);
      router.refresh();
    } catch {
      toast.add({
        title: "Something Went Wrong",
        description: "Failed to create account. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
    } catch {
      toast.add({
        title: "Google Authentication Failed",
        description: "Unable to sign up with Google. Please try again.",
        type: "error",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/60 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-foreground"
          >
            <span className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white">
              <WrenchIcon className="size-5" />
            </span>
            <span>
              Fix<span className="text-blue-600 dark:text-blue-400">Mate</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join FixMate as a Customer or a Technician
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                  role === "customer"
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/25"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted"
                }`}
              >
                <UserCheckIcon className="size-6 mb-1.5" />
                <span className="text-sm font-semibold">Customer</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Book repair services
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("technician")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                  role === "technician"
                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-600/20 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted"
                }`}
              >
                <HardHatIcon className="size-6 mb-1.5" />
                <span className="text-sm font-semibold">Technician</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Offer repair services
                </span>
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <UserIcon className="size-4" />
                </span>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="pl-9 h-10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <LockIcon className="size-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 space-y-1.5 rounded-lg bg-muted p-3 text-xs text-muted-foreground border border-border">
                <p className="font-medium text-foreground">Password requirements:</p>
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircleIcon className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className={hasMinLength ? "text-emerald-700 font-medium dark:text-emerald-300" : ""}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUppercase ? (
                    <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircleIcon className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className={hasUppercase ? "text-emerald-700 font-medium dark:text-emerald-300" : ""}>
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowercase ? (
                    <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircleIcon className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className={hasLowercase ? "text-emerald-700 font-medium dark:text-emerald-300" : ""}>
                    At least one lowercase letter (a-z)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FcGoogle className="size-5" />
            <span>{googleLoading ? "Connecting..." : "Sign up with Google"}</span>
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
