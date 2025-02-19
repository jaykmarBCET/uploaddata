import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image'

interface ImageCardProps {
  backgroundUrl: string;
  avatarUrl: string;
  title: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ backgroundUrl, avatarUrl, title }) => {
  return (
    <div className="relative w-full h-screen">

      <div className="absolute inset-0">
        <Image
          src={backgroundUrl}
          alt="Background"
          className="w-full h-full object-cover"
          fill={true}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Centered Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="relative w-96 rounded-xl shadow-xl bg-white/80 backdrop-blur-md">
          <div className="relative w-full h-40">
            {/* Avatar */}
            <div className="absolute  flex-col inset-0 flex items-center justify-center -top-8">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <CardContent className="pt-10 pb-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </CardContent>
            </div>
          </div>


        </Card>
      </div>
    </div>
  );
};

export default ImageCard;
