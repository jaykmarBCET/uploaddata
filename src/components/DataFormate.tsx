import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import useAuthStore from "@/store/user";
import Image from "next/image";

interface NoteProps {
  item: {
    _id: string;
    dataUrl: string;
    dataId: string;
    type: string;
    message: string;
  };
}

const NoteCard: React.FC<NoteProps> = ({ item }) => {
  const { deleteData, updateData } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [newMessage, setNewMessage] = useState(item.message);
  const [newType, setNewType] = useState(item.type);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDelete = async () => {
    await deleteData(item._id);
  };

  const handleUpdate = async () => {
    await updateData({ dataId: item._id, message: newMessage, type: newType });
    setEditMode(false);
  };

  const downloadHandle = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch(item.dataUrl);
      const contentLength = response.headers.get("content-length");
      const contentType = response.headers.get("content-type");

      if (!response.body || !contentLength || !contentType) {
        throw new Error("Failed to fetch file metadata.");
      }

      const totalSize = parseInt(contentLength, 10);
      let loadedSize = 0;
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loadedSize += value.length;
        setDownloadProgress((loadedSize / totalSize) * 100);
      }

      const blob = new Blob(chunks, { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const fileExtension = contentType.includes("video") ? ".mp4" : contentType.includes("image") ? ".jpg" : "";
      link.download = (item.message || "download") + fileExtension;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white mx-2 w-full max-w-sm">
      {item.type === "video" ? (
        <ReactPlayer url={item.dataUrl} width="100%" controls height="auto" />
      ) : (
        <Image src={item.dataUrl} width={1000} height={500} alt="Note" className="w-full object-fill h-40 rounded-md" />
      )}

      <p className="mt-2 text-gray-700 text-sm">{item.message || "No message"}</p>

      <div className="flex flex-wrap gap-2 justify-between mt-4">
        <Button className="bg-red-500 hover:bg-red-600 text-white flex-1" onClick={handleDelete}>
          Delete
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white flex-1" onClick={() => setEditMode(true)}>
          Update
        </Button>
        <Button onClick={downloadHandle} variant="outline" disabled={isDownloading} className="flex-1">
          {isDownloading ? `Downloading... ${downloadProgress.toFixed(2)}%` : "Download"}
        </Button>
      </div>

      {/* Responsive Update Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 sm:p-4 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Update Note</h2>
            <input
              type="text"
              placeholder="New Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <div className="flex justify-between">
              <Button className="bg-gray-500 text-white" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button className="bg-green-500 text-white" onClick={handleUpdate}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
