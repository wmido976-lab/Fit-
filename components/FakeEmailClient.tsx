import React, { useState } from 'react';
import Modal from './common/Modal';
import { useEmail } from '../contexts/EmailContext';
import type { Email } from '../types';

const translations = {
    en: {
        inboxTitle: "Simulated Inbox",
        from: "Fit Pro Support",
        empty: "Your inbox is empty.",
        emailBodyTitle: "Email Content",
    },
    ar: {
        inboxTitle: "صندوق البريد الوارد (محاكاة)",
        from: "دعم Fit Pro",
        empty: "صندوق بريدك فارغ.",
        emailBodyTitle: "محتوى الرسالة",
    }
}

interface FakeEmailClientProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'ar';
}

const FakeEmailClient: React.FC<FakeEmailClientProps> = ({ isOpen, onClose, language }) => {
    const { emails, markAsRead } = useEmail();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const t = translations[language];

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        if (!email.read) {
            markAsRead(email.id);
        }
    };
    
    React.useEffect(() => {
        if (isOpen && emails.length > 0 && !selectedEmail) {
            handleSelectEmail(emails[0]);
        }
        if(!isOpen) {
           setSelectedEmail(null);
        }
    }, [isOpen, emails, selectedEmail]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.inboxTitle}>
            <div className="flex flex-col md:flex-row h-[60vh]">
                {/* Email List */}
                <div className="w-full md:w-1/3 border-r-0 md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-700 overflow-y-auto">
                    {emails.length === 0 ? (
                        <p className="p-4 text-gray-500">{t.empty}</p>
                    ) : (
                        <ul>
                            {emails.map(email => (
                                <li key={email.id}
                                    onClick={() => handleSelectEmail(email)}
                                    className={`p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${selectedEmail?.id === email.id ? 'bg-primary-50 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className={`font-bold ${!email.read ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{t.from}</p>
                                        {!email.read && <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>}
                                    </div>
                                    <p className={`text-sm truncate ${!email.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{email.subject}</p>
                                    <p className="text-xs text-gray-400 text-right">{new Date(email.timestamp).toLocaleTimeString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Email Body */}
                <div className="w-full md:w-2/3 p-4 overflow-y-auto">
                    {selectedEmail ? (
                        <div>
                            <h3 className="text-xl font-bold mb-2">{selectedEmail.subject}</h3>
                            <div className="text-sm text-gray-500 mb-4">
                                <p><strong>To:</strong> {selectedEmail.to}</p>
                                <p><strong>From:</strong> {t.from}</p>
                            </div>
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full text-gray-400">
                           <p>{emails.length > 0 ? 'Select an email to read' : t.empty}</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default FakeEmailClient;