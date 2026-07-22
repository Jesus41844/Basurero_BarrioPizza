"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const staffLinks = [
  { href: "/staff", label: "Dashboard" },
  { href: "/staff/validate", label: "Validar" },
  { href: "/staff/coupons", label: "Cupones" },
  { href: "/staff/bins", label: "Basureros" },
  { href: "/staff/reports", label: "Reportes" },
  { href: "/staff/achievements", label: "Logros" },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isStaff, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
    if (isAuthenticated && !isStaff) router.push("/home");
  }, [isAuthenticated, isStaff, router]);

  if (!isAuthenticated || !isStaff) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-ink-bg text-white flex flex-col border-r-2 border-red shrink-0" aria-label="Panel Staff">
        <div className="p-5 border-b-2 border-white/10">
          <Link href="/staff" className="font-heading text-xl text-red no-underline flex items-center gap-2">
            <Logo size={24} />
            BARRIO PIZZA
          </Link>
          <p className="label-on-dark mt-1">Panel Staff</p>
        </div>
        <nav className="flex-1 p-3" aria-label="Navegación staff">
          {staffLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block px-4 py-3 font-body text-sm uppercase tracking-wider no-underline transition-colors",
                  active ? "bg-red/20 text-red border-l-2 border-red" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t-2 border-white/10">
          <button
            onClick={() => { logout(); router.push("/auth"); }}
            className="w-full px-4 py-3 font-body text-sm uppercase tracking-wider text-white/60 hover:text-white bg-transparent border border-white/20 cursor-pointer text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 p-6 bg-surface overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
