"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLoginButton from "@/app/components/FacebookLoginButton";
import { authService } from "@/src/services/authApi";
import { registerSchema } from "@/src/schemas";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        setGoogleLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        await authService.googleLogin(credentialResponse.credential);
        setSuccessMessage("Đăng ký Google thành công! Đang chuyển hướng...");

        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err: any) {
        setErrorMessage(err.message || "Đăng ký bằng Google thất bại. Vui lòng thử lại.");
      } finally {
        setGoogleLoading(false);
      }
    }
  };

  const handleGoogleError = () => {
    setErrorMessage("Không thể kết nối với dịch vụ Google. Vui lòng thử lại.");
  };

  const handleFacebookSuccess = async (accessToken: string) => {
    try {
      setFacebookLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await authService.facebookLogin(accessToken);
      setSuccessMessage("Đăng ký Facebook thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || "Đăng ký bằng Facebook thất bại. Vui lòng thử lại.");
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleFacebookError = (errorMsg: string) => {
    setErrorMessage(errorMsg || "Đăng ký bằng Facebook thất bại.");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const fbAccessToken = params.get("access_token");
    const fbError = params.get("error_description") || params.get("error");

    if (fbAccessToken) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "FACEBOOK_AUTH_SUCCESS", accessToken: fbAccessToken },
          window.location.origin
        );
        window.close();
        return;
      }
      handleFacebookSuccess(fbAccessToken);
    } else if (fbError) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "FACEBOOK_AUTH_ERROR", error: fbError },
          window.location.origin
        );
        window.close();
        return;
      }
      setErrorMessage(fbError);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate with Zod Schema
    const validationResult = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Thông tin đăng ký không hợp lệ.";
      setErrorMessage(firstError);
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });
      setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản...");
      setTimeout(() => {
        router.push(`/verify-email?registered=true&email=${encodeURIComponent(email.trim())}`);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Đăng ký không thành công. Email này có thể đã được sử dụng."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 sm:p-6 md:p-12 font-[var(--font-body)] text-[#1b1c1a] antialiased selection:bg-[#ff6b6b] selection:text-white">
      <main className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(255,107,107,0.12)] overflow-hidden border border-[#efeeea] transform transition-all duration-300">
        {/* Left Column: Image Section (Hidden on Mobile) */}
        <div className="hidden md:block w-1/2 relative bg-[#e9e8e4] overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2dckchm15pzyRB1wgeEQAzOhxclA3MAkpF4Tja10JRAmOqw16aFgiz3apQNtck4TYKELLuXZhtQjxtU__Wtr7lKYHxaxsbWhont-m-_y0WJbYKe0VS86DeTFRQaxnWoo1TXtECQ3l-CbpjI64D28R6OnbYDh9wT6-rTaUmk746-zrMKKSsUBbI79sIqKuI4hJLupoV82PhHQXvo9VG_Aa2-ifv0pEPYCaYfc4FIw-u98BO-OzDSzY')",
            }}
          />

          {/* Gradient Overlay for subtle contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

          {/* Overlay Badge */}
          <div className="absolute top-6 right-6 bg-[#ffd167] text-[#765900] font-[var(--font-headline)] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md bg-opacity-95 flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            Exclusive Recipes
          </div>

          {/* Bottom quote on image */}
          <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
            <p className="font-[var(--font-headline)] font-bold text-lg leading-tight mb-1">
              Khơi nguồn cảm hứng ẩm thực
            </p>
            <p className="text-xs text-white/90 font-light">
              Hàng ngàn công thức độc quyền từ cộng đồng đầu bếp Bếp Phương
            </p>
          </div>
        </div>

        {/* Right Column: Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative">
          {/* Brand / Header */}
          <div className="mb-6 text-center md:text-left">
            <Link href="/" className="inline-block group mb-1">
              <h1 className="font-[var(--font-headline)] text-3xl sm:text-4xl font-extrabold text-[#ae2f34] tracking-tight group-hover:scale-105 transition-transform duration-200">
                Bếp Phương
              </h1>
            </Link>
            <p className="text-sm sm:text-base text-[#584140] font-medium">
              Join the most vibrant culinary community.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#d1f2e2] border border-[#006c4f]/20 text-[#003b29] text-sm flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006c4f]">
                check_circle
              </span>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5 group">
              <label
                htmlFor="email"
                className="font-[var(--font-headline)] font-semibold text-sm text-[#584140] ml-1"
              >
                Email Address
              </label>
              <div className="relative rounded-xl transition-shadow duration-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@gourmetpop.com"
                  className="w-full bg-[#f4f4f0] text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base border border-transparent rounded-xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-[#ff6b6b]/15 focus:border-[#ff6b6b] focus:bg-white focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 group">
              <label
                htmlFor="password"
                className="font-[var(--font-headline)] font-semibold text-sm text-[#584140] ml-1"
              >
                Password
              </label>
              <div className="relative rounded-xl transition-shadow duration-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f4f4f0] text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base border border-transparent rounded-xl py-3 pl-11 pr-12 focus:ring-4 focus:ring-[#ff6b6b]/15 focus:border-[#ff6b6b] focus:bg-white focus:outline-none transition-all duration-200"
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

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5 group">
              <label
                htmlFor="confirm-password"
                className="font-[var(--font-headline)] font-semibold text-sm text-[#584140] ml-1"
              >
                Confirm Password
              </label>
              <div className="relative rounded-xl transition-shadow duration-200">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c706f] group-focus-within:text-[#ae2f34] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f4f4f0] text-[#1b1c1a] placeholder:text-[#8c706f]/60 font-[var(--font-body)] text-sm sm:text-base border border-transparent rounded-xl py-3 pl-11 pr-12 focus:ring-4 focus:ring-[#ff6b6b]/15 focus:border-[#ff6b6b] focus:bg-white focus:outline-none transition-all duration-200"
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

            {/* Submit Button with Glint & 3D Shadow Effect */}
            <button
              type="submit"
              disabled={loading || googleLoading || facebookLoading}
              className="w-full bg-[#ff6b6b] hover:bg-[#ff5656] text-white font-[var(--font-headline)] font-bold text-sm tracking-wide rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 shadow-[0_3px_0_0_#ae2f34] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_#ae2f34] active:translate-y-1 active:shadow-none transition-all duration-150 relative overflow-hidden group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    Join Now
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </span>
              {/* Glint Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#efeeea]" />
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-[#8c706f]">
              hoặc đăng ký bằng
            </span>
          </div>

          {/* Social Sign-up Buttons */}
          <div className="flex flex-col items-center gap-3 w-full min-h-[44px]">
            {googleLoading ? (
              <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-[#584140] font-medium">
                <svg
                  className="animate-spin h-5 w-5 text-[#ff6b6b]"
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
                Đang xác thực Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                size="large"
                theme="outline"
                text="signup_with"
                width="350"
              />
            )}

            <FacebookLoginButton
              onSuccess={handleFacebookSuccess}
              onError={handleFacebookError}
              disabled={loading || googleLoading || facebookLoading}
              text="signup_with"
            />
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center md:text-left font-[var(--font-body)] text-sm sm:text-base text-[#584140] border-t border-[#efeeea] pt-5">
            Already craving?
            <Link
              href="/login"
              className="font-[var(--font-headline)] font-bold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors underline-offset-4 hover:underline ml-1.5 inline-flex items-center gap-0.5"
            >
              Sign in here
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
