"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmulator = exports.authEmulatorHost = exports.firebaseConfig = void 0;
// Firebase configuration - using environment variables with fallback to direct values
exports.firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
