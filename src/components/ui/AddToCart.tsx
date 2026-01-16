"use client";

import { useCart } from "@/contexts/CartContext";
import IEvent from "@/interfaces/event.interface";

export default function AddToCartButton({ Props }: { Props: IEvent }) {
  const { addToCart } = useCart();
  return <button className="form-button" onClick={() => addToCart(Props)}>Reservar ahora &rarr;</button>;
}
