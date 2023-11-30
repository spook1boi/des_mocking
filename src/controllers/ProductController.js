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

  async getProducts(req, res) {
    try {
        const products = await this.productsRepository.getProducts();
        res.status(200).json({ status: 'success', products: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await this.productsRepository.getProductById(productId);
      res.status(200).json({ status: 'success', product: product });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
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