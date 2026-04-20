import { z } from "zod";

export const taskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
});

export const postTaskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
  authorId: z.number().positive(),
});

export const patchTaskSchema = z.object({
  content: z.string("Task is required.").min(1, "Task is required.").max(300),
  authorId: z.number().positive().nullish(),
});

export const boardSchema = z.object({
  name: z
    .string("Board name is required.")
    .min(1, "Board name is required.")
    .max(100),
});

export const postBoardSchema = z.object({
  name: z
    .string("Board name is required.")
    .min(1, "Board name is required.")
    .max(100),
  content: z.json(),
  authorId: z.number().positive(),
});

export const patchBoardSchema = z.object({
  name: z
    .string("Board name is required.")
    .min(1, "Board name is required.")
    .max(100),
  content: z.json().nullish(),
  authorId: z.number().positive().nullish(),
});
