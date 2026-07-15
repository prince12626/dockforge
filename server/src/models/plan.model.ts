import { Schema, model } from "mongoose";

const planSchema = new Schema(
      {
            name: {
                  type: String,
                  required: true,
            },

            price: {
                  type: Number,
                  required: true,
            },
            description: {
                  type: String,
                  default: "",
            },

            featured: {
                  type: Boolean,
                  default: false,
            },
            cpu: {
                  type: Number,
                  required: true,
            },

            memory: {
                  type: Number,
                  required: true,
            },

            storage: {
                  type: Number,
                  required: true,
            },

            maxVps: {
                  type: Number,
                  required: true,
            },

            features: [
                  {
                        type: String,
                  },
            ],
      },
      {
            timestamps: true,
      },
);

export const Plan = model("Plan", planSchema);
