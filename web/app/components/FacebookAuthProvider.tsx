"use client";

import React, { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

interface FacebookAuthProviderProps {
  children: React.ReactNode;
}

export default function FacebookAuthProvider({ children }: FacebookAuthProviderProps) {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

  useEffect(() => {
    if (typeof window !== "undefined" && appId) {
      window.fbAsyncInit = function () {
        window.FB?.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
      };

      // If SDK script is already loaded
      if (window.FB) {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
      }
    }
  }, [appId]);

  return (
    <>
      {appId && (
        <Script
          id="facebook-jssdk"
          src="https://connect.facebook.net/vi_VN/sdk.js"
          strategy="afterInteractive"
        />
      )}
      {children}
    </>
  );
}
