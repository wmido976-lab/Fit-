
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, name, className, ...props }) => {
    // Use name for id, fallback to a generated id for accessibility
    const id = name || React.useId();

    return (
        // The container needs to be relative for the absolutely positioned label
        <div className="relative">
            <input
                id={id}
                name={name}
                placeholder=" " // A space placeholder is crucial for the :placeholder-shown CSS pseudo-class to work
                {...props}
                // 'peer' is the key to styling the label based on the input's state
                className={`peer block w-full px-4 pt-6 pb-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm ${className || ''}`}
            />
            <label
                htmlFor={id}
                className="
                    absolute text-base text-zinc-400
                    duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-left rtl:origin-right
                    start-4
                    peer-focus:text-primary
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75
                    peer-focus:-translate-y-3
                    pointer-events-none"
            >
                {label}
            </label>
        </div>
    );
};

export default Input;