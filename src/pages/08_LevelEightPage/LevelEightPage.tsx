import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import TipButton from '../../components/TipButton/TipButton';
import TipView from '../../components/TipView/TipView';
import LevelOverModal from '../../components/LevelOverModal/LevelOverModal';
import CustomTipModal from '../../components/CustomTipModal/CustomTipModal';
import CustomTextModal from '../../components/CustomTextModal/CustomTextModal';
import './LevelEightPage.css';
import '../shared/LevelPages.css';
import levelData from '../meta/levels.json';
import { MdChat } from 'react-icons/md';
import { getPercentageText } from '../../utils';

const LevelEightPage: React.FC = () => {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCustomTipModal, setShowCustomTipModal] = useState(false);
    const [isCustomTip, setIsCustomTip] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
    const level = levelData.levels[7];
    const baseAmount = level.baseAmount;
    const navigate = useNavigate();
    // false = right, true = left
    const getCorrectAnswerPattern = [false, true, true, true, false];
    const goodAnswers = [true, true, false, true, false];
    const questions = [
        {
            text: 'Did you know concession workers have to stay on their feet for the entire game, even during overtime?',
            leftButtonText: "That's tough",
            rightButtonText: 'Not my concern',
        },
        {
            text: 'This worker is a college student trying to pay for their textbooks this semester. Still want to skip the tip?',
            leftButtonText: "I'll help out",
            rightButtonText: 'Most definitely',
        },
        {
            text: 'Fun fact: Workers miss watching the game to serve you those nachos and drinks. Having second thoughts?',
            leftButtonText: "That's their choice",
            rightButtonText: "I'll reconsider",
        },
        {
            text: 'This concession worker sprinted across the arena to get your hot food here before it got cold. Worth a tip?',
            leftButtonText: 'I guess so',
            rightButtonText: 'Definitely not',
        },
        {
            text: "Last chance: They've served hundreds of fans tonight with a smile. Still no tip?",
            leftButtonText: 'Still no',
            rightButtonText: "Okay, I'll tip",
        },
    ];

    const handleTipSelect = (percentage: number) => {
        if (percentage === 0) {
            setShowQuestionModal(true);
            setQuestionIndex(0);
            setAnswerHistory([]);
        } else if (percentage === -1) {
            setShowCustomTipModal(true);
        } else {
            setSelectedTip(percentage);
            setIsCustomTip(false);
        }
    };

    const handleCustomTipSubmit = (percentage: number) => {
        if (percentage === 0) {
            setShowQuestionModal(true);
            setQuestionIndex(0);
            setAnswerHistory([]);
        } else {
            setSelectedTip(percentage);
            setIsCustomTip(true);
        }
    };

    const handleSubmit = () => {
        localStorage.setItem('level8Tip', selectedTip?.toString() || '0');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/');
    };

    const handleQuestionAnswer = (isCorrect: boolean) => {
        const newAnswerHistory = [...answerHistory, isCorrect];
        setAnswerHistory(newAnswerHistory);

        if (questionIndex < questions.length - 1) {
            setQuestionIndex((prev) => prev + 1);
        } else {
            // Check if answer pattern matches required pattern
            const isPatternCorrect = newAnswerHistory.every(
                (answer, index) => answer === getCorrectAnswerPattern[index]
            );

            const answeredAllCorrect = newAnswerHistory.every((answer, index) => answer === goodAnswers[index]);

            if (isPatternCorrect) {
                setShowQuestionModal(false);
                setSelectedTip(0);
                setIsCustomTip(false);
                toast.success('Hmm, fine...', { icon: <MdChat /> });
            } else {
                // Wrong pattern - start over
                setQuestionIndex(0);
                setAnswerHistory([]);
                setSelectedTip(null);
                setShowQuestionModal(false);
                if (answeredAllCorrect) {
                    toast.success('Awe, thanks! Just select one of the tip options...', { icon: <MdChat /> });
                } else {
                    toast.error('Oh No! The system is malfunctioning... oh well, maybe try a different button?', {
                        icon: <MdChat />,
                    });
                }
            }
        }
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
                        percentage={18}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 18 && !isCustomTip}
                    />
                    <TipButton
                        percentage={20}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 20 && !isCustomTip}
                    />
                    <TipButton
                        customText={'No Tip'}
                        percentage={0}
                        onClick={handleTipSelect}
                        isSelected={selectedTip === 0 && !isCustomTip}
                    />
                    <TipButton
                        percentage={-1}
                        onClick={handleTipSelect}
                        isSelected={isCustomTip}
                        customText={isCustomTip ? getPercentageText(selectedTip || 0) : 'Other'}
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

            <LevelOverModal isOpen={showModal} tipPercentage={selectedTip ?? 0} onClose={handleModalClose} />

            <CustomTipModal
                isOpen={showCustomTipModal}
                onClose={() => setShowCustomTipModal(false)}
                onSubmit={handleCustomTipSubmit}
                baseAmount={baseAmount}
            />

            <CustomTextModal
                isOpen={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
                text={questions[questionIndex].text}
                button1Text={questions[questionIndex].leftButtonText}
                button2Text={questions[questionIndex].rightButtonText}
                button1OnClick={() => handleQuestionAnswer(true)}
                button2OnClick={() => handleQuestionAnswer(false)}
            />
        </motion.div>
    );
};

export default LevelEightPage;
