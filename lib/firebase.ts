import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('aba-coin-firebase-adminsdk-t5d7s-a7654e53fb.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export { db, admin };
