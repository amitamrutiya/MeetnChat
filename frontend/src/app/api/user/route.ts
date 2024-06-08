import { getUserByEmail } from "@/actions/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (email) {
    const user = await getUserByEmail(email as string);
    console.log(user);
    if (user) {
      return NextResponse.json({ success: true, user: user }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Email not provided" },
      { status: 400 }
    );
  }
}
