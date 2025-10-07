/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage , getDownloadURL } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // apiKey: 'AIzaSyBUS8ivnBGL-9bDzKGKjegvWv5VCatZE_4',
    // authDomain: 'uep-viewer-176.firebaseapp.com',
    // projectId: 'uep-viewer-176',
    // // storageBucket: 'syn-uep-viewer-176-bucket-dev',
    // storageBucket: 'uep-viewer-176.appspot.com',
    // messagingSenderId: '445518009994',
    // appId: '1:445518009994:web:efa2a4e40c64cd4da37f73',
    // measurementId: 'G-VEVN2KSYC0'
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
    appId: process.env.REACT_APP_PROJECT_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
