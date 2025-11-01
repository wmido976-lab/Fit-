// FIX: Import Section type
import { User, LoginActivity, UserSession, Message, DashboardPost, FoodItem, ExerciseInfo, SubscriptionPlanPrices, Coupon, CustomDashboardCard, Section, ForumMessage, ProgressPhoto, ExerciseDifficulty } from '../types';
import { foodData } from './nutritionData';
import { exerciseData } from './exerciseData';

let db: IDBDatabase;

const DB_NAME = 'FitProDB';
const DB_VERSION = 14;
const USERS_STORE = 'users';
const ACTIVITY_STORE = 'login_activity';
const SESSIONS_STORE = 'user_sessions';
const MESSAGES_STORE = 'messages';
const POSTS_STORE = 'dashboard_posts';
const FOODS_STORE = 'foods';
const EXERCISES_STORE = 'exercises';
const PRICES_STORE = 'subscription_prices';
const COUPONS_STORE = 'coupons';
const SETTINGS_STORE = 'app_settings';
const CUSTOM_CARDS_STORE = 'custom_dashboard_cards';
const SECTIONS_STORE = 'sections';
const FORUM_MESSAGES_STORE = 'forum_messages';
const PROGRESS_PHOTOS_STORE = 'progress_photos';


export const initDB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(true);
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            
            reject(false);
        };

        request.onsuccess = () => {
            db = request.result;
            // Seed data after successful connection
            seedInitialData().then(() => resolve(true)).catch(reject);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = (event.target as IDBOpenDBRequest).result;

            if (!tempDb.objectStoreNames.contains(USERS_STORE)) {
                const usersStore = tempDb.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true });
                usersStore.createIndex('email', 'email', { unique: true });
            }

            if (!tempDb.objectStoreNames.contains(ACTIVITY_STORE)) {
                tempDb.createObjectStore(ACTIVITY_STORE, { keyPath: 'id', autoIncrement: true });
            }
            
            if (!tempDb.objectStoreNames.contains(SESSIONS_STORE)) {
                const sessionsStore = tempDb.createObjectStore(SESSIONS_STORE, { keyPath: 'sessionId' });
                sessionsStore.createIndex('userId', 'userId', { unique: false });
            }
            
            if (!tempDb.objectStoreNames.contains(MESSAGES_STORE)) {
                const messagesStore = tempDb.createObjectStore(MESSAGES_STORE, { keyPath: 'id', autoIncrement: true });
                messagesStore.createIndex('conversationId', 'conversationId', { unique: false });
            }

            if (!tempDb.objectStoreNames.contains(POSTS_STORE)) {
                const postsStore = tempDb.createObjectStore(POSTS_STORE, { keyPath: 'id', autoIncrement: true });
                postsStore.createIndex('userId', 'userId', { unique: false });
            }

            if (!tempDb.objectStoreNames.contains(FOODS_STORE)) {
                tempDb.createObjectStore(FOODS_STORE, { keyPath: 'id' });
            }
            
            // Recreate exercises store for new index
            if (event.oldVersion < 11 && tempDb.objectStoreNames.contains(EXERCISES_STORE)) {
                tempDb.deleteObjectStore(EXERCISES_STORE);
            }
            if (!tempDb.objectStoreNames.contains(EXERCISES_STORE)) {
                const exerciseStore = tempDb.createObjectStore(EXERCISES_STORE, { keyPath: 'id', autoIncrement: true });
                exerciseStore.createIndex('name_en', 'name.en', { unique: false });
                exerciseStore.createIndex('name_ar', 'name.ar', { unique: false });
                exerciseStore.createIndex('difficulty', 'difficulty', { unique: false });
            }

            if (!tempDb.objectStoreNames.contains(PRICES_STORE)) {
                tempDb.createObjectStore(PRICES_STORE, { keyPath: 'id' });
            }

            if (!tempDb.objectStoreNames.contains(COUPONS_STORE)) {
                const couponsStore = tempDb.createObjectStore(COUPONS_STORE, { keyPath: 'id', autoIncrement: true });
                couponsStore.createIndex('code', 'code', { unique: true });
            }
            
            if (!tempDb.objectStoreNames.contains(SETTINGS_STORE)) {
                tempDb.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
            }
            
            if (!tempDb.objectStoreNames.contains(CUSTOM_CARDS_STORE)) {
                tempDb.createObjectStore(CUSTOM_CARDS_STORE, { keyPath: 'id', autoIncrement: true });
            }
            
            if (event.oldVersion < 12 && tempDb.objectStoreNames.contains('sections')) {
                tempDb.deleteObjectStore('sections');
            }

            if (!tempDb.objectStoreNames.contains(FORUM_MESSAGES_STORE)) {
                tempDb.createObjectStore(FORUM_MESSAGES_STORE, { keyPath: 'id', autoIncrement: true });
            }
             if (!tempDb.objectStoreNames.contains(PROGRESS_PHOTOS_STORE)) {
                const photosStore = tempDb.createObjectStore(PROGRESS_PHOTOS_STORE, { keyPath: 'id', autoIncrement: true });
                photosStore.createIndex('userId', 'userId', { unique: false });
            }
            if (event.oldVersion < 13) {
                 if (!tempDb.objectStoreNames.contains(SECTIONS_STORE)) {
                    tempDb.createObjectStore(SECTIONS_STORE, { keyPath: 'id', autoIncrement: true });
                }
                const tx = (event.target as IDBOpenDBRequest).transaction;
                if (tx) {
                    const postsStore = tx.objectStore(POSTS_STORE);
                    if (!postsStore.indexNames.contains('sectionId')) {
                        postsStore.createIndex('sectionId', 'sectionId', { unique: false });
                    }
                }
            }
            if (event.oldVersion < 14) {
                const tx = (event.target as IDBOpenDBRequest).transaction;
                if (tx) {
                    const postsStore = tx.objectStore(POSTS_STORE);
                    if (!postsStore.indexNames.contains('context')) {
                        postsStore.createIndex('context', 'context', { unique: false });
                    }
                }
            }
        };
    });
};

