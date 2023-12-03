import ProductsMongoDAO from '../dao/mongo/products.mongo.js';
import ProductDTO from '../dao/DTOs/product.dto.js';

class ProductsRepository {
  constructor() {
    this.productsDAO = new ProductsMongoDAO();
  }

  async addProduct(productDTO) {
    return await this.productsDAO.addProduct(productDTO);
  }

  async updateProduct(id, productDTO) {
    return await this.productsDAO.updateProduct(id, productDTO);
  }

  async getProducts() {
    try {
      const products = await this.productsDAO.getProducts();
      return Array.isArray(products) ? products.map(product => new ProductDTO(product)) : [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error; 
    }
  }

  async getProductById(id) {
    return await this.productsDAO.getProductById(id);
  }

  async getProductsByCategory(category) {
    return await this.productsDAO.getProductsByCategory(category);
  }

  async getProductsMaster(page, limit, category, availability, sortOrder) {
    try {
      const products = await this.productsDAO.getProductsMaster(page, limit, category, availability, sortOrder);
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error; 
    }
  }

  async deleteProduct(id) {
    return await this.productsDAO.deleteProduct(id);
  }
}

export default ProductsRepository;