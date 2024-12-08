import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import './LevelNinePage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';

const LevelNinePage: React.FC = () => {
    const [tip, setTip] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [tipValues, setTipValues] = useState<number[]>([2, 6, 8, 10, 12, 14]);
    const [locked, setLocked] = useState(false);
    const bound = (n: number) => {
        return n >= 0 ? n : null;
    }
    const tipActions = [
        () => {
            return setTip(prev => prev ? prev + 6 : 2);
        },
        () => {
            return setTip(prev => prev ? bound(prev - 13) : 6);
        },
        () => {
            return setTip(prev => prev ? bound(prev - 23) : 8);
        },
        () => {
            return setTip(prev => prev ? prev + 2 : 10);
        },
        () => {
            return setTip(prev => prev ? bound(prev + 13) : 12);
        },
        () => {
            return setTip(prev => prev ? null : 14);
        },
    ]

    useEffect(() => {
        if (locked) return;
        if (tip === null) {
            setSelectedIndex(null);
        } else if (tip === 0) {
            setLocked(true);
            setTipValues(() => {
                return tipValues.map((value, index) => index === selectedIndex ? 0 : value);
            })
        }
    }, [tip, locked, selectedIndex, tipValues])

    const level = levelData.levels[8];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();


    const handleTipSelect = (index: number) => {
        if (locked) return;
        setSelectedIndex(index);
        tipActions[index]();
    };


    const handleSubmit = () => {
        localStorage.setItem('level9Tip', tip?.toString() || '0');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
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
                <TipView baseAmount={baseAmount} tipPercentage={tip} />
                <motion.div
                    className="tip-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {tipValues.map((value, index) => (
                        <motion.div
                            key={index}
                            animate={
                                locked && index === selectedIndex
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
                                key={index} 
                                isSelected={selectedIndex === index} 
                                percentage={value} 
                                onClick={() => handleTipSelect(index)} 
                            />
                        </motion.div>
                    ))}
                </motion.div>
                <motion.button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={tip === null}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Submit Tip
                </motion.button>
            </div>

            <LevelOverModal isOpen={showModal} tipPercentage={tip ?? 0} onClose={handleModalClose} />

            <CustomTipModal
                isOpen={showCustomTipModal}
                onClose={() => setShowCustomTipModal(false)}
                onSubmit={handleSubmit}
                baseAmount={baseAmount}
            />

        </motion.div>
    );
};

export default LevelNinePage;
