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
exports.authenticateUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const passportConfig_1 = require("../config/passportConfig");
const user_model_1 = __importDefault(require("../models/user.model"));
const utils_1 = __importDefault(require("../utils"));
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passportConfig_1.passportConfig_jwt.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next((0, http_errors_1.default)(401, 'Unauthorized'));
        }
        if (!user) {
            return next((0, http_errors_1.default)(404, 'Unauthorized! Please login fast and try again.'));
        }
        req.user = user;
        next();
    })(req, res, next);
});
exports.authenticateUser = authenticateUser;
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, utils_1.default)(req.user);
        const user = yield user_model_1.default.findById(userId);
        if (!user || user.isAdmin !== 'ADMIN') {
            return next((0, http_errors_1.default)(403, 'Forbidden, not admin'));
        }
        next();
    }
    catch (error) {
        next((0, http_errors_1.default)('500', 'Internal Server Error'));
    }
});
exports.default = protectAdmin;
