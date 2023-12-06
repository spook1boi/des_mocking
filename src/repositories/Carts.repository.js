import CartsMongoDAO from '../dao/mongo/carts.mongo.js';
import CartDTO from '../dao/DTOs/cart.dto.js';

class CartsRepository {
  constructor() {
    this.cartsDAO = new CartsMongoDAO();
  }

  async getCarts() {
    return await this.cartsDAO.getCarts();
  }

  async addCart(cartDTO) {
    return await this.cartsDAO.addCart(cartDTO);
  }

  async getCartById(cartId) {
    return await this.cartsDAO.getCartById(cartId);
  }

  async removeProductFromCart(cartId, prodId) {
    return await this.cartsDAO.removeProductFromCart(cartId, prodId);
  }

  async getCartWithProducts(cartId) {
    return await this.cartsDAO.getCartWithProducts(cartId);
  }

  async addProductToCart(cartId, productDTO) {
    const cart = await this.cartsDAO.getCartById(cartId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedCart = await this.cartsDAO.addProductToCart(cartId, productDTO);

    return updatedCart;
  }

  async updateProductQuantity(cartId, prodId, quantity) {
    const cart = await this.cartsDAO.getCartById(cartId);
    if (!cart) {

      throw new Error('Cart not found');
    }
    const updatedCart = await this.cartsDAO.updateProductQuantity(cartId, prodId, quantity);

    return updatedCart;
  }

}

export default CartsRepository;