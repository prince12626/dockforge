import { Schema, model, Types } from "mongoose";

const vpsSchema = new Schema(
      {
            userId: {
                  type: Types.ObjectId,
                  ref: "User",
                  required: true,
            },

            name: {
                  type: String,
                  required: true,
                  trim: true,
            },

            status: {
                  type: String,
                  enum: [
                        "creating",
                        "running",
                        "stopped",
                        "restarting",
                        "error",
                        "deleted",
                  ],
                  default: "creating",
            },
            os: {
                  type: String,
                  default: "ubuntu:24.04",
            },
            container: {
                  id: {
                        type: String,
                  },

                  name: {
                        type: String,
                  },

                  image: {
                        type: String,
                        default: "ubuntu:24.04",
                  },

                  port: {
                        type: Number,
                  },

                  internalIp: {
                        type: String,
                  },
            },

            resources: {
                  cpu: {
                        type: Number,
                        default: 1,
                  },

                  memory: {
                        type: Number,
                        default: 1024,
                  },

                  storage: {
                        type: Number,
                        default: 10,
                  },
            },
            docker: {
                  imageId: String,
                  volumeId: String,
                  networkId: String,
            },
            lastStartedAt: Date,
            expiresAt: Date,
      },
      {
            timestamps: true,
      },
);

export const VPS = model("VPS", vpsSchema);
