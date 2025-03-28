import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getaProduct,
} from '../controllers/product.controller.js';
import protectAdmin, {
  authenticateUser,
} from '../middlewares/authMiddlewares.js';

const productRouter = Router();

productRouter
  .route('/create-product')
  .post(authenticateUser, protectAdmin, createProduct);

productRouter.route('/product/:id').get(authenticateUser, getaProduct);
productRouter
  .route('/all-products')
  .get(authenticateUser, protectAdmin, getAllProducts);

export default productRouter;
