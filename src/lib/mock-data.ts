
import type { Product, BlogPost } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Bloom Booster',
    description: 'A potent fertilizer to enhance flowering and fruiting in your plants. Made with all-natural ingredients.',
    price: 19.99,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Bag of Organic Bloom Booster fertilizer',
    category: 'Fertilizers',
    dataAiHint: 'fertilizer bag'
  },
  {
    id: '2',
    name: 'Premium Potting Mix',
    description: 'Enriched soil blend perfect for indoor and outdoor container gardening. Promotes healthy root growth.',
    price: 12.50,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Bag of Premium Potting Mix',
    category: 'Soils & Mixes',
    dataAiHint: 'soil bag'
  },
  {
    id: '3',
    name: 'Gardening Gloves - Heavy Duty',
    description: 'Durable and comfortable gloves to protect your hands while gardening. Thorn-proof and water-resistant.',
    price: 9.75,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Pair of heavy-duty gardening gloves',
    category: 'Tools & Accessories',
    dataAiHint: 'gardening gloves'
  },
  {
    id: '4',
    name: 'Eco-Friendly Pest Control Spray',
    description: 'Safely protect your plants from common pests without harmful chemicals. Safe for pets and pollinators.',
    price: 15.00,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Bottle of eco-friendly pest control spray',
    category: 'Pest Control',
    dataAiHint: 'spray bottle'
  },
  {
    id: '5',
    name: 'Heirloom Tomato Seeds',
    description: 'A variety pack of heirloom tomato seeds for a delicious and colorful harvest. Non-GMO.',
    price: 4.99,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Packet of heirloom tomato seeds',
    category: 'Seeds',
    dataAiHint: 'seeds packet'
  },
  {
    id: '6',
    name: 'Self-Watering Planter Pot',
    description: 'Stylish and functional self-watering pot, ideal for busy plant parents. Keeps soil moist for days.',
    price: 24.99,
    imageSrc: 'https://placehold.co/600x400.png',
    imageAlt: 'Self-watering planter pot',
    category: 'Pots & Planters',
    dataAiHint: 'plant pot'
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started-with-organic-gardening',
    title: 'Getting Started with Organic Gardening: A Beginner\'s Guide',
    excerpt: 'Discover the joys of organic gardening! This guide covers the basics, from soil preparation to choosing the right plants for your eco-friendly garden.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Lush organic vegetable garden',
    dataAiHint: 'organic garden',
    date: '2024-05-15T10:00:00Z',
    author: 'Jane GreenThumb',
  },
  {
    id: '2',
    slug: 'top-5-fertilizers-for-vibrant-blooms',
    title: 'Top 5 BioWe Fertilizers for Vibrant Blooms',
    excerpt: 'Unlock the secret to stunning flowers with our top-rated organic fertilizers. Learn which BioWe product is perfect for your blooming beauties.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Colorful flowers blooming in a garden',
    dataAiHint: 'colorful flowers',
    date: '2024-05-22T14:30:00Z',
    author: 'Alex Roots',
  },
  {
    id: '3',
    slug: 'container-gardening-tips-for-small-spaces',
    title: 'Container Gardening Magic: Tips for Small Spaces',
    excerpt: 'No backyard? No problem! Explore creative container gardening ideas to grow your own food and flowers, even on a balcony or patio.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Assortment of plants in pots on a balcony',
    dataAiHint: 'balcony garden',
    date: '2024-06-01T09:15:00Z',
    author: 'Sarah Sprouts',
  },
    {
    id: '4',
    slug: 'understanding-soil-health',
    title: 'The Dirt on Soil: Understanding Soil Health for a Thriving Garden',
    excerpt: 'Healthy soil is the foundation of a successful garden. Learn about soil composition, amendments, and how BioWe products can help improve your soil structure.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Close up of rich, dark garden soil',
    dataAiHint: 'garden soil',
    date: '2024-06-10T11:00:00Z',
    author: 'Mike Gardener',
  },
];
