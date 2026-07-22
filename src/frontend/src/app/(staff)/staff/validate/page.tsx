"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import jsQR from "jsqr";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function StaffValidatePage() {
  const { token } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const validate = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/v1/staff/validate-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codigo: code.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: `Cupón válido — consumido correctamente` });
      } else {
        setResult({ ok: false, msg: data.error || "Error al validar" });
      }
    } catch {
      setResult({ ok: false, msg: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOn(true);
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
          setCodigo(code.data);
          validate(code.data);
        }
      }, 500);
    } catch {
      setResult({ ok: false, msg: "No se pudo acceder a la cámara" });
    }
  }, [stopCamera, token]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div>
      <h1 className="heading text-3xl mb-6">Validar Cupón</h1>

      <Card className="mb-6">
        <Input
          label="Código del cupón"
          placeholder="Ej: BP-A3F2K1"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Button
          onClick={() => validate(codigo)}
          loading={loading}
          className="mt-3 w-full justify-center"
        >
          VALIDAR
        </Button>
      </Card>

      <div className="text-center mb-6">
        <p className="label mb-3">O escanear con cámara</p>
        {!cameraOn ? (
          <Button variant="outline" onClick={startCamera} className="mx-auto">
            ACTIVAR CÁMARA
          </Button>
        ) : (
          <div className="relative bg-ink-bg aspect-[4/3] max-w-sm mx-auto">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 bg-black/60 px-2 py-1 font-body text-xs text-white cursor-pointer border-none"
            >
              Detener
            </button>
          </div>
        )}
      </div>

      {result && (
        <Card dark={!result.ok} className={`text-center ${!result.ok ? "" : "card text-center"}`}>
          <p className={`font-heading text-xl mb-1 ${result.ok ? "text-red" : "text-red"}`}>
            {result.ok ? "VÁLIDO" : "INVÁLIDO"}
          </p>
          <p className="font-body text-sm">{result.msg}</p>
        </Card>
      )}
    </div>
  );
}
