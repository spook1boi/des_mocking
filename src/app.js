import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import ProductManager from '../src/dao/ProductManager.js';
import CartManager from '../src/dao/CartManager.js';
import productRouter from '../src/routes/product.router.js';
import cartRouter from '../src/routes/cart.router.js';
import '../src/db/db.config.js';
import __dirname from "./utils.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Conectar a la base de datos utilizando db.config.js

// Configurar Handlebars como motor de plantillas
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")


// Servir archivos estáticos

// Parsear JSON y URL-encoded

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
  try {
    // Obtener la lista de productos
    const products = await ProductManager.getAllProducts();
    res.render('products', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta para la vista de un carrito específico
app.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    // Obtener el carrito por su ID
    const cart = await CartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.render('cart', { cart });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});