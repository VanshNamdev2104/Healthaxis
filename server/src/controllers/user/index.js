import User from "../../models/user/user.model.js";
import { generateTokens, verifyRefreshToken } from "../../utils/token.js";
import {
    successResponse,
    errorResponse,
    conflictResponse,
    unauthorizedResponse,
    validationError,
} from "../../utils/responsehandler.js";

/**
 * @desc    Register a new user
 * @route   POST /api/user/register
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, number, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return conflictResponse(res, "User with this email already exists");
        }

        // Create the user (password is hashed via pre-save hook)
        const user = await User.create({ name, email, password, number, role });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        return successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
            "User registered successfully",
            201
        );
    } catch (error) {
        return errorResponse(res, error, "Registration failed");
    }
};

/**
 * @desc    Login user
 * @route   POST /api/user/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, number, password } = req.body;

        // Build query to find by either email or number
        const query = {};
        if (email) {
            query.email = email;
        } else if (number) {
            query.number = number;
        } else {
            return validationError(res, "Please provide email or number");
        }

        // Find user
        const user = await User.findOne(query);
        if (!user) {
            return unauthorizedResponse(res, "Invalid credentials");
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return unauthorizedResponse(res, "Invalid credentials");
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        return successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
            "Login successful"
        );
    } catch (error) {
        return errorResponse(res, error, "Login failed");
    }
};

/**
 * @desc    Logout user (invalidate refresh token)
 * @route   POST /api/user/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // Clear the refresh token from DB
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

        return successResponse(res, null, "Logged out successfully");
    } catch (error) {
        return errorResponse(res, error, "Logout failed");
    }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/user/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return validationError(res, "Refresh token is required");
        }

        // Verify the refresh token
        const decoded = verifyRefreshToken(token);

        // Find the user and check if the refresh token matches
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            return unauthorizedResponse(res, "Invalid refresh token");
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Update refresh token in DB
        user.refreshToken = newRefreshToken;
        await user.save();

        return successResponse(
            res,
            { accessToken, refreshToken: newRefreshToken },
            "Token refreshed successfully"
        );
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return unauthorizedResponse(res, "Refresh token has expired, please login again");
        }
        return unauthorizedResponse(res, "Invalid refresh token");
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        return successResponse(res, { user: req.user }, "Profile fetched successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch profile");
    }
};

/**
 * @desc    Update user profile (name, email)
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, email, number } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (number) updates.number = number;

        // If email is being changed, check for duplicates
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return conflictResponse(res, "Email is already in use");
            }
            updates.email = email;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        return successResponse(res, { user: updatedUser }, "Profile updated successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to update profile");
    }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/user/account
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);

        return successResponse(res, null, "Account deleted successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to delete account");
    }
};
