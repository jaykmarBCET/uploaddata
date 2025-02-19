import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

// Define User Interface
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarId?: string;
  cover?:string;
  coverId?:string
}

// Define Data Interface
export interface DataItem {
  _id: string;
  dataUrl: string;
  dataId: string;
  message: string;
  type: string;
  createAt:Date;
  updatedAt:Date;

}

// Define Store State and Actions
interface AuthState {
  user: User | null;
  data: DataItem[] | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  currentUser: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  avatar: (avatar: File) => Promise<void>;
  cover: (cover: File) => Promise<void>;
  getData: () => Promise<void>;
  deleteData: (dataId: string) => Promise<void>;
  add:(data:{data:any,message:string,type:string})=>Promise<void>;
  updateData: (data: { dataId: string; type: string; message: string }) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  data: null,

  login: async (data) => {
    try {
      toast.loading("Logging in...");
      const response = await axios.post<User>("/api/login", data, { withCredentials: true });
      toast.dismiss();
      if (response.status === 200) {
        toast.success("Login successful!");
        set({ user: response.data });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Login failed! Please check your credentials.");
      console.error("Login error:", error);
    }
  },

  currentUser: async () => {
    try {
      const response = await axios.get<User>("/api/currentuser", { withCredentials: true });
      set({ user: response.data });
    } catch (error) {
      toast.error("Failed to fetch user data.");
      console.error("Current user fetch error:", error);
    }
  },

  register: async (data) => {
    try {
      toast.loading("Registering...");
      const response = await axios.post<User>("/api/register", data, { withCredentials: true });
      toast.dismiss();
      toast.success("Registration successful!");
      set({ user: response.data });
    } catch (error) {
      toast.dismiss();
      toast.error("Registration failed.");
      console.error("Register error:", error);
    }
  },

  avatar: async (avatar) => {
    try {
      const response = await axios.post<User>("/api/avatar", { avatar }, { withCredentials: true });
      set({ user: response.data });
    } catch (error) {
      toast.error("Failed to update avatar.");
      console.error("Avatar update error:", error);
    }
  },

  cover: async (cover) => {
    try {
      const response = await axios.post<User>("/api/cover", { cover }, { withCredentials: true });
      set({ user: response.data });
    } catch (error) {
      toast.error("Failed to update cover image.");
      console.error("Cover update error:", error);
    }
  },

  getData: async () => {
    try {
      const response = await axios.get<DataItem[]>("/api/uploaddata", { withCredentials: true });
      set({ data: response.data });
    } catch (error) {
      toast.error("Failed to fetch data.");
      console.error("Data fetch error:", error);
    }
  },

  deleteData: async (dataId) => {
    try {
      await axios.delete("/api/uploaddata", {
        data: { dataId },
        withCredentials: true,
      });
      set((state) => ({
        data: state.data?.filter((item) => item._id !== dataId) || [],
      }));
      toast.success("Data deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete data.");
      console.error("Data delete error:", error);
    }
  },

  updateData: async (data:{dataId:string,message:string,type:string}) => {
    try {
      const response = await axios.put<DataItem>("/api/uploaddata", data, { withCredentials: true });
      set((state) => ({
        data: state.data?.map((item) => (item._id === data.dataId ? response.data : item)) || [],
      }));
      toast.success("Data updated successfully!");
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Data update error:", error);
    }
  },
  add: async (data) => {
    try {
      const response = await axios.post('/api/uploaddata', data, { withCredentials: true });
      
      set((state) => ({
        data: [...state.data!, response.data], // Correct spreading of state.data
      }));
      toast.success("data added successfully")
      
    } catch (error) {
      toast.error("failed to add")
      console.error("Error uploading data:", error);
    }
  }
  
}));

export default useAuthStore;
