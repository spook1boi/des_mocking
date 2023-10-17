import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const cartRouter = Router();
const carts = new CartManager();

cartRouter.get("/", async (req, res) => {
    res.send(await carts.getCarts());
});

cartRouter.get("/:id", async (req, res) => {
    const cartId = req.params.id;
    res.send(await carts.getCartById(cartId));
});

cartRouter.post("/carts", async (req, res) => {
    try {
        const newCart = req.body;
        const result = await carts.addCart(newCart);
        if (result === 'Cart added') {
            res.status(201).json({ message: 'Cart added successfully' });
        } else {
            res.status(400).json({ message: 'Could not add cart' });
        }
    } catch (error) {
        console.error('Error adding cart:', error);
        res.status(500).json({ message: 'Error adding cart' });
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    res.send(await carts.addProductInCart(cartId, prodId));
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    res.send(await carts.removeProductFromCart(cartId, prodId));
});

cartRouter.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const newProducts = req.body;
    res.send(await carts.updateProductsInCart(cartId, newProducts));
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const newProduct = req.body;
    res.send(await carts.updateProductInCart(cartId, prodId, newProduct));
});

cartRouter.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    res.send(await carts.removeAllProductsFromCart(cartId));
});

cartRouter.get("/population/:cid", async (req, res) => {
    const cartId = req.params.cid;
    res.send(await carts.getCartWithProducts(cartId));
});

export default cartRouter;