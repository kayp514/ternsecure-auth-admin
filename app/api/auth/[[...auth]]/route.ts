import {
  createTernSecureNextJsHandler,
  type TernSecureHandlerOptions,
} from "@tern-secure/nextjs/admin";

export const runtime = "nodejs";

const authHandlerOptions: TernSecureHandlerOptions = {
  cors: {
    allowedOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ternsecure-auth-admin.vercel.app/",
    ],
    allowedMethods: ["GET", "POST"],
  },
  cookies: {
    httpOnly: true,
    name: "_session_cookie",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  },
  security: {
    requireCSRF: true,
    allowedReferers: ["https://ternsecure.com"],
  },
  debug: process.env.NODE_ENV === "development",
};

const { GET, POST } = createTernSecureNextJsHandler(authHandlerOptions);

export { GET, POST };
