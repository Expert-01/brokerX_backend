import { getUserById } from '../models/getUserModel.js';

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
