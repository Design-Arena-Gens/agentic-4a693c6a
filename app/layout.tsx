import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FairGo - Your Reliable Ride Partner",
  description: "Book rides instantly with FairGo. Safe, fast, and affordable transportation at your fingertips.",
  keywords: "ride hailing, taxi, transportation, book ride, FairGo",
  openGraph: {
    title: "FairGo - Your Reliable Ride Partner",
    description: "Book rides instantly with FairGo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