const getStore = (storeName: string, mode: IDBTransactionMode): IDBObjectStore => {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
};

const seedFoodData = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(FOODS_STORE, 'readwrite');
        const store = tx.objectStore(FOODS_STORE);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);

        const countRequest = store.count();
        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                
                foodData.forEach(food => {
                    store.add(food);
                });
            }
        };
    });
};

const seedExerciseData = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(EXERCISES_STORE, 'readwrite');
        const store = tx.objectStore(EXERCISES_STORE);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);

        const countRequest = store.count();
        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                
                exerciseData.forEach(exercise => {
                    store.add(exercise);
                });
            }
        };
    });
};

const seedInitialPrices = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(PRICES_STORE, 'readwrite');
        const store = tx.objectStore(PRICES_STORE);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        
        const getRequest = store.get(1); // Prices object will have a fixed ID of 1
        getRequest.onsuccess = () => {
            if (!getRequest.result) {
                
                const initialPrices: SubscriptionPlanPrices = {
                    id: 1,
                    silver: { monthly: 250, two_months: 480, three_months: 700, yearly: 2500 },
                    gold: { monthly: 450, two_months: 850, three_months: 1250, yearly: 4500 },
                    platinum: { monthly: 650, two_months: 1200, three_months: 1750, yearly: 6500 },
                };
                store.add(initialPrices);
            } else {
                // Migration for existing users
                const currentPrices = getRequest.result;
                if (!currentPrices.silver.two_months) {
                     
                     currentPrices.silver.two_months = 480;
                     currentPrices.silver.three_months = 700;
                     currentPrices.gold.two_months = 850;
                     currentPrices.gold.three_months = 1250;
                     currentPrices.platinum.two_months = 1200;
                     currentPrices.platinum.three_months = 1750;
                     store.put(currentPrices);
                }
            }
        };
    });
};

const seedInitialData = (): Promise<void> => {
    return Promise.all([seedFoodData(), seedExerciseData(), seedInitialPrices()]).then(() => {});
}

