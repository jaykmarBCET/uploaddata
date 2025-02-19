import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/connection/dbConnect";
import { User } from "@/models/userModel";
import { authMiddleware } from "@/middleware/auth.middleware";
import { generateToken } from "@/utils/generateToken";

connectDB();

export const GET = async (req: NextRequest) => {
    try {
        const user = await authMiddleware(req);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const currentUser = await User.findById(user._id).select("-password");
        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const token = await generateToken(currentUser._id);
        const res = NextResponse.json(currentUser, { status: 200 });

        res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/`);
        return res;
    } catch (error) {
        console.error("Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({ message: "Something went wrong", error: errorMessage }, { status: 500 });
    }
};
