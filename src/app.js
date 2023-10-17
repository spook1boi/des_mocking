import express from "express"
import prodRouter from "../src/routes/product.router.js"
import cartRouter from "../src/routes/cart.router.js"
import ProductManager from "../src/dao/ProductManager.js"
import CartManager from "../src/dao/CartManager.js"
import mongoose from "mongoose"
import "../src/db/db.config.js";
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"


const app = express()

const PORT = 8080
const product = new ProductManager()
const cart = new CartManager()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api", prodRouter)
app.use("/api", cartRouter)

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
    let allProducts  = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON());
    res.render("home", {
        title: "Vista Products",
        products : allProducts
    });
})

app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts  = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "Vista Cart",
        carts : allCarts
    });
})

