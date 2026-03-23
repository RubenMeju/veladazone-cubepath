"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function CompletionCelebration({ total }: { total: number }) {
  const [phase, setPhase] = useState<
    "idle" | "entering" | "impact" | "message" | "done"
  >("idle");

  const triggered = useRef(false);

  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (total !== 10) return;
    if (triggered.current) return;
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("celebration-shown") === "true"
    )
      return;

    triggered.current = true;
    localStorage.setItem("celebration-shown", "true");

    setTimeout(() => {
      setPhase("entering");
      t1.current = setTimeout(() => setPhase("impact"), 900);
      t2.current = setTimeout(() => setPhase("message"), 1200);
    }, 0);

    return () => {
      clearTimeout(t1.current ?? undefined);
      clearTimeout(t2.current ?? undefined);
    };
  }, [total]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={() => setPhase("done")}
    >
      <style>{`
        @keyframes glove-left {
          0%   { transform: translateX(-120vw) rotate(-30deg); }
          70%  { transform: translateX(-8vw) rotate(-10deg); }
          85%  { transform: translateX(-12vw) rotate(-12deg); }
          100% { transform: translateX(-10vw) rotate(-10deg); }
        }
        @keyframes glove-right {
          0%   { transform: translateX(120vw) rotate(30deg) scaleX(-1); }
          70%  { transform: translateX(8vw) rotate(10deg) scaleX(-1); }
          85%  { transform: translateX(12vw) rotate(12deg) scaleX(-1); }
          100% { transform: translateX(10vw) rotate(10deg) scaleX(-1); }
        }
        @keyframes flash {
          0%   { opacity: 0; transform: scale(0.5); }
          20%  { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2); }
        }
        @keyframes shockwave {
          0%   { opacity: 0.8; transform: scale(0); }
          100% { opacity: 0; transform: scale(3); }
        }
        @keyframes message-in {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          60%  { transform: scale(1.05) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .glove-left  { animation: glove-left  0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .glove-right { animation: glove-right 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .flash       { animation: flash     0.5s ease-out forwards; }
        .shockwave   { animation: shockwave 0.6s ease-out forwards; }
        .message-in  { animation: message-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      {/* Guantes */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{ height: 200 }}
      >
        {/* Guante izquierdo */}
        <div
          className={
            phase === "entering" || phase === "impact" || phase === "message"
              ? "glove-left"
              : ""
          }
          style={{
            fontSize: 100,
            position: "absolute",
            left: "50%",
            marginLeft: -50,
            transformOrigin: "center",
          }}
        >
          🥊
        </div>

        {/* Guante derecho */}
        <div
          className={
            phase === "entering" || phase === "impact" || phase === "message"
              ? "glove-right"
              : ""
          }
          style={{
            fontSize: 100,
            position: "absolute",
            left: "50%",
            marginLeft: -50,
            transformOrigin: "center",
          }}
        >
          🥊
        </div>

        {/* Flash de impacto */}
        {(phase === "impact" || phase === "message") && (
          <>
            <div
              className="flash"
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#f4a261",
                zIndex: 10,
              }}
            />
            <div
              className="shockwave"
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "4px solid #f4a261",
                zIndex: 9,
              }}
            />
          </>
        )}
      </div>

      {/* Mensaje */}
      {phase === "message" && (
        <div
          className="message-in relative overflow-hidden rounded-2xl p-8 text-center mx-4"
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(244,162,97,0.4)",
            maxWidth: 360,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(244,162,97,0.5), transparent)",
            }}
          />

          <div
            className="font-bebas text-5xl mb-2"
            style={{
              color: "#f4a261",
              textShadow: "0 0 30px rgba(244,162,97,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            ¡CARTEL COMPLETO!
          </div>

          <p
            style={{
              color: "#9ca3af",
              fontSize: 14,
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Has hecho todas tus predicciones para La Velada del Año 6. El 25 de
            julio sabremos quién tiene razón.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/mi-cartel"
              onClick={() => setPhase("done")}
              className="font-bebas text-xl tracking-widest"
              style={{
                background: "#f4a261",
                color: "#000",
                padding: "12px 24px",
                borderRadius: 12,
                textDecoration: "none",
                display: "block",
                letterSpacing: "0.1em",
              }}
            >
              🃏 VER MI CARTEL
            </Link>
            <button
              onClick={() => setPhase("done")}
              style={{
                color: "#6b7280",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
