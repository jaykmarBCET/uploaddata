"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/user";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AvatarChanger from "@/components/AvatarChanger";
import CoverChanger from "@/components/CoverChanger";
import DataFormate from "@/components/DataFormate";

const Dashboard = () => {
  const { user, data, getData } = useAuthStore();
  const router = useRouter();
  const [showAvatarChanger, setShowAvatarChanger] = useState(false);
  const [showCoverChanger, setShowCoverChanger] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Cover and Avatar Section */}
      <div className="relative w-full max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div
          className="relative w-full h-64 cursor-pointer"
          onClick={() => setShowCoverChanger(true)}
        >
          <img
            src={user?.cover || "/default-cover.jpg"}
            alt="User Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <span className="text-white text-sm">Change Cover</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div
            className="cursor-pointer"
            onClick={() => setShowAvatarChanger(true)}
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg hover:scale-105 transition">
              <AvatarImage src={user?.avatar || "/default-avatar.png"} />
              <AvatarFallback className="bg-gray-300 text-gray-700">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Name and Email */}
      <div className="mt-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {user?.name || "User Name"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
      </div>

      {/* Avatar & Cover Changer Modals */}
      {showAvatarChanger && <AvatarChanger close={setShowAvatarChanger} />}
      {showCoverChanger && <CoverChanger close={setShowCoverChanger} />}

      {/* Data Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">
          Your Data
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {data && data.length > 0 ? (
            data.map((item, idx) => (
              <Card key={idx} className="shadow-lg hover:scale-105 transition">
                <CardContent className="p-4 ">
                  <DataFormate item={item} />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-3">
              No data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
