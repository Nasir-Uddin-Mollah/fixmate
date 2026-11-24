import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixmate");

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      area: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60,
    },
  },
  databaseHooks: {
    user: {
      update: {
        after: async (user) => {
          try {
            const name = String(user.name ?? "").trim();
            const email = String(user.email ?? "").trim();
            if (!name || !email) return;

            const bookings = db.collection("bookings");
            const services = db.collection("services");

            await Promise.all([
              bookings.updateMany({ customerEmail: email }, { $set: { customerName: name } }),
              bookings.updateMany({ technicianEmail: email }, { $set: { technicianName: name } }),
              services.updateMany({ technicianEmail: email }, { $set: { technicianName: name } }),
            ]);
          } catch (error) {
            console.error("Failed to sync user name to history:", error);
          }
        },
      },
    },
  },
  plugins: [jwt()],
});
