import { Plan } from "../models/plan.model.js";

export async function getPlans() {
  return await Plan.find()
    .sort({
      price: 1,
    })
    .lean();
}

export async function getPlanById(id: string) {
  return await Plan.findById(id).lean();
}
