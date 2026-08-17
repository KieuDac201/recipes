"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/authApi";
import { forgotPasswordSchema } from "@/src/schemas";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationResult = forgotPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Email không hợp lệ.";
      setErrorMessage(firstError);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword({
        email: validationResult.data.email,
      });

      setSuccessMessage(
        res.message || "Mã OTP đã được gửi đến email của bạn!"
      );

      // Automatically navigate to Reset Password page and prefill email
      setTimeout(() => {
        router.push(
          `/reset-password?email=${encodeURIComponent(
            validationResult.data.email
          )}`
        );
      }, 1000);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Không thể gửi mã OTP. Vui lòng kiểm tra lại email của bạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_12px_32px_-6px_rgba(255,107,107,0.12)] border border-[#efeeea] p-6 sm:p-8 md:p-10 relative z-10 transition-all">
      {/* Icon Area */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#ffdad8] flex items-center justify-center text-[#ae2f34] shadow-inner">
          <span
            className="material-symbols-outlined text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock_reset
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group mb-2">
          <span className="font-[var(--font-headline)] text-2xl font-extrabold text-[#ae2f34] tracking-tight group-hover:scale-105 transition-transform duration-200">
            GourmetPop
          </span>
        </Link>
        <h1 className="font-[var(--font-headline)] text-2xl sm:text-3xl font-bold text-[#1b1c1a] mb-2 tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-sm sm:text-base text-[#584140] font-medium leading-relaxed">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#d1f2e2] border border-[#006c4f]/20 text-[#003b29] text-sm flex items-start gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006c4f]">
            check_circle
          </span>
          <span className="font-medium">{successMessage} Đang chuyển sang trang nhập mã OTP...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="your@email.com"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-3 pl-11 pr-4 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-base focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
            />
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
                Đang gửi OTP...
              </>
            ) : (
              <>
                Send OTP
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Back to Login */}
      <div className="mt-8 text-center pt-6 border-t border-[#efeeea]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-[var(--font-headline)] font-semibold text-sm text-[#584140] hover:text-[#ae2f34] transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          Back to Login
        </Link>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 sm:p-6 md:p-12 font-[var(--font-body)] text-[#1b1c1a] antialiased selection:bg-[#ff6b6b] selection:text-white relative overflow-hidden">
      {/* Abstract Decorative Elements from Stitch Design */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#ffb3b0]/20 blur-[100px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#ffd167]/20 blur-[80px] opacity-50 mix-blend-multiply" />
      </div>

      <Suspense fallback={<div className="text-center font-bold text-[#ae2f34]">Đang tải...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
