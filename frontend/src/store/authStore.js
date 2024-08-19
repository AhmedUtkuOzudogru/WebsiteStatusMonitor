import { create } from 'zustand';
import axios from "axios";
import dotenv from 'dotenv';
require('dotenv').config({path:'../../.env'});
const apiUrl =process.env.API_URL||"http://localhost:5000"

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isVerifyingAuth: true,
    message: null,

    signup: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${apiUrl}/api/auth/signup`,
                { email, password, username });
            set({user:response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({ error: error.response.data.message ||"Error signing up" , isLoading: false });
            throw error;
        }
    },
    verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${apiUrl}/api/auth/verify-email`,
                { code: verificationCode });
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    checkAuth:async () => {
        set({isCheckingAuth: true, error:null});
        try{
            const response = await axios.get(`${apiUrl}/api/auth/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        }catch (error) {
            set({error: null, isCheckingAuth: false});

        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`,
                { email, password });
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${apiUrl}/api/auth/logout`);
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging out", isLoading: false });
            throw error;
        }
    },
    resetPassword: async (password, token) => {
        set({ isLoading: true, error: null });
        try {
           const response =  await axios.post(`${apiUrl}/api/auth/reset-password/${token}`,
               { password});
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error sending email", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            set({ isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error sending email", isLoading: false });
            throw error;
        }
    },
}));
