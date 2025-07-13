import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Post Analysis App",
  description: "App to display and analyze posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
