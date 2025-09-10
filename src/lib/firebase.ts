
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "bakesnplates",
  "appId": "1:661416198704:web:f330ae9e730c43f3f5a3f5",
  "storageBucket": "bakesnplates.appspot.com",
  "apiKey": "AIzaSyD55cqczaXiRz24v0a2Dg2O8Srqv3bItlw",
  "authDomain": "bakesnplates.firebaseapp.com",
  "messagingSenderId": "661416198704"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
