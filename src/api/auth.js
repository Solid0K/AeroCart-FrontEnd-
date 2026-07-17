import apiClient from "./client";

export const signup = (payload) => apiClient.post("/auth/signup", payload);

export const signin = (payload) =>
  apiClient.post("/auth/signin", payload).then((res) => res.data);

export const getCurrentUser = () =>
  apiClient.get("/auth/me").then((res) => res.data);
