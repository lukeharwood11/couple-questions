import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TipButtonWithSubtext from '../../components/TipButtonWithSubtext/TipButtonWithSubtext';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTextModal from '../../components/CustomTextModal/CustomTextModal';
import './LevelTenPage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import toast from 'react-hot-toast';
import { MdChat } from 'react-icons/md';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface KeypadButton {
    percentage: number;
    letters: string;
    status?: 'correct' | 'present' | 'absent' | null;
}


const LevelTenPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [selectedTipIndex, setSelectedTipIndex] = useState<number | null>(null);
    const [showLevelOverModal, setShowLevelOverModal] = useState(false);
    const [error, setError] = useState<boolean>(false);

    const [keypadButtons, setKeypadButtons] = useState<KeypadButton[]>([
        { percentage: 10, letters: 'ABCD' },
        { percentage: 15, letters: 'EFGH' },
        { percentage: 20, letters: 'IJKL' },
        { percentage: 25, letters: 'MNOP' },
        { percentage: 30, letters: 'QRSTU' },
        { percentage: 35, letters: 'VWXYZ' },
    ]);
    const [customTextModal, setCustomTextModal] = useState(false);
    const [lastFiveIndices, setLastFiveIndices] = useState<Array<number>>([]);
    const [targetWord, setTargetWord] = useState<string>("");
    const level = levelData.levels[9];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [buttonStatuses, setButtonStatuses] = useState<Array<'correct' | 'present' | 'absent' | null>>(
        new Array(9).fill(null)
    );
    
    const getDate = () => {
        const now = new Date();
        const date = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getTargetWord = async (date: string) => {
        const url = `https://api.justacouplequestions.com/level10/${date}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch word');
        }
        
        const data = await response.json();
        return data.solution.toUpperCase();
    };
    useEffect(() => {
        const fetchWord = async () => {
            setIsLoading(true);
            try {
                const cachedItem = localStorage.getItem('level10Cache');
                const currentDate = getDate();
                if (cachedItem) {
                    const data = JSON.parse(cachedItem);
                    if (data.date === currentDate) {
                        setTargetWord(data.word);
                        setIsLoading(false);
                        return;
                    }
                }
                
                const word = await getTargetWord(currentDate);
                setTargetWord(word);
                localStorage.setItem('level10Cache', JSON.stringify({ date: currentDate, word }));
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchWord();
    }, []);

    useEffect(() => {
        if (selectedTipIndex !== null) {
            setSelectedTip(keypadButtons[selectedTipIndex].percentage);
        }
    }, [keypadButtons, selectedTipIndex]);

    const handleSelectTip = (index: number) => {
        setSelectedTipIndex(index);
        setSelectedTip(keypadButtons[index].percentage);
        
        const newIndices = [...lastFiveIndices, index];
        setLastFiveIndices(newIndices);
        
        if (newIndices.length === 5) {
            checkWord(newIndices);
            // Clear the history after checking
            setTimeout(() => {
                setLastFiveIndices([]);
            }, 3000);
        }
    };

    const checkWord = useCallback((indices: number[]) => {
        const targetArray = targetWord.split('');
        const newStatuses: Array<'correct' | 'present' | 'absent'> = new Array(9).fill(null);
        
        // Check if the word is correct
        let isCorrect = true;
        for (let i = 0; i < 5; i++) {
            const buttonIndex = indices[i];
            const letters = keypadButtons[buttonIndex].letters;
            if (!letters.includes(targetArray[i])) {
                isCorrect = false;
            }
        }

        // If word is correct, set first value to 0
        if (isCorrect) {
            setKeypadButtons((prev) => {
                const newButtons = [...prev];
                newButtons[indices[4]].percentage = 0;
                return newButtons;
            });
        }
        
        // Check each letter in the attempt
        for (let i = 0; i < 5; i++) {
            const buttonIndex = indices[i];
            const letters = keypadButtons[buttonIndex].letters;
            if (letters.includes(targetArray[i])) {
                newStatuses[buttonIndex] = 'correct';
            } else if (Array.from(targetArray).some(letter => letters.includes(letter))) {
                newStatuses[buttonIndex] = 'present';
            } else {
                newStatuses[buttonIndex] = 'absent';
            }
        }

        setButtonStatuses(newStatuses);

        // Clear statuses after 3 seconds
        setTimeout(() => {
            setButtonStatuses(new Array(9).fill(null));
        }, 3000);
    }, [targetWord, keypadButtons]);

    const handleSubmit = () => {
        localStorage.setItem('level10Tip', selectedTip?.toString() || '0');
        setShowLevelOverModal(true);
    };

    const handleModalClose = () => {
        setShowLevelOverModal(false);
        navigate('/');
    };

    if (error) {
        return (
            <motion.div 
                className="level-container error-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <h1 className="level-title">Oops!</h1>
                <div className="error-content">
                    <p>We're having trouble loading today's puzzle.</p>
                    <p>Please check your internet connection and try again.</p>
                    <motion.button 
                        className="submit-button"
                        onClick={() => window.location.reload()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Retry
                    </motion.button>
                </div>
            </motion.div>
        );
    }

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
            <p className="level-ten-subtitle">
                Your <span className="highlight-letter">p</span>ersonal <span className="highlight-letter">l</span>ocal b<span className="highlight-letter">a</span>nk toda<span className="highlight-letter">y</span> was <span className="highlight-letter">t</span>ruly <span className="highlight-letter">o</span>utstanding! The <span className="highlight-letter">d</span>edicated <span className="highlight-letter">a</span>ssistant helped <span className="highlight-letter">y</span>ou <span className="highlight-letter">s</span>wiftly. Their <span className="highlight-letter">w</span>arm and <span className="highlight-letter">o</span>rganized <span className="highlight-letter">r</span>esponse <span className="highlight-letter">d</span>eserves <span className="highlight-letter">l</span>ovely <span className="highlight-letter">e</span>xtra thanks!
            </p>

            <div className="tip-container">
                <TipView baseAmount={baseAmount} tipPercentage={selectedTip} />
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <motion.div
                            className="tip-buttons"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {keypadButtons.map((button, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ rotateX: 0 }}
                                    animate={{
                                        rotateX: lastFiveIndices.length === 5 ? [0, 180, 360] : 0
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: lastFiveIndices.length === 5 ? index * 0.2 : 0
                                    }}
                                >
                                    <TipButtonWithSubtext
                                        percentage={button.percentage}
                                        subtext={button.letters}
                                        onClick={() => handleSelectTip(index)}
                                        isSelected={selectedTipIndex === index}
                                        disabled={isLoading}
                                        className={
                                            buttonStatuses[index] === 'correct'
                                                ? 'correct'
                                                : buttonStatuses[index] === 'present'
                                                ? 'present'
                                                : buttonStatuses[index] === 'absent'
                                                ? 'absent'
                                                : ''
                                        }
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={selectedTip === null || isLoading}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Submit Tip
                        </motion.button>
                    </>
                )}
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
                    toast.success("You're forgiven. Now where were we?", {
                        icon: <MdChat />,
                    });
                    setCustomTextModal(false);
                    setSelectedTip(null);
                }}
                button2OnClick={() => {
                    toast.error("Tips are mandatory for those that don't care about human decency.", {
                        icon: <MdChat />,
                    });
                    setCustomTextModal(false);
                    setSelectedTip(null);
                }}
            />
        </motion.div>
    );
};

export default LevelTenPage;
