import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins/admin";

const client = new MongoClient(process.env.DB!);

await client.connect();

const authBaseURL = process.env.BETTER_AUTH_URL;
const clientURL = process.env.CLIENT_URL;
const isProduction = process.env.NODE_ENV === "production";

if (!authBaseURL) {
  throw new Error("BETTER_AUTH_URL must be configured.");
}

if (!clientURL) {
  throw new Error("CLIENT_URL must be configured.");
}
const adminUserIds = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
export const auth = betterAuth({
  database: mongodbAdapter(client.db()),

  baseURL: authBaseURL,
  basePath: "/api/v1/authentication",

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [clientURL],
  plugins: [
    admin({
      adminUserIds,
    }),
  ],
  appName: "Dockforge",

  advanced: {
    crossSubDomainCookies: {
      enabled: isProduction,
      domain: ".princechaurasiya.in",
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: new URL(authBaseURL).protocol === "https:",
      httpOnly: true,
    },
  },
});
