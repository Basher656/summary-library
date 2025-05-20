import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZECh91ho99znAklqfjE0oHFXLWh1tCNY",
    authDomain: "summary-library-bbd18.firebaseapp.com",
    projectId: "summary-library-bbd18",
    storageBucket: "summary-library-bbd18.appspot.com",
    messagingSenderId: "208401779093",
    appId: "1:208401779093:web:49c66b8fb01a61d276ce9c",
    measurementId: "G-XQPXLYH5S5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
