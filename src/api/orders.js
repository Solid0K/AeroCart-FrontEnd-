import apiClient from "./client";

export const checkOut = () =>
  apiClient.post("/orders/checkOut").then((res) => res.data);

export const getOrders = (params) =>
  apiClient.get("/orders", { params }).then((res) => res.data);

export const getOrder = (orderId) =>
  apiClient.get(`/orders/${orderId}`).then((res) => res.data);

export const simulatePayment = (paymentIntentId, success) =>
  apiClient
    .post(`/mock-payment/${paymentIntentId}/simulate`, null, {
      params: { success },
    })
    .then((res) => res.data);
