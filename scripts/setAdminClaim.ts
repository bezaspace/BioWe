// Usage: Set the admin claim for a user in Firebase
// Run: npx ts-node scripts/setAdminClaim.ts <USER_UID>

import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert } from "firebase-admin/app";

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
  console.error("Please provide a user UID as an argument.");
  process.exit(1);
}

getAuth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Admin claim set for user: ${uid}`);
    process.exit(0);
  })
  .catch(error => {
    console.error("Error setting admin claim:", error);
    process.exit(1);
  });
