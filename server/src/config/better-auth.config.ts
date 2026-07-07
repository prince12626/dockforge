import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.DB!);

await client.connect();

export const auth = betterAuth({
      database: mongodbAdapter(client.db()),
      basePath: "/api/v1/authentication",
      emailAndPassword: {
            enabled: true,
      },
      trustedOrigins: ["http://localhost:4000"],
      appName: "Hostinger",
});
