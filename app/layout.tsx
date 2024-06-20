import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./providers/ConvexClerkProvider";
import AudioProvider from "./providers/AudioProvider";

const inter = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FxrCast",
  description: "Generate your podcasts using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <AudioProvider>
          <body className={inter.className}>{children}</body>
        </AudioProvider>
      </html>
    </ConvexClientProvider>
  );
}
