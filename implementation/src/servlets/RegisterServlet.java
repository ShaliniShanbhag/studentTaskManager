package servlets;

import db.DBConnection;
import utils.PasswordUtils;
import utils.ResponseUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Map<String, String> result = new HashMap<>();

        if (name == null || email == null || password == null || name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            result.put("error", "Name, email, and password are required.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, result);
            return;
        }

        String hashedPassword = PasswordUtils.hashPassword(password);

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, name);
                stmt.setString(2, email);
                stmt.setString(3, hashedPassword);
                
                int rowsInserted = stmt.executeUpdate();
                if (rowsInserted > 0) {
                    result.put("message", "User registered successfully");
                    ResponseUtils.sendJson(response, HttpServletResponse.SC_CREATED, result);
                } else {
                    result.put("error", "Failed to register user");
                    ResponseUtils.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, result);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            if (e.getErrorCode() == 1062) { // MySQL Duplicate entry error code
                result.put("error", "Email already exists.");
                ResponseUtils.sendJson(response, HttpServletResponse.SC_CONFLICT, result);
            } else {
                result.put("error", "Database error occurred.");
                ResponseUtils.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, result);
            }
        }
    }
}
