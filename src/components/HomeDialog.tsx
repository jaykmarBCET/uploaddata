import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageCardProps {
  backgroundUrl: string;
  avatarUrl: string;
  title: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ backgroundUrl, avatarUrl, title }) => {
  return (
    <div className="relative w-full h-screen">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundUrl}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay for better visibility */}
      </div>

      {/* Centered Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="relative w-96 rounded-xl shadow-xl bg-white/80 backdrop-blur-md">
          <div className="relative w-full h-40">
            {/* Avatar */}
            <div className="absolute inset-0 flex items-center justify-center -top-8">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Card Content */}
          <CardContent className="pt-10 pb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageCard;
