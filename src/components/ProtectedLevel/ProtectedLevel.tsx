import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedLevel: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // level is the last part of the url
    const level = location.pathname.split('/').pop();

    useEffect(() => {
        const levelNumber = parseInt(level || '1');

        // Level 1 is always accessible
        if (levelNumber === 1) return;

        // Check if previous level is completed
        const previousLevelComplete = localStorage.getItem(`level${levelNumber - 1}Complete`) === 'true';

        if (!previousLevelComplete) {
            toast.error('Complete the previous level first!', {
                icon: '🔒',
            });
            navigate('/', { replace: true });
        }
    }, [level, navigate, location]);

    return <Outlet />;
};

export default ProtectedLevel;
