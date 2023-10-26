import passport from 'passport';
import local from 'passport-local';
import UserManager from '../dao/UserManager.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;
const userManager = new UserManager();

const initializePassword = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age, rol } = req.body;

      try {
        const user = await userManager.findEmail({ email: username });

        if (user) {
          console.log("El usuario ya existe");
          return done(null, false);
        }

        const hashedPassword = await createHash(password);

        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword,
          rol
        };

        const result = await userManager.addUser(newUser);
        return done(null, result);
      } catch (error) {
        return done("Error al obtener el usuario: " + error);
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
        console.log("Usuario no existe");
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
          rol: "usuario",
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
};

export default initializePassword;