import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECURE_KEY,
    },
    async (token, done) => {
      try {
        console.log(token);
        return done(null, token.email);
      } catch (error) {
        return done(error);
      }
    }
  )
);
