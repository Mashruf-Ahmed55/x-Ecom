import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import productModel from '../models/product.model';

// Create a new product
export const createProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newProduct = await productModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct,
      });
    } catch (error) {
      next(createHttpError(500, 'Internal server error'));
    }
  }
);

// Get a products
export const getaProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productFind = await productModel.findById(req.params.id);
      if (!productFind) {
        return next(createHttpError(404, 'Product not found'));
      }
      res.status(200).json({
        success: true,
        product: productFind,
      });
    } catch (error) {
      next(createHttpError(500, 'Internal server error'));
    }
  }
);

// Get All products
export const getAllProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productFind = await productModel.find({});
      if (!productFind) {
        return next(createHttpError(404, 'Product not found'));
      }
      res.status(200).json({
        success: true,
        product: productFind,
      });
    } catch (error) {
      next(createHttpError(500, 'Product not found'));
    }
  }
);
