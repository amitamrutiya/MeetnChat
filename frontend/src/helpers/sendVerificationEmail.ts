import { resend } from "@/config/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
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
