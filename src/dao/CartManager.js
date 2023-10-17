import { cartsModel } from '../db/models/carts.model.js';
import mongoose from "mongoose";

class CartManager {
  constructor() {
    this.cartsModel = cartsModel;
  }
  async getCarts() {
    try {
      const carts = await this.cartsModel.find({}).populate({
        path: "products.productId",
        model: "products",
        select: "image description price stock",
      });
      return carts;
    } catch (error) {
      console.error('Error getting carts:', error);
      return [];
    }
  }

  async addCart(cartData) {
    try {
      await this.cartsModel.create(cartData);
      return 'Cart added';
    } catch (error) {
      console.error('Error adding cart:', error);
      return 'Error adding cart';
    }
  }

  async getCartById(cid) {
    try {
      const cartId = new mongoose.Types.ObjectId(cid);
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return 'Error getting cart';
    }
  }

  async addProductInCart(cartId, prodId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        return 'Cart not found';
      }

      const existingProduct = cart.products.find((product) => product.productId === prodId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          productId: prodId,
          quantity: 1,
        });
      }

      await cart.save();
      return 'Product added to cart';
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return 'Error adding product to cart';
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }

      const productIndex = cart.products.findIndex((product) => product.productId === prodId);

      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        return 'Product removed from cart';
      } else {
        return 'Product not found in cart';
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
      return 'Error removing product from cart';
    }
  }

  async updateProductsInCart(cartId, newProducts) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        return 'Cart not found';
      }

      cart.products = newProducts;

      await cart.save();
      return 'Cart updated with new products';
    } catch (error) {
      console.error('Error updating cart:', error);
      return 'Error updating cart';
    }
  }

  async updateProductInCart(cartId, prodId, updatedProduct) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }

      const productToUpdate = cart.products.find((product) => product.productId === prodId);

      if (!productToUpdate) {
        return 'Product not found in cart';
      }

      Object.assign(productToUpdate, updatedProduct);

      await cart.save();
      return 'Updated product in cart';
    } catch (error) {
      console.error('Error updating product in cart:', error);
      return 'Error updating product in cart';
    }
  }

  async removeAllProductsFromCart(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }

      cart.products = [];
      await cart.save();

      return 'Todos los productos han sido eliminados del carrito';
    } catch (error) {
      console.error('Error al eliminar los productos del carrito:', error);
      return 'Error al eliminar los productos del carrito';
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId).populate('products.productId').lean();
      if (!cart) {
        return 'Cart not found';
      }
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return 'Error getting cart';
    }
  }
}

export default CartManager;