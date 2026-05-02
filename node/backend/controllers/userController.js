import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// Helper to create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

// @desc    Register a new user
// @route   POST /api/user/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validations
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const newUserId = result.insertId;
        const token = createToken(newUserId);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUserId,
                name,
                email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// @desc    Authenticate user
// @route   POST /api/user/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validations
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        // Check if user exists
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = users[0];

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user.id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};