export const addUser = (user: Omit<User, 'id'>): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readwrite');
        const request = store.add({ ...user, trialUsed: false, points: 0, weeklyWorkoutCount: 0 });
        request.onsuccess = () => {
            const addedUser = { ...user, id: request.result as number, weeklyWorkoutCount: 0 };
            resolve(addedUser);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getUserById = (id: number): Promise<User | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readonly');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getCoach = (): Promise<User | undefined> => {
    return getUserByEmail('wmido976@gmail.com');
};

export const getCoaches = (): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const users: User[] = request.result;
            const coaches = users.filter(user => user.isCoach);
            resolve(coaches);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getUserByEmail = (email: string): Promise<User | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readonly');
        const index = store.index('email');
        const request = index.get(email);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getUserByResetToken = (token: string): Promise<User | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const users: User[] = request.result;
            const foundUser = users.find(user => user.emailResetToken === token);
            resolve(foundUser);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getAllUsers = (coachId: number): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const users = request.result.filter(user => user.id !== coachId);
            resolve(users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        };
        request.onerror = () => reject(request.error);
    });
};

export const updateUser = (user: User): Promise<User> => {
     return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readwrite');
        const request = store.put(user);
        request.onsuccess = () => resolve(user);
        request.onerror = () => reject(request.error);
    });
};

export const deleteUser = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(USERS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const addLoginActivity = (activity: Omit<LoginActivity, 'id'>): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(ACTIVITY_STORE, 'readwrite');
        const request = store.add(activity);
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

export const createSession = (userId: number): Promise<UserSession> => {
     return new Promise(async (resolve, reject) => {
        await initDB();
        const sessionId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const session: UserSession = { sessionId, userId, loginTime: new Date(), isActive: true };
        const store = getStore(SESSIONS_STORE, 'readwrite');
        const request = store.add(session);
        request.onsuccess = () => resolve(session);
        request.onerror = () => reject(request.error);
    });
};

export const getSession = (sessionId: string): Promise<{ session: UserSession, user: User } | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const tx = db.transaction([SESSIONS_STORE, USERS_STORE], 'readonly');
        const sessionsStore = tx.objectStore(SESSIONS_STORE);
        const usersStore = tx.objectStore(USERS_STORE);

        tx.onerror = () => reject(tx.error);

        const request = sessionsStore.get(sessionId);

        request.onsuccess = () => {
            const session: UserSession | undefined = request.result;
            if (session && session.isActive) {
                const userRequest = usersStore.get(session.userId);
                userRequest.onsuccess = () => {
                    const user: User | undefined = userRequest.result;
                    if (user) {
                        resolve({ session, user });
                    } else {
                        // Session exists but user doesn't? Resolve undefined.
                        resolve(undefined);
                    }
                };
            } else {
                resolve(undefined);
            }
        };
    });
};

export const endSession = (sessionId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SESSIONS_STORE, 'readwrite');
        const request = store.get(sessionId);
        request.onsuccess = () => {
            const session: UserSession | undefined = request.result;
            if (session) {
                session.isActive = false;
                session.logoutTime = new Date();
                const updateRequest = store.put(session);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                resolve(); // No session found, nothing to do
            }
        };
        request.onerror = () => reject(request.error);
    });
};

export const addMessage = (message: Omit<Message, 'id'>): Promise<Message> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(MESSAGES_STORE, 'readwrite');
        const messageWithStatus = { ...message, read: false }; // New messages are unread by default
        const request = store.add(messageWithStatus);
        request.onsuccess = () => {
            const addedMessage = { ...messageWithStatus, id: request.result as number };
            resolve(addedMessage);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getMessagesForConversation = (userId1: number, userId2: number): Promise<Message[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const conversationId = [userId1, userId2].sort((a,b)=>a-b).join('-');
        const store = getStore(MESSAGES_STORE, 'readonly');
        const index = store.index('conversationId');
        const request = index.getAll(conversationId);
        request.onsuccess = () => {
            if(request.result){
                resolve(request.result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
            } else {
                resolve([]);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

export const getUnreadMessagesCount = (userId: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(MESSAGES_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const allMessages: Message[] = request.result;
            const unreadCount = allMessages.filter(
                msg => msg.receiverId === userId && !msg.read
            ).length;
            resolve(unreadCount);
        };
        request.onerror = () => reject(request.error);
    });
};

export const markMessagesAsRead = (conversationId: string, receiverId: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const tx = db.transaction(MESSAGES_STORE, 'readwrite');
        const store = tx.objectStore(MESSAGES_STORE);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);

        const index = store.index('conversationId');
        const request = index.openCursor(IDBKeyRange.only(conversationId));

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                const message = cursor.value as Message;
                if (message.receiverId === receiverId && !message.read) {
                    const updatedMessage = { ...message, read: true };
                    cursor.update(updatedMessage);
                }
                cursor.continue();
            }
        };
    });
};


