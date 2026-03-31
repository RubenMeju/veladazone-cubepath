import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import { Prediction } from "@/types";

// Sin edge runtime — Node.js estándar para Docker/self-hosted
const BACKEND =
  process.env.BACKEND_URL ?? // red interna Docker en prod: http://backend:8000/api/v1
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api/v1";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }, // ← Promise
) {
  const { username } = await params;

  let predictions: Prediction[] = [];
  try {
    const res = await fetch(`${BACKEND}/predictions/cartel/${username}/`, {
      cache: "no-store",
    });
    if (res.ok) predictions = await res.json();
  } catch {
    // Cartel vacío si falla
  }

  const mainEvent = predictions.find((p) => p.fight.is_main_event);
  const rest = predictions.filter((p) => !p.fight.is_main_event).slice(0, 8);

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "48px",
        },
      },
      // Gradiente fondo
      React.createElement("div", {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "linear-gradient(160deg, rgba(230,57,70,0.18) 0%, transparent 50%, rgba(244,162,97,0.08) 100%)",
        },
      }),
      // Borde rojo
      React.createElement("div", {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          border: "2px solid rgba(230,57,70,0.35)",
          borderRadius: "24px",
        },
      }),
      // HEADER
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
          },
        },
        React.createElement(
          "p",
          {
            style: {
              color: "#e63946",
              fontSize: "14px",
              letterSpacing: "6px",
              margin: "0 0 4px",
            },
          },
          "MIS PREDICCIONES",
        ),
        React.createElement(
          "p",
          {
            style: {
              color: "white",
              fontSize: "64px",
              fontWeight: 900,
              margin: "0",
              letterSpacing: "4px",
            },
          },
          "VELADA DEL AÑO 6",
        ),
        React.createElement(
          "p",
          { style: { color: "#6b7280", fontSize: "16px", margin: "4px 0 0" } },
          "25 · 07 · 2026 · SEVILLA",
        ),
        React.createElement(
          "p",
          {
            style: {
              color: "#f4a261",
              fontSize: "22px",
              margin: "8px 0 0",
              fontWeight: 600,
            },
          },
          `@${username}`,
        ),
      ),
      // COMBATE ESTELAR
      mainEvent
        ? React.createElement(
            "div",
            {
              style: {
                background: "rgba(230,57,70,0.12)",
                border: "1px solid rgba(230,57,70,0.4)",
                borderRadius: "16px",
                padding: "20px 40px",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "700px",
              },
            },
            React.createElement(
              "p",
              {
                style: {
                  color: "#e63946",
                  fontSize: "13px",
                  letterSpacing: "4px",
                  margin: "0 0 12px",
                },
              },
              "COMBATE ESTELAR",
            ),
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: "24px" } },
              // Fighter 1
              React.createElement(
                "p",
                {
                  style: {
                    color:
                      mainEvent.predicted_winner.id ===
                      mainEvent.fight.fighter1.id
                        ? "#f4a261"
                        : "#4b5563",
                    fontSize: "28px",
                    fontWeight: 900,
                    margin: "0",
                  },
                },
                `${mainEvent.predicted_winner.id === mainEvent.fight.fighter1.id ? "👑 " : ""}${mainEvent.fight.fighter1.name}`,
              ),
              React.createElement(
                "p",
                {
                  style: {
                    color: "#e63946",
                    fontSize: "28px",
                    fontWeight: 900,
                    margin: "0 16px",
                  },
                },
                "VS",
              ),
              // Fighter 2
              React.createElement(
                "p",
                {
                  style: {
                    color:
                      mainEvent.predicted_winner.id ===
                      mainEvent.fight.fighter2.id
                        ? "#f4a261"
                        : "#4b5563",
                    fontSize: "28px",
                    fontWeight: 900,
                    margin: "0",
                  },
                },
                `${mainEvent.predicted_winner.id === mainEvent.fight.fighter2.id ? "👑 " : ""}${mainEvent.fight.fighter2.name}`,
              ),
            ),
          )
        : null,
      // RESTO DE COMBATES
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            maxWidth: "900px",
          },
        },
        ...rest.map((p) => {
          const loser =
            p.fight.fighter1.id === p.predicted_winner.id
              ? p.fight.fighter2
              : p.fight.fighter1;
          return React.createElement(
            "div",
            {
              key: p.id,
              style: {
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "12px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "160px",
              },
            },
            React.createElement(
              "p",
              {
                style: {
                  color: "#f4a261",
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: "0",
                },
              },
              `👑 ${p.predicted_winner.name}`,
            ),
            React.createElement(
              "p",
              {
                style: {
                  color: "#4b5563",
                  fontSize: "12px",
                  margin: "4px 0 0",
                },
              },
              `vs ${loser.name}`,
            ),
          );
        }),
      ),
      // FOOTER
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            bottom: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        },
        React.createElement(
          "p",
          {
            style: {
              color: "white",
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "3px",
              margin: "0",
            },
          },
          "🥊 VELADAZONE.COM",
        ),
        React.createElement(
          "p",
          { style: { color: "#374151", fontSize: "13px", margin: "4px 0 0" } },
          "Haz tus predicciones en veladazone.com",
        ),
      ),
    ),
    { width: 1200, height: 630 },
  );
}
