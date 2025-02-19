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
  cover?: string;
  coverId?: string;
}

// Define Data Interface
export interface DataItem {
  _id: string;
  dataUrl: string;
  dataId: string;
  message: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Store State and Actions
interface AuthState {
  user: User | null;
  data: DataItem[] | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  currentUser: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  avatar: (avatar: string) => Promise<void>;
  cover: (cover: string) => Promise<void>;
  getData: () => Promise<void>;
  deleteData: (dataId: string) => Promise<void>;
  add: (data: { data: string; message: string; type: string }) => Promise<void>;
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

  updateData: async ({ dataId, message, type }) => {
    try {
      const response = await axios.put<DataItem>("/api/uploaddata", { dataId, message, type }, { withCredentials: true });
      set((state) => ({
        data: state.data?.map((item) => (item._id === dataId ? response.data : item)) || [],
      }));
      toast.success("Data updated successfully!");
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Data update error:", error);
    }
  },

  add: async ({ data, message, type }) => {
    try {
      const response = await axios.post<DataItem>("/api/uploaddata", { data, message, type }, { withCredentials: true });
      set((state) => ({
        data: state.data ? [...state.data, response.data] : [response.data],
      }));
      toast.success("Data added successfully!");
    } catch (error) {
      toast.error("Failed to add data.");
      console.error("Error uploading data:", error);
    }
  },
}));

export default useAuthStore;
