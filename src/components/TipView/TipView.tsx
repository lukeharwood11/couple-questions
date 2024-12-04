import React from 'react';
import './TipView.css';
import { motion } from 'framer-motion';

interface TipViewProps {
    baseAmount: number;
    tipPercentage: number | null;
}

const TipView: React.FC<TipViewProps> = ({ baseAmount, tipPercentage }) => {
    const tipAmount = tipPercentage ? (baseAmount * tipPercentage) / 100 : 0;
    const totalAmount = baseAmount + tipAmount;

    return (
        <motion.div className="tip-view" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
            <div className="amount-row">
                <span>Base Amount:</span>
                <span>${baseAmount.toFixed(2)}</span>
            </div>
            <div className="amount-row">
                {tipPercentage === null && <span>Tip:</span>}
                {tipPercentage !== null && <span>Tip ({tipPercentage?.toFixed(2)}%):</span>}
                {tipPercentage !== null && <span>${tipAmount.toFixed(2)}</span>}
            </div>
            <div className="amount-row total">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
        </motion.div>
    );
};

export default TipView;
