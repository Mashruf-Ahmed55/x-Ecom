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
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessTokenAndRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../config/envConfig");
const generateAccessToken = (id) => {
    if (!envConfig_1.envConfig.jwtSecret_accessToken) {
        throw new Error('JWT Secret not found');
    }
    return jsonwebtoken_1.default.sign({ id }, envConfig_1.envConfig.jwtSecret_accessToken, {
        expiresIn: '15m',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!envConfig_1.envConfig.jwtSecret_refreshToken) {
        throw new Error('JWT Secret not found');
    }
    return jsonwebtoken_1.default.sign({ id }, envConfig_1.envConfig.jwtSecret_refreshToken, {
        expiresIn: '15d',
    });
});
exports.generateRefreshToken = generateRefreshToken;
const generateAccessTokenAndRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = generateAccessToken(id);
    const refreshToken = yield generateRefreshToken(id);
    return { accessToken, refreshToken };
});
exports.generateAccessTokenAndRefreshToken = generateAccessTokenAndRefreshToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, envConfig_1.envConfig.jwtSecret_refreshToken);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
