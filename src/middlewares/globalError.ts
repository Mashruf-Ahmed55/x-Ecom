import {HttpError} from 'http-errors';
import {NextFunction, Request, Response} from "express";
import {envConfig} from "../config/envConfig";

const globalErrorHandler = (err: HttpError,req:Request,res:Response,next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message ? err.message : 'Internal Server Error';
    const stack = err.stack;
    res.status(statusCode).json({message, stack: envConfig.nodeEnv as string === 'development' && stack });
};

export default  globalErrorHandler;
