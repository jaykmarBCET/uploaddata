import { NextRequest } from "next/server";
import { User } from "@/models/userModel";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: NextRequest) => {
  try {
    const tokenObj = req.cookies.get("token");
    const token = tokenObj?.value;
    

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECURE_KEY as string) as { _id: string; email: string };
    
    const user = await User.findById(decoded._id).select("-password");
    
    
    if (!user) {
      throw new Error("Invalid token");
    }

    return user;
  } catch (error) {
    throw new Error("Token verification failed");
    console.log("middleware problem",error);
  }
};
