import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { portfolioMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = portfolioMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, "bg-background text-primary scrollbar")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />

          {children}

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
