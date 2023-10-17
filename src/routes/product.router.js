import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const prodRouter = Router();
const product = new ProductManager();

// http://localhost:8080/api/products/productID - GET.
prodRouter.get("/products/:id", async (req, res) => {
    try {
        const prodId = req.params.id;
        const productDetails = await product.getProductById(prodId);
        if (productDetails === 'Product not found') {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.render('viewProducts', { layout: 'main', product: productDetails });
        }
    } catch (error) {
        console.error('Error getting the product:', error);
        res.status(500).json({ error: 'Error getting the product' });
    }
});

// http://localhost:8080/api/products/limit?limit=numberLimit - GET.
prodRouter.get("/limit", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    res.send(await product.getProductsByLimit(limit));
});

// http://localhost:8080/api/products/page/pageNumber - GET.
prodRouter.get("/page/:page", async (req, res) => {
    const page = parseInt(req.params.page);
    if (isNaN(page) || page <= 0) {
        return res.status(400).json({ error: 'Invalid page number' });
    }
    const productsPerPage = 10; 
    try {
        const products = await product.getProductsByPage(page, productsPerPage);
        res.json(products);
    } catch (error) {
        console.error('Error getting products by page:', error);
        res.status(500).json({ error: 'Error getting products by page' });
    }
});

//  http://localhost:8080/api/products/ - PUT .
prodRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updProd = req.body;
    res.send(await product.updateProduct(id, updProd));
});

prodRouter.get("/page/:page/limit/:limit", async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    try {
        const products = await product.getProductsByPage(page, limit);
        res.render('viewProducts', {
            layout: 'main',
            products: products.products,
            totalPages: products.totalPages,
            currentPage: page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
        });
    } catch (error) {
        console.error('Error getting products by page:', error);
        res.status(500).json({ error: 'Error getting products by page' });
    }
});

// http://localhost:8080/api/products/search/query?q=productName - GET.
prodRouter.get("/search/query", async (req, res) => {
    const query = req.query.q;
    res.send(await product.getProductsByQuery(query));
});

prodRouter.get("/", async (req, res) => {
    const sortOrder = req.query.sortOrder || "asc";
    const category = req.query.category || "";
    const availability = req.query.availability || "";
    res.send(await product.getProductsMaster(null, null, category, availability, sortOrder));
});

prodRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    res.send(await product.addProduct(newProduct));
});

prodRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    res.send(await product.delProducts(id));
});

export default prodRouter;