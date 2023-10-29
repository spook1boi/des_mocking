import { Router } from 'express';
import passport from 'passport';
import UserManager from '../dao/UserManager.js';

const userRouter = Router();
const userManager = new UserManager();

userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 400, error: 'Missing data' });
    }
    
    const defaultRole = 'usuario';

    const userToRegister = {
      first_name,
      last_name,
      email,
      age,
      password,
      rol: rol || defaultRole, 
    };

    const result = await userManager.register(userToRegister); 

    res.redirect("/api/sessions/login");
  } catch (error) {
    res.status(500).send("Error while registering: " + error.message);
  }
});

userRouter.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
    }

    if (req.user.rol === 'admin') {
      req.session.firstName = req.user.first_name;
      req.session.lastName = req.user.last_name;
      req.session.emailUser = req.user.email;
      req.session.rol = req.user.rol;
      res.redirect("/api/sessions/profile");
    } else {
      req.session.firstName = req.user.first_name;
      req.session.lastName = req.user.last_name;      
      req.session.emailUser = req.user.email;
      req.session.rol = req.user.rol;
      res.redirect("/");
    }
  } catch (error) {
    res.status(500).send("Error al acceder al perfil: " + error.message);
  }
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

export default userRouter;