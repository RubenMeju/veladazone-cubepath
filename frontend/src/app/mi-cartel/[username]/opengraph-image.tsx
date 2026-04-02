import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mi Cartel - VeladaZone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getPredictions(username: string) {
  const baseUrl = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/v1`
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

  try {
    const res = await fetch(`${baseUrl}/predictions/cartel/${username}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const predictions = await getPredictions(username);

  // ✅ Fallback simple cuando no hay predicciones
  if (!predictions || predictions.length === 0) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              letterSpacing: 6,
            }}
          >
            VELADA DEL AÑO 6
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#e63946" }}>
            VELADAZONE.COM
          </div>
        </div>
      </div>,
      { ...size },
    );
  }

  // ✅ Solo se calcula si hay predicciones
  const mainEvent = predictions.find((p: any) => p.fight.is_main_event);
  const rest = predictions
    .filter((p: any) => !p.fight.is_main_event)
    .slice(0, 6);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        position: "relative",
      }}
    >
      {/* Gradiente de fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(230,57,70,0.18) 0%, transparent 50%, rgba(244,162,97,0.08) 100%)",
          display: "flex",
        }}
      />

      {/* Borde */}
      <div
        style={{
          position: "absolute",
          inset: 12,
          border: "1px solid rgba(230,57,70,0.35)",
          borderRadius: 20,
          display: "flex",
        }}
      />

      {/* Contenido principal */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 60px",
          height: "100%",
          gap: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#e63946",
              letterSpacing: 6,
              marginBottom: 4,
              display: "flex",
            }}
          >
            MIS PREDICCIONES
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              letterSpacing: 6,
              lineHeight: 1,
              display: "flex",
            }}
          >
            VELADA DEL AÑO 6
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#555",
              marginTop: 6,
              letterSpacing: 2,
              display: "flex",
            }}
          >
            25 · 07 · 2026 · SEVILLA
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#f4a261",
              marginTop: 8,
              fontWeight: 600,
              display: "flex",
            }}
          >
            @{username}
          </div>
        </div>

        {/* Evento estelar */}
        {mainEvent && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(230,57,70,0.12)",
              border: "1px solid rgba(230,57,70,0.35)",
              borderRadius: 14,
              padding: "16px 28px",
              marginBottom: 20,
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#e63946",
                letterSpacing: 4,
                marginBottom: 8,
                display: "flex",
              }}
            >
              COMBATE ESTELAR
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 26,
                  fontWeight: 800,
                  color:
                    mainEvent.predicted_winner.id ===
                    mainEvent.fight.fighter1.id
                      ? "#f4a261"
                      : "#444",
                }}
              >
                <span>{mainEvent.fight.fighter1.country_flag}</span>
                <span>{mainEvent.fight.fighter1.name}</span>
                {mainEvent.predicted_winner.id ===
                  mainEvent.fight.fighter1.id && <span>👑</span>}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#e63946",
                  display: "flex",
                }}
              >
                VS
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 26,
                  fontWeight: 800,
                  color:
                    mainEvent.predicted_winner.id ===
                    mainEvent.fight.fighter2.id
                      ? "#f4a261"
                      : "#444",
                }}
              >
                {mainEvent.predicted_winner.id ===
                  mainEvent.fight.fighter2.id && <span>👑</span>}
                <span>{mainEvent.fight.fighter2.name}</span>
                <span>{mainEvent.fight.fighter2.country_flag}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resto de combates */}
        {rest.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              width: "100%",
            }}
          >
            {rest.map((p: any) => {
              const rival =
                p.fight.fighter1.id === p.predicted_winner.id
                  ? p.fight.fighter2.name
                  : p.fight.fighter1.name;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 10,
                    padding: "12px 18px",
                    minWidth: 160,
                  }}
                >
                  <div style={{ fontSize: 18, display: "flex" }}>👑</div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#f4a261",
                      marginTop: 4,
                      display: "flex",
                    }}
                  >
                    {p.predicted_winner.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#555",
                      marginTop: 2,
                      display: "flex",
                    }}
                  >
                    vs {rival}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 20,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "white",
              letterSpacing: 4,
              display: "flex",
            }}
          >
            VELADAZONE.COM
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#444",
              marginTop: 4,
              display: "flex",
            }}
          >
            Haz tus predicciones en veladazone.com
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
