"use server";

import { auth } from "@tern-secure/nextjs/server";

export default async function ProtectedPage() {
  const { user } = await auth();

  if (user) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>Welcome, {user.email}!</p>
      </div>
    );
  }
}
