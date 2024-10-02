import { NextApiRequest, NextApiResponse } from 'next';
import { db, admin } from '../../../lib/firebase';

export default async function updateTaskAndCounters(req: NextApiRequest, res: NextApiResponse) {
    const { userId, taskId, status, timestamp, counterIncrement, totalIncrement } = req.body;

    if (!userId || !taskId || !status || !timestamp || typeof counterIncrement === 'undefined' || typeof totalIncrement === 'undefined') {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const taskRef = db.collection('users').doc(userId.toString()).collection('tasks').doc(taskId);
        const userRef = db.collection('users').doc(userId.toString());

        const batch = db.batch();
        batch.set(taskRef, { status, timestamp }, { merge: true });
        batch.update(userRef, {
            counter: admin.firestore.FieldValue.increment(counterIncrement),
            totalAmount: admin.firestore.FieldValue.increment(totalIncrement),
        });

        await batch.commit();

        res.json({ message: 'Task and counters updated successfully' });
    } catch (error) {
        console.error('Error updating task and counters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
