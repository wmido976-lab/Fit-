import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { 
    initDB, 
    getUserByEmail, 
    addUser, 
    addLoginActivity, 
    createSession, 
    getSession, 
    endSession, 
    updateUser,
    getCoach,
    addMessage
} from '../services/dbService';

export interface VerificationData {
    fullName: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    phoneNumber: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'loading';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    isCoach: boolean;
    isVerified: boolean;
    subscriptionStatus: SubscriptionStatus;
    daysRemainingInTrial: number;
    login: (email: string, password?: string) => Promise<void>;
    register: (name: string, email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    completeVerification: (data: VerificationData) => Promise<void>;
    updateProfilePicture: (pictureData: string) => Promise<void>;
    updateUserSubscription: (tier: 'free' | 'silver' | 'gold' | 'platinum', endDate: Date) => Promise<void>;
    addPoints: (points: number) => Promise<void>;
    resetPoints: () => Promise<void>;
    clearNewUserFlag: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('loading');
    const [daysRemainingInTrial, setDaysRemainingInTrial] = useState(0);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                await initDB();
                
                // Seed or update coach accounts to ensure they have correct permissions
                const coachesToSeed = [
                    {
                        email: 'wmido976@gmail.com',
                        name: 'Platform Owner',
                        picture: `https://ui-avatars.com/api/?name=Owner&background=800080&color=fff&rounded=true`,
                    },
                    {
                        email: 'midowaleed174@gmail.com',
                        name: 'Captain Muhammad Walid',
                        picture: `https://ui-avatars.com/api/?name=Muhammad+Walid&background=10B981&color=fff&rounded=true`,
                    }
                ];

                for (const coach of coachesToSeed) {
                    let userAccount = await getUserByEmail(coach.email);
                    const coachProps = {
                        isCoach: true,
                        subscriptionTier: 'platinum' as const,
                        subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
                    };

                    if (!userAccount) {
                        // Create coach if they don't exist
                        await addUser({
                            name: coach.name,
                            email: coach.email,
                            picture: coach.picture,
                            createdAt: new Date(),
                            ...coachProps
                        });
                    } else if (!userAccount.isCoach) {
                        // Update the user to be a coach if they exist but aren't flagged as one
                        await updateUser({
                            ...userAccount,
                            ...coachProps
                        });
                    }
                }

                const sessionId = localStorage.getItem('fitproSessionId');
                if (sessionId) {
                    const sessionData = await getSession(sessionId);
                    if (sessionData?.session && sessionData.session.isActive) {
                        const currentUser = sessionData.user;
                        setUser(currentUser);
                        // A user is considered verified if they have a full name saved.
                        if (currentUser.fullName) {
                            setIsVerified(true);
                        }
                    } else {
                        localStorage.removeItem('fitproSessionId');
                    }
                }
            } catch (error) {
                
                localStorage.removeItem('fitproSessionId');
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        if (!user) {
            setSubscriptionStatus('loading');
            return;
        }

        if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date()) {
            setSubscriptionStatus('active');
            const now = new Date();
            const endDate = new Date(user.subscriptionEndDate);
            const diffTime = Math.abs(endDate.getTime() - now.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemainingInTrial(diffDays);
        } else {
            setSubscriptionStatus('expired');
            setDaysRemainingInTrial(0);
        }

    }, [user]);

    const login = async (email: string, password?: string) => {
        setLoading(true);
        try {
            const processedEmail = email.trim().toLowerCase();
            const user = await getUserByEmail(processedEmail);

            // If user does not exist, log and throw.
            if (!user) {
                await addLoginActivity({ userId: -1, loginTime: new Date(), ipAddress: '127.0.0.1', deviceInfo: navigator.userAgent, status: 'failed', failureReason: 'User not found' });
                throw new Error('Invalid credentials');
            }

            // Now we know user exists, check for password match.
            // Coaches have a password bypass for the demo.
            const passwordMatch = user.isCoach 
                ? true 
                : user.password === password;

            if (passwordMatch) {
                // Success: Log activity, update user, create session
                await addLoginActivity({ userId: user.id!, loginTime: new Date(), ipAddress: '127.0.0.1', deviceInfo: navigator.userAgent, status: 'success' });
                user.lastLogin = new Date();
                await updateUser(user);
                const session = await createSession(user.id!);
                localStorage.setItem('fitproSessionId', session.sessionId);
                setUser(user);
                if (user.fullName) {
                    setIsVerified(true);
                }
            } else {
                // Failure: Log activity and throw
                await addLoginActivity({ userId: user.id!, loginTime: new Date(), ipAddress: '127.0.0.1', deviceInfo: navigator.userAgent, status: 'failed', failureReason: 'Invalid credentials' });
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            
            setUser(null);
            localStorage.removeItem('fitproSessionId');
            throw error; // Re-throw to be caught by UI component
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password?: string) => {
        setLoading(true);
        try {
            const processedEmail = email.trim().toLowerCase();
            let existingUser = await getUserByEmail(processedEmail);
            if (existingUser) {
                throw new Error('Email is already registered.');
            }
    
            const newUser: Omit<User, 'id'> = {
                name: name.trim(),
                email: processedEmail,
                picture: `https://ui-avatars.com/api/?name=${name.trim().split(' ')[0]}&background=random&color=fff&rounded=true`,
                password,
                isCoach: false,
                createdAt: new Date(),
                subscriptionTier: 'free',
                trialUsed: false,
                points: 0,
                weeklyWorkoutCount: 0,
                isNewUser: true,
            };
    
            const user = await addUser(newUser);
            
            // Silently notify the owner about the new registration
            if (user && user.id) {
                try {
                    const owner = await getCoach();
                    if (owner && owner.id) {
                        const messageContent = `[NEW USER REGISTRATION]\nName: ${user.name}\nEmail: ${user.email}`;
                        await addMessage({
                            senderId: user.id,
                            receiverId: owner.id,
                            conversationId: [user.id, owner.id].sort((a,b)=>a-b).join('-'),
                            type: 'text',
                            content: messageContent,
                            timestamp: new Date(),
                            channel: 'coach',
                        });
                    }
                } catch (notificationError) {
                    
                }
            }

            // Now log them in
            if (user && user.id) {
                await addLoginActivity({ userId: user.id, loginTime: new Date(), ipAddress: '127.0.0.1', deviceInfo: navigator.userAgent, status: 'success' });
                user.lastLogin = new Date();
                await updateUser(user);
                const session = await createSession(user.id);
                localStorage.setItem('fitproSessionId', session.sessionId);
                setUser(user);
                if (user.fullName) {
                    setIsVerified(true);
                }
            } else {
                throw new Error('Failed to create user account.');
            }
    
        } catch (error) {
            
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    const completeVerification = async (data: VerificationData) => {
        if (!user) throw new Error("No user to verify");
        
        const updatedUser: User = {
            ...user,
            ...data,
        };
        
        await updateUser(updatedUser);
        setUser(updatedUser);
        setIsVerified(true);
    };

    const updateProfilePicture = async (pictureData: string) => {
        if (!user) throw new Error("No user is logged in to update.");

        const updatedUser: User = {
            ...user,
            picture: pictureData,
        };

        await updateUser(updatedUser);
        setUser(updatedUser);
    };

    const updateUserSubscription = async (tier: 'free' | 'silver' | 'gold' | 'platinum', endDate: Date) => {
        if (!user) throw new Error("No user is logged in to update.");

        const updatedUser: User = {
            ...user,
            subscriptionTier: tier,
            subscriptionEndDate: endDate,
        };
        
        if (tier === 'free') {
            updatedUser.trialUsed = true;
        }

        await updateUser(updatedUser);
        setUser(updatedUser);
    };

    const addPoints = async (points: number) => {
        if (!user) return;
        const newPoints = (user.points || 0) + points;
        const updatedUser = { ...user, points: newPoints };
        await updateUser(updatedUser);
        setUser(updatedUser);
    };

    const resetPoints = async () => {
        if (!user) return;
        const updatedUser = { ...user, points: 0 };
        await updateUser(updatedUser);
        setUser(updatedUser);
    };

    const logout = async () => {
        const sessionId = localStorage.getItem('fitproSessionId');
        if (sessionId) {
            await endSession(sessionId);
            localStorage.removeItem('fitproSessionId');
        }
        setUser(null);
        setIsVerified(false);
    };
    
    const clearNewUserFlag = async () => {
        if (!user) return;
        if (user.isNewUser) {
            const updatedUser = { ...user, isNewUser: false };
            await updateUser(updatedUser);
            setUser(updatedUser); // Update state locally to reflect change immediately
        }
    };

    const isCoach = user?.isCoach ?? false;

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            loading, 
            isCoach, 
            isVerified, 
            subscriptionStatus,
            daysRemainingInTrial,
            login, 
            register,
            logout, 
            completeVerification, 
            updateProfilePicture,
            updateUserSubscription,
            addPoints,
            resetPoints,
            clearNewUserFlag,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};