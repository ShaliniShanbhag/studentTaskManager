import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../config/db.js";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateTaskBreakdown = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { userId } = req.body;

        // Verify task exists and belongs to the user
        const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        const task = tasks[0];

        // Format system instructions prompt
        const prompt = `
            As an expert academic AI study assistant, help a student break down their task into highly structured sub-tasks.
            Task Title: ${task.task_title}
            Task Description: ${task.description || "No description provided"}
            Category/Course: ${task.category || "General"}

            Please break down this task into exactly 4 to 6 actionable academic sub-tasks.
            For each sub-task, provide:
            1. An actionable step title (be specific and detailed).
            2. An estimated time commitment in MINUTES (e.g., 30, 45, 60, 90, 120).

            Also provide:
            - A brief, tailored "success strategy" tip for this task.
            - Total estimated effort level ("low", "medium", "high").

            Format the response strictly as a single JSON object. DO NOT wrap it in markdown block quotes or HTML. The JSON must match this structure exactly:
            {
                "subtasks": [
                    { "title": "Sub-task 1 Title", "estimated_time": 45 },
                    { "title": "Sub-task 2 Title", "estimated_time": 60 }
                ],
                "tips": "Tailored success strategy...",
                "estimatedTime": "medium"
            }
        `;

        let parsedData = null;

        if (process.env.GEMINI_API_KEY) {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            
            try {
                // Extract JSON block in case markdown blocks are present
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse Gemini JSON output:", text);
            }
        }

        // Fallback or Mock data in case API key is missing or parsing failed
        if (!parsedData) {
            parsedData = {
                subtasks: [
                    { title: "Perform initial planning & background literature review", estimated_time: 45 },
                    { title: "Draft structural outline & select key reference materials", estimated_time: 30 },
                    { title: "Write primary draft & expand core content sections", estimated_time: 120 },
                    { title: "Proofread structural arguments & refine formatting", estimated_time: 45 }
                ],
                tips: "Break this task into dedicated 25-minute Pomodoro study sessions. Take short breaks to maintain peak analytical cognitive performance.",
                estimatedTime: "medium"
            };
        }

        // --- AUTOMATED SCHEDULING ALGORITHM ---
        // Distribute the sub-tasks evenly between Today and the parent Task's Due Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let datesArray = [];
        if (task.due_date) {
            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);

            // Compute total days between today and due date
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            const numSubtasks = parsedData.subtasks.length;

            if (diffDays === 0) {
                // Task is due today, all subtasks scheduled for today
                datesArray = Array(numSubtasks).fill(today);
            } else {
                // Spreading sub-tasks evenly
                for (let i = 0; i < numSubtasks; i++) {
                    // Linearly space the subtasks
                    const fraction = i / (numSubtasks - 1 || 1);
                    const offsetDays = Math.round(fraction * diffDays);
                    
                    const scheduledDate = new Date(today);
                    scheduledDate.setDate(today.getDate() + offsetDays);
                    datesArray.push(scheduledDate);
                }
            }
        } else {
            // No due date, schedule everything for today
            datesArray = Array(parsedData.subtasks.length).fill(today);
        }

        // Delete existing uncompleted subtasks if regenerating
        await pool.query("DELETE FROM sub_tasks WHERE task_id = ?", [taskId]);

        // Insert new sub-tasks into database
        const insertedSubtasks = [];
        for (let i = 0; i < parsedData.subtasks.length; i++) {
            const subtask = parsedData.subtasks[i];
            const scheduleDateStr = datesArray[i].toISOString().split('T')[0];

            const [result] = await pool.query(
                "INSERT INTO sub_tasks (task_id, title, estimated_time, actual_time, is_completed, schedule_date) VALUES (?, ?, ?, 0, 0, ?)",
                [taskId, subtask.title, subtask.estimated_time, scheduleDateStr]
            );

            insertedSubtasks.push({
                id: result.insertId,
                task_id: parseInt(taskId),
                title: subtask.title,
                estimated_time: subtask.estimated_time,
                actual_time: 0,
                is_completed: 0,
                schedule_date: scheduleDateStr
            });
        }

        res.status(200).json({
            success: true,
            message: "Subtasks generated and scheduled successfully!",
            subtasks: insertedSubtasks,
            tips: parsedData.tips,
            estimatedTime: parsedData.estimatedTime
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ success: false, message: "AI breakdown scheduler is currently unavailable." });
    }
};

export const assistTask = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Task title is required for AI assistance" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            As an expert academic AI assistant, help a student with the following task:
            Title: ${title}
            Description: ${description || "No description provided"}
            Category: ${category || "General"}

            Provide:
            1. A breakdown of 5 actionable sub-tasks.
            2. A brief 'Success Strategy' tip for this specific type of task.
            3. Estimated time commitment (low, medium, high).

            Format the response as JSON with the following structure:
            {
                "breakdown": ["subtask 1", "subtask 2", ...],
                "tips": "strategy tip here",
                "estimatedTime": "low/medium/high"
            }
        `;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({
                success: true,
                suggestions: {
                    breakdown: [
                        "Initial research and data collection",
                        "Outline the key arguments or components",
                        "Draft the first version",
                        "Review and refine against requirements",
                        "Final submission check"
                    ],
                    tips: "Break this task into 25-minute Pomodoro sessions to maintain focus. Ensure you have all necessary materials ready before starting.",
                    strategy: "Since this is a " + (category || "general") + " task, prioritize clarity and accuracy. Good luck!"
                }
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonData = jsonMatch ? JSON.parse(jsonMatch[0]) : { breakdown: [], tips: text };

        res.status(200).json({
            success: true,
            suggestions: jsonData
        });

    } catch (error) {
        console.error("AI Assist Error:", error);
        res.status(500).json({ success: false, message: "AI Assistant is currently unavailable" });
    }
};
