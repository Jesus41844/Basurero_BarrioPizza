"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import NavBar from "@/components/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <NavBar />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
