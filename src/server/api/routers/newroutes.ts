// src/server/api/routers/dept.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const newRoutes = createTRPCRouter({

/// Reegan,, write your new routes here,; so in frontend api is imported refer naturalCurls admin/settings/page.tsx then ,, api.newRoutes.getData.method
//this "method u get from chatgpt".

//use session.id to search for user table in the database, then fetch the information and insert them in frontend profile.
//so add few details in database schema like addres and all 
//when u change the user schema ask chatgpt to update seed.ts file as per the schema and then run => npx prisma db push --force-reset;   then :=>npm run db:push; then :=> npx prisma db seed 
// the abouve step will first update the database schema, then seed the database with initial data. then u have to write new routes in backend ,, then function in frontend and use the function values to display in frontend.

// 




});
