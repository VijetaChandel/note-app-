import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useWorkspaceStats = () => {
    const [counts, setCounts] = useState({ pinned: 0, archive: 0, trash: 0, total: 0 });

    const fetchCounts = useCallback(async () => {
        try {
            const [activeRes, archiveRes, trashRes] = await Promise.all([
                api.get('/notes'),
                api.get('/notes', { params: { archived: 'true' } }),
                api.get('/notes', { params: { deleted: 'true' } })
            ]);
            if (activeRes.data.success && archiveRes.data.success && trashRes.data.success) {
                setCounts({
                    pinned: activeRes.data.notes.filter(n => n.isPinned).length,
                    archive: archiveRes.data.notes.length,
                    trash: trashRes.data.notes.length,
                    total: activeRes.data.notes.length + archiveRes.data.notes.length + trashRes.data.notes.length
                });
            }
        } catch (error) {
            console.error("Failed to fetch sidebar workspace stats");
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        fetchCounts();
        
        // Simple polling for sidebar syncing
        const interval = setInterval(() => { if (isMounted) fetchCounts(); }, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchCounts]);

    return { ...counts, refreshStats: fetchCounts };
};
