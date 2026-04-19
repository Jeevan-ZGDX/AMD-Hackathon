const API_BASE_URL = "http://localhost:8000/api/v1";

export async function fetchProducts(category?: string, query?: string) {
  let url = `${API_BASE_URL}/products?`;
  if (category && category !== "All Items") url += `category=${category}&`;
  if (query) url += `q=${query}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function placeOrder(orderData: any) {
  const res = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function fetchUserOrders(userId: string) {
  const res = await fetch(`${API_BASE_URL}/orders?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
