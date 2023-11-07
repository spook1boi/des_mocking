import passport from 'passport';
import local from 'passport-local';
import UserManager from '../dao/UserManager.js';
import { createHash, isValidPassword, generateToken, verifyToken } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { usersModel } from '../db/models/users.model.js';

const LocalStrategy = local.Strategy;
const userManager = new UserManager();

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const initializePassword = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
  
      try {
        const user = await userManager.findEmail(email);
  
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
  
        const hashedPassword = await createHash(password);
  
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword
        };
  
        newUser.rol = "user";

        const result = await userManager.addUser(newUser);
        return done(null, result);
      } catch (error) {
        return done("Error while fetching the user: " + error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userManager.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  const authenticateUser = async (username, password, done) => {
    try {
      const user = await userManager.findEmail(username);

      if (!user) {
        console.log("User does not exist");
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use('login', new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.16ad7325476479bb',
    clientSecret: '2e127e55ef4ff5cb001b4fcbd07d991b5eb64dbf',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userManager.findEmail(profile._json.email);

      if (!user) {
        const newUser = {
          first_name: profile._json.login,
          last_name: "github",
          email: profile._json.email,
          password: "",
          rol: "user"
        };

        const result = await userManager.addUser(newUser);
        done(null, result);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }));

  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'Secret-key'
  }, async (jwt_payload, done) => {
    try {
      const user = await verifyToken(jwt_payload);
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use('current', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'Secret-key'
  }, async (jwt_payload, done) => {
    try {
      const user = generateToken(jwt_payload); 
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};

export default initializePassword;