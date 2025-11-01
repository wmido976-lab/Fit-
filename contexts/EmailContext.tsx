import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import type { Email } from '../types';

interface EmailContextType {
    emails: Email[];
    sendEmail: (to: string, subject: string, body: string) => void;
    markAsRead: (id: number) => void;
    unreadCount: number;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const EMAIL_STORAGE_KEY = 'fitpro_fake_emails';

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [emails, setEmails] = useState<Email[]>(() => {
        try {
            const storedEmails = localStorage.getItem(EMAIL_STORAGE_KEY);
            return storedEmails ? JSON.parse(storedEmails) : [];
        } catch (error) {
            console.error("Error loading emails from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails));
        } catch (error) {
            console.error("Error saving emails to localStorage", error);
        }
    }, [emails]);

    const sendEmail = (to: string, subject: string, body: string) => {
        const newEmail: Email = {
            id: Date.now(),
            to,
            subject,
            body,
            read: false,
            timestamp: new Date(),
        };
        setEmails(prevEmails => [newEmail, ...prevEmails]);
    };

    const markAsRead = (id: number) => {
        setEmails(prevEmails =>
            prevEmails.map(email =>
                email.id === id ? { ...email, read: true } : email
            )
        );
    };

    const unreadCount = useMemo(() => {
        return emails.filter(email => !email.read).length;
    }, [emails]);

    return (
        <EmailContext.Provider value={{ emails, sendEmail, markAsRead, unreadCount }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (context === undefined) {
        throw new Error('useEmail must be used within an EmailProvider');
    }
    return context;
};