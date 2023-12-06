import { nanoid } from 'nanoid';

export const generateMockProducts = () => {
  const products = [];

  for (let i = 0; i < 100; i++) {
    const product = {
      id: nanoid(),
      description: `Product ${i + 1}`,
      image: 'https://example.com/image.jpg',
      price: getRandomNumber(1, 1000),
      stock: getRandomNumber(1, 100),
      category: `Category ${i % 5 + 1}`
    };

    products.push(product);
  }

  return products;
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}