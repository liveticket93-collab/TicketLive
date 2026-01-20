"use client";
import { useCartCoupons } from "@/hooks/useCartCoupons";

export default function TestTotal() {
  const { getTotalWithDiscount, getDiscount } = useCartCoupons();
  
  return (
    <div style={{color: 'white', padding: '20px'}}>
      <h1>TEST DE CUPONES</h1>
      <p>Descuento: ${getDiscount()}</p>
      <p>Total con descuento: ${getTotalWithDiscount()}</p>
    </div>
  );
}