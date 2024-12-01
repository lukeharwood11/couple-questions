import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTextModal from '../../components/CustomTextModal/CustomTextModal';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import toast from 'react-hot-toast';
import './LevelSixPage.css';

const LevelSixPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [selectedTipIndex, setSelectedTipIndex] = useState<number | null>(null);
    const [showLevelOverModal, setShowLevelOverModal] = useState(false);
    const [customAmounts, setCustomAmounts] = useState<number[]>([21, 22, 23, 24, 25, 26]);
    const [customTextModal, setCustomTextModal] = useState(false);
    const [clickHistory, setClickHistory] = useState<number[]>([]);
    const [hasUnlocked, setHasUnlocked] = useState(false);
    const level = levelData.levels[5];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();

    const secretCombination = [3, 1, 4, 2]; // The combination that unlocks 0%

    const isPartOfValidPattern = (index: number): boolean => {
        if (clickHistory.length === 0) return false;

        // Find the position of this index in the click history
        const position = clickHistory.indexOf(index);
        if (position === -1) return false;

        // Check if all entries up to this position match the secret combination
        for (let i = 0; i <= position; i++) {
            if (clickHistory[i] !== secretCombination[i]) {
                return false;
            }
        }

        return true;
    };

    const handleSelectPercentage = (index: number, percentage: number) => {
        setSelectedTipIndex(index);

        // Update click history
        const newHistory = [...clickHistory, index].slice(-4);
        setClickHistory(newHistory);

        // Check if the new click breaks the pattern
        let isValidSequence = true;
        for (let i = 0; i < newHistory.length; i++) {
            if (newHistory[i] !== secretCombination[i]) {
                isValidSequence = false;
                break;
            }
        }

        // If pattern is broken, reset the history
        if (!isValidSequence) {
            setClickHistory([index]);
        }

        // Check if secret combination is matched
        if (newHistory.length === 4 && newHistory.every((val, idx) => val === secretCombination[idx])) {
            setHasUnlocked(true);
            setTimeout(() => {
                setCustomAmounts((prev) => prev.map((amount, i) => (i === 0 ? 0 : amount)));
            }, 400);
        }
    };

    useEffect(() => {
        setSelectedTip(selectedTipIndex !== null ? customAmounts[selectedTipIndex] : null);
    }, [customAmounts, selectedTipIndex]);

    const handleTipSelect = (percentage: number) => {
        if (percentage === -1) {
            setSelectedTipIndex(null);
        } else {
            setSelectedTip(percentage);
        }
    };

    const handleSubmit = () => {
        localStorage.setItem('level6Complete', 'true');
        localStorage.setItem('level6Tip', selectedTip?.toString() || '0');
        setShowLevelOverModal(true);
    };

    const handleModalClose = () => {
        setShowLevelOverModal(false);
        navigate('/');
    };

    return (
        <div className="level-six-page">
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
                    <TipView baseAmount={baseAmount} tipPercentage={selectedTip ?? 0} />
                    <motion.div
                        className="tip-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {customAmounts.map((amount, index) => (
                            <motion.div
                                key={index}
                                animate={
                                    index === 0 && hasUnlocked
                                        ? {
                                              rotateY: [0, 360],
                                              transition: {
                                                  duration: 0.8,
                                                  ease: 'easeInOut',
                                              },
                                          }
                                        : {}
                                }
                            >
                                <TipButton
                                    percentage={amount}
                                    onClick={() => handleSelectPercentage(index, amount)}
                                    isSelected={selectedTipIndex === index}
                                    className={isPartOfValidPattern(index) ? 'pattern-active' : ''}
                                />
                            </motion.div>
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

                <LevelOverModal
                    isOpen={showLevelOverModal}
                    tipPercentage={selectedTip ?? 0}
                    onClose={handleModalClose}
                />

                <CustomTextModal
                    text={"Please confirm that you don't care about human decency."}
                    isOpen={customTextModal}
                    onClose={() => setCustomTextModal(false)}
                    button1Text={"I'm sorry"}
                    button2Text={"I don't care"}
                    button1OnClick={() => {
                        toast.success("You're forgiven. Now where were we?");
                        setCustomTextModal(false);
                        setSelectedTip(null);
                    }}
                    button2OnClick={() => {
                        toast.error("Tips are mandatory for those that don't care about human decency.");
                        setCustomTextModal(false);
                        setSelectedTip(null);
                    }}
                />
            </motion.div>
        </div>
    );
};

export default LevelSixPage;
