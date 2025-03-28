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
require("dotenv/config");
const app_1 = __importDefault(require("./src/app"));
const dbConfig_1 = __importDefault(require("./src/config/dbConfig"));
const envConfig_1 = require("./src/config/envConfig");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConfig_1.default)();
        app_1.default.listen(envConfig_1.envConfig.port, () => {
            console.log(`🚀 Server started on port ${envConfig_1.envConfig.port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
});
startServer().catch((err) => {
    console.error(err);
});
