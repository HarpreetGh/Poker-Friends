import * as firebase from 'firebase';

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVr4IKgejWBb6uFG_joH5a5tT03j40NRM",
    authDomain: "pokerfriends-843ef.firebaseapp.com",
    projectId: "pokerfriends-843ef",
    storageBucket: "pokerfriends-843ef.appspot.com",
    messagingSenderId: "1077794174230",
    appId: "1:1077794174230:web:f05b745f8fba6d8f798c37"
  };

firebase.initializeApp(firebaseConfig);