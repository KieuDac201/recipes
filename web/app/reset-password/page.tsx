"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/authApi";
import { resetPasswordSchema } from "@/src/schemas";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 1; // 1: weak
    if (password.length >= 6 && /[0-9]/.test(password)) strength = 2; // medium
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      strength = 3; // strong
    }
    return strength;
  }, [password]);

  const handleResendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (resendCooldown > 0 || resending) return;

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMessage("Vui lòng cung cấp địa chỉ email hợp lệ để gửi lại mã OTP.");
      return;
    }

    try {
      setResending(true);
      setErrorMessage(null);
      await authService.forgotPassword({ email: email.trim() });
      setSuccessMessage("Đã gửi lại mã OTP vào email của bạn!");
      setResendCooldown(60);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau."
      );
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationResult = resetPasswordSchema.safeParse({
      email: email.trim(),
      otp: otp.trim(),
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message ||
        "Thông tin đặt lại mật khẩu không hợp lệ.";
      setErrorMessage(firstError);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword({
        email: validationResult.data.email,
        otp: validationResult.data.otp,
        password: validationResult.data.password,
      });

      setSuccessMessage(
        res.message || "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
      );

      setTimeout(() => {
        router.push(
          `/login?reset=true&email=${encodeURIComponent(
            validationResult.data.email
          )}`
        );
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_12px_32px_-6px_rgba(255,107,107,0.12)] border border-[#efeeea] p-6 sm:p-8 md:p-10 relative z-10 transition-all">
      {/* Icon Header */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-[#ffdad8] flex items-center justify-center text-[#ae2f34] shadow-inner">
          <span
            className="material-symbols-outlined text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock_reset
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-7">
        <Link href="/" className="inline-block group mb-1">
          <span className="font-[var(--font-headline)] text-2xl font-extrabold text-[#ae2f34] tracking-tight group-hover:scale-105 transition-transform duration-200">
            GourmetPop
          </span>
        </Link>
        <h1 className="font-[var(--font-headline)] text-2xl sm:text-3xl font-bold text-[#1b1c1a] mb-2 tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm sm:text-base text-[#584140] font-medium leading-relaxed">
          Enter your new credentials below to securely update your account access.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#d1f2e2] border border-[#006c4f]/20 text-[#003b29] text-sm flex items-start gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006c4f]">
            check_circle
          </span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field (Prefilled) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="email"
              className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a]"
            >
              Email Address
            </label>
            {email && (
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-xs font-semibold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors cursor-pointer"
              >
                {isEditingEmail ? "Khóa email" : "Đổi email"}
              </button>
            )}
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c706f] pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              readOnly={!isEditingEmail && !!searchParams.get("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={`w-full rounded-xl py-2.5 pl-11 pr-4 font-[var(--font-body)] text-sm sm:text-base border transition-all duration-200 ${
                !isEditingEmail && !!searchParams.get("email")
                  ? "bg-[#f4f4f0] border-transparent text-[#584140] cursor-not-allowed"
                  : "bg-white border-[#e0bfbd] text-[#1b1c1a] focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none"
              }`}
            />
          </div>
        </div>

        {/* OTP Code Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="otp"
              className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a]"
            >
              Verification Code (OTP)
            </label>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || resendCooldown > 0}
              className="text-xs font-semibold text-[#ae2f34] hover:text-[#ff6b6b] disabled:text-[#8c706f]/60 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {resending
                ? "Đang gửi..."
                : resendCooldown > 0
                ? `Gửi lại (${resendCooldown}s)`
                : "Resend Code"}
            </button>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">pin</span>
            </span>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="6-digit code sent to email"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base tracking-widest font-semibold focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] mb-1.5"
          >
            New Password
          </label>
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
              placeholder="Create a strong password"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-2.5 pl-11 pr-12 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden bg-[#e3e2df]">
                <div
                  className={`h-full w-1/3 transition-colors duration-300 ${
                    passwordStrength >= 1 ? (passwordStrength === 1 ? "bg-[#ff9e9e]" : passwordStrength === 2 ? "bg-[#ffd167]" : "bg-[#00b083]") : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full w-1/3 transition-colors duration-300 ${
                    passwordStrength >= 2 ? (passwordStrength === 2 ? "bg-[#ffd167]" : "bg-[#00b083]") : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full w-1/3 transition-colors duration-300 ${
                    passwordStrength === 3 ? "bg-[#00b083]" : "bg-transparent"
                  }`}
                />
              </div>
              <p className="text-[11px] font-medium text-[#8c706f] mt-1">
                Độ mạnh mật khẩu:{" "}
                <span className="font-bold">
                  {passwordStrength === 1 && "Yếu (thêm số & ký tự đặc biệt)"}
                  {passwordStrength === 2 && "Trung bình (thêm chữ hoa & ký tự đặc biệt)"}
                  {passwordStrength === 3 && "Mạnh"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block font-[var(--font-headline)] text-sm font-semibold text-[#1b1c1a] mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </span>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-[#f4f4f0] border border-transparent rounded-xl py-2.5 pl-11 pr-12 text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base focus:bg-white focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/15 focus:outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8c706f] hover:text-[#1b1c1a] transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
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
                Đang cập nhật...
              </>
            ) : (
              <>
                Reset Password
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Back to Sign In */}
      <div className="mt-7 text-center pt-5 border-t border-[#efeeea]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-[var(--font-headline)] font-semibold text-sm text-[#584140] hover:text-[#ae2f34] transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 sm:p-6 md:p-12 font-[var(--font-body)] text-[#1b1c1a] antialiased selection:bg-[#ff6b6b] selection:text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#ffb3b0]/20 blur-[100px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#ffd167]/20 blur-[80px] opacity-50 mix-blend-multiply" />
      </div>

      <Suspense fallback={<div className="text-center font-bold text-[#ae2f34]">Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
