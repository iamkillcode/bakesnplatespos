
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { app, db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from './use-toast';

const auth = getAuth(app);

type UserRole = 'staff' | 'executive';

interface AppUser extends User {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: {firstName: string, lastName: string}) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchAppUserData = useCallback(async (firebaseUser: User) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({ 
            ...firebaseUser, 
            role: userData.role || 'staff',
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatarUrl: userData.avatarUrl,
        } as AppUser);
    } else {
        // Default to 'staff' if no role document is found
        const defaultUserData = { 
            role: 'staff',
            firstName: '',
            lastName: '',
            avatarUrl: '',
        };
        await setDoc(userDocRef, defaultUserData, { merge: true });
        setUser({ ...firebaseUser, ...defaultUserData } as AppUser);
        console.warn(`No role document found for user ${firebaseUser.uid}. Defaulting to 'staff'.`);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchAppUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchAppUserData]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      // The onAuthStateChanged listener will handle setting the user state.
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
        await signOut(auth);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };
  
  const updateUserProfile = useCallback(async (data: {firstName: string, lastName: string}) => {
    if (!user) return;
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { 
            firstName: data.firstName,
            lastName: data.lastName
        }, { merge: true });
        // Refetch user data to ensure state is up-to-date
        await fetchAppUserData(user);
        toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error) {
        console.error("Error updating user profile:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    }
  }, [user, toast, fetchAppUserData]);
  
  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) return;

    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { avatarUrl: downloadURL });
      
      // Refetch user data to ensure the new avatar URL is populated everywhere
      await fetchAppUserData(user);

      toast({ title: 'Success', description: 'Avatar updated successfully.' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ variant: 'destructive', title: 'Error', 'description': 'Failed to upload avatar.' });
    }
  }, [user, toast, fetchAppUserData]);
  
  const value = { user, loading, login, logout, updateUserProfile, uploadAvatar, error };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
