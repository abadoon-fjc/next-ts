import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function getUserDataTask(req: NextApiRequest, res: NextApiResponse) {
    const { userId, taskId } = req.query;

    if (!userId || !taskId) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const taskRef = db.collection('users').doc(userId.toString()).collection('tasks').doc(taskId.toString());
        const taskDoc = await taskRef.get();

        if (taskDoc.exists) {
            res.json(taskDoc.data());
        } else {
            res.json({ status: 'not_completed' });
        }
    } catch (error) {
        console.error('Error fetching task data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
