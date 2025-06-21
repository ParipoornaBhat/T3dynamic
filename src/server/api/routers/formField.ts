import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const formFieldRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.formField.findMany({
      orderBy: { name: "asc" },
    });
  }),

  updateOptions: publicProcedure
    .input(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.formField.update({
        where: { name: input.name },
        data: { options: input.options },
      });
    }),

  addOption: publicProcedure
    .input(
      z.object({
        name: z.string(),
        option: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.formField.findUnique({ where: { name: input.name } });
      if (!field) throw new Error("Form field not found");

      return ctx.db.formField.update({
        where: { name: input.name },
        data: {
          options: [...field.options, input.option],
        },
      });
    }),

  deleteOption: publicProcedure
    .input(
      z.object({
        name: z.string(),
        index: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.formField.findUnique({ where: { name: input.name } });
      if (!field) throw new Error("Form field not found");

      const newOptions = [...field.options];
      newOptions.splice(input.index, 1);

      return ctx.db.formField.update({
        where: { name: input.name },
        data: { options: newOptions },
      });
    }),
});
