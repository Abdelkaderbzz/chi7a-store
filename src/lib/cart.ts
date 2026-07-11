export interface CartItem {
  id: string;
  slug: string;
  nameAr: string;
  price: number;
  image: string | null;
  quantity: number;
  deliveryPrice?: number;
}

export const CART_STORAGE_KEY = "chi7a-cart";

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
