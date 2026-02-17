const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey';

module.exports = function(passport) {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new User({ email: profile.emails[0].value, password: '' });
        await user.save();
      }
      // Token JWT می‌سازیم
      user.token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  // GitHub Strategy
  passport.use(new GitHubStrategy({
    clientID: 'GITHUB_CLIENT_ID',
    clientSecret: 'GITHUB_CLIENT_SECRET',
    callbackURL: '/api/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, password: '' });
        await user.save();
      }
      user.token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
