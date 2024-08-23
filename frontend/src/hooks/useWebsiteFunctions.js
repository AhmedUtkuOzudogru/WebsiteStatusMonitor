import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const apiUrl = "http://localhost:5000";

export const useWebsiteFunctions = () => {
    const [websites, setWebsites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthStore();

    const fetchWebsites = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/api/websites/user-websites`, {
                params: {
                    userId: user.id
                }
            });

            // Access the websites array correctly
            const websitesData = response.data.websites;
            setWebsites(Array.isArray(websitesData) ? websitesData : []);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching websites");
            setWebsites([]); // Set to empty array on error
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateWebsiteStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiUrl}/api/websites/update-status`, {
                userId: user.id
            });
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
        //Todo Implement add website logic
    }, []);

    const deleteWebsite = useCallback(async (websiteId) => {
        //Todo Implement delete website logic
    }, []);

    return {
        websites,
        isLoading,
        error,
        fetchWebsites,
        updateWebsiteStatus,
        updateAndFetchWebsites,
        addWebsite,
        deleteWebsite
    };
};