import { Product } from "@/interfaces/product.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
