import EErrors from './EErrors.js';
import CustomError from './CustomError.js';

export const handleProductCreationError = (product) => {
  const requiredProperties = ['description', 'image', 'price', 'stock', 'category', 'availability'];
  const errorInfo = requiredProperties
    .map(prop => `*${prop} : necesita ser ${getExpectedType(prop)}, recibido ${product[prop]}`)
    .join('\n');

  CustomError.createError({
    name: 'ValidationError',
    cause: EErrors.REQUIRED_DATA,
    message: 'Una o más propiedades están incompletas o no son válidas.\nLista de propiedades requeridas:\n' + errorInfo
  });
};