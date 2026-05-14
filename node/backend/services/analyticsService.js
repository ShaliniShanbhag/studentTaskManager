import { analyticsModel } from '../models/analyticsModel.js';

export const analyticsService = {
    getDashboardData: async (userId) => {
        const summary = await analyticsModel.getSummary(userId);
        const categories = await analyticsModel.getCategoryAnalytics(userId);
        const weekly = await analyticsModel.getWeeklyAnalytics(userId);

        // Calculate productivity percentage
        const total = summary.totalTasks || 0;
        const completed = summary.completedTasks || 0;
        const productivityPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            summary: {
                totalTasks: total,
                completedTasks: completed,
                pendingTasks: summary.pendingTasks || 0,
                overdueTasks: summary.overdueTasks || 0,
                productivityPercentage
            },
            categories,
            weekly
        };
    }
};
