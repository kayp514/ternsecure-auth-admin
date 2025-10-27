'use server'

import { auth } from "@tern-secure/nextjs/server"
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export default async function ProtectedPage() {
    const headersList = await headers();
    const referer = headersList.get('referer');
    const refererr = headersList.get('Referer');

    const cookieStore = await cookies();
    const idToken = cookieStore.get('__dev_FIREBASE_[DEFAULT]')?.value;

    console.log({ referer, refererr, idToken });
    const { token } = await auth();

    if (!token) {
        throw new Error("Unauthorized");
    }

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    const serverApp = initializeServerApp(firebaseConfig, {
        authIdToken: idToken,
        releaseOnDeref: headersList
    });

    const serverAuth = getAuth(serverApp);
    await serverAuth.authStateReady();

    if (serverAuth.currentUser) {
        return (
            <div>
                <h1>Protected Page</h1>
                <p>Welcome, {serverAuth.currentUser.email}!</p>
            </div>
        );
    }
}