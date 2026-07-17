import apiClient from "./client";

export const getProducts = (params) =>
  apiClient.get("/user/products", { params }).then((res) => res.data);

export const getProduct = (id) =>
  apiClient.get(`/user/products/${id}`).then((res) => res.data);
