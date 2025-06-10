import { cert, getApps, getApp, initializeApp, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { firebaseConfig } from './config';

const serviceAccount: ServiceAccount = {
  projectId: firebaseConfig.projectId,
  clientEmail: "firebase-adminsdk-fbsvc@bioweshop-c5a3c.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYnUVSYyphiawz\nU57kONkhRENyUJXD4LWerIHK4ICx+speRT2dO5IVjZGCt1xE2Ywyk5T9bY+NJXJu\nC70MItqPBSeSaTYHC7HJyVxkegyELD0N2LmpCXk75Pz805DDfl/+/+fKcGrmMsaL\ndt6fJV5WpRgdbW7kImvIqlri82ZvHPooxf2uH4/puw7SFDhfCTMfXeTecUWB5He7\ny9KzPfmKa9waIpDBM/n7g5Ddb4irL4daFNqQ+zc1eViyTh4OwRNhwv7BMZTUeTLe\nlN0mNHdlGUVnyqOsgER41NbRZID4dIipZ/CFdyOFCqgBthqk26mSfdcLn/JfVwuM\nGoQG9GZjAgMBAAECggEAFNN8FEQdZ8tmc71ONOK1GV8RZ9YrZIbpAfWUjgpDmwYY\nUPOt9s5G9H3/L2a08V2mo3g+9V6FdRjOcXSp9bAD7KR4GU4WO1vohRrfatlk6ocx\nmw7KNzu9uY4EIBRW8Evx7wBzsc0pfq8gfQOvBD9l4k5hPhLNoSrj/obmJDZcR36S\nK7VjxckJHDW+YlxXYQnOP3nGyOHXRYndSF+cUbEdhHcLpTiiCYMmg7X9jlQWyARE\n0UIU+3zNmMe7RzyqwDSsOE6EPMsqDw9kW1EWxTZSsMJZqHgmxvNgjz5rTYF9/Tki\nWyrqo2nW3fkjnVtovW/d5tDL/40ONfps3kv3vem9oQKBgQDNBtt715stxRdPxhTj\nGWxYRagq7SNRWdc6kNXOOiojsmFcUZ5QdzE/j6oz/UtE3otIWjBw9FBATJ90b77B\nr0GQ7JzO4B0e+hrE7VU0X0JdHDbOZ+rHfYqY8KCKCKChvvCwQqJgsqEBMjTUqlNS\nFBOcyBdtkg45q6GXF4ieMCS6awKBgQC+jpGdIZ/MnD9Lef2kY6J8WjIfKOAu6Xvb\n/WJQO9sftSQWIao6inpDmq8E7nHwhIP4xKbOLFnKw18+JuQb+w+h1yOTfmYwIs4V\nFxZXgzoCuWg02mGvXSLpOqQ+s/rdaQ6cVpdKcm8Yp1+PaQvu9KUllEKlYsq/qCUz\nUrYseBjx6QKBgAsYsupZ+fkZMLDNnLXJ23ZPltFz8jRl82MlEZ1OwpcaAXD4rePW\n/6BcCy8zJ0676LfqwbJrVqiUPREVNzLOZHMOi1IbCRhzGt3Lpo/mE/ZsH38+WpOf\ndM/gPiAaZW87oVU41gb7xAEHkZps+YN4uLMElVgFzqVKZ72AtZEyM9qvAoGAXkJj\noRha1XmMjadAYiqu21g6ZtNvYYU5MW67TPjuwVZ3DUOF0wNgy0Qeww+36MOEDHAq\nGt4xZG0UFchjGbws1V94R6NEpRbyXdhXwt40udhAxbQokfg+JqRNTn703sTy5z6m\nA7trXQSd7nCF6KO3dUlLVkfyBrAEBskpOAIIRNECgYBMQBmMUfa1IxAwdWrTaHD7\n2KpJJp1K/uzIhlR8NJNUTPq41Nx7A+qIZWDmskjuC5EX9uPaiSGdmutZhj+qzboM\nJ6ojMPx6Sjh9ZM2dJ9gAQqCHDkrtpizMSZ2FvBYg3M1wmA+HDhwGVg0q3bgDk4/t\nnjsRf2TntImq3QsRnJCs0A==\n-----END PRIVATE KEY-----\n",
};

let adminApp: App;

if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApp();
}

const adminAuth = getAdminAuth(adminApp);

export { adminApp, adminAuth };
