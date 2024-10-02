import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function addUsername(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        await userRef.set({ name }, { merge: true });
        res.json({ message: 'Username added successfully' });
    } catch (error) {
        console.error('Error adding username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
