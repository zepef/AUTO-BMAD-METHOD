import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowForge - Forge Better Software, Together",
  description: "AI-powered development platform for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
