import type { Metadata } from "next";
import { Inter, Fragment_Mono } from "next/font/google";
import "./globals.css";

// Design doc: "System Font" display hierarchy -> Inter (variable, no weights needed)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Design doc: "SFMono-Regular" labels -> Fragment Mono
const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "GRIDLINE JERSEYS · Pro-Fit Matchday Kits",
  description:
    "Breathable, sublimated pro-fit jerseys — home & away colorways in every size, with your name and number pressed on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#0e1f16] text-[#e7efee] font-sans selection:bg-[#e7efee] selection:text-[#0e1f16]">
        {children}
      </body>
    </html>
  );
}
