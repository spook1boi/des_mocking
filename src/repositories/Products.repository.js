import ProductsMongoDAO from '../dao/mongo/products.mongo.js';
import productDTO from '../dao/DTOs/product.dto.js';

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
    return await this.productsDAO.getProducts();
  }

  async getProductById(id) {
    return await this.productsDAO.getProductById(id);
  }

  async getProductsByCategory(category) {
    return await this.productsDAO.getProductsByCategory(category);
  }

  // ... otras funciones ...

  async deleteProduct(id) {
    return await this.productsDAO.deleteProduct(id);
  }
}

export default ProductsRepository;