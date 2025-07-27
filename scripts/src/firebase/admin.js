"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.adminApp = void 0;
var app_1 = require("firebase-admin/app");
var auth_1 = require("firebase-admin/auth");
var config_1 = require("./config");
var serviceAccount = {
    projectId: config_1.firebaseConfig.projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
var adminApp;
if ((0, app_1.getApps)().length === 0) {
    exports.adminApp = adminApp = (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
    });
}
else {
    exports.adminApp = adminApp = (0, app_1.getApp)();
}
var adminAuth = (0, auth_1.getAuth)(adminApp);
exports.adminAuth = adminAuth;
