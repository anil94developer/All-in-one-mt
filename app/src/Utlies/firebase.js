import { initializeApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';

import { getDatabase } from "@react-native-firebase/database";
import firebase from '@react-native-firebase/app';

 
// Get a reference to the Firestore database

const config = {
    apiKey: "AIzaSyBE-ouDIonU23JZFPq-XNXYj94y69Ygc7k",
    authDomain: "Manu-f722b.firebaseapp.com",
    databaseURL: "https://Manu-f722b-default-rtdb.firebaseio.com",
    projectId: "Manu-f722b",
    storageBucket: "Manu-f722b.appspot.com",
    messagingSenderId: "915352896435",
    appId: "1:915352896435:web:540b15925d5d5de84dc1c6",
    measurementId: "G-YWEQMVW1WF"
}

const m_app = initializeApp(config);

// const app = firebase.initializeApp(config);
 //
const db = firebase.firestore(m_app);
const m_db = getFirestore(m_app);
const realDb = getDatabase(m_app);

export { db, firebase, realDb, m_db, m_app }