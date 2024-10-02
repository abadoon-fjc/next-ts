import { v4 as uuidv4 } from 'uuid';
import { db, admin } from '../../../lib/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, amount, walletAddress } = req.body;

  if (!userId || amount <= 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const userRef = db.collection('users').doc(userId.toString());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentCounter = userDoc.data()?.counter ?? 0;

    if (amount > currentCounter) {
      return res.status(400).json({ message: 'You do not have that many ABA-coins, bro' });
    }

    const newCounter = currentCounter - amount;
    await userRef.set({ counter: newCounter }, { merge: true });

    const transactionId = uuidv4();
    const transactionRef = db.collection('transactions').doc(transactionId);
    await transactionRef.set({
      walletAddress,
      amount,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    const withdrawalRef = userRef.collection('withdrawals').doc(transactionId);
    await withdrawalRef.set({
      amount,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Counter updated successfully', newCounter, transactionId });
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
