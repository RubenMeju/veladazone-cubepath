import { Metadata } from "next";
import InviteClient from "./InviteClient";

interface Props {
  params: { code: string };
}

async function getLeagueByCode(code: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/fantasy/leagues/preview/?invite_code=${code}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const league = await getLeagueByCode(params.code);

  if (!league) {
    return { title: "Invitación no válida — VeladaZone" };
  }

  const title = `🏆 Únete a "${league.name}" — Fantasy VeladaZone`;
  const description = `${league.member_count} personas ya compiten. ¿Sabes quién ganará La Velada del Año 6? Demuéstralo.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://laveladazone.duckdns.org/fantasy/invite/${params.code}`,
      siteName: "VeladaZone",
      images: [{ url: "https://laveladazone.duckdns.org/og-fantasy.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const league = await getLeagueByCode(params.code);

  return <InviteClient league={league} inviteCode={params.code} />;
}
