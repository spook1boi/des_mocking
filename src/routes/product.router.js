import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const prodRouter = Router();
const productController = new ProductController();

const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

prodRouter.get("/products/:pid", async (req, res) => {
  try {
    const prodId = req.params.pid;
    const productDetails = await productController.getProductById(prodId);

    if (productDetails === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.render('productDetails', { layout: 'main', title: 'Detalles del Producto', product: productDetails });
    }
  } catch (error) {
    console.error('Error getting the product:', error);
    res.status(500).json({ error: 'Error getting the product' });
  }
});

prodRouter.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productController.getProductsByCategory(category);
    if (products.length === 0) {
      res.status(404).json({ error: 'No se encontraron productos en la categoría proporcionada.' });
    } else {
      res.json(products);
    }
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/limit/:limit", async (req, res) => {
  try {
    let limit = parseInt(req.params.limit) ?? 10;
    res.json(await productController.getProductsByLimit(limit));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/page/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page) ?? 1;
    if (page <= 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
    const productsPerPage = 10;
    const products = await productController.getProductsByPage(page, productsPerPage);
    res.json(products);
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.put("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updProd = req.body;
    res.json(await productController.updateProduct(pid, updProd));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products/search/query", async (req, res) => {
  try {
    const query = req.query.q;
    res.json(await productController.getProductsByQuery(query));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    res.json(await productController.addProduct(newProduct));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.delete("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    res.json(await productController.delProducts(pid));
  } catch (error) {
    errorHandler(res, error);
  }
});

prodRouter.get("/products", async (req, res) => {
  try {
    const { sortOrder = "asc", category = "", availability = "" } = req.query;
    const products = await productController.getProductsMaster(null, null, category, availability, sortOrder);
    res.json(products);
  } catch (error) {
    errorHandler(res, error);
  }
});

export default prodRouter;