
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDJRg-UYxWYMXpf2eY15eJKAlL4s0RAgmw",
  authDomain: "mg-chatapp.firebaseapp.com",
  projectId: "mg-chatapp",
  storageBucket: "mg-chatapp.appspot.com",
  messagingSenderId: "216687227331",
  appId: "1:216687227331:web:15823aeef58d6961704d76",
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
