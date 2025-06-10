# Firebase Authentication Setup Guide

## 1. Set up Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" and follow the setup wizard
3. Once the project is created, click on "Authentication" in the left sidebar
4. Click on "Get started" and enable "Google" as a sign-in method
5. In the Google sign-in settings:
   - Toggle the "Enable" switch
   - Add a project support email
   - Click "Save"

## 2. Get Firebase Configuration

1. In the Firebase Console, click on the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section and click on the web app (or create one if needed)
4. Copy the Firebase configuration object

## 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional: Only if you want to use Firebase Emulator
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099

# Firebase Admin SDK (for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
FIREBASE_ADMIN_PRIVATE_KEY="your-private-key"
```

## 4. Set Up Firebase Admin (Optional)

For server-side operations, you'll need to set up Firebase Admin:

1. In the Firebase Console, go to Project settings > Service accounts
2. Click on "Generate new private key" and download the JSON file
3. Copy the values from the JSON file to your `.env.local` file

## 5. Start the Development Server

```bash
npm run dev
```

## 6. Testing Authentication

1. Click the "Sign In" button in the navigation bar
2. Sign in with your Google account
3. You should see your profile picture/initials in the top-right corner
4. Click on your profile to see the dropdown menu with the sign-out option

## 7. Deploying to Production

1. Make sure to update the authorized domains in the Firebase Console:
   - Go to Authentication > Settings > Authorized domains
   - Add your production domain (e.g., yourdomain.com)

2. Update the environment variables in your hosting provider with your production values.

## Troubleshooting

- If you see "auth/unauthorized-domain", make sure to add your domain to the authorized domains in the Firebase Console
- If you're using the emulator, make sure it's running: `firebase emulators:start --only auth`
- Check the browser console for any error messages
