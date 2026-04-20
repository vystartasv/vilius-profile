import { defineCollection, z } from 'astro:content';

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    period: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    outcomes: z.array(z.string()),
    href: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published: z.string(),
    href: z.string().url(),
  }),
});

export const collections = { experience, projects, writing };
