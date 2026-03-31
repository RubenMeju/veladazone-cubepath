import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { Prediction } from "@/types";

export const runtime = "edge";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "https://laveladazone.com/api/v1";

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params;

  let predictions: Prediction[] = [];
  try {
    const res = await fetch(
      `${BACKEND}/predictions/cartel/${username}/`,
      { next: { revalidate: 300 } }, // 5 min cache
    );
    if (res.ok) predictions = await res.json();
  } catch {
    // Si falla, renderizamos el cartel vacío igualmente
  }

  const mainEvent = predictions.find((p) => p.fight.is_main_event);
  const rest = predictions.filter((p) => !p.fight.is_main_event).slice(0, 8);

  return new ImageResponse(
    (
      <div
        style={{
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
        }}
      >
        {/* Gradiente de fondo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(230,57,70,0.18) 0%, transparent 50%, rgba(244,162,97,0.08) 100%)",
          }}
        />

        {/* Borde rojo sutil */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            border: "2px solid rgba(230,57,70,0.35)",
            borderRadius: "24px",
          }}
        />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
            zIndex: 1,
          }}
        >
          <p
            style={{
              color: "#e63946",
              fontSize: "14px",
              letterSpacing: "6px",
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            MIS PREDICCIONES
          </p>
          <p
            style={{
              color: "white",
              fontSize: "64px",
              fontWeight: 900,
              margin: "0",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            VELADA DEL AÑO 6
          </p>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: "4px 0 0" }}>
            25 · 07 · 2026 · SEVILLA
          </p>
          <p
            style={{
              color: "#f4a261",
              fontSize: "22px",
              margin: "8px 0 0",
              fontWeight: 600,
            }}
          >
            @{username}
          </p>
        </div>

        {/* COMBATE ESTELAR */}
        {mainEvent && (
          <div
            style={{
              background: "rgba(230,57,70,0.12)",
              border: "1px solid rgba(230,57,70,0.4)",
              borderRadius: "16px",
              padding: "20px 40px",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "700px",
              zIndex: 1,
            }}
          >
            <p
              style={{
                color: "#e63946",
                fontSize: "13px",
                letterSpacing: "4px",
                margin: "0 0 12px",
              }}
            >
              ⭐ COMBATE ESTELAR
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              {[mainEvent.fight.fighter1, mainEvent.fight.fighter2].map(
                (fighter, i) => {
                  const isWinner =
                    mainEvent.predicted_winner.id === fighter.id;
                  return (
                    <div
                      key={fighter.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {i === 1 && (
                        <p
                          style={{
                            color: "#e63946",
                            fontSize: "28px",
                            fontWeight: 900,
                            margin: "0 16px",
                          }}
                        >
                          VS
                        </p>
                      )}
                      <p
                        style={{
                          color: isWinner ? "#f4a261" : "#4b5563",
                          fontSize: "28px",
                          fontWeight: 900,
                          margin: "0",
                          textTransform: "uppercase",
                        }}
                      >
                        {isWinner ? "👑 " : ""}
                        {fighter.name}
                        {fighter.country_flag ? ` ${fighter.country_flag}` : ""}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* RESTO DE COMBATES */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            maxWidth: "900px",
            zIndex: 1,
          }}
        >
          {rest.map((p) => {
            const loser =
              p.fight.fighter1.id === p.predicted_winner.id
                ? p.fight.fighter2
                : p.fight.fighter1;
            return (
              <div
                key={p.id}
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "12px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "160px",
                }}
              >
                <p
                  style={{
                    color: "#f4a261",
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: "0",
                    textTransform: "uppercase",
                  }}
                >
                  👑 {p.predicted_winner.name}
                </p>
                <p
                  style={{ color: "#4b5563", fontSize: "12px", margin: "4px 0 0" }}
                >
                  vs {loser.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "3px",
              margin: "0",
            }}
          >
            🥊 VELADAZONE.COM
          </p>
          <p style={{ color: "#374151", fontSize: "13px", margin: "4px 0 0" }}>
            Haz tus predicciones en veladazone.com
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}