import { NextApiRequest, NextApiResponse } from 'next';
import { db, admin } from '../../../lib/firebase';

export default async function checkReferralCode(req: NextApiRequest, res: NextApiResponse) {
    const { userId, referralCode } = req.body;

    if (!userId || !referralCode) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(userId.toString());
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ result: 'codeNotFound' });
        }

        const referralCollection = userRef.collection('referallCodes');
        const referralDoc = await referralCollection.doc(referralCode.toString()).get();

        if (referralDoc.exists) {
            return res.json({ result: 'codeAlreadyUsed' });
        }

        const referrerRef = db.collection('users').doc(referralCode.toString());
        const referrerDoc = await referrerRef.get();

        if (!referrerDoc.exists) {
            return res.status(404).json({ result: 'codeNotFound' });
        }

        const batch = db.batch();

        batch.set(referralCollection.doc(referralCode.toString()), {
            usedAt: new Date().toISOString()
        });

        batch.update(userRef, {
            counter: admin.firestore.FieldValue.increment(100),
            totalAmount: admin.firestore.FieldValue.increment(100)
        });

        batch.update(referrerRef, {
            counter: admin.firestore.FieldValue.increment(100),
            totalAmount: admin.firestore.FieldValue.increment(100),
            referalAmount: admin.firestore.FieldValue.increment(1)
        });

        await batch.commit();

        res.json({ result: 'codeActivated' });
    } catch (error) {
        console.error('Error processing referral code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

console.log("good")
