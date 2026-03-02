import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  heroImageUrl: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
    select: { heroImageUrl: true },
  });

  if (!settings) {
    return null;
  }

  return {
    heroImageUrl: settings.heroImageUrl ?? null,
  };
}

export async function upsertHeroImageUrl(heroImageUrl: string) {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: { heroImageUrl },
    create: { id: 1, heroImageUrl },
  });
}
