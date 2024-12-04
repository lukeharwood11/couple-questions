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

        // Check if previous level is completed with 0 tip
        const previousLevelTip = parseFloat(localStorage.getItem(`level${levelNumber - 1}Tip`) || '-1');

        if (previousLevelTip !== 0) {
            toast.error('Complete the previous level with no tip first!', {
                icon: '🔒',
            });
            navigate('/', { replace: true });
        }
    }, [level, navigate, location]);

    return <Outlet />;
};

export default ProtectedLevel;
