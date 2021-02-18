import firebase from 'firebase';
const firebaseApp= firebase.initializeApp({
   
    apiKey: "AIzaSyAh3_4tminpWb3ToJTOSe1vlw-asaRzcZQ",
    authDomain: "picxellence-1a20e.firebaseapp.com",
    projectId: "picxellence-1a20e",
    storageBucket: "picxellence-1a20e.appspot.com",
    messagingSenderId: "1002974590170",
    appId: "1:1002974590170:web:c4d9c95cf74f3d1cf3a1e3",
    measurementId: "G-NZFK3XJ0MF"
});
const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db,auth,storage};