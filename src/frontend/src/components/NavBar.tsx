"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, LogOut, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-surface border-b-2 border-line">
      <div className="flex items-center justify-between h-12 px-4 max-w-lg mx-auto">
        <Link href={isAuthenticated ? "/home" : "/"} className="no-underline flex items-center gap-2">
          <Logo size={24} />
          <span className="font-heading text-base tracking-wide text-ink">BARRIO PIZZA</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Barra de herramientas">
          {isAuthenticated && (
            <Link
              href="/scan"
              aria-label="Escanear QR"
              className="min-touch-target text-mid hover:text-ink transition-colors"
            >
              <QrCode size={18} aria-hidden="true" />
            </Link>
          )}

          <button
            onClick={toggle}
            aria-label={dark ? "Modo claro" : "Modo oscuro"}
            className="min-touch-target text-mid hover:text-ink transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              aria-label="Cerrar sesión"
              className="min-touch-target text-mid hover:text-ink transition-colors"
            >
              <LogOut size={18} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
