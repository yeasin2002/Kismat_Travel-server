import { ENV } from "@config";
import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { User } from "@interfaces/users.interface";
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
      const user = await db.Users.unscoped().findOne({ where: { email } });
      if (user && compare(password, user.password)) return done(null, user.toJSON());
      done(new HttpException(403, "Incorrect email or password"));
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
    scope: ["profile", "email"],
  },
  async (accessToken, _, { displayName, _json, profileUrl }, done) => {
    try {
      const findUser = await db.Users.unscoped().findOne({ where: { email: _json.email } });
      if (findUser) return done(null, findUser.toJSON());

      const newUser = await db.Users.create({ email: _json.email, password: accessToken, name: displayName, photoUrl: profileUrl });
      done(null, newUser.toJSON());
    } catch (error) {
      return done(error);
    }
  },
);

export function serializeUser(user: User, done: (...args: any[]) => void) {
  done(null, user.id);
}

export async function deserializeUser(id: string, done: (...args: any[]) => void) {
  try {
    const User = await db.Users.unscoped().findByPk(id);
    done(null, User.toJSON());
  } catch (error) {
    done(error);
  }
}
