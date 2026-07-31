import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.DB!);
const isProd = process.env.NODE_ENV === "production";
await client.connect();

export const auth = betterAuth({
      database: mongodbAdapter(client.db()),
      basePath: "/api/v1/authentication",
      emailAndPassword: {
            enabled: true,
      },
      trustedOrigins: [process.env.CLIENT_URL!],
      appName: "Dockforge",
      advanced: {
            crossSubDomainCookies: isProd
                  ? {
                          enabled: true,
                          domain: ".princechaurasiya.in",
                    }
                  : {
                          enabled: false,
                    },

            defaultCookieAttributes: {
                  sameSite: "lax",
                  secure: isProd,
                  httpOnly: true,
            },
      },
});
