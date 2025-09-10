
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { useAuth } from './use-auth';
import { format } from 'date-fns';

export type Notification = {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: string;
    read: boolean;
};

const seedNotifications = async (userId: string) => {
    if (!userId) return false;
    const batch = writeBatch(db);
    let dirty = false;

    const notificationsCollection = collection(db, 'notifications');
    const q = query(notificationsCollection, where("userId", "==", userId));
    const notificationsSnapshot = await getDocs(q);

    if (notificationsSnapshot.empty) {
        dirty = true;
        const initialNotifications = [
            { 
                title: 'Low Stock Alert', 
                description: 'Butter is running low. Only 5 kg remaining.',
                date: format(new Date(Date.now() - 1000 * 60 * 60 * 24), 'yyyy-MM-dd HH:mm:ss'), // 1 day ago
                read: false,
            },
            { 
                title: 'New Order Received', 
                description: 'Kofi Mensah placed a new order for Doughnuts (6).',
                date: format(new Date(Date.now() - 1000 * 60 * 30), 'yyyy-MM-dd HH:mm:ss'), // 30 mins ago
                read: false,
            },
            { 
                title: 'Order Completed', 
                description: 'Order for Ama Serwaa (Bento Cake) has been marked as completed.',
                date: format(new Date(Date.now() - 1000 * 60 * 60 * 48), 'yyyy-MM-dd HH:mm:ss'), // 2 days ago
                read: true,
            },
        ];

        initialNotifications.forEach(notification => {
            const docRef = doc(notificationsCollection);
            batch.set(docRef, { ...notification, userId });
        });
        console.log('Seeding notifications...');
    }

    if (dirty) {
        await batch.commit();
        console.log('Notifications seeding committed.');
        return true;
    }
    console.log('Notifications seeding check complete. No new data seeded.');
    return false;
};

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        };
        setLoading(true);
        try {
            await seedNotifications(user.uid);
            
            const q = query(
                collection(db, 'notifications'), 
                where("userId", "==", user.uid),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const userNotifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(userNotifications);

        } catch (error) {
            console.error("Error fetching notifications: ", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    
    const markAllAsRead = async () => {
        if (!user) return;
        const batch = writeBatch(db);
        const unreadNotifications = notifications.filter(n => !n.read);

        if (unreadNotifications.length === 0) return;

        unreadNotifications.forEach(notification => {
            const notifRef = doc(db, 'notifications', notification.id);
            batch.update(notifRef, { read: true });
        });

        try {
            await batch.commit();
            // Update local state immediately for better UX
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Error marking notifications as read: ", error);
        }
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return { notifications, loading, unreadCount, markAllAsRead };
}

    