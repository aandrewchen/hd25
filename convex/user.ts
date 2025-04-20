import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get the auth user
    const authUser = await ctx.db.get(args.userId);
    if (!authUser) return null;

    // Get the userInfo
    const userInfo = await ctx.db
      .query("userInfo")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    // Return combined user data
    return userInfo;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
