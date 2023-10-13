import { cartModel } from '../db/models/carts.model.js';

// Define el CartManager para gestionar operaciones con carritos
const CartManager = {
  // Crea un nuevo carrito
  createCart: async (description, quantity, total) => {
    try {
      const newCart = await cartModel.create({
        description,
        quantity,
        total,
      });
      return newCart;
    } catch (error) {
      throw error;
    }
  },

  // Obtiene un carrito por su ID
  getCartById: async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId);
      return cart;
    } catch (error) {
      throw error;
    }
  },

  // Actualiza un carrito por su ID
  updateCart: async (cartId, newData) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, newData, { new: true });
      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  // Elimina un carrito por su ID
  deleteCart: async (cartId) => {
    try {
      const result = await cartModel.findByIdAndDelete(cartId);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default CartManager;