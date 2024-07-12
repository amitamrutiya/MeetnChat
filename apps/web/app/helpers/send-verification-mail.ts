import { Resend } from "resend";
import VerificationEmail from "../emails/verification-email";
import { ApiResponse } from "@repo/common";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      to: [email],
      subject: "MeetnChillChat | Verification Code",
      from: "meetnchillchat@studynotion.store",
      react: VerificationEmail({ username, otp }),
    });
    if (response.error) {
      console.log("Error in sendVerificationEmail", response.error);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
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
