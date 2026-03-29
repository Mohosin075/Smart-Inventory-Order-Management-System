"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const searchProducts = (0, catchAsync_1.default)(async (req, res) => {
    const queryParam = String(req.query.query || '');
    // Simulate search logic
    const results = [
        { id: 1, name: 'iPhone 13', stock: 3 },
        { id: 2, name: 'MacBook Pro', stock: 5 },
    ].filter(product => product.name.toLowerCase().includes(queryParam.toLowerCase()));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Search results fetched successfully',
        results,
    });
});
exports.SearchController = { searchProducts };
