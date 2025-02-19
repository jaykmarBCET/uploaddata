import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/userModel";
import { connectDB } from "@/connection/dbConnect";
import { uploader } from "@/utils/uploaddata";
import { authMiddleware } from "@/middleware/auth.middleware";
import { deleter } from "@/utils/deletedata";

connectDB();

export const POST = async (req: NextRequest) => {
    const user = await authMiddleware(req);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized request" }, { status: 400 });
    }

    const currentUser = await User.findById(user._id);
    if (!currentUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { avatar } = await req.json();
    if (!avatar) {
        return NextResponse.json({ message: "Data is required" }, { status: 400 });
    }

    const { url, publicId } = await uploader(avatar);
    if (!url) {
        return NextResponse.json({ message: "Something went wrong while uploading user data" }, { status: 500 });
    }

    if (currentUser.avatarId) {
        await deleter(currentUser.avatarId);
    }

    await User.findByIdAndUpdate(
        currentUser._id,  // Fix: Correctly passing the user ID
        { avatarId: publicId, avatar: url },
        { new: true }
    );

    const changedUser = await User.findById(currentUser._id).select("-password");
    if (!changedUser) {
        return NextResponse.json({ message: "Server problem" }, { status: 500 });
    }

    return NextResponse.json(changedUser, { status: 200 });
};
