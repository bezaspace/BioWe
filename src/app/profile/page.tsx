'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Save, Mail, Phone, Home, MapPin, MapPinIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    phoneNumber: '',
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India', // Default country
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Load from localStorage first
      const savedProfile = localStorage.getItem('bioWeUserProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          if (parsedProfile.uid === user.uid) {
            setProfile(parsedProfile);
            return;
          }
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }
      
      // Fallback to user auth data
      setProfile(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL,
      }));
      
      // TODO: Load additional profile data from Firestore
      // This would be implemented when you set up Firestore
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('shippingAddress.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress!,
          [field]: value,
        },
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save profile data to localStorage for now
      // In a real app, this would be saved to Firestore
      const profileData = {
        ...profile,
        uid: user?.uid,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('bioWeUserProfile', JSON.stringify(profileData));
      
      // TODO: Save profile data to Firestore
      // This would be implemented when you set up Firestore
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          <p className="text-muted-foreground">You need to be signed in to access this page.</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Picture and Basic Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader className="items-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback>
                      {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5">
                    <User className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold">{profile.displayName}</h2>
                  <p className="text-muted-foreground text-sm">{profile.email}</p>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information and shipping address.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Full Name</Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          value={profile.displayName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex">
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-muted/50"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Contact support to change your email
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={profile.phoneNumber || ''}
                        onChange={handleInputChange}
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingAddress.fullName">Full Name</Label>
                        <Input
                          id="shippingAddress.fullName"
                          name="shippingAddress.fullName"
                          value={profile.shippingAddress?.fullName || ''}
                          onChange={handleInputChange}
                          placeholder="Recipient's full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shippingAddress.addressLine1">Address Line 1</Label>
                        <Input
                          id="shippingAddress.addressLine1"
                          name="shippingAddress.addressLine1"
                          value={profile.shippingAddress?.addressLine1 || ''}
                          onChange={handleInputChange}
                          placeholder="House/Flat no, Building name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shippingAddress.addressLine2">Address Line 2 (Optional)</Label>
                        <Input
                          id="shippingAddress.addressLine2"
                          name="shippingAddress.addressLine2"
                          value={profile.shippingAddress?.addressLine2 || ''}
                          onChange={handleInputChange}
                          placeholder="Area, Street, Sector, Village"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shippingAddress.city">City</Label>
                          <Input
                            id="shippingAddress.city"
                            name="shippingAddress.city"
                            value={profile.shippingAddress?.city || ''}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shippingAddress.state">State</Label>
                          <Input
                            id="shippingAddress.state"
                            name="shippingAddress.state"
                            value={profile.shippingAddress?.state || ''}
                            onChange={handleInputChange}
                            placeholder="State"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shippingAddress.postalCode">Postal Code</Label>
                          <Input
                            id="shippingAddress.postalCode"
                            name="shippingAddress.postalCode"
                            value={profile.shippingAddress?.postalCode || ''}
                            onChange={handleInputChange}
                            placeholder="PIN code"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shippingAddress.country">Country</Label>
                          <Input
                            id="shippingAddress.country"
                            name="shippingAddress.country"
                            value={profile.shippingAddress?.country || 'India'}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
