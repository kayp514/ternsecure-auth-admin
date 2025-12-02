import { ternSecureProxy, createRouteMatcher } from '@tern-secure/nextjs/server';

const publicPaths = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/unauthorized",
  "/api/auth/(.*)",
  "/__/auth/(.*)",
  "/__/firebase/(.*)",
]);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export default ternSecureProxy(
  async (auth, request) => {
    //const url = new URL('/unauthorized', request.url);
    if (!publicPaths(request)) {
      await auth.protect((require) => {
        return require({ role: "admin" });
      });
    }
  },
  {
    debug: true,
    checkRevoked: {
      enabled: true,
      adapter: {
        type: "redis",
        config: {
          url: process.env.KV_REST_API_URL!,
          token: process.env.KV_REST_API_TOKEN!,
          keyPrefix: process.env.REDIS_KEY_PREFIX!,
        },
      },
    },
    session: { maxAge: '1 hour' }
  }
);
