import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/cart";

export async function sanitizeCartItems(items: CartItem[]) {
  if (items.length === 0) {
    return [];
  }

  const uniqueIds = Array.from(new Set(items.map((item) => item.productId)));
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });
  const existingIds = new Set(existingProducts.map((product) => product.id));

  return items.filter((item) => existingIds.has(item.productId));
}
