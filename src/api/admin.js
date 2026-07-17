import apiClient from "./client";

// Products
export const adminAddProduct = (payload) =>
  apiClient.post("/admin/products", payload).then((res) => res.data);

export const adminUpdateProduct = (id, payload) =>
  apiClient.put(`/admin/products/${id}`, payload).then((res) => res.data);

export const adminAdjustStock = (id, payload) =>
  apiClient
    .patch(`/admin/products/${id}/stock`, payload)
    .then((res) => res.data);

export const adminSoftDeleteProduct = (id) =>
  apiClient.delete(`/admin/products/${id}/softDelete`).then((res) => res.data);

export const adminAbsoluteDeleteProduct = (id) =>
  apiClient
    .delete(`/admin/products/${id}/absoluteDelete`)
    .then((res) => res.data);

// Orders
export const adminGetOrders = (params) =>
  apiClient.get("/admin/orders", { params }).then((res) => res.data);

export const adminGetOrder = (orderId) =>
  apiClient.get(`/admin/orders/${orderId}`).then((res) => res.data);

export const adminUpdateOrderStatus = (orderId, status) =>
  apiClient
    .patch(`/admin/orders/${orderId}/status`, { status })
    .then((res) => res.data);
