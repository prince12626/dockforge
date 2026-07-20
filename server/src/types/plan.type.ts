import type { Types } from "mongoose";

export interface IPlan {
  _id: string;
  name: string;
  price: number;
  cpu: number;
  memory: number;
  storage: number;
  maxVps: number;
  featured: boolean;
  description: string;
  features: string[];
}

export interface ISubscription {
  _id: string;
  userId: string;
  planId: IPlan | Types.ObjectId;
  status: "active" | "expired" | "cancelled";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
