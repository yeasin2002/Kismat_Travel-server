import { ENV } from "@config";
import { db } from "@db";
import { compare } from "@utils/encryption";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

export const PassportLocalStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await db.Users.findOne({ where: { email } });
      if (!user) return done(null, false, { message: "Incorrect email" });
      if (compare(password, user.password)) return done(null, user.toJSON());
      return done(null, false, { message: "Incorrect password" });
    } catch (error) {
      return done(error);
    }
  },
);

export const PassportGoogleStrategy = new GoogleStrategy(
  {
    clientID: ENV.GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    callbackURL: ENV.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, _, profile, done) => {
    try {
      const { email } = profile._json;

      const findUser = await db.Users.unscoped().findOne({ where: { email } });
      if (findUser) return done(null, findUser.toJSON());

      const newUser = await db.Users.create({ email, password: accessToken });
      done(null, newUser.toJSON());
    } catch (error) {
      return done(error);
    }
  },
);
