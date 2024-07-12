import { z } from "zod";

export const usernameValidation = z.string().min(1, { message: "Username must be at least 1 character" });

export const emailValidation = z.string().email("Please enter a valid email address");

export const phoneValidation = z.string().regex(/^\d{10}$/, "Please enter a valid phone number");

export const profileImageValidation = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 3MB")
  .refine(
    (file) => {
      const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      1;
      return supportedImageTypes.includes(file!.type);
    },
    {
      message: "Uploaded file must be an image (jpeg, jpg, png, gif, webp, svg).",
    }
  );
export const profileSchema = z.object({
  name: z.string(),
  phone_number: phoneValidation,
  username: usernameValidation,
  bio: z.string(),
  profile_image: profileImageValidation,
});
