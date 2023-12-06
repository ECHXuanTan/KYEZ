// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKhoKPSiFCp6h9PLBFbF6RsdphJE62Dpw",
  authDomain: "kyez-2cb72.firebaseapp.com",
  projectId: "kyez-2cb72",
  storageBucket: "kyez-2cb72.appspot.com",
  messagingSenderId: "705790531440",
  appId: "1:705790531440:web:f25bd81d11e6c4ed1021b5",
  measurementId: "G-NTFLKVR94Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);