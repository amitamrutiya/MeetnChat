"use server";

import { db } from "@/lib/db";
import { signUpSchema } from "@/schemas/signupSchema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function register(values: z.infer<typeof signUpSchema>) {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }
  const { username, email, password, fullname } = validatedFields.data;

  const existingUserVerifiedByUsername = await db.user.findFirst({
    where: {
      username,
      emailVerified: {
        not: null,
      },
    },
  });

  if (existingUserVerifiedByUsername) {
    return { success: false, message: "Username already exists" };
  }

  const existingUserByEmail = await db.user.findFirst({
    where: {
      email,
    },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 10);
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (existingUserByEmail && existingUserByEmail.emailVerified) {
    // existingUserByEmail.password = hashedPassword;
    // existingUserByEmail.verifyCode = verifyCode;
    // existingUserByEmail.verifyCodeExpiry = expiryDate;
    // existingUserByEmail.updatedAt = new Date();
    // await db.user.create({
    //   data: existingUserByEmail,
    // });
    return { success: false, message: "User already exists with this email" };
  } else {
    const firstName = fullname.split(" ")[0];
    const lastName = fullname.split(" ")[1] ?? "";
    const newUser = await db.user.create({
      data: {
        email,
        name: fullname,
        password: hashedPassword,
        username: username,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}+${lastName}`,
        is_online: true,
        emailVerified: new Date(),
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        friends: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return { success: false, message: "Error sending verification email" };
    }
    return {
      success: true,
      message: "User registered successfully. Please verify your email",
    };
  }
}
