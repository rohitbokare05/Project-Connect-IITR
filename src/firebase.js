// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCHc3WstiMLmSxXNgkYBkInseshtFyWydo",
  authDomain: "ece-research-connect-d79c3.firebaseapp.com",
  projectId: "ece-research-connect-d79c3",
  storageBucket: "ece-research-connect-d79c3.firebasestorage.app",
  messagingSenderId: "181327152019",
  appId: "1:181327152019:web:9f41c2097b3068cdf0de66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);