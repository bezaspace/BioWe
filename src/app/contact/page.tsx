import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight text-[#228B22]">Contact Us</h1>
      <p className="text-center text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
        Have questions about our products or need gardening advice? Fill out the form below, and our team will be happy to assist you.
      </p>
      <ContactForm />
    </div>
  );
}
