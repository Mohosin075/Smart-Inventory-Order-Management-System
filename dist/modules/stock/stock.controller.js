"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const stock_service_1 = require("./stock.service");
const handleStockDeduction = (0, catchAsync_1.default)(async (req, res) => {
    const { productId, quantity } = req.body;
    const updated = await stock_service_1.StockServices.handleStockDeduction(productId, Number(quantity));
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Stock deducted successfully', updatedStock: updated === null || updated === void 0 ? void 0 : updated.stockQuantity });
});
const handleStockRestock = (0, catchAsync_1.default)(async (req, res) => {
    const { productId, quantity } = req.body;
    const updated = await stock_service_1.StockServices.handleStockRestock(productId, Number(quantity));
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Product restocked', data: updated });
});
exports.StockController = { handleStockDeduction, handleStockRestock };
