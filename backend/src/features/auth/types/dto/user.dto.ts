import { z } from "zod";

export const UserDTOSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  profileImage: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserDTO = z.infer<typeof UserDTOSchema>;
