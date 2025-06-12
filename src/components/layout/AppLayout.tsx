"use client";
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from "@/components/ui/toaster";
import { SearchInput } from '@/components/shared/SearchInput';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="w-full bg-background border-b border-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, description, category..."
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
