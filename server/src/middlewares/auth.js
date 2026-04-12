import { verifyAccessToken } from "../utils/token.js";
import { unauthorizedResponse , forbiddenResponse} from "../utils/responsehandler.js";
import User from "../models/user/user.model.js";

/**
 * Authentication middleware
 * Verifies the access token from the Authorization header
 * and attaches the user object to req.user
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from "Bearer <token>" header or fall back to cookies
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return unauthorizedResponse(res, "Access token is required");
        }

        // Verify the token
        const decoded = verifyAccessToken(token);

        // Find the user and exclude password from the result
        const user = await User.findById(decoded.userId).select("-password -refreshToken");

        if (!user) {
            return unauthorizedResponse(res, "User not found");
        }

        // Attach user to request object for downstream use
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return unauthorizedResponse(res, "Access token has expired");
        }
        if (error.name === "JsonWebTokenError") {
            return unauthorizedResponse(res, "Invalid access token");
        }
        return unauthorizedResponse(res, "Authentication failed");
    }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return unauthorizedResponse(res, "Please login first"); // 401
    }

    // Check role
    if (!roles.includes(req.user.role)) {
      return forbiddenResponse(
        res,
        `Role '${req.user.role}' is not allowed to access this resource`
      ); // 403
    }

    next();
  };
};

export default { authenticate, authorizeRoles };
