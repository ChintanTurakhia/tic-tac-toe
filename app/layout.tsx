import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Emoji Studio 🎨 — Draw & Publish Your Own Emoji!",
  description:
    "A fun, kid-friendly studio to draw, remix, and describe your very own emoji — then publish it to the official emoji specifications body!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
