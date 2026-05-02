import pool from "../config/db.js";

// @desc    Add a new task
// @route   POST /api/task/add
export const addTask = async (req, res) => {
    try {
        // the userId is appended by the authMiddleware
        const { userId, title, description, status, due_date } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Task title is required" });
        }

        // We use the exact column names: user_id, task_title, description, status, due_date
        const [result] = await pool.query(
            "INSERT INTO tasks (user_id, task_title, description, status, due_date) VALUES (?, ?, ?, ?, ?)",
            [userId, title, description || null, status || 'pending', due_date || null]
        );

        res.status(201).json({
            success: true,
            message: "Task added successfully",
            taskId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while adding the task" });
    }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/task/get
export const getTasks = async (req, res) => {
    try {
        const { userId } = req.body;

        const [tasks] = await pool.query("SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC", [userId]);

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while fetching tasks" });
    }
};

// @desc    Update an existing task
// @route   PUT /api/task/update/:id
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, title, description, status, due_date } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Task title is required" });
        }

        const [result] = await pool.query(
            "UPDATE tasks SET task_title = ?, description = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?",
            [title, description || null, status || 'pending', due_date || null, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized to update" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while updating the task" });
    }
};

// @desc    Delete a task
// @route   DELETE /api/task/delete/:id
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const [result] = await pool.query(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized to delete" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while deleting the task" });
    }
};
