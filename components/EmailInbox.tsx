import React, { useState } from 'react';
import { useEmail } from '../contexts/EmailContext';
import FakeEmailClient from './FakeEmailClient';
import { MailIcon } from './icons';

interface EmailInboxProps {
    language: 'en' | 'ar';
}

const EmailInbox: React.FC<EmailInboxProps> = ({ language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount } = useEmail();

    return (
        <>
            <div className="fixed bottom-6 right-6 z-30 rtl:left-6 rtl:right-auto">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative w-16 h-16 bg-primary hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300"
                    aria-label="Open Inbox"
                >
                    <MailIcon className="w-8 h-8"/>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>
            <FakeEmailClient isOpen={isOpen} onClose={() => setIsOpen(false)} language={language} />
        </>
    );
};

export default EmailInbox;