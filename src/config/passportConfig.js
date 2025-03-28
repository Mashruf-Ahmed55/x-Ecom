import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy } from 'passport-jwt';
import userModel from '../models/user.model.js';
import generateGmail from '../utils/generateAutoEmail.js';
import { generateAccessTokenAndRefreshToken } from '../utils/generateToken.js';
import { envConfig } from './envConfig.js';

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
};
const passportConfig_jwt = passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: envConfig.jwtSecret_accessToken,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id).select('-password');
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.error('Error authenticating user:', error);
        return done(error, false);
      }
    }
  )
);

const passportConfig_github = passport.use(
  new GitHubStrategy(
    {
      clientID: envConfig.github_client_id,
      clientSecret: envConfig.github_client_secret,
      callbackURL: 'http://127.0.0.1:8080/api/v1/users/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ githubId: profile.id });
        const autoGenerateEmail = generateGmail(profile.username);
        console.log(autoGenerateEmail);
        if (!user) {
          const password = profile.username + profile.id.toString().slice(-8);
          const hasedPassword = await bcrypt.hash(password, 10);
          console.log(hasedPassword, profile._json.email);
          user = await userModel.create({
            firstName: profile.username,
            lastName: profile.username,
            email: profile._json.email || autoGenerateEmail,
            password: hasedPassword,
            providerId: profile.id,
            provider: profile.provider,
            avatar: profile._json.avatar_url,
            profile_url_id: profile.profileUrl,
          });
        }

        const { accessToken, refreshToken } =
          await generateAccessTokenAndRefreshToken(user.id);

        return done(null, { user, accessToken, refreshToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const passport_google = passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.google_client_id,
      clientSecret: envConfig.google_client_secret,
      callbackURL: 'http://127.0.0.1:8080/api/v1/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
          const password = profile.username + profile.id.toString().slice(-8);
          const hasedPassword = await bcrypt.hash(password, 10);
          const autoGenerateEmail = generateGmail(profile.displayName);
          user = await userModel.create({
            firstName: profile.displayName,
            lastName: profile.displayName,
            email: profile._json.email || autoGenerateEmail,
            password: hasedPassword,
            providerId: profile.id,
            provider: profile.provider,
            avatar: profile._json.picture,
            profile_url_id: profile._json.sub,
          });
        }

        const { accessToken, refreshToken } =
          await generateAccessTokenAndRefreshToken(user.id);

        return cb(null, { user, accessToken, refreshToken });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

export { passport_google, passportConfig_github, passportConfig_jwt };
