import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "./dotenv.js";
import User from "../models/user/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT,
            clientSecret: env.GOOGLE_SECRET,
            callbackURL: "/api/auth/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // 1. Check if this Google account is already linked
                let user = await User.findOne({ googleId });

                if (user) {
                    return done(null, user);
                }

                // 2. Check if a user with the same email already exists (registered manually)
                user = await User.findOne({ email });

                if (user) {
                    // Link Google account to existing user
                    user.googleId = googleId;
                    await user.save();
                    return done(null, user);
                }

                // 3. Create a new user for first-time Google sign-in
                user = await User.create({
                    name: profile.displayName,
                    email,
                    googleId,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
