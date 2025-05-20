export function Footer() {
  return (
    <footer className="bg-muted py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BioBloom Shop. All rights reserved.</p>
        <p className="text-sm mt-1">Your partner in organic gardening.</p>
      </div>
    </footer>
  );
}
