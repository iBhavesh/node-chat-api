import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
config();

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECURE_KEY,
    },
    async (token, done) => {
      try {
        if (token.type !== "ACCESS_TOKEN") throw new Error("Invalid JWT");
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  "media",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECURE_KEY,
    },
    async (token, done) => {
      try {
        if (token.type !== "MEDIA_TOKEN") throw new Error("Invalid JWT");
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
