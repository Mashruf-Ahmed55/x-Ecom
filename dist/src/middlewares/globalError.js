"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = require("../config/envConfig");
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message ? err.message : 'Internal Server Error';
    const stack = err.stack;
    res.status(statusCode).json({ message, stack: envConfig_1.envConfig.nodeEnv === 'development' && stack });
};
exports.default = globalErrorHandler;
