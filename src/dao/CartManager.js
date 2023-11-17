import { cartsModel } from './models/carts.model.js';
import mongoose from "mongoose";

class CartManager {
  constructor() {
    this.cartsModel = cartsModel;
  }

  async getCarts() {
    try {
      const carts = await this.cartsModel.find({}).populate({
        path: 'products.productId',
        model: 'products',
        select: 'image description price stock',
      });
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async addCart(cartData) {
    try {
      await this.cartsModel.create(cartData);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async addProductInCart(cartId, prodId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        return 'Cart not found';
      }

      const existingProduct = cart.products.find(
        (product) => product.productId === prodId
      );

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
      throw error;
    }
  }

  async removeProductFromCart(cartId, prodId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId === prodId
      );

      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        return 'Product removed from cart';
      } else {
        return 'Product not found in cart';
      }
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async updateProductInCart(cartId, prodId, updatedProduct) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        return 'Cart not found';
      }

      const productToUpdate = cart.products.find(
        (product) => product.productId === prodId
      );

      if (!productToUpdate) {
        return 'Product not found in cart';
      }

      Object.assign(productToUpdate, updatedProduct);

      await cart.save();
      return 'Updated product in cart';
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async getCartWithProducts(cartId) {
    try {
      const cart = await this.cartsModel
        .findById(cartId)
        .populate('products.productId')
        .lean();
      if (!cart) {
        return 'Cart not found';
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export default CartManager;