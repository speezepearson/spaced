import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    questionMarkdown: v.string(),
    answerMarkdown: v.string(),
    nextReviewAtMillis: v.optional(v.number()),
  }),
});
