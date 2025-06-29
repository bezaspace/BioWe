import { adminApp } from '../src/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { mockBlogPosts } from '../src/lib/mock-data';

async function seedBlogPosts() {
  const db = getFirestore(adminApp);
  const batch = db.batch();

  for (const post of mockBlogPosts) {
    const { id, ...data } = post;
    const docRef = db.collection('blogPosts').doc(id);
    batch.set(docRef, data);
  }

  await batch.commit();
  console.log('Seeded blog posts to Firestore');
}

seedBlogPosts().catch((err) => {
  console.error('Blog seeding failed:', err);
  process.exit(1);
});