import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const apiUrl = "http://localhost:5000";

export const useWebsiteFunctions = () => {
    const [websites, setWebsites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { user, logout } = useAuthStore();

    const fetchWebsites = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/api/websites/user-websites`, {
                params: { userId: user.id }
            });
            const websitesData = response.data.websites;
            setWebsites(Array.isArray(websitesData) ? websitesData : []);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching websites");
            setWebsites([]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateWebsiteStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`${apiUrl}/api/websites/update-status`, { userId: user.id });
        } catch (error) {
            setError(error.response?.data?.message || "Error updating website status");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateAndFetchWebsites = useCallback(async () => {
        try {
            await updateWebsiteStatus();
            await fetchWebsites();
        } catch (error) {
            console.error('Error updating and fetching websites:', error);
        }
    }, [updateWebsiteStatus, fetchWebsites]);

    const addWebsite = useCallback(async (website) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`${apiUrl}/api/websites/add`, { domainName: website.domainName });
            await fetchWebsites();
        } catch (error) {
            setError(error.response?.data?.message || "Error adding website");
        } finally {
            setIsLoading(false);
        }
    }, [fetchWebsites]);

    const deleteWebsite = useCallback(async (websiteId) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.delete(`${apiUrl}/api/websites/${websiteId}`, { websiteId });
            await fetchWebsites();
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting website");
        } finally {
            setIsLoading(false);
        }
    }, [fetchWebsites]);

    const changeUsername = useCallback(async (newUsername) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            await axios.put(`${apiUrl}/api/auth/change-username`, { newUsername });
            setMessage("Username changed successfully");
        } catch (error) {
            setError(error.response?.data?.message || "Error changing username");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const requestEmailChange = useCallback(async (newEmail) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            await axios.put(`${apiUrl}/api/auth/change-email`, { newEmail });
            setMessage("Email change requested successfully. Please verify your new email.");
            logout();
            return true;
        } catch (error) {
            setError(error.message || "Error requesting email change");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            //Todo: add backend for change password !!!!!!!
            //await axios.post(`${apiUrl}/api/auth/change-password`, { currentPassword, newPassword, confirmPassword });
            setMessage("Password changed successfully");
        } catch (error) {
            setError(error.response?.data?.message || "Error changing password");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            await axios.delete(`${apiUrl}/api/auth/delete-account`);
            logout();
            setMessage("Account deleted successfully");
            return true;
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting account");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    return {
        websites,
        isLoading,
        error,
        message,
        fetchWebsites,
        updateWebsiteStatus,
        updateAndFetchWebsites,
        addWebsite,
        deleteWebsite,
        changeUsername,
        requestEmailChange,
        changePassword,
        deleteAccount,
    };
};