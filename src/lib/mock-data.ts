
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
    content: 'Organic gardening is more than just a trend; it’s a commitment to sustainable practices and healthier living. This guide will walk you through the essentials to start your own organic garden, no matter the size of your space.\\n\\nFirst, understand your soil. Healthy soil is the cornerstone of organic gardening. Get a soil test to understand its pH and nutrient levels. Amend your soil with compost and other organic matter to improve its structure and fertility. BioWe offers excellent organic compost to get you started!\\n\\nNext, choose your plants wisely. Opt for native plants or varieties well-suited to your climate. This reduces the need for excessive watering and pest control. Consider companion planting to naturally deter pests and enhance growth. For example, basil planted near tomatoes can repel certain insects and improve tomato flavor.\\n\\nWatering effectively is crucial. Water deeply but infrequently to encourage strong root development. Morning is the best time to water, as it allows leaves to dry during the day, reducing the risk of fungal diseases.\\n\\nFinally, embrace natural pest and disease control. Encourage beneficial insects like ladybugs and lacewings. Use physical barriers or organic sprays like neem oil if pests become a problem. BioWe’s Eco-Friendly Pest Control Spray is a great option. Happy gardening!',
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
    content: 'Every gardener dreams of a profusion of vibrant blooms. The key? The right nutrition. At BioWe, we’ve formulated a range of organic fertilizers to help your flowering plants thrive. Here are our top 5 picks:\\n\\n1. BioWe Organic Bloom Booster: Specially designed to enhance flowering and fruiting. Rich in phosphorus and potassium, it encourages abundant, long-lasting blooms.\\n\\n2. BioWe All-Purpose Plant Food: A balanced fertilizer that supports overall plant health, leading to stronger stems and more resilient flowers. Great for a wide variety of flowering annuals and perennials.\\n\\n3. BioWe Rose & Flower Care: Tailored for roses and other demanding flowering shrubs, this mix promotes brilliant colors and healthy foliage.\\n\\n4. BioWe Liquid Seaweed Extract: A fantastic supplement that provides trace minerals and growth hormones, acting as a biostimulant for impressive floral displays.\\n\\n5. BioWe Bone Meal: A natural source of phosphorus, essential for root development and flower production. Incorporate it into the soil when planting or as a top dressing for established plants.\\n\\nRemember to follow application instructions for each product to achieve the best results. With BioWe, your garden will be the envy of the neighborhood!',
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
    content: 'Living in an apartment or home with limited outdoor space doesn’t mean you have to give up on your gardening dreams. Container gardening offers a fantastic way to cultivate plants on balconies, patios, or even sunny windowsills.\\n\\nChoose the right containers. Ensure they have adequate drainage holes. The size of the container should match the mature size of the plant. Materials vary from terracotta (dries out faster) to plastic (retains moisture longer) and fabric pots (excellent aeration). BioWe offers a range of stylish and functional self-watering planters.\\n\\nUse quality potting mix. Don’t use garden soil in containers, as it compacts easily. BioWe Premium Potting Mix is specifically formulated for container gardening, providing good drainage and aeration while retaining necessary moisture and nutrients.\\n\\nSelect appropriate plants. Many vegetables, herbs, and flowers thrive in containers. Consider dwarf varieties of your favorite plants. Herbs like basil, mint, and rosemary are excellent choices, as are compact tomatoes, peppers, and lettuce. For flowers, try petunias, geraniums, or succulents.\\n\\nWatering and fertilizing. Container plants dry out more quickly than those in the ground, so monitor moisture levels regularly. Fertilize as needed, as nutrients can leach out with watering. BioWe’s liquid fertilizers are easy to apply for container plants.\\n\\nMaximize your space. Use vertical planters, hanging baskets, and tiered shelving to make the most of your small area. With a little creativity, your small space can become a green oasis!',
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
    content: 'Often overlooked, soil is the single most important ingredient for a flourishing garden. Understanding and nurturing your soil’s health will pay dividends in the form of robust plants and bountiful harvests.\\n\\nSoil is a living ecosystem, teeming with microorganisms, fungi, and earthworms that break down organic matter and make nutrients available to plants. Good soil structure allows for proper aeration, drainage, and root penetration.\\n\\nKey components of healthy soil include: Organic Matter (compost, manure, leaf mold), Minerals (sand, silt, clay), and Pore Spaces (for air and water). The ideal soil, often called loam, has a balanced mix of these.\\n\\nHow to improve your soil? Add organic matter regularly. Compost is king! It improves soil structure, water retention, and nutrient content. BioWe’s Premium Potting Mix and Organic Bloom Booster are excellent sources of organic matter for different needs. Avoid tilling excessively, as it can damage soil structure and harm beneficial organisms. Consider cover crops like clover or rye during the off-season to prevent erosion and add organic matter when tilled in.\\n\\nMulching is another great practice. A layer of organic mulch (wood chips, straw, shredded leaves) helps retain moisture, suppress weeds, and regulate soil temperature. As it decomposes, it also adds organic matter to the soil.\\n\\nBy focusing on building healthy soil, you’re creating a sustainable foundation for your garden to thrive for years to come. BioWe is here to support your journey to better soil and better gardening!',
  },
];
