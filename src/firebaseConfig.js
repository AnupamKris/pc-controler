// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdMYysTiW2JkY3oHnh-OPaf79aS_ogr5M",
  authDomain: "hackcident-90d53.firebaseapp.com",
  projectId: "hackcident-90d53",
  storageBucket: "hackcident-90d53.appspot.com",
  messagingSenderId: "337728858061",
  appId: "1:337728858061:web:5d622213fec3d90ca80684",
  databaseURL:
    "https://hackcident-90d53-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, database };
