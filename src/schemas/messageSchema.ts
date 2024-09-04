import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .max(300, { message: "Content must be under 300 characters" }),
});
