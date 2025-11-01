
import React, { useState, useEffect } from 'react';
import type { Language } from '../App';
import type { User } from '../types';
import { getAllUsers, deleteUser, updateUser } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import Modal from './common/Modal';
import Spinner from './common/Spinner';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import { TrashIcon } from './icons';

const translations = {
    en: {
        title: "User Management",
        subtitle: "View and manage all registered users.",
        noUsers: "No users found.",
        profileTitle: "User Profile",
        email: "Email",
        joinDate: "Join Date",
        lastLogin: "Last Login",
        deleteUser: "Delete User",
        deleteConfirm: "Are you sure you want to delete this user? This action cannot be undone.",
        userDeleted: "User deleted successfully.",
        never: "Never",
        subscriptionManagement: "Subscription Management",
        subscriptionTier: "Subscription Tier",
        expirationDate: "Expiration Date",
        saveSubscription: "Save Subscription",
        saving: "Saving...",
    },
    ar: {
        title: "إدارة المستخدمين",
        subtitle: "عرض وإدارة جميع المستخدمين المسجلين.",
        noUsers: "لم يتم العثور على مستخدمين.",
        profileTitle: "ملف المستخدم",
        email: "البريد الإلكتروني",
        joinDate: "تاريخ الانضمام",
        lastLogin: "آخر تسجيل دخول",
        deleteUser: "حذف المستخدم",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.",
        userDeleted: "تم حذف المستخدم بنجاح.",
        never: "أبداً",
        subscriptionManagement: "إدارة الاشتراك",
        subscriptionTier: "باقة الاشتراك",
        expirationDate: "تاريخ الانتهاء",
        saveSubscription: "حفظ الاشتراك",
        saving: "جاري الحفظ...",
    }
};

const UserList: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user: coach } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for subscription management in modal
    const [selectedTier, setSelectedTier] = useState<'free' | 'silver' | 'gold' | 'platinum'>('free');
    const [expiryDate, setExpiryDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);


    const fetchUsers = async () => {
        if (coach?.id) {
            setLoading(true);
            const userList = await getAllUsers(coach.id);
            setUsers(userList);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [coach]);

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setSelectedTier(user.subscriptionTier || 'free');
        setExpiryDate(user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toISOString().split('T')[0] : '');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveSubscription = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        
        // Ensure expiryDate at midnight UTC to avoid timezone issues
        const endOfDay = expiryDate ? new Date(expiryDate + 'T23:59:59.999Z') : undefined;

        const updatedUser: User = {
            ...selectedUser,
            subscriptionTier: selectedTier,
            subscriptionEndDate: endOfDay,
        };
        await updateUser(updatedUser);
        setIsSaving(false);
        handleCloseModal();
        await fetchUsers(); // Refresh the list
    };

    const handleDeleteUser = async () => {
        if (selectedUser && window.confirm(t.deleteConfirm)) {
            await deleteUser(selectedUser.id!);
            handleCloseModal();
            await fetchUsers();
        }
    };
    
    const formatDate = (date: Date | undefined) => {
        if (!date) return t.never;
        return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">{t.title}</h1>
            <p className="text-center text-lg text-gray-500 dark:text-gray-400">{t.subtitle}</p>

            {loading ? (
                <div className="flex justify-center items-center h-48"><Spinner /></div>
            ) : users.length === 0 ? (
                <Card><p className="text-center">{t.noUsers}</p></Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <Card key={user.id} className="!p-0 flex flex-col text-center hover:shadow-primary/20">
                            <div className="p-6 flex-grow">
                                <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"/>
                                <h3 className="text-xl font-bold">{user.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{user.email}</p>
                            </div>
                            <button onClick={() => handleViewProfile(user)} className="w-full text-center bg-gray-100 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/50 text-primary font-semibold py-3 rounded-b-2xl transition-colors">
                                {t.profileTitle}
                            </button>
                        </Card>
                    ))}
                </div>
            )}

            {selectedUser && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={t.profileTitle}>
                    <div className="space-y-4">
                        <div className="text-center">
                            <img src={selectedUser.picture} alt={selectedUser.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary-500"/>
                            <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p><strong>{t.email}:</strong> <span className="text-gray-600 dark:text-gray-400">{selectedUser.email}</span></p>
                            <p><strong>{t.joinDate}:</strong> <span className="text-gray-600 dark:text-gray-400">{formatDate(selectedUser.createdAt)}</span></p>
                            <p><strong>{t.lastLogin}:</strong> <span className="text-gray-600 dark:text-gray-400">{formatDate(selectedUser.lastLogin)}</span></p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-2">{t.subscriptionManagement}</h3>
                            <div className="space-y-4">
                                <Select label={t.subscriptionTier} value={selectedTier} onChange={e => setSelectedTier(e.target.value as any)}>
                                    <option value="free">Free</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                    <option value="platinum">Platinum</option>
                                </Select>
                                <Input label={t.expirationDate} type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                                <Button onClick={handleSaveSubscription} className="w-full" disabled={isSaving}>
                                    {isSaving ? <><Spinner/> {t.saving}</> : t.saveSubscription}
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button onClick={handleDeleteUser} className="w-full !bg-red-600 hover:!bg-red-700">
                                <TrashIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2"/>
                                {t.deleteUser}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserList;
