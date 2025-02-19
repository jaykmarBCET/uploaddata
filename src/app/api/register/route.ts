import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/connection/dbConnect";
import { User } from "@/models/userModel";
import { generateToken } from "@/utils/generateToken";

connectDB();

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const already = await User.findOne({ email });
        if (already) {
            return NextResponse.json({ message: "Already have an account" }, { status: 400 });
        }

        const newUser = await User.create({ name, email, password });
        if (!newUser) {
            return NextResponse.json({ message: "Something went wrong while creating user" }, { status: 500 });
        }

        const user = await User.findById(newUser._id);
        if (!user) {
            return NextResponse.json({ message: "Something went wrong while fetching user" }, { status: 500 });
        }

        const token = await generateToken(user._id);
        const res = NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email
        }, { status: 200 });

        res.headers.append("Set-Cookie", `token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`);

        return res;
    } catch (error) {
        console.error("Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({ message: "Something went wrong", error: errorMessage }, { status: 500 });
    }
};
