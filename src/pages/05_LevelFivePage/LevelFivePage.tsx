import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import CustomTextModal from '../../components/CustomTextModal/CustomTextModal';
import './LevelFivePage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import toast from 'react-hot-toast';
import { MdChat } from 'react-icons/md';
import { getPercentageText } from '../../utils';

const LevelFivePage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [selectedTipIndex, setSelectedTipIndex] = useState<number | null>(null);
    const [showLevelOverModal, setShowLevelOverModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [customAmounts, setCustomAmounts] = useState<number[]>([10, 15, 18, 20, 25]);
    const [customTextModal, setCustomTextModal] = useState(false);
    const [isCustomTip, setIsCustomTip] = useState(false);
    const level = levelData.levels[4];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();

    const handleSelectPercentage = (index: number, percentage: number) => {
        setSelectedTipIndex(index);
        if (index === 4) {
            setCustomAmounts((prev) => prev.map((amount, i) => (i === index ? percentage + 5 : amount)));
        } else if (index === 1) {
            setCustomAmounts((prev) => prev.map((amount, i) => (i === index ? Math.max(percentage - 6, 0) : amount)));
        }
    };

    useEffect(() => {
        setSelectedTip(selectedTipIndex ? customAmounts[selectedTipIndex ?? 0] : null);
    }, [customAmounts, selectedTipIndex]);

    const handleTipSelect = (percentage: number) => {
        if (percentage === -1) {
            setShowCustomTipModal(true);
            setSelectedTipIndex(null);
        } else {
            setSelectedTip(percentage);
            setIsCustomTip(false);
        }
    };

    const handleCustomTipSubmit = (percentage: number) => {
        if (percentage === 0) {
            setCustomTextModal(true);
        }
        setSelectedTip(percentage);
        setIsCustomTip(true);
        setSelectedTipIndex(null);
    };

    const handleSubmit = () => {
        localStorage.setItem('level5Complete', 'true');
        localStorage.setItem('level5Tip', selectedTip?.toString() || '0');
        setShowLevelOverModal(true);
    };

    const handleModalClose = () => {
        setShowLevelOverModal(false);
        navigate('/');
    };

    return (
        <motion.div
            className="level-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h1 className="level-title">
                Level {level.id}: {level.title}
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
                    {customAmounts.map((amount, index) => (
                        <TipButton
                            key={index}
                            percentage={amount}
                            onClick={() => handleSelectPercentage(index, amount)}
                            isSelected={selectedTipIndex === index}
                        />
                    ))}
                    <TipButton
                        percentage={-1}
                        onClick={handleTipSelect}
                        isSelected={isCustomTip}
                        customText={isCustomTip ? getPercentageText(selectedTip ?? 0) : 'Other'}
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

            <LevelOverModal isOpen={showLevelOverModal} tipPercentage={selectedTip ?? 0} onClose={handleModalClose} />

            <CustomTipModal
                isOpen={showCustomTipModal}
                onClose={() => setShowCustomTipModal(false)}
                onSubmit={handleCustomTipSubmit}
                baseAmount={baseAmount}
            />
            <CustomTextModal
                text={"Please confirm that you don't care about human decency."}
                isOpen={customTextModal}
                onClose={() => setCustomTextModal(false)}
                button1Text={"I'm sorry"}
                button2Text={"I don't care"}
                button1OnClick={() => {
                    toast.success("You're forgiven. Now where were we?", {
                        icon: <MdChat />,
                    });
                    setCustomTextModal(false);
                    setSelectedTip(null);
                    setIsCustomTip(false);
                }}
                button2OnClick={() => {
                    toast.error("Tips are mandatory for those that don't care about human decency.", {
                        icon: <MdChat />,
                    });
                    setCustomTextModal(false);
                    setSelectedTip(null);
                    setIsCustomTip(false);
                }}
            />
        </motion.div>
    );
};

export default LevelFivePage;
