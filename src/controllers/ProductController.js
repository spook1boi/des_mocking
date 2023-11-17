import ProductManager from '../dao/ProductManager.js';

class ProductController {
  constructor() {
    this.ProductManager = new ProductManager();
  }

  async addProduct(req, res) {
    try {
      const productData = req.body;
      const result = await this.ProductManager.addProduct(productData);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productData = req.body;
      const result = await this.ProductManager.updateProduct(productId, productData);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await this.ProductManager.getProducts();
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await this.ProductManager.getProductById(productId);
      res.status(200).json({ status: 'success', product: product });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const category = req.params.category;
      const products = await this.ProductManager.getProductsByCategory(category);
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsByQuery(req, res) {
    try {
      const query = req.query.q;
      const products = await this.ProductManager.getProductsByQuery(query);
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsByLimit(req, res) {
    try {
      const limit = parseInt(req.query.limit);
      const products = await this.ProductManager.getProductsByLimit(limit);
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getProductsByPage(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const productsPerPage = parseInt(req.query.limit) || 10;
      const products = await this.ProductManager.getProductsByPage(page, productsPerPage);
      res.status(200).json({ status: 'success', products: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const result = await this.ProductManager.deleteProduct(productId);
      res.status(200).json({ status: 'success', message: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default ProductController;