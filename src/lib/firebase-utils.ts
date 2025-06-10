import { User, UserInfo } from 'firebase/auth';

export interface AuthUser extends User {
  // Add any additional user properties here if needed
}

export function mapUserData(user: User | null): AuthUser | null {
  if (!user) return null;
  
  return {
    ...user,
    // Map any additional user properties here
  };
}

export function getStripeRole(): Promise<string | null> {
  return new Promise((resolve) => {
    // This is a placeholder for custom claims check
    // You'll need to implement this based on your requirements
    resolve(null);
  });
}

// Helper to check if user has a specific role
export async function hasRole(user: User, role: string): Promise<boolean> {
  // This is a placeholder for role-based access control
  // You'll need to implement this based on your requirements
  return false;
}

// Format user display name
export function formatDisplayName(user: UserInfo | null): string {
  if (!user) return 'User';
  return user.displayName || user.email?.split('@')[0] || 'User';
}
