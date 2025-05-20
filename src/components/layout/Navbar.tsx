
"use client";

import Link from 'next/link';
import { Leaf, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { getCartItemCount } = useCart();
  const pathname = usePathname();
  const cartItemCount = getCartItemCount();

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
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#228B22]" />
            <span className="text-2xl font-bold text-[#228B22]">BioWe</span>
          </Link>
          
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

          <div className="flex items-center">
             <Link href="/cart" className="relative flex items-center text-foreground hover:text-primary transition-colors p-2">
              <ShoppingBag className="h-7 w-7" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">View shopping cart</span>
            </Link>
            {/* Mobile menu button can be added here if needed later */}
          </div>
        </div>
      </nav>
    </header>
  );
}
