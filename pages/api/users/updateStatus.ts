import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function updateStatus(req: NextApiRequest, res: NextApiResponse) {
    const { userId, status } = req.body;

    if (!userId || !status) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        await userRef.set({ status }, { merge: true });
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
