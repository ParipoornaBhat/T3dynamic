import { userRouter } from "@/server/api/routers/user";
import { roleRouter } from "@/server/api/routers/roles";
import { permRouter } from "@/server/api/routers/perm";
import { deptRouter } from "@/server/api/routers/dept";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
  perm: permRouter,
  dept: deptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
