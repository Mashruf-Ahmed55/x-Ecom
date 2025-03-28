"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_controller_1 = require("../controllers/user.controller");
const authMiddlewares_1 = __importStar(require("../middlewares/authMiddlewares"));
const validateSchema_1 = require("../middlewares/validateSchema");
const user_controller_2 = require("./../controllers/user.controller");
const userRouter = (0, express_1.Router)();
// @ts-ignore
userRouter.route('/register').post(validateSchema_1.validateSchemaSignUp, user_controller_1.createUser);
// @ts-ignore
userRouter.route('/login').post(validateSchema_1.validateSchemaSignIn, user_controller_1.loginUser);
userRouter.route('/refresh-token').post(user_controller_1.accessTokenCreate);
userRouter.route('/logout').get(authMiddlewares_1.authenticateUser, user_controller_1.logoutUser);
// GITHUB
userRouter.get('/auth/github', passport_1.default.authenticate('github', {
    session: false,
    scope: ['user:email'],
}));
userRouter.get('/auth/github/callback', passport_1.default.authenticate('github', {
    failureRedirect: `http://localhost:5173/login`,
    session: false,
}), function (req, res) {
    const user = req.user;
    res
        .cookie('accessToken', user.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .cookie('refreshToken', user.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .redirect(`http://localhost:5173/success`);
});
// GOOGLE
userRouter.get('/auth/google', passport_1.default.authenticate('google', { session: false, scope: ['profile'] }));
userRouter.get('/auth/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: false,
}), function (req, res) {
    const user = req.user;
    res
        .cookie('accessToken', user.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .cookie('refreshToken', user.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .redirect(`http://localhost:5173/success`);
});
userRouter.route('/update').put(authMiddlewares_1.authenticateUser, user_controller_1.updateUser);
userRouter.route('/me').get(authMiddlewares_1.authenticateUser, user_controller_1.getUser);
userRouter.route('/all-users').get(authMiddlewares_1.authenticateUser, authMiddlewares_1.default, user_controller_1.getAllUsers);
userRouter.route('/delete').delete(authMiddlewares_1.authenticateUser, authMiddlewares_1.default, user_controller_1.deleteUser);
userRouter.route('/block/:id').post(authMiddlewares_1.authenticateUser, authMiddlewares_1.default, user_controller_1.blockUser);
userRouter
    .route('/un-block/:id')
    .post(authMiddlewares_1.authenticateUser, authMiddlewares_1.default, user_controller_2.unBlockUser);
exports.default = userRouter;
