import { cartsModel } from './models/carts.model.js';
import mongoose from "mongoose";
import CartDTO from '../DTOs/cart.dto.js';

class CartsMongoDAO {
  async getCarts() {
    try {
      const carts = await cartsModel.find({}).populate({
        path: 'products.productId',
        model: 'products',
        select: 'image description price stock',
      });
      return carts.map(cart => new CartDTO(cart));
    } catch (error) {
      throw error;
    }
  }

  async addCart(cartDTO) {
    try {
      const cart = new cartsModel(cartDTO);
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const id = new mongoose.Types.ObjectId(cartId);
      const cart = await cartsModel.findById(id);
      if (!cart) {
        return 'Cart not found';
      }
      return new CartDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  // Resto de funciones...

  async removeProductFromCart(cartId, prodId) {
    // Implementación similar a la función existente, adaptada para trabajar con DTO
  }

  // Resto de funciones...

  async getCartWithProducts(cartId) {
    // Implementación similar a la función existente, adaptada para trabajar con DTO
  }
}

export default CartsMongoDAO;