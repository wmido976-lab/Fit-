
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            {...props}
            className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-lg shadow-md text-zinc-900 bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${className} dark:focus:ring-offset-black`}
        >
            {children}
        </button>
    );
};

export default Button;