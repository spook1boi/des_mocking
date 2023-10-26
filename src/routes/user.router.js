import { Router } from 'express';
import passport from 'passport';
import UserManager from '../dao/UserManager.js';

const userRouter = Router();
const user = new UserManager();

userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 400, error: 'Faltan datos' });
    }
    res.redirect("/api/sessions/login");
  } catch (error) {
    res.status(500).send("Error al registrar: " + error.message);
  }
});

userRouter.get("/failregister", (req, res) => {
  console.log("Failed Strategy");
  res.send({ error: "Failed" });
});

userRouter.post("/login", (req, res, next) => {passport.authenticate("login", (err, user) => {
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
  req.session.emailUsuario = req.session.user.email;
  req.session.rolUsuario = req.session.user.rol;
  res.redirect("/");
});

function handleLoginError(err, res) {
  res.status(500).send("Error al iniciar sesión: " + err.message);
}

function handleInvalidCredentials(res) {
  res.status(400).send({ status: "error", error: "Credenciales inválidas" });
}

function handleLoginSuccess(req, res, user) {
  if (user.rol === 'admin') {
    req.session.emailUsuario = user.email;
    req.session.nomUsuario = user.first_name;
    req.session.apeUsuario = user.last_name;
    req.session.rolUsuario = user.rol;
    res.redirect("/api/sessions/profile");
  } else {
    req.session.emailUsuario = user.email;
    req.session.rolUsuario = user.rol;
    res.redirect("/");
  }
}

export default userRouter;