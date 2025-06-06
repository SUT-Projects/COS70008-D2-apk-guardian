import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(
      /^(?!.*\s)[^\s]{6,20}$/,
      "Password requirements: No Whitespaces. Length: 06-20 characters.",
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
