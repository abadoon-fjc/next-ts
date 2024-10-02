import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function getUserData(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid userId' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        const doc = await userRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = doc.data();
        res.json({
            status: userData?.status || '',
            counter: userData?.counter || 0,
            totalClicks: userData?.totalAmount || 0,
            wallet: userData?.wallet || ''
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
