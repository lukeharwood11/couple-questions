import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHelp, MdInfo } from 'react-icons/md';
import './HomePage.css';
import levelData from '../meta/levels.json';
import WelcomePopup from '../../components/WelcomePopup/WelcomePopup';
import LevelCarousel from '../../components/LevelCarousel/LevelCarousel';
import ThankYouPopup from '../../components/ThankYouPopup/ThankYouPopup';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);
    const [showThanksPopup, setShowThanksPopup] = useState(false);

    const { levels } = levelData;

    useEffect(() => {
        const hasCompletedLevelOne = localStorage.getItem('level1Tip') === '0';
        if (!hasCompletedLevelOne) {
            setShowWelcomePopup(true);
        }
    }, []);

    const closePopup = () => {
        setShowWelcomePopup(false);
    };

    const getLevelStatus = (level: number) => {
        const tipPercentage = parseFloat(localStorage.getItem(`level${level}Tip`) || '-1');

        let statusColor = '#666'; // Default gray for locked levels
        if (tipPercentage >= 0) {
            if (tipPercentage === 0) statusColor = 'var(--tertiary-color)';
            else statusColor = 'var(--error-color)';
        }

        return { isComplete: tipPercentage === 0, tipPercentage, statusColor };
    };

    const isLevelAccessible = (level: number) => {
        if (level === 1) return true;

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
        if (lastCompletedLevel === 0) {
            return level <= 2;
        }

        // Allow access if within (2 - nonZeroTips) levels of the last completed level
        const lookAhead = Math.max(0, 2 - nonZeroTips);
        return level <= lastCompletedLevel + lookAhead;
    };

    const getNextAvailableLevel = () => {
        // Start from the highest level and work backwards
        for (let i = levels.length; i >= 1; i--) {
            if (localStorage.getItem(`level${i}Tip`) === '0') {
                return i + 1;
            }
        }
        return 1; // Return 1 if no levels are completed
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const titleVariants = {
        hidden: {
            opacity: 0,
            y: -20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    const dividerVariants = {
        hidden: {
            width: '0%',
            opacity: 0,
        },
        visible: {
            width: '100%',
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeInOut',
                delay: 0.3,
            },
        },
    };

    return (
        <div className="home-container">
            <motion.div className="home-content" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div>
                    <motion.h1 className="home-title" variants={titleVariants} initial="hidden" animate="visible">
                        <span className="title-highlight">Just</span> a couple
                        <span className="title-emphasis"> questions</span>...
                    </motion.h1>
                    <motion.div className="home-title-buttons">
                        <motion.button className="home-nav-button" onClick={() => setShowThanksPopup(true)}>
                            Note <MdInfo size={24} />
                        </motion.button>
                        <motion.button className="home-nav-button" onClick={() => setShowWelcomePopup(true)}>
                            Help <MdHelp size={24} />
                        </motion.button>
                    </motion.div>
                    <motion.hr className="home-divider" variants={dividerVariants} initial="hidden" animate="visible" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <LevelCarousel
                        onThanksClick={() => setShowThanksPopup(true)}
                        levels={levels}
                        onSelectLevel={(levelId) => navigate(`/level/${levelId}`)}
                        getLevelStatus={getLevelStatus}
                        isLevelAccessible={isLevelAccessible}
                        currentLevel={getNextAvailableLevel() || 1}
                    />
                </motion.div>
            </motion.div>

            <WelcomePopup isOpen={showWelcomePopup} onClose={closePopup} />
            <ThankYouPopup isOpen={showThanksPopup} onClose={() => setShowThanksPopup(false)} />
        </div>
    );
};

export default HomePage;
