"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
passport_1.default.use("jwt", new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECURE_KEY,
}, async (token, done) => {
    try {
        if (token.type !== "ACCESS_TOKEN")
            throw new Error("Invalid JWT");
        return done(null, token.user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use("media", new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromUrlQueryParameter("token"),
    secretOrKey: process.env.SECURE_KEY,
}, async (token, done) => {
    try {
        if (token.type !== "MEDIA_TOKEN")
            throw new Error("Invalid JWT");
        return done(null, token.user);
    }
    catch (error) {
        return done(error);
    }
}));
