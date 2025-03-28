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
exports.unBlockUser = exports.blockUser = exports.updateUser = exports.deleteUser = exports.getUser = exports.getAllUsers = exports.logoutUser = exports.accessTokenCreate = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const utils_1 = __importDefault(require("../utils"));
const generateToken_1 = require("../utils/generateToken");
// Create a new user
// POST /api/v1/users/register
exports.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            return next((0, http_errors_1.default)(400, 'User already exists'));
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_model_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const { accessToken, refreshToken } = yield (0, generateToken_1.generateAccessTokenAndRefreshToken)(String(newUser._id));
        res
            .status(200)
            .cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
            .cookie('refreshToken', refreshToken, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
            .json({
            success: true,
            message: 'User register in successfully',
            data: newUser,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal server error'));
    }
}));
// Login a user
// POST /api/v1/users/login
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({
            email,
        });
        if (!user) {
            return next((0, http_errors_1.default)(401, 'Invalid email or password'));
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return next((0, http_errors_1.default)(401, 'Invalid email or password'));
        }
        const { accessToken, refreshToken } = yield (0, generateToken_1.generateAccessTokenAndRefreshToken)(String(user._id));
        const newUser = yield user_model_1.default.findById(user._id).select('-password');
        res
            .status(200)
            .cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
            .cookie('refreshToken', refreshToken, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
            .json({
            success: true,
            message: 'User logged in successfully',
            data: newUser,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Refresh TOken
// POST /api/v1/users/refresh-token
exports.accessTokenCreate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        return next((0, http_errors_1.default)(401, 'Unauthorized, no refresh token'));
    }
    try {
        const decode = (0, generateToken_1.verifyRefreshToken)(token);
        if (!decode) {
            return next((0, http_errors_1.default)('403', 'Forbidden, invalid refresh token'));
        }
        const payload = decode;
        const newAccesToken = (0, generateToken_1.generateAccessToken)(payload.id);
        res
            .status(200)
            .cookie('accessToken', newAccesToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
            .json({
            success: true,
            accessToken: newAccesToken,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Logout a user
// GET /api/v1/users/logout
exports.logoutUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json({
            success: true,
            message: 'User logged out successfully',
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Get all users
// GET /api/v1/users/getAllUsers
exports.getAllUsers = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({});
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Get a user by ID
// GET /api/v1/users/me
exports.getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, utils_1.default)(req.user);
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Get a user by ID
// DELETE /api/v1/users/delete
exports.deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, utils_1.default)(req.user);
    try {
        const user = yield user_model_1.default.findByIdAndDelete(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        res
            .status(200)
            .json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Update a user by ID
// PUT /api/v1/users/update
exports.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, utils_1.default)(req.user);
    const { firstName, lastName, email } = req.body;
    try {
        const user = yield user_model_1.default.findByIdAndUpdate(userId, {
            firstName: firstName,
            lastName: lastName,
            email: email,
        }, {
            new: true,
        });
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        res
            .status(200)
            .json({ success: true, message: 'User Updated successfully' });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Block a user by ID
// POST /api/v1/users/block/:id
exports.blockUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        user.isBlocked = true;
        yield user.save();
        res
            .status(200)
            .json({ success: true, message: 'User Blocked successfully' });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
// Unblock a user by ID
// POST /api/v1/users/un-block/:id
exports.unBlockUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        user.isBlocked = false;
        yield user.save();
        res
            .status(200)
            .json({ success: true, message: 'User UnBlocked successfully' });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, 'Internal Server Error'));
    }
}));
