"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.getaProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Create a new product
exports.createProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield product_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal server error'));
    }
}));
// Get a products
exports.getaProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productFind = yield product_model_1.default.findById(req.params.id);
        if (!productFind) {
            return next((0, http_errors_1.default)(404, 'Product not found'));
        }
        res.status(200).json({
            success: true,
            product: productFind,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal server error'));
    }
}));
// Get All products
exports.getAllProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productFind = yield product_model_1.default.find({});
        if (!productFind) {
            return next((0, http_errors_1.default)(404, 'Product not found'));
        }
        res.status(200).json({
            success: true,
            product: productFind,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Product not found'));
    }
}));
