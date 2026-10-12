import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { firebase ,getDatabase} from '@react-native-firebase/database';

const firebaseConfig = async () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBE-ouDIonU23JZFPq-XNXYj94y69Ygc7k",
    authDomain: "Manu-f722b.firebaseapp.com",
    databaseURL: "https://Manu-f722b-default-rtdb.firebaseio.com",
    projectId: "Manu-f722b",
    storageBucket: "Manu-f722b.appspot.com",
    messagingSenderId: "915352896435",
    appId: "1:915352896435:web:540b15925d5d5de84dc1c6",
    measurementId: "G-YWEQMVW1WF"
  };
 console.log("firebase -------",firebase.apps.length)
  if (!firebase.apps.length) {
    let res = firebase.initializeApp(firebaseConfig);
    console.log("firebase conneaction----------", JSON.stringify(res))

  } else {
    console.log("firebase conneaction-----errr-----")

  }
};

const writeUserData = async (refName,data) => {
  console.log('-==-=-=-=re',refName,data);
 firebase.database().ref(refName)
    .set(data) 
    .catch(error => {
      //error callback
      console.log('error----------------------------- ', error);
    });
};

const pushData = async (refName,data) => {
  console.log('-==-=-=-=re',refName,data);
 firebase.database().ref(refName)
    .push(data) 
    .catch(error => {
      //error callback
      console.log('error----------------------------- ', error);
    });
};


const readUserData = async id => {
  console.log('test call');
  firebase
    .database()
    .ref("/" + id + "/")
    .on('value', snapshot => {
      const userObj = snapshot.val();
      return userObj;
    });
};

const updateSingleData = id => {
  firebase.database().ref('Users/').update({
    id,
  });
};

const updateUserData = async (id, latitude, longitude, name,
  image) => {
  firebase
    .database()
    .ref('Users/')
    .push({
      id,
      latitude,
      longitude,
      name,
      image
    })
    .then(data => {
      //success callback
      console.log('data ', data);
    })
    .catch(error => {
      //error callback
      console.log('error----------------------------- ', error);
    });
};

export { firebaseConfig, writeUserData, updateUserData, readUserData ,pushData};
