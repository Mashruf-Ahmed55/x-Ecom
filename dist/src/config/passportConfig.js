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
exports.passportConfig_jwt = exports.passportConfig_github = exports.passport_google = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
const generateAutoEmail_1 = __importDefault(require("../utils/generateAutoEmail"));
const generateToken_1 = require("../utils/generateToken");
const envConfig_1 = require("./envConfig");
const cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.accessToken;
    }
    return token;
};
const passportConfig_jwt = passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: envConfig_1.envConfig.jwtSecret_accessToken,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(payload.id).select('-password');
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        console.error('Error authenticating user:', error);
        return done(error, false);
    }
})));
exports.passportConfig_jwt = passportConfig_jwt;
const passportConfig_github = passport_1.default.use(new passport_github2_1.Strategy({
    clientID: envConfig_1.envConfig.github_client_id,
    clientSecret: envConfig_1.envConfig.github_client_secret,
    callbackURL: 'http://127.0.0.1:8080/api/v1/users/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ githubId: profile.id });
        const autoGenerateEmail = (0, generateAutoEmail_1.default)(profile.username);
        console.log(autoGenerateEmail);
        if (!user) {
            const password = profile.username + profile.id.toString().slice(-8);
            const hasedPassword = yield bcryptjs_1.default.hash(password, 10);
            console.log(hasedPassword, profile._json.email);
            user = yield user_model_1.default.create({
                firstName: profile.username,
                lastName: profile.username,
                email: profile._json.email || autoGenerateEmail,
                password: hasedPassword,
                providerId: profile.id,
                provider: profile.provider,
                avatar: profile._json.avatar_url,
                profile_url_id: profile.profileUrl,
            });
        }
        const { accessToken, refreshToken } = yield (0, generateToken_1.generateAccessTokenAndRefreshToken)(user.id);
        return done(null, { user, accessToken, refreshToken });
    }
    catch (error) {
        return done(error, null);
    }
})));
exports.passportConfig_github = passportConfig_github;
const passport_google = passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: envConfig_1.envConfig.google_client_id,
    clientSecret: envConfig_1.envConfig.google_client_secret,
    callbackURL: 'http://127.0.0.1:8080/api/v1/users/auth/google/callback',
}, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(profile);
    try {
        let user = yield user_model_1.default.findOne({ googleId: profile.id });
        if (!user) {
            const password = profile.username + profile.id.toString().slice(-8);
            const hasedPassword = yield bcryptjs_1.default.hash(password, 10);
            const autoGenerateEmail = (0, generateAutoEmail_1.default)(profile.displayName);
            user = yield user_model_1.default.create({
                firstName: profile.displayName,
                lastName: profile.displayName,
                email: profile._json.email || autoGenerateEmail,
                password: hasedPassword,
                providerId: profile.id,
                provider: profile.provider,
                avatar: profile._json.picture,
                profile_url_id: profile._json.sub,
            });
        }
        const { accessToken, refreshToken } = yield (0, generateToken_1.generateAccessTokenAndRefreshToken)(user.id);
        return cb(null, { user, accessToken, refreshToken });
    }
    catch (error) {
        return cb(error, null);
    }
})));
exports.passport_google = passport_google;
