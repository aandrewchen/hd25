import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getHousemates = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // First find the user's house
    const houseTenant = await ctx.db
      .query("houseTenants")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.userId))
      .first();

    if (!houseTenant) {
      throw new Error("House not found");
    }

    // Get all tenants for this house
    const houseTenants = await ctx.db
      .query("houseTenants")
      .withIndex("by_house", (q) => q.eq("houseId", houseTenant.houseId))
      .collect();

    // Get all users
    const housemates = await Promise.all(
      houseTenants.map(async (tenant) => {
        const user = await ctx.db.get(tenant.tenantId);
        if (!user) {
          throw new Error(`User ${tenant.tenantId} not found`);
        }
        return user;
      })
    );

    return housemates;
  },
});
