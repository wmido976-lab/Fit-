
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, name, children, ...props }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-zinc-300 mb-1">
                {label}
            </label>
            <select
                id={name}
                name={name}
                {...props}
                className="block w-full pl-4 pr-10 py-3 text-base bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm rounded-lg"
            >
                {children}
            </select>
        </div>
    );
};

export default Select;