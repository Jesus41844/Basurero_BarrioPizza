"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/map", label: "Mapa", icon: MapPin },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function BottomNav({ onScan }: { onScan?: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-ink-bg border-t-[3px] border-red"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "min-touch-target flex flex-col items-center justify-center gap-0.5 font-body text-[10px] uppercase tracking-widest",
                active ? "text-red" : "text-white/30"
              )}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </Link>
          );
        })}

        <button
          onClick={onScan}
          aria-label="Escanear QR"
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-red border-2 border-white flex items-center justify-center cursor-pointer hover:bg-red/90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10M12 7v10" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
