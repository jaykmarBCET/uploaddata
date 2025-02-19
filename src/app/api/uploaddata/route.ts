import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/userModel";
import { connectDB } from "@/connection/dbConnect";
import { uploader } from "@/utils/uploaddata";
import { authMiddleware } from "@/middleware/auth.middleware";
import { deleter } from "@/utils/deletedata";
import { Data } from "@/models/DataModel";

connectDB()
export const  POST = async(req:NextRequest)=>{
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ message: "unauthorized request" }, { status: 400 })
        }
        const currentUser = await User.findById(user._id);
        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const {data,message,type} = await req.json()
        if(!data){
            return NextResponse.json({message:"data is required"},{status:400})
        }

        const {url,publicId}:{url:string,publicId:string} = await uploader(data);
        if(!url){
            return NextResponse.json({message:"something server problem"},{status:500})
        }
        const newData = await Data.create({
            userId:currentUser._id,
            dataUrl:url,
            dataId:publicId,
            message,
            type,

        })
        const currentData = await Data.findById(newData._id);
        if(!currentData){
            return NextResponse.json({message:"server problem try again"},{status:500})
        }

        return NextResponse.json(currentData,{status:200});
    } catch (error) {
        return NextResponse.json({message:"server problem",error},{status:500})
    }
}
// GET: Fetch user data
export const GET = async (req: NextRequest) => {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
        }
        const userData = await Data.find({ userId: user._id });
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
};

// DELETE: Remove data from Cloudinary and MongoDB
export const DELETE = async (req: NextRequest) => {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
        }
        const { dataId } = await req.json();
        if (!dataId) {
            return NextResponse.json({ message: "Data ID is required" }, { status: 400 });
        }
        const existingData = await Data.findOne({ userId: user._id, _id:dataId });
        if (!existingData) {
            return NextResponse.json({ message: "Data not found" }, { status: 404 });
        }
        await deleter(existingData.dataId);
        await Data.findByIdAndDelete(existingData._id);
        return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
};

// UPDATE: Modify type and message
export const PUT = async (req: NextRequest) => {
    try {
        const user = await authMiddleware(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
        }
        const { dataId, type, message } = await req.json();
        if (!dataId) {
            return NextResponse.json({ message: "Data ID is required" }, { status: 400 });
        }
        const updatedData = await Data.findByIdAndUpdate(dataId,{type,message },{new:true})
        if (!updatedData) {
            return NextResponse.json({ message: "Data not found or update failed" }, { status: 404 });
        }
        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
};
