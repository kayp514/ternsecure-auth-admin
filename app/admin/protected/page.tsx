"use server";

import { auth } from "@tern-secure/nextjs/server";

export default async function ProtectedPage() {
  const { sessionClaims, userId } = await auth();

  if (userId) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>Welcome, {sessionClaims.email}!</p>
      </div>
    );
  }
}
