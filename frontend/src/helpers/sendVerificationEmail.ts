import { resend } from "@/config/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    resend.emails.send({
      to: email,
      subject: "MeetnChillChat | Verification Code",
      from: "meetnchillchat@gmail.com",
      react: VerificationEmail({ username, otp }),
    });

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (error) {
    console.log("Error in sendVerificationEmail", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
