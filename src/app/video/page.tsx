"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import useAuthStore from "@/store/user";
import { useRouter } from "next/navigation";
import { DataItem } from "@/store/user";
import ReactPlayer from "react-player";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function Video() {
  const router = useRouter();
  const [play, setPlay] = useState<DataItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const { user, data } = useAuthStore();

  // Memoized video list to prevent unnecessary re-renders
  const videos = useMemo(() => data?.filter((item) => item.type !== "image") || [], [data]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user?.email) {
      router.push("/login");
    }
  }, [user, router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!play) return;
      const currentIndex = videos.findIndex((item) => item._id === play._id);

      switch (e.key.toLowerCase()) {
        case "m": // Mute/Unmute
          setIsMuted((prev) => !prev);
          break;
        case "f": // Fullscreen
          if (playerRef.current) {
            const playerElement = playerRef.current.getInternalPlayer();
            if (playerElement?.requestFullscreen) {
              playerElement.requestFullscreen();
            }
          }
          break;
        case "arrowright": // Next Video
          if (currentIndex < videos.length - 1) {
            setPlay(videos[currentIndex + 1]);
          }
          break;
        case "arrowleft": // Previous Video
          if (currentIndex > 0) {
            setPlay(videos[currentIndex - 1]);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [play, videos]);

  return (
    <div className="w-full mt-4 px-4 h-[80vh] flex flex-col lg:flex-row">
      {/* Video Player Section */}
      <div className="lg:w-[75%] w-full">
        <motion.h1
          layoutId="video-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-bold bg-gray-300 dark:bg-gray-700 text-black dark:text-white inline-block px-4 py-1 rounded-lg"
        >
          {play?.message || "Select a video"}
        </motion.h1>
        <div className="mt-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ReactPlayer
              ref={playerRef}
              className="rounded-lg border-4 border-gray-400 shadow-lg"
              width="100%"
              url={play?.dataUrl}
              controls
              playing
              muted={isMuted}
            />
          </motion.div>
        </div>
      </div>

      {/* Video List Sidebar */}
      <div className="border overflow-y-auto mt-4 lg:mt-0 lg:ml-6 w-full lg:w-[25%] flex flex-col items-center p-2 rounded-lg shadow-lg h-[85vh]">
        {videos.length > 0 ? (
          videos.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Card
                onClick={() => play?._id !== item._id && setPlay(item)} // Prevent redundant state updates
                className={`cursor-pointer transition-all ${
                  item._id === play?._id ? "bg-blue-500 text-white" : "bg-blue-300"
                }`}
              >
                <CardContent className="p-3 text-center">{item.message}</CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No videos available</p>
        )}
      </div>
    </div>
  );
}

export default Video;
