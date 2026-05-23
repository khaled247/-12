// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBa8sycPu9WfX42bJ0neDFgpGBhxOnFMbY",
  authDomain: "khaled-e7e6c.firebaseapp.com",
  projectId: "khaled-e7e6c",
  storageBucket: "khaled-e7e6c.firebasestorage.app",
  messagingSenderId: "394315707550",
  appId: "1:394315707550:web:1c2210fd925b66ed07f78f",
  measurementId: "G-X527XBGN5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
