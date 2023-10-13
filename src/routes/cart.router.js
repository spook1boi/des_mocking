import express from 'express';
import CartManager from '../dao/CartManager.js';
import ProductManager from '../dao/ProductManager.js';

const router = express.Router();

router.get('/api/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await CartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/api/carts', async (req, res) => {
  const { description, quantity, total } = req.body;
  try {
    const newCart = await CartManager.createCart(description, quantity, total);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.put('/api/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const newData = req.body; 
  try {
    const updatedCart = await CartManager.updateCart(cartId, newData);
    if (!updatedCart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.status(200).json(updatedCart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

router.delete('/api/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const result = await CartManager.deleteCart(cartId);
    if (!result) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el carrito' });
  }
});

router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await CartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const productIndex = cart.products.findIndex((product) => product.product == productId);

    if (productIndex === -1) {
      res.status(404).json({ error: 'Product not found in the cart' });
    } else {

      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the product from the cart' });
  }
});

router.delete('/api/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const result = await CartManager.deleteCart(cartId);
    if (!result) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the cart' });
  }
});

router.put('/api/carts/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await CartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const product = cart.products.find((item) => item.product == productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found in the cart' });
    } else {
      product.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the quantity of the product' });
  }
});

router.get('/api/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await CartManager.getCartById(cartId).populate('products.product');
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the cart' });
  }
});


export default router;