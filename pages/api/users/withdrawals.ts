import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function getWithdrawals(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const withdrawalsRef = db.collection('users').doc(userId.toString()).collection('withdrawals');
        const withdrawalsSnap = await withdrawalsRef.get();

        const withdrawals = withdrawalsSnap.docs.map(doc => doc.data());
        res.json(withdrawals);
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
