import connectDB from "@/config/database";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await connectDB();
  return new NextResponse("connect");
}
