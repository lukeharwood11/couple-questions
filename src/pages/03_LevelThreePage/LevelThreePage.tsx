import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import './LevelThreePage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import { getPercentageText } from '../../utils';

const LevelThreePage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [isCustomTip, setIsCustomTip] = useState(false);
    const level = levelData.levels[2];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();

    const handleTipSelect = (percentage: number) => {
        if (percentage === -1) {
            setShowCustomTipModal(true);
        } else {
            setSelectedTip(percentage);
            setIsCustomTip(false);
        }
    };

    const handleCustomTipSubmit = (percentage: number) => {
        setSelectedTip(percentage);
        setIsCustomTip(true);
    };

    const handleSubmit = () => {
        localStorage.setItem('level3Tip', selectedTip?.toString() || '0');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/');
    };

    return (
        <div className="level-three-page">
            <motion.div
                className="level-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <h1 className="level-title">{level.title}</h1>
                <p className="level-subtitle">{level.subtitle}</p>
                <div className="tip-container">
                    <TipView baseAmount={baseAmount} tipPercentage={selectedTip} />
                    <motion.div
                        className="tip-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <TipButton
                            percentage={5}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 5 && !isCustomTip}
                        />
                        <TipButton
                            percentage={10}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 10 && !isCustomTip}
                        />
                        <TipButton
                            percentage={15}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 15 && !isCustomTip}
                        />
                        <TipButton
                            percentage={20}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 20 && !isCustomTip}
                        />
                        <TipButton
                            percentage={200}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 200 && !isCustomTip}
                        />
                        <TipButton
                            percentage={2000}
                            onClick={handleTipSelect}
                            isSelected={selectedTip === 2000 && !isCustomTip}
                        />
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
                    <TipButton
                        percentage={-1}
                        onClick={handleTipSelect}
                        isSelected={isCustomTip}
                        customText={isCustomTip ? getPercentageText(selectedTip || 0) : 'Custom Amount'}
                    />
                </div>
            </div>

            <LevelOverModal isOpen={showModal} tipPercentage={selectedTip ?? 0} onClose={handleModalClose} />

            <CustomTipModal
                isOpen={showCustomTipModal}
                onClose={() => setShowCustomTipModal(false)}
                onSubmit={handleCustomTipSubmit}
                baseAmount={baseAmount}
            />
        </div>
    );
};

export default LevelThreePage;
