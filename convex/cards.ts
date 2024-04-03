import { httpAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const create = mutation({
  args: {
    questionMarkdown: v.string(),
    answerMarkdown: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cards", { ...args });
  },
});

export const get = query({
  args: { id: v.id("cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cards").collect();
  },
});

export const markReviewed = mutation({
  args: {
    id: v.id("cards"),
    nextReviewAtMillis: v.number(),
  },
  handler: async (ctx, { id, nextReviewAtMillis }) => {
    await ctx.db.patch(id, { nextReviewAtMillis });
  },
});

export const httpCreate = httpAction(async (ctx, request) => {
  const { questionMarkdown, answerMarkdown }: { questionMarkdown: string, answerMarkdown: string } = await request.json();
  await ctx.runMutation(api.cards.create, { questionMarkdown, answerMarkdown });
  return new Response(null, {
    status: 204,
    // headers: new Headers({
    //   // e.g. https://mywebsite.com, configured on your Convex dashboard
    //   "Access-Control-Allow-Origin": request.headers.get('Referer') ?? '*',
    //   Vary: "origin",
    // }),
  },
  );
});
