import ProductsRepository from '../repositories/Products.repository.js';

class ProductController {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async addProduct(req, res) {
    try {
      const productDTO = req.body;
      const result = await this.productsRepository.addProduct(productDTO);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productDTO = req.body;
      const result = await this.productsRepository.updateProduct(productId, productDTO);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProducts() {
    try {
      const products = await this.productsRepository.getProducts();
      return products.map(product => product.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productsRepository.getProductById(id);
      return product;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const category = req.params.category;
      const products = await this.productsRepository.getProductsByCategory(category);
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsMaster(page, limit, category, availability, sortOrder) {
    try {
      const products = await this.productsRepository.getProductsMaster(page, limit, category, availability, sortOrder);
      return { status: 'success', products: products };
    } catch (error) {
      console.error('Error getting products:', error);
      return { status: 'error', message: 'Error getting products' };
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const result = await this.productsRepository.deleteProduct(productId);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default ProductController;