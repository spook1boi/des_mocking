import { Router } from "express";
import { usersModel } from "../db/models/users.model.js";
import UserManager from "../dao/UserManager.js";

const userRouter = Router();
const user = new UserManager();

userRouter.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const newUser = new usersModel({
      first_name,
      last_name,
      email,
      age,
      password,
      rol: "usuario",
    });

    user.addUser(newUser);

    res.redirect("/");
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).send("Error al registrar el usuario");
  }
});

userRouter.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await user.loginUser(email, password);

    req.session.emailUsuario = email;
    req.session.rolUsuario = userData.rol;

    if (userData.rol === 'admin') {
      req.session.nomUsuario = userData.first_name;
      req.session.apeUsuario = userData.last_name;
      res.redirect("/api/profile");
    } else {
      req.session.nomUsuario = userData.first_name;
      req.session.apeUsuario = userData.last_name;
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    res.status(500).send("Error al iniciar sesion: " + error.message);
  }
});

userRouter.get("/profile", async (req, res) => {
  try {

    const user = {
      first_name: req.session.nomUsuario,
      last_name: req.session.apeUsuario,
      email: req.session.emailUsuario, 
      age: 30, 
      rol: req.session.rolUsuario, 
    };

    res.render("profile", user);
  } catch (error) {
    console.error("Error al acceder al perfil:", error);
    res.status(500).send("Error al acceder al perfil");
  }
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al cerrar sesion:", error);
      res.status(500).send("Error al cerrar sesion");
    } else {
      res.redirect("/api/login");
    }
  });
});

export default userRouter;