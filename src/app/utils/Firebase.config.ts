import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDwmho0b3NEtrqGMe1p7GPKxBSTCkPVRd4",
  authDomain: "resume-56466.firebaseapp.com",
  projectId: "resume-56466",
  storageBucket: "resume-56466.firebasestorage.app",
  messagingSenderId: "830906368206",
  appId: "1:830906368206:web:9b1f11d3646d4e196cd09f",
  measurementId: "G-7DZ9TNFH1Q",
};

let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    getAnalytics(app);
  }
} else {
  app = getApp();
}

export const db = getFirestore(app);
export const database = getDatabase(app);
