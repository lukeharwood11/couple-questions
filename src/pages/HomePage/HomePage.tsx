import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHelp, MdInfo } from 'react-icons/md';
import './HomePage.css';
import levelData from '../meta/levels.json';
import WelcomePopup from '../../components/WelcomePopup/WelcomePopup';
import LevelCarousel from '../../components/LevelCarousel/LevelCarousel';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);

    const { levels } = levelData;

    useEffect(() => {
        const hasCompletedLevelOne = localStorage.getItem('level1Complete') === 'true';
        if (!hasCompletedLevelOne) {
            setShowWelcomePopup(true);
        }
    }, []);

    const closePopup = () => {
        setShowWelcomePopup(false);
    };

    const getLevelStatus = (level: number) => {
        const isComplete = localStorage.getItem(`level${level}Complete`) === 'true';
        const tipPercentage = parseFloat(localStorage.getItem(`level${level}Tip`) || '0');

        let statusColor = '#666'; // Default gray for locked levels
        if (isComplete) {
            if (tipPercentage === 0) statusColor = 'var(--tertiary-color)';
            else statusColor = 'var(--error-color)';
        }

        return { isComplete, tipPercentage, statusColor };
    };

    const isLevelAccessible = (level: number) => {
        if (level === 1) return true;
        return localStorage.getItem(`level${level - 1}Complete`) === 'true';
    };

    const getLastCompletedLevel = () => {
        // Start from the highest level and work backwards
        for (let i = levels.length; i >= 1; i--) {
            if (localStorage.getItem(`level${i}Complete`) === 'true') {
                return i;
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
                        <motion.button
                            className="home-nav-button"
                            onClick={() => navigate('/thank-you')}
                            whileHover={{
                                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                                transition: { duration: 0.3 },
                            }}
                        >
                            Note <MdInfo size={24} />
                        </motion.button>
                        <motion.button
                            className="home-nav-button"
                            onClick={() => setShowWelcomePopup(true)}
                            whileHover={{
                                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                                transition: { duration: 0.3 },
                            }}
                        >
                            Help <MdHelp size={24} />
                        </motion.button>
                    </motion.div>
                    <motion.hr className="home-divider" variants={dividerVariants} initial="hidden" animate="visible" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <LevelCarousel
                        levels={levels}
                        onSelectLevel={(levelId) => navigate(`/level/${levelId}`)}
                        getLevelStatus={getLevelStatus}
                        isLevelAccessible={isLevelAccessible}
                        currentLevel={getLastCompletedLevel() || 1}
                    />
                </motion.div>
            </motion.div>

            <WelcomePopup isOpen={showWelcomePopup} onClose={closePopup} />
        </div>
    );
};

export default HomePage;
