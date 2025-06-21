import { userRouter } from "@/server/api/routers/user";
import { roleRouter } from "@/server/api/routers/roles";
import { permRouter } from "@/server/api/routers/perm";
import { deptRouter } from "@/server/api/routers/dept";
import { passRouter } from "@/server/api/routers/passwordreset";
import { boppItemRouter } from "@/server/api/routers/boppitem";
import {formFieldRouter} from "@/server/api/routers/formField";
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
  pass: passRouter,
  boppItem: boppItemRouter,
  formField: formFieldRouter,
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
