
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 ${className}`}>
            {children}
        </div>
    );
};

export default Card;