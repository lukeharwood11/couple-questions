import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedLevel: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const level = parseInt(location.pathname.split('/').pop() || '1');

    useEffect(() => {
        if (level === 1) return;

        // Find the last completed level and count non-zero tips up to that point
        let lastCompletedLevel = 0;
        let nonZeroTips = 0;
        
        // First find the last completed level
        for (let i = level - 1; i >= 1; i--) {
            const tipValue = localStorage.getItem(`level${i}Tip`);
            if (tipValue === '0') {
                lastCompletedLevel = i;
                break;
            }
        }

        // Then count non-zero tips only up to the last completed level
        for (let i = 1; i <= lastCompletedLevel; i++) {
            const tipValue = localStorage.getItem(`level${i}Tip`);
            if (tipValue !== null && parseFloat(tipValue) > 0) {
                nonZeroTips++;
            }
        }

        // If level 1 isn't completed, only allow access to levels 1 and 2
        if (lastCompletedLevel === 0 && level > 2) {
            toast.error('Complete level 1 first!', {
                icon: '🔒',
            });
            navigate('/', { replace: true });
            return;
        }

        // Calculate how many levels ahead they can look based on non-zero tips
        const lookAhead = Math.max(0, 2 - nonZeroTips);
        if (level > lastCompletedLevel + lookAhead) {
            toast.error('Complete more previous levels with perfect tips first!', {
                icon: '🔒',
            });
            navigate('/', { replace: true });
        }
    }, [level, navigate]);

    return <Outlet />;
};

export default ProtectedLevel;
