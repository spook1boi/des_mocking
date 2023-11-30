export default class ProductDTO {
    constructor(product) {
        this.description = product.description
        this.category = product.category
        this.thumbnails = product.thumbnails
        this.price = product.price
        this.stock = product.stock
    }
};