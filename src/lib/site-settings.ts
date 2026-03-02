import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  heroImageUrl: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const rows = await prisma.$queryRawUnsafe<Array<{ heroImageUrl: string | null }>>(
    `SELECT heroImageUrl FROM SiteSettings WHERE id = 1 LIMIT 1`,
  );

  if (!rows.length) {
    return null;
  }

  return {
    heroImageUrl: rows[0].heroImageUrl ?? null,
  };
}

export async function upsertHeroImageUrl(heroImageUrl: string) {
  await prisma.$executeRawUnsafe(
    `INSERT INTO SiteSettings (id, heroImageUrl, updatedAt)
     VALUES (1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE
     SET heroImageUrl = excluded.heroImageUrl,
         updatedAt = CURRENT_TIMESTAMP`,
    heroImageUrl,
  );
}
