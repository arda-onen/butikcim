export const CART_COOKIE_NAME = "butikcim_cart";

export type CartItem = {
  productId: number;
  quantity: number;
};

export function parseCartCookie(value?: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => {
        const productId = Number((item as { productId?: unknown }).productId);
        const quantity = Number((item as { quantity?: unknown }).quantity);
        return Number.isFinite(productId) && Number.isFinite(quantity) && quantity > 0;
      })
      .map((item) => ({
        productId: Math.round((item as { productId: number }).productId),
        quantity: Math.round((item as { quantity: number }).quantity),
      }));
  } catch {
    return [];
  }
}

export function serializeCartCookie(items: CartItem[]) {
  return JSON.stringify(items);
}

export function upsertCartItem(
  items: CartItem[],
  productId: number,
  quantityDelta: number,
) {
  const next = [...items];
  const index = next.findIndex((item) => item.productId === productId);

  if (index === -1) {
    if (quantityDelta > 0) {
      next.push({ productId, quantity: quantityDelta });
    }
    return next;
  }

  const quantity = next[index].quantity + quantityDelta;
  if (quantity <= 0) {
    next.splice(index, 1);
  } else {
    next[index] = { ...next[index], quantity };
  }

  return next;
}
