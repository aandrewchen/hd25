import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  messages: defineTable({
    body: v.string(),
    sender: v.id("users"),
    recipient: v.id("users"),
  }),
  chats: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    lastMessage: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
  }),
  houses: defineTable({
    address: v.string(),
    rentAmount: v.number(),
    dueDate: v.number(), // Day of month rent is due
    landlordId: v.id("users"),
  }),
  houseTenants: defineTable({
    houseId: v.id("houses"),
    tenantId: v.id("users"),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_house", ["houseId"]),
  rentPayments: defineTable({
    houseId: v.id("houses"),
    userId: v.id("users"),
    amount: v.number(),
    month: v.number(), // Month number (1-12)
    year: v.number(),
    status: v.string(), // "paid", "pending", "overdue"
    paymentDate: v.optional(v.number()),
  }),
  maintenanceRequests: defineTable({
    houseId: v.id("houses"),
    userId: v.id("users"),
    title: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    location: v.string(),
    images: v.array(v.string()), // URLs to images
    status: v.string(), // "submitted", "in-progress", "done"
    submittedAt: v.number(),
    completedAt: v.optional(v.number()),
  }),
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(), // "rent", "repair"
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
    relatedId: v.optional(v.string()), // ID of related rent payment or maintenance request
  }),
  userInfo: defineTable({
    userId: v.id("users"), // Reference to the auth users table
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.string()), // "landlord" or "tenant"
    lastActive: v.optional(v.number()),
    image: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});

export default schema;
