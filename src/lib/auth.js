import { betterAuth } from "better-auth";
// import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("medicaredb");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    accountLinking: {
        enabled: true,
        trustedProviders: ["google"]
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    // session: {
    //     cookieCache: {
    //         enabled: true,
    //         strategy: "jwt",
    //         maxAge: 7 * 24 * 60 * 60
    //     }
    // },
    // plugins: [
    //     jwt(), 
    // ],
});