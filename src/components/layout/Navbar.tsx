"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, Search as SearchIcon, User } from 'lucide-react';
import { useSearch } from '@/lib/search';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/context/auth/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar() {
  const { getCartItemCount } = useCart();
  const { user, loading } = useAuth();
  
  // Debug logs
  console.log('Navbar - Auth State:', { user, loading });
  const pathname = usePathname();
  const cartItemCount = getCartItemCount();
  const [isOpen, setIsOpen] = useState(false);
  const { search, setSearch } = useSearch();
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearch(query);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const getIsActive = (currentPathname: string, linkHref: string): boolean => {
    if (linkHref === '/') {
      return currentPathname === '/';
    }
    // For other links like /products, /blog, /about
    // Check for exact match or if it's a parent route of the current path
    if (currentPathname === linkHref) {
      return true;
    }
    // Check for child routes, e.g. /products/item1 for link /products or /blog/post-slug for link /blog
    if (currentPathname.startsWith(`${linkHref}/`)) {
      return true;
    }
    return false;
  };

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <Image 
              src="/images/products/Biowe logo.png"
              alt="BioWe Logo"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </Link>
          
          {/* Desktop Search and Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg hover:text-primary transition-colors",
                  getIsActive(pathname, link.href)
                    ? "text-primary font-semibold" 
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <div className="flex items-center space-x-2">
                {user ? (
                  <UserMenu />
                ) : (
                  <LoginModal />
                )}
              </div>
            )}
            <Link href="/cart" className="relative flex items-center text-foreground hover:text-primary transition-colors p-2">
              <ShoppingBag className="h-7 w-7" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">View shopping cart</span>
            </Link>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-foreground hover:text-primary transition-colors">
                    <Menu className="h-7 w-7" />
                    <span className="sr-only">Open menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6">
                    <div className="px-4">
                    </div>
                    <div className="flex flex-col space-y-4">
                      {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-lg hover:text-primary transition-colors px-4 py-2 rounded-md",
                          getIsActive(pathname, link.href)
                            ? "text-primary font-semibold bg-primary/10" 
                            : "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
