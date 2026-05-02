package servlets;

import db.DBConnection;
import utils.ResponseUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/addTask")
public class AddTaskServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Map<String, String> result = new HashMap<>();

        if (session == null || session.getAttribute("user_id") == null) {
            result.put("error", "Unauthorized. Please login first.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_UNAUTHORIZED, result);
            return;
        }

        int userId = (int) session.getAttribute("user_id");
        String taskTitle = request.getParameter("task_title");
        String description = request.getParameter("description");
        String dueDateStr = request.getParameter("due_date");

        if (taskTitle == null || taskTitle.isEmpty()) {
            result.put("error", "Task title is required.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, result);
            return;
        }

        Date dueDate = null;
        if (dueDateStr != null && !dueDateStr.isEmpty()) {
            try {
                dueDate = Date.valueOf(dueDateStr); // Format must be yyyy-[m]m-[d]d
            } catch (IllegalArgumentException e) {
                result.put("error", "Invalid date format. Use YYYY-MM-DD.");
                ResponseUtils.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, result);
                return;
            }
        }

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO tasks (user_id, task_title, description, due_date) VALUES (?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, userId);
                stmt.setString(2, taskTitle);
                stmt.setString(3, description);
                stmt.setDate(4, dueDate); // can be null
                
                int rowsInserted = stmt.executeUpdate();
                if (rowsInserted > 0) {
                    result.put("message", "Task added successfully");
                    ResponseUtils.sendJson(response, HttpServletResponse.SC_CREATED, result);
                } else {
                    result.put("error", "Failed to add task");
                    ResponseUtils.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, result);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            result.put("error", "Database error occurred.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, result);
        }
    }
}
