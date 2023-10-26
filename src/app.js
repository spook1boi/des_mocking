import express from "express";
import mongoose from "mongoose";
import passport from "passport";

import { engine } from "express-handlebars";
import * as path from "path";

import MongoStore from "connect-mongo";
import session from "express-session";
import FileStore from "session-file-store";

import "../src/db/db.config.js";
import __dirname from "./utils.js";

import prodRouter from "../src/routes/product.router.js";
import cartRouter from "../src/routes/cart.router.js";
import userRouter from "../src/routes/user.router.js";

import initializePassport from '../src/config/passport.config.js'
import ProductManager from "../src/dao/ProductManager.js";
import CartManager from "../src/dao/CartManager.js";

initializePassport(passport);

const app = express();

const PORT = 8080;
const product = new ProductManager();
const cart = new CartManager();
const fileStorage = FileStore(session);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(
    session({
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://SpookyBoi:Aqr6Tt0QgOgQ0qTl@cluster0.lozpuyb.mongodb.net/ecommerce",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3600
      }),
      secret: "SecretPassword",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.use("/api", prodRouter);
app.use("/api", cartRouter);
app.use("/api/sessions", userRouter);

app.get("/", async (req, res) => {
    const allProducts = await product.getProducts();
    const productData = allProducts.map(product => product.toJSON());
    const page = parseInt(req.query.page) || 1;

    const user = {
        first_name: req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        rol: req.session.rolUsuario,
    };

    console.log("User object:", user);
    res.render("home", {
        title: "Vista Products",
        products: productData,
        page: page,
        user: user,  
    });
});

app.get('/api/sessions/register', async (req, res) => {
    res.render('register', { title: 'Register' });
  });
  
  app.get('/api/sessions/login', async(req, res) => {
    res.render('login', { title: 'Login' });
  });
 
  app.get('/api/sessions/profile', async(req, res) => {
    try {
      const user = {
        first_name: req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        email: req.session.emailUsuario,
        age: 30,
        rol: req.session.rolUsuario,
      };
  
      res.render('profile', user);
    } catch (error) {
      console.error('Error al acceder al perfil:', error);
      res.status(500).send('Error al acceder al perfil');
    }
  });

app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts  = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "Vista Cart",
        carts : allCarts
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

