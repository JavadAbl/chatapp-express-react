import { z } from "zod";

export const RegisterScheme = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(30, { message: "First name must be at most 30 characters long" })
    .nonempty({ message: "First name is required" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(30, { message: "Last name must be at most 30 characters long" })
    .nonempty({ message: "Last name is required" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" })
    .nonempty({ message: "Username is required" }),

  mobile: z.string().nonempty({ message: "mobile is required" }),

  email: z.string().email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(30, { message: "Password must be at most 30 characters long" })
    .nonempty({ message: "Password is required" }),

  profileImage: z.string().optional(),
});

/*  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }); */

// export type TypeOf<T extends ZodType<any, any, any>> = T["_output"];
export type RegisterDTO = z.infer<typeof RegisterScheme>;
