import connectDB from "@/config/database";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { email, password, username } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      is_verified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          message: "Username already exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.is_verified) {
        return Response.json(
          {
            message: "User already exists with this email",
            success: false,
          },
          {
            status: 400,
          }
        );
      }
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = expiryDate;

      await existingUserByEmail.save();
    } else {
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        username: username,
        is_online: true,
        is_verified: false,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        chats: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    console.log("emailResponse", emailResponse)
    if (!emailResponse.success) {
      return Response.json(
        {
          message: "Error sending verification email",
          success: false,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: "User registered successfully. Please verify your email",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error registering user ", error);
    return Response.json(
      {
        message: "Error registering user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
