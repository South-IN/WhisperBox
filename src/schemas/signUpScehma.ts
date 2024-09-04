import { z } from "zod";

export const validateUsername = z
  .string()
  .min(2, "Username must atleast be 2 characters")
  .max(20, "username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not have special characters");

export const signUpSchema = z.object({
  usename: validateUsername,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be greater than 6 characters" }),
});
