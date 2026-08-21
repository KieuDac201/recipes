"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/authApi";
import { loginSchema } from "@/src/schemas";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if redirected due to expired session
    if (typeof window !== "undefined") {
      const expiredMsg = sessionStorage.getItem("session_expired_message");
      if (expiredMsg) {
        setErrorMessage(expiredMsg);
        sessionStorage.removeItem("session_expired_message");
      }
    }

    const isRegistered = searchParams.get("registered");
    const isReset = searchParams.get("reset");
    const prefilledEmail = searchParams.get("email");

    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }

    if (isRegistered === "true") {
      setSuccessMessage("Đăng ký tài khoản thành công! Vui lòng nhập mật khẩu để đăng nhập.");
    } else if (isReset === "true") {
      setSuccessMessage("Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate with Zod Schema
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ.";
      setErrorMessage(firstError);
      return;
    }

    try {
      setLoading(true);
      await authService.login(validationResult.data);
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");

      const redirectTo = searchParams.get("redirect") || "/admin";
      setTimeout(() => {
        router.push(redirectTo);
      }, 800);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_12px_32px_-6px_rgba(255,107,107,0.12)] border border-[#efeeea] p-6 sm:p-8 md:p-10 transition-all">
      {/* Brand / Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group mb-1">
          <h1 className="font-[var(--font-headline)] text-4xl sm:text-5xl font-extrabold text-[#ae2f34] tracking-tight group-hover:scale-105 transition-transform duration-200">
            Bếp Phương
          </h1>
        </Link>
        <p className="text-base sm:text-lg text-[#584140] mt-1 font-medium">
          Sign in to discover your next favorite recipe.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#d1f2e2] border border-[#006c4f]/20 text-[#003b29] text-sm flex items-start gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006c4f]">
            check_circle
          </span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] mb-2"
          >
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-3 pl-11 pr-4 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-base focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a]"
            >
              Password
            </label>
            <Link
              href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : "/forgot-password"}
              className="text-xs font-bold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors font-[var(--font-headline)]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-3 pl-11 pr-12 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-base focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8c706f] hover:text-[#1b1c1a] transition-colors cursor-pointer"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6b6b] hover:bg-[#ff5656] text-white border-b-4 border-[#ae2f34] hover:border-[#8c1520] active:border-b-0 active:translate-y-1 rounded-full py-3.5 px-6 font-[var(--font-headline)] font-bold text-sm tracking-wide shadow-md hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Register Redirection */}
      <div className="mt-8 text-center pt-6 border-t border-[#efeeea]">
        <p className="text-sm sm:text-base text-[#584140]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-[var(--font-headline)] font-bold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors ml-1 inline-flex items-center gap-0.5 group"
          >
            Join Now
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 sm:p-6 md:p-12 font-[var(--font-body)] text-[#1b1c1a] antialiased selection:bg-[#ff6b6b] selection:text-white">
      <Suspense fallback={<div className="text-center font-bold text-[#ae2f34]">Đang tải...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
