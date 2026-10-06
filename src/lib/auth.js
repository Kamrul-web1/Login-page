import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const resend = new Resend(process.env.RESEND_API_KEY);

const client = new MongoClient(process.env.BETTER_AUTH_MONGOODB_URL);

const db = client.db("better-auth-project");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: 'verify Email',
                html: `<p>click the llink to verify your email:${url}</p>`
            });
        },
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 5
    },
    database: mongodbAdapter(db, {
        client,
    }),
});