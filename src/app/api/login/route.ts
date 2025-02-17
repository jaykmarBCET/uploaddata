import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/connection/dbConnect";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/generateToken";

connectDB();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password }: { email: string; password: string } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password.length <= 7) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User does not have an account" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ Await bcrypt.compare
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = await generateToken(user._id);
    if (!token) {
      return NextResponse.json({ message: "Token generation failed" }, { status: 500 });
    }

    const res = NextResponse.json({ email: user.email, name: user.name, _id: user._id }, { status: 200 });

    // ✅ Correct way to set cookies in Next.js API route
    res.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`);

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
