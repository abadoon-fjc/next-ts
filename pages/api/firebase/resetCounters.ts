import { db } from '../../../lib/firebase';
import { NextApiRequest, NextApiResponse } from 'next';
import schedule from 'node-schedule';


async function resetCountersInBatches() {
  const batchSize = 500;
  let lastDoc = null;
  let usersSnapshot;

  do {
    let query = db.collection('users').orderBy('id').limit(batchSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    usersSnapshot = await query.get();

    if (!usersSnapshot.empty) {
      const batch = db.batch();
      usersSnapshot.forEach((doc) => {
        const userRef = db.collection('users').doc(doc.id);
        batch.update(userRef, { todayAmount: 0 });
      });
      await batch.commit();
      lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
    }
  } while (usersSnapshot.size === batchSize);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  schedule.scheduleJob('0 0 * * *', async () => {
    try {
      await resetCountersInBatches();
      console.log('All counters reset at 00:00 UTC');
      res.status(200).json({ message: 'Counters reset successfully' });
    } catch (error) {
      console.error('Error resetting counters:', error);
      res.status(500).json({ message: 'Error resetting counters' });
    }
  });
}
