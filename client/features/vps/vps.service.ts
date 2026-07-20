import axiosInstance from "@/lib/api";
import { CreateVpsPayload } from "@/types/vps.types";

export const vpsService = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/vps/");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get(`/vps/${id}`);
    return data;
  },

  create: async (payload: CreateVpsPayload) => {
    const { data } = await axiosInstance.post("/vps/", payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/vps/${id}`);
    return data;
  },

  start: async (id: string) => {
    const { data } = await axiosInstance.post(`/vps/${id}/start`);
    return data;
  },

  restart: async (id: string) => {
    const { data } = await axiosInstance.post(`/vps/${id}/restart`);
    return data;
  },

  getStats: async (id: string) => {
    const { data } = await axiosInstance.get(`/vps/stats/${id}`);
    return data;
  },

  stop: async (id: string) => {
    const { data } = await axiosInstance.post(`/vps/${id}/stop`);
    return data;
  },
};
