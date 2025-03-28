"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaSignIn = exports.validateSchemaSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const validateSchemaSignUp = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            firstName: joi_1.default.string().required().min(1).max(30).alphanum(),
            lastName: joi_1.default.string().required().min(1).max(30).alphanum(),
            email: joi_1.default.string().email().required().lowercase(),
            password: joi_1.default.string()
                .required()
                .min(8)
                .max(30)
                .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
                .messages({
                'string.pattern.base': 'Password must have at least 1 letter and 1 number.',
            }),
        });
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation Failed!',
                errors: error.details.map((err) => err.message),
            });
        }
        return next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.validateSchemaSignUp = validateSchemaSignUp;
const validateSchemaSignIn = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required().lowercase(),
            password: joi_1.default.string().required(),
        });
        // Validate Data
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation Failed!',
                errors: error.details.map((err) => err.message),
            });
        }
        next();
    }
    catch (err) {
        console.log(err);
    }
};
exports.validateSchemaSignIn = validateSchemaSignIn;
