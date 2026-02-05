import { z } from "zod";

const emptyToUndefined = (value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

export const FeedbackStatus = z.enum(["Pending", "Approved", "Published"]);

export const FeedbackInputSchema = z
  .object({
    name: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(120).optional()),
    email: z.preprocess(emptyToUndefined, z.string().email().max(200).optional()),
    message: z.string().trim().min(1).max(4000),
    context: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
    budget: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
    timeline: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
    type: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    topic: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    consent: z.boolean(),
    source: z.string().trim().max(200).optional()
  })
  .strict();

export const FeedbackUpdateSchema = z
  .object({
    status: FeedbackStatus.optional(),
    note: z.string().trim().max(500).optional()
  })
  .strict();

export const ChangelogEntryInputSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    summary: z.string().trim().min(1).max(2000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
    links: z
      .array(
        z
          .object({
            label: z.string().trim().min(1).max(80),
            url: z.string().url().max(500)
          })
          .strict()
      )
      .max(20)
      .optional()
  })
  .strict();
