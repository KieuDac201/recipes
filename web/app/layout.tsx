import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Roboto } from "next/font/google";
import "./globals.css";
import GoogleAuthProvider from "./components/GoogleAuthProvider";
import FacebookAuthProvider from "./components/FacebookAuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bếp Phương — Công Thức Món Ăn Hấp Dẫn",
  description:
    "Khám phá, nấu nướng và chia sẻ những công thức món ăn đặc sắc cùng Bếp Phương.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${beVietnamPro.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols Outlined for icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf9f5] text-[#1b1c1a]">
        <GoogleAuthProvider>
          <FacebookAuthProvider>{children}</FacebookAuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
