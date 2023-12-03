import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDykiN0bLK9UcMRdtP3Esm3QJsw2vNBPYU",
    authDomain: "rasapp-456bf.firebaseapp.com",
    projectId: "rasapp-456bf",
    storageBucket: "rasapp-456bf.appspot.com",
    messagingSenderId: "640222762058",
    appId: "1:640222762058:web:d791e70063d1f31a39c2b3",
    measurementId: "G-RZCJHBET7W"
  };

  const app = initializeApp(firebaseConfig);

  export const firebaseAuth = getAuth(app)