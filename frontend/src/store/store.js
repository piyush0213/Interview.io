import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const useStore = create((set) => ({

  // can use this hook to create a global state
  // set is a function that takes an object and updates the state with the object in zustand
  user: null,
  isSigningUp: false,
  checkingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  isUpdatingAvatar: false,
  isEdittingUser: false,

  signup: async (credentials) => {
    set({ isSigningUp: true }); // set isSigningUp to true when signing up
    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/signup`, credentials);
      localStorage.setItem('jwt-interview-coach', res.data.token);
      // console.log(res.data)
      set({ user: res.data.user, isSigningUp: true }); // set our state after signing up. This will trigger a re-render and .data.user as the response has the user object AND a success object
      toast.success("Signup successful!"); // show a toast message
    } catch (error) {
      toast.error(error.response.data.message || "Error in Signing up"); // if there is an error, show the error message
      set({ isSigningUp: false, user: null }); // set isSigningUp back to false
    }
  },
  googleSignup: async (access_token, role) => {
    if (!access_token || !role) return;

    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/google`, {
        access_token,
        isRegistering: true,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("jwt-interview-coach", res.data.token);
        set({ user: res.data.user, isSigningUp: false });
        toast.success(res.data.message || "Google login/signup successful!");
      } else {
        toast.error(res.data.message || "Google login/signup failed");
        set({ isSigningUp: false });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Google login/signup failed"
      );
      set({ isSigningUp: false });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/login`, credentials);
      localStorage.setItem('jwt-interview-coach', res.data.token);
      // console.log(res.data.user.avatar)
      set({ user: res.data.user, isLoggingIn: false });
      toast.success("Logged in successfully");
      return res.data.user;
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in logging in");
      set({ user: null, isLoggingIn: false });
      return null;
    }
  },
  googleLogin: async (access_token) => {
    if (!access_token) return false;

    set({ isLoggingIn: true });
    try {
      const res = await axios.post(`${API_URL}/api/v1/auth/google`, {
        access_token,
        isRegistering: false, // login mode
      });

      if (res.data.success) {
        localStorage.setItem("jwt-interview-coach", res.data.token);
        set({ user: res.data.user, isLoggingIn: false });
        toast.success(res.data.message || "Google login successful!");
        return true;
      } else {
        toast.error(res.data.message || "Google login failed");
        set({ isLoggingIn: false });
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
      set({ isLoggingIn: false });
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateAvatar: async (avatar) => {
    set({ isUpdatingAvatar: true });
    try {
      // console.log("avatar:" ,avatar)
      const res = await axios.post(`${API_URL}/api/v1/auth/updateAvatar`, avatar);
      set({ user: res.data.user, isUpdatingAvatar: false });
      toast.success("Avatar updated successfully");
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in updating avatar");
      set({ isUpdatingAvatar: false });
    }
  },
  updateUser: async (credentials) => {
    set({ isEdittingUser: true });
    try {
      const res = await axios.put(`${API_URL}/api/v1/auth/editUser`, credentials);
      set({ user: res.data.user, isEdittingUser: false });
      toast.success("User updated successfully");
      return { success: true };
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in updating user");
      set({ isEdittingUser: false });
      return { success: false, message: error.response.data.message };
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post(`${API_URL}/api/v1/auth/logout`);
      localStorage.removeItem('jwt-interview-coach');
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in logging out");
      set({ isLoggingOut: false });
    }
  },
  getAuth: async () => {
    set({ checkingAuth: true });
    try {
      const token = localStorage.getItem('jwt-interview-coach');
      const res = await axios.get(`${API_URL}/api/v1/auth/getAuth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      console.log(error)
      set({ user: null, checkingAuth: false });
    }
  },
})); // now we can use the functions in the store in any component in our app
