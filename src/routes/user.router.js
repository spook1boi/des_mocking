import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/UserController.js';
import { generateToken } from '../utils.js'; 

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 400, error: 'Missing data' });
    }
    
    const defaultRole = 'user';

    const userToRegister = {
      first_name,
      last_name,
      email,
      age,
      password,
      rol: rol || defaultRole, 
    };

    const result = await userController.register(userToRegister);

    res.redirect("/api/sessions/login");
  } catch (error) {
    res.status(500).send("Error while registering: " + error.message);
  }
});

userRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user) => {
    if (err) {
      return res.status(500).send("Error al iniciar sesión: " + err.message);
    }
    
    if (!user) {
      return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
    }

    req.logIn(user, async (loginErr) => {
      if (loginErr) {
        return res.status(500).send("Error al iniciar sesión: " + loginErr.message);
      }

      const userPayload = {
        email: user.email,
        rol: user.rol,
      };
 
      const token = await generateToken(userPayload);
      console.log('Token:', token);
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 

      if (user.rol === 'admin') {
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;
        req.session.emailUser = user.email;
        req.session.rol = user.rol;
        res.redirect("/api/sessions/profile");
      } else {
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;      
        req.session.emailUser = user.email;
        req.session.rol = user.rol;
        res.redirect("/");
      }
    });
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
    res.clearCookie('token'); 
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

userRouter.get('/current', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
      };

      return res.status(200).json(user);
    } else {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return res.status(500).json({ message: 'Error al obtener el usuario actual' });
  }
});

export default userRouter;