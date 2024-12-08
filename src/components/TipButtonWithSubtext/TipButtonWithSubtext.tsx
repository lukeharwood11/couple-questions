import React from 'react';
import './TipButtonWithSubtext.css';

interface TipButtonWithSubtextProps {
    percentage: number;
    subtext: string;
    onClick: () => void;
    isSelected?: boolean;
    className?: string;
    disabled?: boolean;
}

const TipButtonWithSubtext: React.FC<TipButtonWithSubtextProps> = ({
    percentage,
    subtext,
    onClick,
    isSelected,
    className = '',
    disabled = false
}) => {
    return (
        <button
            className={`tip-button-with-subtext ${isSelected ? 'selected' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <div className="percentage">{percentage}%</div>
            <div className="subtext">{subtext}</div>
        </button>
    );
};

export default TipButtonWithSubtext; 