import { productsModel } from '../db/models/products.model.js';
import CartManager from '../dao/CartManager.js';

class ProductManager {
  constructor() {}

  async addProduct(productData) {
    try {
      await productsModel.create(productData);
      return 'Product added';
    } catch (error) {
      console.error('Error adding product:', error);
      return 'Error adding product';
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        return 'Product not found';
      }
      product.set(productData);
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
      return products;
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
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      return 'Error getting product';
    }
  }

  async getProductsByCategory(category) {
    try {
      const products = await productsModel.find({ category });
      return products;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  async getProductsByQuery(query) {
    try {
      const products = await productsModel.find({
        description: { $regex: query, $options: 'i' },
      });
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByLimit(limit) {
    try {
      const products = await productsModel.find({}).limit(limit); 
      return products;
    } catch (error) {
      throw error;
    }
}

async getProductsByPage(page, productsPerPage) {
  if (page <= 0) {
    page = 1;
  }
  try {
    const startIndex = (page - 1) * productsPerPage;
    const products = await productsModel
      .find()
      .skip(startIndex)
      .limit(productsPerPage);
    return products;
  } catch (error) {
    console.error('Error getting products by page:', error);
    return { error: 'Error getting products by page' };
  }
}

  async getProductsMaster(page = 1, limit = 10, availability, category) {
    try {
      let filter = {};
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      if (category != "") {
        filter.category = category;
      }
      if (availability != "") {
        filter.availability = availability;
      }

      const query = ProductManager
        .find(filter)
        .skip(startIndex)
        .limit(limit);

      const products = await query.exec();

      const totalProducts = await ProductManager.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = startIndex > 0;
      const hasNextPage = endIndex < totalProducts;
      const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
      const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

      return {
        status: 'success',
        payload: products,
        totalPages: totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return { status: 'error', payload: 'Error getting products' };
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

export default ProductManager;