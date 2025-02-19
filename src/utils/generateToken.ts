import { User } from "@/models/userModel";
import jwt from 'jsonwebtoken'

const generateToken = async (userId: string): Promise<string | null> => {
    try {
      const user = await User.findById(userId);
      if (!user) return null;
  
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECURE_KEY as string,
        { expiresIn: "7d" }
      );
  
      return token;
    } catch (error) {
      console.error("Token generation failed:", error);
      return null;
    }
  };

  export {generateToken}