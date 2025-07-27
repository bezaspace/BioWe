// This file helps with environment variable validation and provides better error messages

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
] as const;

type EnvVar = typeof requiredEnvVars[number];

export function validateEnv() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    // Only log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
    }
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Only log success in development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ All required environment variables are set');
  }
}

// This will run when the file is imported
if (typeof window === 'undefined') {
  // Server-side
  validateEnv();
} else {
  // Client-side - just log a warning in development
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName] && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Missing environment variable: ${varName}`);
    }
  });
}
