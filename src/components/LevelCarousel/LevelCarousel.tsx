import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { MdLock, MdPlayArrow, MdChevronLeft, MdChevronRight, MdOutlineHandshake } from 'react-icons/md';
import './LevelCarousel.css';
import { getPercentageText } from '../../utils';

interface Level {
    id: number;
    title: string;
}

interface LevelCarouselProps {
    levels: Level[];
    onSelectLevel: (levelId: number) => void;
    getLevelStatus: (level: number) => { isComplete: boolean; tipPercentage: number; statusColor: string };
    isLevelAccessible: (level: number) => boolean;
    currentLevel: number;
    onThanksClick: () => void;
}

const LevelCarousel: React.FC<LevelCarouselProps> = ({
    levels,
    onSelectLevel,
    getLevelStatus,
    isLevelAccessible,
    currentLevel,
    onThanksClick,
}) => {
    const [activeIndex, setActiveIndex] = useState(currentLevel - 1);
    const [isDragging, setIsDragging] = useState(false);

    const navigate = (newDirection: number) => {
        const newIndex = activeIndex + newDirection;
        if (newIndex >= 0 && newIndex < levels.length + 1) {
            setActiveIndex(newIndex);
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const SWIPE_THRESHOLD = 50;
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
            if (info.offset.x > 0) {
                navigate(-1);
            } else {
                navigate(1);
            }
        }
        setIsDragging(false);
    };

    const getCardVariants = (index: number) => {
        const position = index - activeIndex;
        const xOffset = position * 350;
        const scale = position === 0 ? 1 : 0.8;
        const zIndex = position === 0 ? 1 : 0;

        return {
            x: `-50%`,
            translateX: `${xOffset}px`,
            scale,
            zIndex,
            opacity: Math.abs(position) <= 2 ? 1 - Math.abs(position) * 0.3 : 0,
        };
    };

    const getNextUnfinishedLevel = () => {
        for (let i = 1; i <= levels.length; i++) {
            const { isComplete } = getLevelStatus(i);
            if (!isComplete) {
                return i;
            }
        }
        return null;
    };

    return (
        <div className="carousel-container">
            <button className="nav-button left" onClick={() => navigate(-1)} disabled={activeIndex === 0}>
                <MdChevronLeft size={30} />
            </button>

            <motion.div
                className="carousel-viewport"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
            >
                <div className="carousel-center-wrapper">
                    {levels.map((level, index) => {
                        const { isComplete, tipPercentage, statusColor } = getLevelStatus(level.id);
                        const accessible = isLevelAccessible(level.id);
                        const isActive = index === activeIndex;
                        const isNextLevel = level.id === getNextUnfinishedLevel() && tipPercentage < 0;

                        return (
                            <motion.div
                                key={level.id}
                                className={`carousel-card ${isActive ? 'active' : ''} 
                  ${isComplete ? 'completed' : ''} 
                  ${!accessible ? 'locked' : ''} 
                  ${isNextLevel ? 'next-level' : ''}`}
                                animate={getCardVariants(index)}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                                style={{
                                    borderColor: statusColor,
                                    position: 'absolute',
                                    left: '50%',
                                    transformOrigin: 'center',
                                }}
                                onClick={() => {
                                    if (!isDragging && accessible && isActive) {
                                        onSelectLevel(level.id);
                                    }
                                }}
                            >
                                <h2>Level {level.id}</h2>
                                {!accessible ? (
                                    <>
                                        <MdLock className="lock-icon" />
                                        <p>{level.title}</p>
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
                                        <p>{level.title}</p>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}

                    <motion.div
                        key="author-note"
                        onClick={() => onThanksClick()}
                        className={`carousel-card ${activeIndex === levels.length ? 'active' : ''}`}
                        animate={getCardVariants(levels.length)}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        style={{
                            position: 'absolute',
                            left: '50%',
                        }}
                    >
                        <h2>Level X: Feedback</h2>
                        <MdOutlineHandshake size={30} />
                        <p>Thank you for playing!</p>
                    </motion.div>
                </div>
            </motion.div>

            <button className="nav-button right" onClick={() => navigate(1)} disabled={activeIndex === levels.length}>
                <MdChevronRight size={30} />
            </button>
        </div>
    );
};

export default LevelCarousel;
