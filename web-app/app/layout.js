import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AnalyticsProvider } from "@/hooks/useAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Mentality-AI",
  description: "Advanced AI-powered mentality analysis platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AnalyticsProvider>
          <Navbar />
          <main>{children}</main>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
