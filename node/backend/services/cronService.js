import cron from 'node-cron';
import pool from '../config/db.js';
import { sendEmail } from './emailService.js';

/**
 * Build a beautiful HTML email for task due date reminders
 */
const buildReminderEmail = (userName, tasks) => {
  const taskRows = tasks.map(task => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
        <strong style="color: #1e293b;">${task.task_title}</strong>
        ${task.category ? `<span style="margin-left: 8px; background: #e0f2fe; color: #0369a1; font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${task.category}</span>` : ''}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #dc2626; font-weight: 600;">
        📅 ${new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Due Tomorrow - ScholarDesk</title></head>
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 36px 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">📅 ScholarDesk</h1>
                <p style="margin: 8px 0 0 0; color: #bfdbfe; font-size: 14px;">Smart Productivity Tracking</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px 40px 24px;">
                <h2 style="margin: 0 0 8px 0; color: #1e293b; font-size: 22px; font-weight: 700;">⏰ Heads up, ${userName}!</h2>
                <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                  You have <strong style="color: #dc2626;">${tasks.length} task${tasks.length > 1 ? 's' : ''}</strong> due <strong>tomorrow</strong>. 
                  Make sure you're on track to complete ${tasks.length > 1 ? 'them' : 'it'} in time!
                </p>

                <!-- Task Table -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <thead>
                    <tr style="background: #f8fafc;">
                      <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Task</th>
                      <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>${taskRows}</tbody>
                </table>

                <!-- CTA -->
                <div style="text-align: center; margin-top: 32px;">
                  <a href="http://localhost:5173/tasks" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">
                    View My Tasks →
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                  You're receiving this because task reminders are enabled on your ScholarDesk account.<br>
                  You can disable notifications in <strong>Settings → Notifications</strong>.
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  const text = `Hi ${userName},\n\nYou have ${tasks.length} task(s) due tomorrow:\n\n${tasks.map(t => `- ${t.task_title} (Due: ${new Date(t.due_date).toLocaleDateString()})`).join('\n')}\n\nLog in to ScholarDesk to complete them!\n\nBest,\nScholarDesk`;

  return { html, text };
};

/**
 * Query the DB for tasks due tomorrow and send email reminders
 */
const sendDueDateReminders = async () => {
  console.log('[CronService] Running due-date reminder check...');
  try {
    // Fetch all non-completed tasks due exactly tomorrow, joined with user email
    const [tasksDueTomorrow] = await pool.query(`
      SELECT 
        t.id, t.task_title, t.due_date, t.category,
        u.email, u.name as user_name,
        u.notifications_enabled
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.due_date = CURDATE() + INTERVAL 1 DAY
        AND LOWER(t.status) != 'completed'
        AND u.email IS NOT NULL
        AND u.notifications_enabled = 1
      ORDER BY u.id, t.due_date ASC
    `);

    if (tasksDueTomorrow.length === 0) {
      console.log('[CronService] No tasks due tomorrow. No emails sent.');
      return;
    }

    // Group tasks by user email
    const userTaskMap = {};
    for (const row of tasksDueTomorrow) {
      if (!userTaskMap[row.email]) {
        userTaskMap[row.email] = { name: row.user_name, tasks: [] };
      }
      userTaskMap[row.email].tasks.push(row);
    }

    // Send one email per user with all their tasks
    for (const [email, { name, tasks }] of Object.entries(userTaskMap)) {
      const { html, text } = buildReminderEmail(name, tasks);
      await sendEmail(
        email,
        `⏰ Reminder: You have ${tasks.length} task${tasks.length > 1 ? 's' : ''} due tomorrow!`,
        text,
        html
      );
    }

    console.log(`[CronService] Sent reminders to ${Object.keys(userTaskMap).length} user(s).`);
  } catch (error) {
    console.error('[CronService] Error during reminder check:', error.message);
  }
};

/**
 * Initialize cron jobs — call this from server.js
 */
export const initCronJobs = () => {
  // Run every day at 8:00 AM server time
  cron.schedule('0 8 * * *', () => {
    sendDueDateReminders();
  }, {
    timezone: 'Asia/Kolkata'  // IST timezone
  });

  console.log('[CronService] ✅ Due-date reminder cron job scheduled (runs daily at 8:00 AM IST).');
};
