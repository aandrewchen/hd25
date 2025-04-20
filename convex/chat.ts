import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

const openAIclient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const translateMessage = action({
  args: {
    text: v.string(),
    targetLanguage: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await openAIclient.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text to ${args.targetLanguage}. If you cannot figure out the translation, please return 'Please speak into the microphone again.' Please do not return random text that is not the translation.`,
          },
          {
            role: "user",
            content: args.text,
          },
        ],
      });

      return response.choices[0].message.content || undefined;
    } catch (error) {
      console.error("Translation error:", error);
      return undefined;
    }
  },
});

export const sendMessage = action({
  args: {
    sender: v.id("users"),
    recipient: v.id("users"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Get recipient's language preference
    const recipientInfo = await ctx.runQuery(api.user.getUser, {
      userId: args.recipient,
    });

    let translation: string | undefined = undefined;
    // Call the translation function
    const translatedText = await ctx.runAction(api.chat.translateMessage, {
      text: args.body,
      targetLanguage: recipientInfo?.language || "eng",
    });

    if (translatedText) {
      translation = translatedText;
    }

    // Store the message with translation
    await ctx.runMutation(api.chat.storeMessage, {
      sender: args.sender,
      recipient: args.recipient,
      body: args.body,
      translation: translation,
    });
  },
});

export const storeMessage = mutation({
  args: {
    sender: v.id("users"),
    recipient: v.id("users"),
    body: v.string(),
    translation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      sender: args.sender,
      recipient: args.recipient,
      body: args.body,
      translation: args.translation,
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

    // Enhance chats with information about the other user
    const chatsWithUsers = await Promise.all(
      chats.map(async (chat) => {
        // Determine which user is the other person in the chat
        const otherUserId =
          chat.user1 === args.userId ? chat.user2 : chat.user1;

        // Get the other user's information
        const otherUser = await ctx.db.get(otherUserId);

        // Return the chat with the other user's information
        return {
          ...chat,
          otherUser: {
            _id: otherUser?._id,
            name: otherUser?.name,
            image: otherUser?.image,
          },
        };
      })
    );

    return chatsWithUsers;
  },
});

export const translateExistingMessage = mutation({
  args: {
    messageId: v.id("messages"),
    recipientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the message
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Get recipient's language preference from userInfo table
    const userInfo = await ctx.db
      .query("userInfo")
      .filter((q) => q.eq(q.field("userId"), args.recipientId))
      .first();

    if (!userInfo) {
      return; // No userInfo found, no translation needed
    }

    // Check if recipient has a language preference
    if (userInfo.language === "eng") {
      return; // No translation needed
    }

    // Use OpenAI directly for translation
    try {
      const response = await openAIclient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text to ${userInfo.language}. If you cannot figure out the translation, please return 'Please speak into the microphone again.' Please do not return random text that is not the translation.`,
          },
          {
            role: "user",
            content: message.body,
          },
        ],
      });

      const translatedText = response.choices[0].message.content;
      if (translatedText) {
        // Update the message with the translation
        await ctx.db.patch(args.messageId, {
          translation: translatedText,
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
  },
});
