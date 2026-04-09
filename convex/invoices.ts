import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const invoiceItem = v.object({
  description: v.string(),
  quantity: v.number(),
  price: v.number(),
  total: v.number(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== identity.subject) return null;
    return invoice;
  },
});

export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.string(),
    items: v.array(invoiceItem),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("invoices", { userId: identity.subject, ...args });
  },
});

export const update = mutation({
  args: {
    id: v.id("invoices"),
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.string(),
    items: v.array(invoiceItem),
    date: v.string(),
  },
  handler: async (ctx, { id, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const invoice = await ctx.db.get(id);
    if (!invoice || invoice.userId !== identity.subject) throw new Error("Not found");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== identity.subject) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
