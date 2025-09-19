# TernSecure Admin Portal

This is the admin portal for a TernSecure-powered authentication system. It provides a user interface for administrators to manage users, including assigning roles, disabling or deleting users, and monitoring user activity.

The project is built with Next.js and utilizes TernSecure authentication, which is built on top of Firebase. It also uses Upstash Redis for session revocation checking.

## Features

-   **User Management:** View, search, and manage all users.
-   **Role-Based Access Control (RBAC):** Assign roles to users (e.g., 'admin').
-   **User Actions:** Disable, enable, and delete users.
-   **Secure Authentication:** Built on top of the TernSecure framework for Next.js.
-   **Session Revocation:** Uses Redis to instantly revoke user sessions when they are disabled or signed out.

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (^22)
-   [npm](https://www.npmjs.com/) (^11.3.0)
-   A Firebase project.
-   An Upstash Redis database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kayp514/ternsecure-auth-admin.git
    cd tern-auth-admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables.

    ```env
    #Auth Page URLs
    NEXT_PUBLIC_SIGN_IN_URL='/sign-in'
    NEXT_PUBLIC_SIGN_UP_URL='/sign-up'

    # Firebase Client Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_APP_NAME=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENTID=

    # Firebase Server-Side Admin Configuration
    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY=

    # Upstash Redis for Session Revocation
    # Used for checking revoked user sessions.
    KV_REST_API_URL=
    KV_REST_API_TOKEN=
    REDIS_KEY_PREFIX=

    # TernSecure API URL (Development)
    # During development, point this to your local server.
    TERNSECURE_API_URL="localhost:3000"
    ```

### Running the Development Server

Once the installation and configuration are complete, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Configuration

-   **API Route:** The core API endpoint for authentication is handled by the TernSecure package. It is crucial that the API route is located at `app/api/auth/[[...auth]]/route.ts`.

-   **API Endpoint URL:**
    -   In **development**, the `TERNSECURE_API_URL` environment variable is used to specify the API endpoint (e.g., `http://localhost:3000`).
    -   In **production**, the system uses the `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` as the base. The necessary routes and paths are automatically appended by the `@tern-secure/nextjs` package.

## Session Management with Redis

This application uses Redis to manage user session revocation. When an admin disables a user, their session information is stored in Redis. The `ternSecureMiddleware` checks against this Redis store on each request to ensure that disabled users cannot access protected routes.

Currently, the implementation is tailored for **Upstash Redis**.

### Future Support

Support for other Redis providers (like `ioredis`) and different database systems (like Postgres) for session management is planned for future releases.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.