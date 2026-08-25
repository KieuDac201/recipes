"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/src/services/authApi";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email") || "";

  const [status, setStatus] = useState<"verifying" | "success" | "error" | "idle">(
    token ? "verifying" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const executeVerification = async () => {
      try {
        await authService.verifyEmail(token);
        if (isMounted) {
          setStatus("success");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            err?.message ||
              "Liên kết kích hoạt không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại email xác thực."
          );
        }
      }
    };

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!emailFromUrl) {
      setErrorMessage("Không tìm thấy địa chỉ email trong đường dẫn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage(null);
      setErrorMessage(null);
      await authService.resendVerification(emailFromUrl);
      setResendMessage(`Đã gửi lại email kích hoạt đến ${emailFromUrl}! Vui lòng kiểm tra hộp thư.`);
      setCooldown(60); // 60s cooldown
    } catch (err: any) {
      setErrorMessage(err?.message || "Không thể gửi lại email xác thực. Vui lòng thử lại sau.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 sm:p-6 md:p-12 font-[var(--font-body)] text-[#1b1c1a] antialiased">
      <main className="w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(255,107,107,0.12)] overflow-hidden border border-[#efeeea] p-8 sm:p-12 text-center">
        {/* Brand */}
        <div className="mb-6">
          <Link href="/" className="inline-block group mb-1">
            <h1 className="font-[var(--font-headline)] text-3xl font-extrabold text-[#ae2f34] tracking-tight">
              Bếp Phương
            </h1>
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#8c706f] font-semibold mt-1">
            Xác Thực Tài Khoản
          </p>
        </div>

        {/* 1. Verifying State */}
        {status === "verifying" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#ffdad8] border-t-[#ff6b6b] animate-spin" />
            <h2 className="font-[var(--font-headline)] text-xl font-bold text-[#1b1c1a] mt-2">
              Đang xác thực tài khoản của bạn...
            </h2>
            <p className="text-sm text-[#584140]">
              Vui lòng chờ trong giây lát trong khi chúng tôi kích hoạt tài khoản.
            </p>
          </div>
        )}

        {/* 2. Success State */}
        {status === "success" && (
          <div className="py-4 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#d1f2e2] flex items-center justify-center text-[#006c4f] shadow-inner">
              <span className="material-symbols-outlined text-[44px]">check_circle</span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl font-bold text-[#003b29]">
              Kích Hoạt Thành Công! 🎉
            </h2>
            <p className="text-sm sm:text-base text-[#584140] leading-relaxed max-w-md">
              Địa chỉ email của bạn đã được xác thực thành công. Bạn đã được đăng nhập tự động và sẵn sàng khám phá thế giới ẩm thực cùng Bếp Phương!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Link
                href="/"
                className="flex-1 bg-[#ff6b6b] hover:bg-[#ff5656] text-white font-[var(--font-headline)] font-bold text-sm rounded-xl py-3.5 px-6 shadow-[0_3px_0_0_#ae2f34] transition-all flex items-center justify-center gap-2"
              >
                Khám Phá Công Thức
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. Error or Idle State (No email input needed) */}
        {(status === "error" || status === "idle") && (
          <div className="py-2 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ffdad8] flex items-center justify-center text-[#ae2f34]">
              <span className="material-symbols-outlined text-[36px]">
                {status === "error" ? "error" : "mark_email_unread"}
              </span>
            </div>

            <h2 className="font-[var(--font-headline)] text-xl sm:text-2xl font-bold text-[#1b1c1a]">
              {status === "error" ? "Xác Thực Không Thành Công" : "Kiểm Tra Hộp Thư Của Bạn"}
            </h2>

            {errorMessage && (
              <div className="w-full p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm text-left flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                  error
                </span>
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {resendMessage && (
              <div className="w-full p-3.5 rounded-xl bg-[#d1f2e2] border border-[#006c4f]/20 text-[#003b29] text-sm text-left flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006c4f]">
                  check_circle
                </span>
                <span className="font-medium">{resendMessage}</span>
              </div>
            )}

            <p className="text-sm text-[#584140] leading-relaxed">
              {status === "error" ? (
                <>
                  Liên kết kích hoạt có thể đã hết hạn hoặc không hợp lệ.{" "}
                  {emailFromUrl && (
                    <>
                      Bấm nút bên dưới để gửi lại liên kết mới tới{" "}
                      <strong className="text-[#ae2f34]">{emailFromUrl}</strong>:
                    </>
                  )}
                </>
              ) : (
                <>
                  Chúng tôi đã gửi một liên kết kích hoạt đến email{" "}
                  {emailFromUrl ? (
                    <strong className="text-[#ae2f34]">{emailFromUrl}</strong>
                  ) : (
                    "của bạn"
                  )}
                  . Vui lòng bấm vào liên kết trong thư để kích hoạt tài khoản.
                </>
              )}
            </p>

            {/* Direct Resend Button without Input Field */}
            {emailFromUrl && (
              <div className="w-full mt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || cooldown > 0}
                  className="w-full bg-[#ae2f34] hover:bg-[#922429] text-white font-[var(--font-headline)] font-bold text-sm rounded-xl py-3.5 px-6 shadow-[0_3px_0_0_#681116] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Đang gửi...
                    </>
                  ) : cooldown > 0 ? (
                    `Gửi lại sau (${cooldown}s)`
                  ) : (
                    <>
                      Gửi Lại Email Kích Hoạt
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-[#efeeea] pt-4 w-full text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#ae2f34] hover:text-[#ff6b6b] transition-colors"
              >
                ← Quay lại trang Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#ffdad8] border-t-[#ff6b6b] animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
