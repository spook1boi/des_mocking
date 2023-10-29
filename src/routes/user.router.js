import { Router } from 'express';
import passport from 'passport';
import UserManager from '../dao/UserManager.js';

const userRouter = Router();
const user = new UserManager();

userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body; 
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 400, error: 'Missing data' });
    }
    
    res.redirect("/api/sessions/login");
  } catch (error) {
    res.status(500).send("Error while registering: " + error.message);
  }
});

userRouter.get("/failregister", (req, res) => {
  console.log("Failed Registration Strategy");
  res.send({ error: "Failed" });
});

userRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user) => {
    if (err) {
      return handleLoginError(err, res);
    }
    if (!user) {
      return handleInvalidCredentials(res);
    }
    handleLoginSuccess(req, res, user);
  })(req, res, next);
});

userRouter.get("/faillogin", (req, res) => {
  res.send({ error: "Failed Login" });
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: 'Logout Error', body: error });
    }
    res.redirect('/api/sessions/login');
  });
});

userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {});

userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/api/sessions/login" }), (req, res) => {
  req.session.user = req.user;
  req.session.emailUser = req.session.user.email;
  req.session.rol = req.session.user.rol; 
  res.redirect("/");
});

function handleLoginError(err, res) {
  res.status(500).send("Error while logging in: " + err.message);
}

function handleInvalidCredentials(res) {
  res.status(400).send({ status: "error", error: "Invalid credentials" });
}

function handleLoginSuccess(req, res, user) {
  if (user.rol === 'admin') {
    req.session.emailUser = user.email;
    req.session.firstName = user.first_name;
    req.session.lastName = user.last_name;
    req.session.rolUser = user.rol;
    res.redirect("/api/sessions/profile");
  } else {
    req.session.emailUser = user.email;
    req.session.rolUser = user.rol;
    res.redirect("/");
  }
}

export default userRouter;