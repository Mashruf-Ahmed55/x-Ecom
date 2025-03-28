"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const returID = (user) => {
    if (!user) {
        throw new Error(`User not found`);
    }
    const userId = String(user._id);
    return userId;
};
exports.default = returID;
