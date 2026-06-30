import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
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
    // 🔥 Better-Auth এ role ফিল্ডটি ডিফাইন করে দেওয়া যেন এটি 'user' কালেকশনেও সেভ হয়
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "patient"
            }
        }
    },
    // 🔥 এখানে নতুন হুকটি পেস্ট করা হয়েছে
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return { 
                        ...user, 
                        role: user.role || "patient" 
                    };
                },
                // Better-Auth এ ইউজার তৈরি হওয়ার পর কাস্টম 'users' কালেকশনেও ডাটা কপি হবে
                after: async (user) => {
                    const customUsersCollection = db.collection("users");
                    
                    // চেক করে দেখা যে কাস্টম কালেকশনে এই ইমেইল অলরেডি আছে কিনা
                    const existingCustomUser = await customUsersCollection.findOne({ email: user.email });
                    
                    if (!existingCustomUser) {
                        await customUsersCollection.insertOne({
                            name: user.name,
                            email: user.email,
                            phone: "", 
                            gender: "unknown", 
                            photo: user.image || "",
                            role: user.role || "patient",
                            status: "active",
                            createdAt: new Date().toISOString()
                        });
                    }
                }
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60
        }
    },
    plugins: [
        jwt(), 
    ],
});