import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdLock, MdPlayArrow, MdOutlineHandshake } from 'react-icons/md';
import './LevelView.css';
import { getPercentageText } from '../../utils';

interface Level {
    id: number;
    title: string;
}

interface LevelViewProps {
    levels: Level[];
    onSelectLevel: (levelId: number) => void;
    getLevelStatus: (level: number) => { isComplete: boolean; tipPercentage: number; statusColor: string };
    isLevelAccessible: (level: number) => boolean;
    currentLevel: number;
    onThanksClick: () => void;
    nextLevelRef: React.RefObject<HTMLDivElement>;
}

const LevelView: React.FC<LevelViewProps> = ({
    levels,
    onSelectLevel,
    getLevelStatus,
    isLevelAccessible,
    currentLevel,
    onThanksClick,
    nextLevelRef,
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const shouldBeMobile = width < 768;
            setIsMobile(shouldBeMobile);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    const getNextUnfinishedLevel = () => {
        for (let i = 1; i <= levels.length; i++) {
            const { isComplete } = getLevelStatus(i);
            if (!isComplete) {
                return i;
            }
        }
        return null;
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <div className="level-grid">
            {levels.map((level) => {
                const { isComplete, tipPercentage, statusColor } = getLevelStatus(level.id);
                const accessible = isLevelAccessible(level.id);
                const isNextLevel = level.id === getNextUnfinishedLevel() && tipPercentage < 0;

                return (
                    <motion.div
                        key={level.id}
                        ref={getNextUnfinishedLevel() === level.id ? nextLevelRef : undefined}
                        className={`level-card 
                            ${isComplete ? 'completed' : ''} 
                            ${!accessible ? 'locked' : ''} 
                            ${isNextLevel ? 'next-level' : ''}`}
                        style={{ borderColor: statusColor }}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={accessible ? 'hover' : undefined}
                        onClick={() => {
                            if (accessible) {
                                onSelectLevel(level.id);
                            }
                        }}
                    >
                        <h2>Level {level.id}</h2>
                        {!accessible ? (
                            <>
                                <MdLock className="lock-icon" />
                                {!isMobile && <p>{level.title}</p>}
                            </>
                        ) : (
                            <>
                                {tipPercentage >= 0 ? (
                                    <div className="tip-result" style={{ color: statusColor }}>
                                        {getPercentageText(tipPercentage)} tip
                                    </div>
                                ) : (
                                    <MdPlayArrow className="play-icon" />
                                )}
                                {!isMobile && <p>{level.title}</p>}
                            </>
                        )}
                    </motion.div>
                );
            })}

            <motion.div
                className="level-card feedback-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={onThanksClick}
            >
                <h2>Level X: Feedback</h2>
                <MdOutlineHandshake size={30} />
                {!isMobile && <p>Thank you for playing!</p>}
            </motion.div>
        </div>
    );
};

export default LevelView;
