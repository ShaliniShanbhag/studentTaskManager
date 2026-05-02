package servlets;

import db.DBConnection;
import utils.PasswordUtils;
import utils.ResponseUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Map<String, Object> result = new HashMap<>();

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            result.put("error", "Email and password are required.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_BAD_REQUEST, result);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT id, password FROM users WHERE email = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, email);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        int userId = rs.getInt("id");
                        String hashedPassword = rs.getString("password");
                        
                        if (PasswordUtils.checkPassword(password, hashedPassword)) {
                            // Valid credentials, create session
                            HttpSession session = request.getSession(true);
                            session.setAttribute("user_id", userId);
                            
                            result.put("message", "Login successful");
                            result.put("user_id", userId);
                            ResponseUtils.sendJson(response, HttpServletResponse.SC_OK, result);
                        } else {
                            result.put("error", "Invalid email or password.");
                            ResponseUtils.sendJson(response, HttpServletResponse.SC_UNAUTHORIZED, result);
                        }
                    } else {
                        result.put("error", "Invalid email or password.");
                        ResponseUtils.sendJson(response, HttpServletResponse.SC_UNAUTHORIZED, result);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            result.put("error", "Database error occurred.");
            ResponseUtils.sendJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, result);
        }
    }
}
