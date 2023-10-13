import { productsModel } from '../db/models/products.model.js';

// Define el ProductManager para gestionar operaciones con productos
const ProductManager = {
  // Crea un nuevo producto
  createProduct: async (title, description, thumbnails, price, stock) => {
    try {
      const newProduct = await productsModel.create({
        title,
        description,
        thumbnails,
        price,
        stock,
      });
      return newProduct;
    } catch (error) {
      throw error;
    }
  },

  // Obtiene un producto por su ID
  getProductById: async (productId) => {
    try {
      const product = await productsModel.findById(productId);
      return product;
    } catch (error) {
      throw error;
    }
  },

  // Actualiza un producto por su ID
  updateProduct: async (productId, newData) => {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(productId, newData, { new: true });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  // Elimina un producto por su ID
  deleteProduct: async (productId) => {
    try {
      const result = await productsModel.findByIdAndDelete(productId);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductManager;