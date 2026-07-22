import NavBar from "@/components/NavBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </>
  );
}
