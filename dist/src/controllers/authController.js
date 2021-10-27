"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.signup = exports.login = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const login = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("User does not exist");
        const isValid = await bcrypt_1.default.compare(req.body.password, user.password);
        if (isValid) {
            const userJson = {
                _id: user._id,
                email: user.email,
            };
            return res.status(200).json(generateTokens(userJson));
        }
        return res.status(400).send("Username/password invalid");
    }
    catch (e) {
        console.log(e);
    }
    return res.sendStatus(400);
};
exports.login = login;
const signup = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = new User_1.default(req.body);
        user.password = await bcrypt_1.default.hash(user.password, 10);
        await user.save();
        const userJson = {
            _id: user._id,
            email: user.email,
        };
        return res.status(201).json(generateTokens(userJson));
    }
    catch (e) { }
    return res.status(400).json({ message: "An error occured" });
};
exports.signup = signup;
const refreshToken = async (req, res) => {
    try {
        if (!req.body["refresh_token"])
            return res.status(400).send("Refresh Token is required");
        const data = (await jsonwebtoken_1.default.verify(req.body["refresh_token"], process.env.SECURE_KEY));
        delete data.iat;
        delete data.exp;
        return res.status(200).json(generateTokens(data));
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.TokenExpiredError)
            return res.status(400).send("Refresh Token expired");
        else if (e.message === "invalid signature") {
            return res.status(400).send("Refresh Token not valid");
        }
        else
            return res.status(400).send("Refresh Token not valid");
    }
};
exports.refreshToken = refreshToken;
const generateTokens = (payload) => {
    const access_token = jsonwebtoken_1.default.sign({ user: payload, type: "ACCESS_TOKEN" }, process.env.SECURE_KEY, {
        expiresIn: "15m",
    });
    const refresh_token = jsonwebtoken_1.default.sign({ user: payload, type: "REFRESH_TOKEN" }, process.env.SECURE_KEY, {
        expiresIn: "10d",
    });
    return { access_token, refresh_token };
};
