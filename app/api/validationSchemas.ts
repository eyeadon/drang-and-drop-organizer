import { z } from "zod";

export const taskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
});

export const postTaskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
  authorId: z.number().positive().nullish(),
});

export const patchTaskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
  authorId: z.number().positive().nullish(),
});
