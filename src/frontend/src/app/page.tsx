"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink font-body relative">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] dark:opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }} />

      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="font-heading text-xl tracking-[0.15em] text-red flex items-center gap-2"
        >
          <Logo size={28} />
          BARRIO PIZZA
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link
            href="/auth"
            className="font-heading text-sm tracking-[0.2em] uppercase text-ink bg-transparent border-2 border-ink px-5 py-2.5 no-underline hover:bg-ink-bg hover:text-white transition-colors"
          >
            INGRESAR
          </Link>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-6xl mx-auto w-full relative z-10">
        {/* Decorative diagonal stripe */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[3px] bg-red/10 -rotate-45 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+60px)] w-[200%] h-[1px] bg-red/5 -rotate-45 pointer-events-none"
          aria-hidden="true"
        />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="heading text-[96px] sm:text-[120px] leading-[0.82] mb-5 select-none">
            BARRIO
            <br />
            PIZZA
          </h1>
          <div className="overflow-hidden mb-4">
            <motion.p
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="font-heading text-3xl sm:text-4xl tracking-[0.35em] text-red"
            >
              SI HAY PIZZA
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-body text-base sm:text-lg text-mid max-w-lg mx-auto leading-relaxed"
          >
            Del barrio y para el barrio. Reciclá, ganá puntos y canjeá por pizza.
          </motion.p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-16"
        >
          {[
            { step: "01", title: "RECICLÁ", desc: "Depositá tus reciclables en cualquiera de nuestras estaciones inteligentes en Panamá." },
            { step: "02", title: "GANÁ PUNTOS", desc: "Cada depósito te da EcoRewards. A más reciclás, más acumulás." },
            { step: "03", title: "CANJEÁ", desc: "Usá tus puntos para obtener pizzas, combos y más en Barrio Pizza." },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.12 }}
              className="card p-7 text-center flex flex-col items-center"
            >
              <span className="font-heading text-5xl text-red leading-none mb-4">{s.step}</span>
              <h3 className="font-heading text-2xl mb-3">{s.title}</h3>
              <p className="font-body text-sm text-mid leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Link
            href="/auth"
            className="inline-block font-heading text-base tracking-[0.25em] uppercase bg-red text-white px-12 py-4.5 no-underline hover:bg-red/90 transition-colors"
          >
            COMENZAR AHORA
          </Link>
        </motion.div>
      </main>

      <footer className="p-6 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="font-body text-[10px] text-mid uppercase tracking-[0.2em]"
        >
          Barrio Pizza &copy; 2024 &mdash; Reciclaje Inteligente
        </motion.p>
      </footer>
    </div>
  );
}