export const getUsersWithConversations = (coachId: number): Promise<{user: User, lastMessage: Message}[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const tx = db.transaction([MESSAGES_STORE, USERS_STORE], 'readonly');
        const msgStore = tx.objectStore(MESSAGES_STORE);
        const userStore = tx.objectStore(USERS_STORE);
        
        const allMessagesRequest = msgStore.getAll();
        const allUsersRequest = userStore.getAll();

        tx.onerror = () => reject(tx.error);
        
        tx.oncomplete = () => {
            const allMessages: Message[] = allMessagesRequest.result || [];
            const allUsers: User[] = allUsersRequest.result || [];

            const usersById = new Map<number, User>();
            allUsers.forEach(u => u.id && usersById.set(u.id, u));

            const conversations = new Map<string, Message>();
            for (const message of allMessages) {
                if (message.conversationId.split('-').includes(coachId.toString())) {
                    const existingLastMessage = conversations.get(message.conversationId);
                    if (!existingLastMessage || new Date(message.timestamp) > new Date(existingLastMessage.timestamp)) {
                        conversations.set(message.conversationId, message);
                    }
                }
            }

            const results: {user: User, lastMessage: Message}[] = [];
            for (const [conversationId, lastMessage] of conversations.entries()) {
                const userIds = conversationId.split('-');
                const otherUserIdStr = userIds.find(id => id !== coachId.toString());
                
                if (otherUserIdStr) {
                    const otherUserId = parseInt(otherUserIdStr, 10);
                    if (!isNaN(otherUserId)) {
                        const user = usersById.get(otherUserId);
                        if (user) {
                            results.push({ user, lastMessage });
                        }
                    }
                }
            }
            
            results.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
            resolve(results);
        };
    });
};

// Post Management
export const getPosts = (currentUserId: number): Promise<DashboardPost[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(POSTS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const allPosts: DashboardPost[] = request.result;
            const userPosts = allPosts.filter(p => (!p.userId || p.userId === currentUserId) && !p.sectionId && (!p.context || p.context === 'dashboard'));
            resolve(userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        };
        request.onerror = () => reject(request.error);
    });
};

export const addPost = (post: Omit<DashboardPost, 'id'>): Promise<DashboardPost> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(POSTS_STORE, 'readwrite');
        const request = store.add(post);
        request.onsuccess = () => resolve({ ...post, id: request.result as number });
        request.onerror = () => reject(request.error);
    });
};

export const updatePost = (post: DashboardPost): Promise<DashboardPost> => {
     return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(POSTS_STORE, 'readwrite');
        const request = store.put(post);
        request.onsuccess = () => resolve(post);
        request.onerror = () => reject(request.error);
    });
};

export const deletePost = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(POSTS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Food Management
export const getFoods = (): Promise<FoodItem[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(FOODS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const addFood = (food: FoodItem): Promise<FoodItem> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(FOODS_STORE, 'readwrite');
        const request = store.add(food);
        request.onsuccess = () => resolve(food);
        request.onerror = () => reject(request.error);
    });
};

