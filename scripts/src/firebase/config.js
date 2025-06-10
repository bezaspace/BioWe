"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmulator = exports.authEmulatorHost = exports.firebaseConfig = void 0;
// Firebase configuration - using environment variables with fallback to direct values
exports.firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAstxg88vrLR71TSlqsBQY8N_83u650eas",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bioweshop-c5a3c.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bioweshop-c5a3c",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bioweshop-c5a3c.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "672362857101",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:672362857101:web:9ec3b1e878646a611a98c4",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-K9ETR35WCM"
};
// Validate Firebase config
Object.entries(exports.firebaseConfig).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    if (!value) {
        console.warn("Missing Firebase config value for ".concat(key));
    }
});
exports.authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
exports.isEmulator = !!exports.authEmulatorHost;
