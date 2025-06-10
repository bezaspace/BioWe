import { adminApp } from '../src/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { mockProducts } from '../src/lib/mock-data';

async function seedProducts() {
  const db = getFirestore(adminApp);
  const batch = db.batch();

  for (const product of mockProducts) {
    const { id, ...data } = product;
    const docRef = db.collection('products').doc(id);
    batch.set(docRef, data);
  }

  await batch.commit();
  console.log('Seeded products to Firestore');
}

seedProducts().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