export const deleteFood = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(FOODS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Exercise Management
export const addExercise = (exercise: Omit<ExerciseInfo, 'id'>): Promise<ExerciseInfo> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(EXERCISES_STORE, 'readwrite');
        const request = store.add(exercise);
        request.onsuccess = () => {
            const addedExercise: ExerciseInfo = {
                ...exercise,
                id: request.result as number,
            };
            resolve(addedExercise);
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteExercise = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(EXERCISES_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getExercises = (): Promise<ExerciseInfo[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(EXERCISES_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const findExerciseByName = (name: string): Promise<ExerciseInfo | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const tx = db.transaction(EXERCISES_STORE, 'readonly');
        const store = tx.objectStore(EXERCISES_STORE);
        const request = store.getAll();
        let foundExercise: ExerciseInfo | undefined;

        tx.onerror = () => reject(tx.error);
        
        request.onsuccess = () => {
            const allExercises: ExerciseInfo[] = request.result;
            const searchTerm = name.trim().toLowerCase();
            foundExercise = allExercises.find(ex => 
                ex.name.en.toLowerCase().includes(searchTerm) || 
                ex.name.ar.includes(searchTerm)
            );
        };

        tx.oncomplete = () => {
            resolve(foundExercise);
        };
    });
};

export const findExercisesByCriteria = async (criteria: { difficulty?: ExerciseDifficulty; muscleGroup?: string }): Promise<ExerciseInfo[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(EXERCISES_STORE, 'readonly');
        const request = store.getAll();

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            let exercises: ExerciseInfo[] = request.result;

            if (criteria.difficulty) {
                exercises = exercises.filter(ex => ex.difficulty === criteria.difficulty);
            }

            if (criteria.muscleGroup) {
                const muscleGroupLower = criteria.muscleGroup.toLowerCase();
                exercises = exercises.filter(ex => 
                    ex.muscleGroup.en.toLowerCase().includes(muscleGroupLower) ||
                    ex.muscleGroup.ar.includes(criteria.muscleGroup!)
                );
            }
            resolve(exercises);
        };
    });
};

// Price Management
export const getPrices = (): Promise<SubscriptionPlanPrices | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(PRICES_STORE, 'readonly');
        const request = store.get(1); // Always get the object with ID 1
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const updatePrices = (prices: SubscriptionPlanPrices): Promise<SubscriptionPlanPrices> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(PRICES_STORE, 'readwrite');
        const request = store.put(prices);
        request.onsuccess = () => resolve(prices);
        request.onerror = () => reject(request.error);
    });
};

// Coupon Management
export const addCoupon = (coupon: Omit<Coupon, 'id'>): Promise<Coupon> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(COUPONS_STORE, 'readwrite');
        const request = store.add(coupon);
        request.onsuccess = () => resolve({ ...coupon, id: request.result as number });
        request.onerror = () => reject(request.error);
    });
};

export const getAllCoupons = (): Promise<Coupon[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(COUPONS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        request.onerror = () => reject(request.error);
    });
};

export const getCouponByCode = (code: string): Promise<Coupon | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(COUPONS_STORE, 'readonly');
        const index = store.index('code');
        const request = index.get(code.toUpperCase());
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteCoupon = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(COUPONS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// App Settings Management
export const getSetting = (key: string): Promise<any | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SETTINGS_STORE, 'readonly');
        const request = store.get(key);
        request.onsuccess = () => {
            resolve(request.result ? request.result.value : undefined);
        };
        request.onerror = () => reject(request.error);
    });
};

export const setSetting = (key: string, value: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SETTINGS_STORE, 'readwrite');
        const request = store.put({ key, value });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Custom Dashboard Card Management
export const addCustomCard = (card: Omit<CustomDashboardCard, 'id'>): Promise<CustomDashboardCard> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(CUSTOM_CARDS_STORE, 'readwrite');
        const request = store.add(card);
        request.onsuccess = () => resolve({ ...card, id: request.result as number });
        request.onerror = () => reject(request.error);
    });
};

export const getCustomCards = (): Promise<CustomDashboardCard[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(CUSTOM_CARDS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const sortedCards = request.result.sort((a: CustomDashboardCard, b: CustomDashboardCard) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            resolve(sortedCards);
        };
        request.onerror = () => reject(request.error);
    });
};

