import express from 'express';
import ProductManager from '../dao/ProductManager.js';

const router = express.Router();

router.get('/api/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query, category, availability } = req.query;
  const perPage = parseInt(limit);
  const currentPage = parseInt(page);

  const filters = {};

  if (query) {
    filters.$text = { $search: query };
  }

  if (category) {
    filters.category = category;
  }

  if (availability) {
    filters.availability = availability === 'true';
  }

  try {
    const products = await ProductManager.getProducts(filters, perPage, currentPage, sort);

    const totalProducts = await ProductManager.countProducts(filters);

    const totalPages = Math.ceil(totalProducts / perPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const prevLink = hasPrevPage ? `/api/products?limit=${perPage}&page=${currentPage - 1}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${perPage}&page=${currentPage + 1}` : null;

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/api/products', async (req, res) => {
  const { title, description, thumbnails, price, stock } = req.body;
  try {
    const newProduct = await ProductManager.createProduct(title, description, thumbnails, price, stock);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

router.put('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const newData = req.body; 
  try {
    const updatedProduct = await ProductManager.updateProduct(productId, newData);
    if (!updatedProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const result = await ProductManager.deleteProduct(productId);
    if (!result) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;