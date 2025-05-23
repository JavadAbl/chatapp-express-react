import { z } from "zod";

export const LoginScheme = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" })
    .nonempty({ message: "Username is required" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(30, { message: "Password must be at most 30 characters long" })
    .nonempty({ message: "Password is required" }),
});

export type LoginDTO = z.infer<typeof LoginScheme>;