export const findCustomCardByTitle = (title: string): Promise<CustomDashboardCard | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(CUSTOM_CARDS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const cards: CustomDashboardCard[] = request.result;
            const foundCard = cards.find(card => card.title === title);
            resolve(foundCard);
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteCustomCard = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(CUSTOM_CARDS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Section Management
export const addSection = (section: Omit<Section, 'id'>): Promise<Section> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SECTIONS_STORE, 'readwrite');
        const request = store.add(section);
        request.onsuccess = () => {
            document.dispatchEvent(new CustomEvent('sectionUpdated'));
            resolve({ ...section, id: request.result as number });
        }
        request.onerror = () => reject(request.error);
    });
};

export const updateSection = (section: Section): Promise<Section> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SECTIONS_STORE, 'readwrite');
        if (!section.id) {
            return reject(new Error("Cannot update a section without an ID."));
        }
        const request = store.put(section);
        request.onsuccess = () => {
            document.dispatchEvent(new CustomEvent('sectionUpdated'));
            resolve(section);
        }
        request.onerror = () => reject(request.error);
    });
};

export const getAllSections = (): Promise<Section[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SECTIONS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const sections = request.result.sort((a: Section, b: Section) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            resolve(sections);
        };
        request.onerror = () => reject(request.error);
    });
};

export const findSectionByName = (name: string): Promise<Section | undefined> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(SECTIONS_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            const sections: Section[] = request.result;
            const searchTerm = name.trim().toLowerCase();
            const foundSection = sections.find(
                s => s.name.en.toLowerCase() === searchTerm || s.name.ar === name
            );
            resolve(foundSection);
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteSection = (sectionId: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const tx = db.transaction([POSTS_STORE, SECTIONS_STORE], 'readwrite');
        const postsStore = tx.objectStore(POSTS_STORE);
        const sectionsStore = tx.objectStore(SECTIONS_STORE);

        tx.onerror = () => reject(tx.error);
        tx.oncomplete = () => {
             document.dispatchEvent(new CustomEvent('sectionUpdated'));
             resolve();
        }

        // 1. Delete all posts associated with the section
        const postsIndex = postsStore.index('sectionId');
        const postsCursorReq = postsIndex.openCursor(IDBKeyRange.only(sectionId));
        postsCursorReq.onsuccess = e => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
                // 2. Once all posts are deleted, delete the section itself
                sectionsStore.delete(sectionId);
            }
        };
    });
};

export const getPostsForSection = (sectionId: number): Promise<DashboardPost[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(POSTS_STORE, 'readonly');
        const index = store.index('sectionId');
        const request = index.getAll(sectionId);
        request.onsuccess = () => {
            const sectionPosts = request.result;
            resolve(sectionPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        };
        request.onerror = () => reject(request.error);
    });
};

// Forum Messages
export const addForumMessage = (message: Omit<ForumMessage, 'id'>): Promise<ForumMessage> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(FORUM_MESSAGES_STORE, 'readwrite');
        const request = store.add(message);
        request.onsuccess = () => {
            const addedMessage = { ...message, id: request.result as number };
            resolve(addedMessage);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getAllForumMessages = (): Promise<ForumMessage[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(FORUM_MESSAGES_STORE, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => {
            if(request.result){
                resolve(request.result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
            } else {
                resolve([]);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

// Progress Photos
export const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id'>): Promise<ProgressPhoto> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(PROGRESS_PHOTOS_STORE, 'readwrite');
        const request = store.add(photo);
        request.onsuccess = () => resolve({ ...photo, id: request.result as number });
        request.onerror = () => reject(request.error);
    });
};

export const getProgressPhotosForUser = (userId: number): Promise<ProgressPhoto[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(PROGRESS_PHOTOS_STORE, 'readonly');
        const index = store.index('userId');
        const request = index.getAll(userId);
        request.onsuccess = () => {
            resolve(request.result.sort((a: ProgressPhoto, b: ProgressPhoto) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteProgressPhoto = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const store = getStore(PROGRESS_PHOTOS_STORE, 'readwrite');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};