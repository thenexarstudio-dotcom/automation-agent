import { defineCollection, z } from "astro:content";

const faqItem = z.object({
  q: z.string(),
  a: z.string(),
});

const templates = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
    order: z.number(),
    price: z.number(),
    relatedTemplates: z.array(z.string()).default([]),
    relatedTool: z.string().optional(),
    faq: z.array(faqItem).default([]),
    updated: z.string(),
  }),
});

const tools = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
    relatedTemplates: z.array(z.string()).default([]),
    faq: z.array(faqItem).default([]),
    updated: z.string(),
  }),
});

const guides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
    price: z.number(),
    faq: z.array(faqItem).default([]),
    updated: z.string(),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
    publishDate: z.string(),
    relatedTemplates: z.array(z.string()).default([]),
    relatedTool: z.string().optional(),
  }),
});

const comparisons = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
    updated: z.string(),
  }),
});

const faq = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    items: z.array(faqItem),
  }),
});

const pillar = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    dek: z.string(),
  }),
});

export const collections = { templates, tools, guides, blog, comparisons, faq, pillar };
