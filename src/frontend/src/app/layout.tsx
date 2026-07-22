import type { Metadata } from "next";
import "./globals.css";
import SkipLink from "@/components/SkipLink";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Barrio Pizza — Reciclaje Inteligente",
  description: "Gana EcoRewards reciclando y canjea por cupones en Barrio Pizza",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "EcoRewards", statusBarStyle: "black-translucent" },
};

export const viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface text-ink font-body">
        <SkipLink />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
