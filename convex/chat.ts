import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    sender: v.id("users"),
    recipient: v.id("users"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      sender: args.sender,
      recipient: args.recipient,
      body: args.body,
    });

    const existingChat = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("user1"), args.sender),
            q.eq(q.field("user2"), args.recipient)
          ),
          q.and(
            q.eq(q.field("user1"), args.recipient),
            q.eq(q.field("user2"), args.sender)
          )
        )
      )
      .first();

    if (existingChat) {
      await ctx.db.patch(existingChat._id, {
        lastMessage: args.body,
        lastMessageTime: Date.now(),
      });
    } else {
      await ctx.db.insert("chats", {
        user1: args.sender,
        user2: args.recipient,
        lastMessage: args.body,
        lastMessageTime: Date.now(),
      });
    }
  },
});

export const getMessages = query({
  args: {
    userId: v.id("users"),
    recipientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("sender"), args.userId),
            q.eq(q.field("recipient"), args.recipientId)
          ),
          q.and(
            q.eq(q.field("sender"), args.recipientId),
            q.eq(q.field("recipient"), args.userId)
          )
        )
      )
      .order("desc")
      .take(50);
    return messages.reverse();
  },
});

export const getChats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1"), args.userId),
          q.eq(q.field("user2"), args.userId)
        )
      )
      .collect();
    return chats;
  },
});
