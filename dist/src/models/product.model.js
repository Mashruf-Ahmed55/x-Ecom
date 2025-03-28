"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
    },
    brand: {
        type: String,
        enum: [
            'Apple',
            'Samsung',
            'Xiaomi',
            'Huawei',
            'Oppo',
            'Vivo',
            'OnePlus',
            'Google',
            'LG',
            'Sony',
            'Nokia',
            'Asus',
            'Lenovo',
            'Motorola',
        ],
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    images: {
        type: [String],
    },
    color: {
        type: String,
        enum: [
            'Black',
            'White',
            'Red',
            'Blue',
            'Green',
            'Yellow',
            'Purple',
            'Orange',
            'Pink',
            'Brown',
            'Gray',
            'Silver',
            'Gold',
            'Multicolor',
        ],
    },
    rating: [
        {
            star: { type: Number, min: 1, max: 5 },
            postedby: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Product', productSchema);
