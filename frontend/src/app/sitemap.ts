// frontend/src/app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL = "https://laveladazone.com";
const API_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/v1`
  : `${BASE_URL}/api/v1`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/predicciones`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/predicciones/ranking`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mi-cartel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/fantasy`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Páginas dinámicas — perfiles y carteles de usuarios
  let dynamicUrls: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(
      `${API_URL}/predictions/leaderboard/?limit=200&offset=0`,
      { next: { revalidate: 3600 } }, // revalida cada hora
    );

    if (res.ok) {
      const { results } = await res.json();

      dynamicUrls = (results ?? []).flatMap((u: { username: string }) => [
        {
          url: `${BASE_URL}/perfil/${u.username}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
        {
          url: `${BASE_URL}/mi-cartel/${u.username}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
      ]);
    }
  } catch {
    // Si falla el fetch, el sitemap se genera solo con las páginas estáticas
  }

  return [...staticUrls, ...dynamicUrls];
}
