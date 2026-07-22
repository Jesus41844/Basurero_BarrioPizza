"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type ScanState = "idle" | "scanning" | "success" | "error";

export default function ScanPage() {
  const { token } = useAuth();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setState("scanning");
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      intervalRef.current = window.setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          stopCamera();
          handleReclaim(code.data);
        }
      }, 500);
    } catch {
      setState("error");
      setMessage("No se pudo acceder a la cámara. Verificá los permisos.");
    }
  }, [token, stopCamera]);

  const handleReclaim = async (qrData: string) => {
    setMessage("Procesando depósito...");
    try {
      const res = await fetch(`${API}/api/v1/client/reclaim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: qrData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al reclamar");
      }

      const data = await res.json();
      setMessage(`¡+${data.puntos} puntos acreditados! Total: ${data.total}`);
      setState("success");
    } catch (err: any) {
      setState("error");
      setMessage(err.message);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="heading text-2xl mb-4">Escanear QR</h1>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
            <div className="w-24 h-24 bg-ink-bg flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10M12 7v10" />
              </svg>
            </div>
            <Button onClick={startCamera} className="text-base py-4 px-8">
              ACTIVAR CÁMARA
            </Button>
          </motion.div>
        )}

        {state === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative bg-ink-bg aspect-[3/4] mb-4 overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-red">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-red"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="bg-black/60 px-3 py-1">
                  <p className="font-body text-xs text-white/70">Escaneando...</p>
                </div>
                <button
                  onClick={stopCamera}
                  className="bg-black/60 px-3 py-1 font-body text-xs text-white cursor-pointer border-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
            <div className="w-20 h-20 bg-ink-bg flex items-center justify-center mx-auto mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-heading text-3xl text-red mb-2">¡RECICLADO!</p>
            <p className="font-body text-sm text-mid mb-6">{message}</p>
            <Button variant="outline" onClick={() => { setState("idle"); setMessage(""); }} className="mx-auto">
              ESCANEAR OTRO
            </Button>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
            <div className="w-20 h-20 bg-ink-bg flex items-center justify-center mx-auto mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <p className="font-heading text-2xl text-red mb-2">ERROR</p>
            <p className="font-body text-sm text-mid mb-6">{message}</p>
            <Button variant="outline" onClick={() => { setState("idle"); setMessage(""); }} className="mx-auto">
              REINTENTAR
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
