import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function updateWalletData(req: NextApiRequest, res: NextApiResponse) {
    const { userId, wallet, walletAddress } = req.body;

    if (!userId || !wallet || !walletAddress) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        await userRef.set({ wallet, walletAddress }, { merge: true });
        res.json({ message: 'Wallet data updated successfully' });
    } catch (error) {
        console.error('Error updating wallet data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
