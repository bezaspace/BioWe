const { adminApp } = require('../src/firebase/admin');
const { getFirestore } = require('firebase-admin/firestore');
const { mockBlogPosts } = require('../src/lib/mock-data');

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
