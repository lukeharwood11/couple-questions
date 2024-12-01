import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import toast from 'react-hot-toast';
import './LevelSevenPage.css';
import { MdChat } from 'react-icons/md';

const LevelSevenPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [selectedTipIndex, setSelectedTipIndex] = useState<number | null>(null);
    const [showLevelOverModal, setShowLevelOverModal] = useState(false);
    const [customAmounts, setCustomAmounts] = useState<number[]>([21, 22, 23, 24, 25, 0]);
    const [clickHistory, setClickHistory] = useState<number[]>([]);
    const level = levelData.levels[6];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();
    const [ticker, setTicker] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const END_TICKER = 30;

    useEffect(() => {
        if (ticker === 1) {
            toast.success("Thank you! You're so sweet!", {
                icon: <MdChat />,
            });
        } else if (ticker === 10) {
            toast.success('Click the submit button ✨', {
                icon: <MdChat />,
            });
        } else if (ticker === END_TICKER) {
            toast.success('Fine...', {
                icon: <MdChat />,
            });
        }
        setCustomAmounts((prev) => {
            const newAmounts = [...prev];
            if (newAmounts[5] !== 0) {
                newAmounts[5] = newAmounts[5] + 1;
            }
            return newAmounts;
        });
    }, [ticker]);

    const handleSelectPercentage = (index: number, percentage: number) => {
        // Clear any existing interval when selecting a new percentage
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
            setTicker(0);
            setCustomAmounts((prev) => {
                const newAmounts = [...prev];
                newAmounts[5] = 0;
                return newAmounts;
            });
        }

        setSelectedTipIndex(index);

        // Special handling for 0% button (last button, index 5)
        if (index === 5) {
            setCustomAmounts((prev) => {
                const newAmounts = [...prev];
                newAmounts[5] = 50;
                return newAmounts;
            });

            // Set interval to count up to 15 seconds
            const interval = setInterval(() => {
                setTicker((prev) => {
                    if (prev >= END_TICKER) {
                        clearInterval(interval);
                        setIntervalId(null);
                        setTicker(0);
                        setCustomAmounts((prev) => {
                            const newAmounts = [...prev];
                            newAmounts[5] = 0;
                            return newAmounts;
                        });
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);

            setIntervalId(interval);
        }

        // Update click history
        const newHistory = [...clickHistory, index].slice(-4);
        setClickHistory(newHistory);
    };

    useEffect(() => {
        setSelectedTip(selectedTipIndex !== null ? customAmounts[selectedTipIndex] : null);
    }, [customAmounts, selectedTipIndex]);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    const handleSubmit = () => {
        localStorage.setItem('level7Complete', 'true');
        localStorage.setItem('level7Tip', selectedTip?.toString() || '0');
        setShowLevelOverModal(true);
    };

    const handleModalClose = () => {
        setShowLevelOverModal(false);
        navigate('/');
    };

    return (
        <div className="level-seven-page">
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
                            <TipButton
                                key={index}
                                percentage={amount}
                                onClick={() => handleSelectPercentage(index, amount)}
                                isSelected={selectedTipIndex === index}
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

                <LevelOverModal
                    isOpen={showLevelOverModal}
                    tipPercentage={selectedTip ?? 0}
                    onClose={handleModalClose}
                />
            </motion.div>
        </div>
    );
};

export default LevelSevenPage;
