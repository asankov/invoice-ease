import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const invoiceItem = v.object({
  description: v.string(),
  quantity: v.number(),
  price: v.number(),
  total: v.number(),
});

export default defineSchema({
  company: defineTable({
    userId: v.string(),
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
  }).index("by_user", ["userId"]),

  invoices: defineTable({
    userId: v.string(),
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientNumber: v.string(),
    clientAddress: v.string(),
    items: v.array(invoiceItem),
    date: v.string(),
  }).index("by_user", ["userId"]),

  customers: defineTable({
    userId: v.string(),
    name: v.string(),
    number: v.string(),
    address: v.string(),
  }).index("by_user", ["userId"]),

  itemTemplates: defineTable({
    userId: v.string(),
    description: v.string(),
    defaultPrice: v.number(),
    category: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
