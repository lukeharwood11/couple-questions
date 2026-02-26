import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import './LevelElevenPage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import toast from 'react-hot-toast';
import { MdChat } from 'react-icons/md';

const LevelElevenPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [showLevelOverModal, setShowLevelOverModal] = useState(false);
    const [customText, setCustomText] = useState('');
    const [isCustomActive, setIsCustomActive] = useState(false);
    const level = levelData.levels[10];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();

    const handleTipSelect = (percentage: number) => {
        setSelectedTip(percentage);
        setIsCustomActive(false);
        setCustomText('');
    };

    const handleCustomApply = () => {
        if (!customText.trim()) return;

        if (customText === 'ZERO') {
            setSelectedTip(0);
            setIsCustomActive(true);
            toast.success("Well played.", { icon: <MdChat /> });
        } else if (customText.toLowerCase() === 'zero') {
            toast.error("Hmm... that's not quite right. Try being more... AGGRESSIVE.", {
                icon: <MdChat />,
            });
        } else {
            const parsed = parseFloat(customText);
            if (!isNaN(parsed) && parsed >= 0) {
                setSelectedTip(Math.max(parsed, 1));
                setIsCustomActive(true);
            } else {
                toast.error("I don't understand that. Try typing a number... or something else.", {
                    icon: <MdChat />,
                });
            }
        }
    };

    const handleSubmit = () => {
        localStorage.setItem('level11Tip', selectedTip?.toString() || '0');
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
                        percentage={10}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 10 && !isCustomActive}
                    />
                    <TipButton
                        percentage={15}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 15 && !isCustomActive}
                    />
                    <TipButton
                        percentage={18}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 18 && !isCustomActive}
                    />
                    <TipButton
                        percentage={20}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 20 && !isCustomActive}
                    />
                    <motion.div
                        className="level-11-custom-input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCustomApply();
                            }}
                            placeholder="Type your tip..."
                        />
                        <button
                            className="level-11-apply-button"
                            onClick={handleCustomApply}
                            disabled={!customText.trim()}
                        >
                            Apply
                        </button>
                    </motion.div>
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
        </motion.div>
    );
};

export default LevelElevenPage;
