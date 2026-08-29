"use client";

import React, { useState, useEffect } from "react";

interface FacebookLoginButtonProps {
  onSuccess: (accessToken: string) => void;
  onError?: (error: string) => void;
  text?: "signin_with" | "signup_with";
  disabled?: boolean;
  className?: string;
}

export default function FacebookLoginButton({
  onSuccess,
  onError,
  text = "signin_with",
  disabled = false,
  className = "",
}: FacebookLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for postMessage from Facebook OAuth popup
    const handleMessage = (event: MessageEvent) => {
      if (typeof window === "undefined") return;
      if (event.origin !== window.location.origin) return;

      if (
        event.data?.type === "FACEBOOK_AUTH_SUCCESS" &&
        event.data.accessToken
      ) {
        setLoading(false);
        onSuccess(event.data.accessToken);
      } else if (event.data?.type === "FACEBOOK_AUTH_ERROR") {
        setLoading(false);
        onError?.(event.data.error || "Đăng nhập bằng Facebook thất bại.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onSuccess, onError]);

  const handleFacebookLogin = () => {
    if (typeof window === "undefined") return;

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (!appId) {
      onError?.(
        "Chưa cấu hình NEXT_PUBLIC_FACEBOOK_APP_ID trong biến môi trường.",
      );
      return;
    }

    setLoading(true);

    // Use Facebook OAuth 2.0 Dialog flow directly to support HTTP/localhost without FB.login restriction
    const redirectUri = `${window.location.origin}/login`;
    const fbOAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=public_profile,email&response_type=token`;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      fbOAuthUrl,
      "facebook_login_popup",
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`,
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      // Fallback to full-window redirect if popup was blocked
      window.location.href = fbOAuthUrl;
      return;
    }

    // Monitor popup closed by user
    const checkInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkInterval);
        setLoading(false);
      }
    }, 1000);
  };

  const buttonLabel =
    text === "signup_with"
      ? "Đăng ký bằng Facebook"
      : "Đăng nhập bằng Facebook";

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={disabled || loading}
      className={`w-[350px] max-w-full h-[40px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f7f8f8] active:bg-[#f1f3f4] transition-all duration-150 flex items-center justify-center gap-[8px] shadow-[0_1px_1px_0_rgba(0,0,0,0.04)] hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-[#1877F2]"
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
          <span
            className="text-[13px] text-[#584140]"
            style={{
              fontFamily:
                "'Google Sans', var(--font-roboto), Roboto, arial, sans-serif",
            }}
          >
            Đang kết nối Facebook...
          </span>
        </div>
      ) : (
        <>
          {/* Facebook icon - inline next to text, same as Google icon layout */}
          <svg
            className="w-[18px] h-[18px] shrink-0"
            viewBox="0 0 24 24"
            fill="#1877F2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {/* Text label - matching Google's exact color #1f1f1f, weight 500, size 14px */}
          <span
            className="text-[14px] text-[#3c4043] select-none whitespace-nowrap"
            style={{
              fontFamily:
                "'Google Sans', var(--font-roboto), Roboto, arial, sans-serif",
              fontWeight: 500,
              letterSpacing: "0.25px",
            }}
          >
            {buttonLabel}
          </span>
        </>
      )}
    </button>
  );
}
