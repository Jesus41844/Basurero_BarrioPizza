"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/components/Logo";

export default function AuthPage() {
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.push("/home");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email);
      } else {
        await register(email, nombre);
      }
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 w-full max-w-sm">
      <div className="flex items-center gap-3 mb-1">
        <Logo size={32} />
        <h1 className="heading text-3xl">BARRIO PIZZA</h1>
      </div>
      <p className="label mb-6">Reciclaje Inteligente</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />

        {mode === "register" && (
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        )}

        {error && <p role="alert" className="font-body text-xs text-red">{error}</p>}

        <Button type="submit" loading={loading}>
          {mode === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
        </Button>
      </form>

      <p className="font-body text-xs text-mid mt-4 text-center">
        {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="bg-transparent border-none text-ink underline cursor-pointer font-body text-xs"
        >
          {mode === "login" ? "Registrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
