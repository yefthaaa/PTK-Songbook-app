import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { APP_NAME } from "@/lib/branding";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Aplikasi lagu pujian dan penyembahan gereja",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Songbook",
  },
};

export const viewport: Viewport = {
  themeColor: "#4a9fd4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
