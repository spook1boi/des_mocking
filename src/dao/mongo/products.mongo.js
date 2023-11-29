import { productsModel } from './models/products.model.js';
import mongoose from "mongoose";
import ProductDTO from '../DTOs/product.dto.js';

class ProductsMongoDAO {
  async addProduct(productDTO) {
    try {
      const product = new productsModel(productDTO);
      await product.save();
      return 'Product added';
    } catch (error) {
      console.error('Error adding product:', error);
      return 'Error adding product';
    }
  }

  async updateProduct(id, productDTO) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        return 'Product not found';
      }
      product.set(productDTO);
      await product.save();
      return 'Product updated';
    } catch (error) {
      console.error('Error updating product:', error);
      return 'Error updating product';
    }
  }

  async getProducts() {
    try {
      const products = await productsModel.find({});
      return products.map(product => new ProductDTO(product));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(id).lean();
      if (!product) {
        return 'Product not found';
      }
      return new ProductDTO(product);
    } catch (error) {
      console.error('Error getting product:', error);
      return 'Error getting product';
    }
  }

  async getProductsByCategory(category) {
    try {
      const products = await productsModel.find({ category });
      return products.map(product => new ProductDTO(product));
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        return 'Product not found';
      }
      await product.remove();
      return 'Product deleted';
    } catch (error) {
      console.error('Error deleting product:', error);
      return 'Error deleting product';
    }
  }
}

export default ProductsMongoDAO;