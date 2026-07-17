import apiClient from "./client";

export const getCart = () => apiClient.get("/cart").then((res) => res.data);

export const addCartItem = (payload) =>
  apiClient.post("/cart/items", payload).then((res) => res.data);

export const updateCartItem = (productId, payload) =>
  apiClient.put(`/cart/items/${productId}`, payload).then((res) => res.data);

export const removeCartItem = (productId) =>
  apiClient.delete(`/cart/items/${productId}`).then((res) => res.data);

export const clearCart = () => apiClient.delete("/cart");
