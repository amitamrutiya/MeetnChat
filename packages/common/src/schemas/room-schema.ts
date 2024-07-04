import { z } from "zod";

export const roomSchema = z.object({
  roomId: z.string().uuid(),
});
