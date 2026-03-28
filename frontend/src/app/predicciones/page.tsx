/**
 * /app/predicciones/page.tsx  —  Server Component
 *
 * Prefetcha datos públicos con React Query + HydrationBoundary.
 * El cliente hereda el cache con timestamps correctos → 0 refetches extra.
 *
 * (HydrationBoundary):
 *   - El cache se serializa en el HTML con sus timestamps
 *   - El cliente lo hidrata exactamente como si él hubiera hecho el fetch
 *   - staleTime funciona correctamente
 *   - Sin props — cualquier componente hijo puede usar useQuery directamente
 */

import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Fight, CommunityStats } from "@/types";
import { serverFetch } from "@/lib/api.server";
import { PrediccionesClient } from "./Prediccionesclient";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Predicciones · VeladaZone",
  description:
    "Elige tu ganador en cada combate de La Velada del Año 6 y compite con la comunidad.",
  openGraph: {
    title: "Predicciones · VeladaZone",
    description: "¿Quién ganará en La Velada del Año 6? Haz tus predicciones.",
    url: "https://laveladazone.duckdns.org/predicciones",
    siteName: "VeladaZone",
    type: "website",
  },
};

// ISR: la página se revalida cada 30s en el servidor
export const revalidate = 30;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function PrediccionesPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Mismo staleTime que usaremos en el cliente
        // Así el cliente no refetchea nada al hidratar
        staleTime: 30 * 1000,
      },
    },
  });

  // Prefetch en paralelo — ambas queries se resuelven antes de renderizar
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["fights", 6],
      queryFn: () =>
        serverFetch<Fight[]>("/fighters/fights/?edition=6", {
          next: { revalidate: 300 }, // combates: cache 5 min (no cambian)
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["community-stats"],
      queryFn: () =>
        serverFetch<CommunityStats[]>("/predictions/community_stats/", {
          next: { revalidate: 30 }, // termómetro: cache 30s
        }),
    }),
  ]);

  return (
    /**
     * dehydrate() → serializa el QueryClient a JSON plano
     * HydrationBoundary → lo inyecta en el QueryClient del cliente durante la hidratación
     * Resultado: PrediccionesClient y TODOS sus hijos pueden llamar useQuery
     * con las mismas queryKeys y obtener los datos sin fetch adicional
     */
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PrediccionesClient />
    </HydrationBoundary>
  );
}
