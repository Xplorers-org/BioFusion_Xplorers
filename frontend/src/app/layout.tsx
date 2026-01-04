import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/presentation/components/providers/theme-provider";
import { Toaster } from "@/presentation/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parkinson's Disease Prediction | AI-Powered Voice Analysis",
  description: "Advanced AI-powered voice analysis for early detection of Parkinson's disease. Upload or record your voice for instant prediction.",
  keywords: ["Parkinson's", "disease prediction", "voice analysis", "AI", "healthcare"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
