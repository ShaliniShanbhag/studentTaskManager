import pool from '../config/db.js';

export const analyticsModel = {
    getSummary: async (userId) => {
        const query = `
            SELECT 
                COUNT(*) as totalTasks,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completedTasks,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingTasks,
                SUM(CASE WHEN due_date < CURDATE() AND status != 'Completed' THEN 1 ELSE 0 END) as overdueTasks
            FROM tasks
            WHERE user_id = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows[0];
    },

    getCategoryAnalytics: async (userId) => {
        const query = `
            SELECT 
                category as name,
                COUNT(*) as value,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
            FROM tasks
            WHERE user_id = ?
            GROUP BY category
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    },

    getWeeklyAnalytics: async (userId) => {
        // Fetch tasks that were due in the last 7 days or upcoming in the next 7 days, 
        // to show a trend. But the requirement says "last 7 days".
        const query = `
            SELECT 
                DATE_FORMAT(due_date, '%b %d') as date,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
            FROM tasks
            WHERE user_id = ? 
              AND due_date IS NOT NULL
              AND due_date >= CURDATE() - INTERVAL 7 DAY
              AND due_date <= CURDATE()
            GROUP BY due_date
            ORDER BY due_date ASC
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    }
};
