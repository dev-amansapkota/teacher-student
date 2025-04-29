import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgTBX7-LR5qExExZQ6Yi_Ho7gt8Yw3Suo",
  authDomain: "ankit10252-bc683.firebaseapp.com",
  projectId: "ankit10252-bc683",
  storageBucket: "ankit10252-bc683.appspot.com",
  messagingSenderId: "617164414578",
  appId: "1:617164414578:web:c74d4f1dc2c1f50dd76ceb",
  measurementId: "G-6G110W7E0V"
};

const app = initializeApp(firebaseConfig);

// Instead of calling getAuth directly, first check if initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  auth = getAuth(app); // fallback if already initialized
}

export { auth };
export default app;
