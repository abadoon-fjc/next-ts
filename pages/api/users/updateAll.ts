import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function updateAll(req: NextApiRequest, res: NextApiResponse) {
    const { userId, counter, dailyClicks, totalClicks } = req.body;

    if (!userId || typeof counter === 'undefined' || typeof dailyClicks === 'undefined' || typeof totalClicks === 'undefined') {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        await userRef.set({ counter, todayAmount: dailyClicks, totalAmount: totalClicks }, { merge: true });
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
