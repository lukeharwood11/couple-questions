import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import './LevelFourPage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import { getPercentageText } from '../../utils';

const LevelFourPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [isCustomTip, setIsCustomTip] = useState(false);
    const tipPercentages = [15, 30, 45, 60, 600, 6000];
    const level = levelData.levels[3];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();
    const [showHiddenButton, setShowHiddenButton] = useState(false);

    const handleTipSelect = (percentage: number) => {
        if (percentage === -1) {
            setShowCustomTipModal(true);
        } else {
            setSelectedTip(percentage);
            setIsCustomTip(false);
        }
    };

    const handleCustomTipSubmit = (customValue: number) => {
        setSelectedTip(customValue);
        setIsCustomTip(true);
        setShowCustomTipModal(false);
    };

    const handleSubmit = () => {
        // Reset the visit count when submitting
        sessionStorage.setItem('level4VisitCount', '0');
        localStorage.setItem('level4Tip', selectedTip?.toString() || '0');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/');
    };

    return (
        <div className="level-four-page">
            <motion.div
                className="level-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <h1 className="level-title">
                    {level.title}
                </h1>
                <p className="level-subtitle">{level.subtitle}</p>
                <div className="tip-container">
                    <TipView baseAmount={baseAmount} tipPercentage={selectedTip} />
                    <motion.div
                        className="tip-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {tipPercentages.map((percentage, index) => (
                            <TipButton
                                key={index}
                                percentage={percentage}
                                onClick={handleTipSelect}
                                isSelected={selectedTip === percentage && !isCustomTip}
                            />
                        ))}
                    </motion.div>
                    <motion.button
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={selectedTip === null}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Submit Tip
                    </motion.button>
                </div>
            </motion.div>

            {/* Hidden footer with lots of empty space and the custom tip button at the bottom */}
            <div className="hidden-footer">
                <div className="spacer-div" />
                <div className="footer-content">
                    <motion.div
                        initial={false}
                        animate={{
                            rotateX: showHiddenButton ? 180 : 0,
                        }}
                        transition={{
                            duration: 0.6,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <motion.p
                            className="hidden-text front"
                            onClick={() => setShowHiddenButton(true)}
                            style={{
                                backfaceVisibility: 'hidden',
                                position: 'absolute',
                                width: '100%',
                            }}
                        >
                            You really think we'd do the same thing twice?
                        </motion.p>

                        <motion.div
                            className="back"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateX(180deg)',
                                position: 'absolute',
                                width: '100%',
                            }}
                        >
                            <TipButton
                                percentage={-1}
                                onClick={handleTipSelect}
                                isSelected={isCustomTip}
                                customText={isCustomTip ? getPercentageText(selectedTip || 0) : 'Custom Amount'}
                            />
                            <p>Well, you were right...</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <CustomTipModal
                isOpen={showCustomTipModal}
                onClose={() => setShowCustomTipModal(false)}
                onSubmit={handleCustomTipSubmit}
                baseAmount={baseAmount}
            />

            <LevelOverModal isOpen={showModal} tipPercentage={selectedTip ?? 0} onClose={handleModalClose} />
        </div>
    );
};

export default LevelFourPage;
