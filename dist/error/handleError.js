"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const mainError_1 = require("./mainError");
const errorBuilder = (err, res) => {
    res.status(mainError_1.HTTP.BAD_REQUEST).json({
        name: err.name,
        message: err.message,
        success: err.success,
        status: err.status,
        error: err,
    });
};
const handleError = (err, req, res, next) => {
    errorBuilder(err, res);
};
exports.handleError = handleError;
