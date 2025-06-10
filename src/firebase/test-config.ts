// Test file to verify Firebase configuration
import { firebaseConfig } from './config';

console.log('Firebase Config:', JSON.stringify(firebaseConfig, null, 2));

// Check if API key is present
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase API key is missing!');
} else {
  console.log('✅ Firebase API key is present');
}

// Check if auth domain is present
if (!firebaseConfig.authDomain) {
  console.error('❌ Firebase Auth Domain is missing!');
} else {
  console.log('✅ Firebase Auth Domain is present');
}

export {};
