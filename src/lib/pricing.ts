export function clampDiscountPercent(value: number) {
  return Math.max(0, Math.min(90, Math.round(value)));
}

export function getDiscountedPrice(price: number, discountPercent: number) {
  const normalizedDiscount = clampDiscountPercent(discountPercent);
  if (normalizedDiscount <= 0) {
    return {
      hasDiscount: false,
      originalPrice: price,
      finalPrice: price,
      discountPercent: 0,
    };
  }

  const finalPrice = Math.max(
    1,
    Math.round(price - (price * normalizedDiscount) / 100),
  );

  return {
    hasDiscount: true,
    originalPrice: price,
    finalPrice,
    discountPercent: normalizedDiscount,
  };
}
