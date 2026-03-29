"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestockController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const restock_service_1 = require("./restock.service");
const addToRestockQueue = (0, catchAsync_1.default)(async (req, res) => {
    const item = await restock_service_1.RestockServices.addToRestockQueue(req.body.productId);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Added to restock queue', queueItem: item });
});
const listQueue = (0, catchAsync_1.default)(async (req, res) => {
    const items = await restock_service_1.RestockServices.listQueue();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: items });
});
const restockFromQueue = (0, catchAsync_1.default)(async (req, res) => {
    const product = await restock_service_1.RestockServices.restockFromQueue(req.params.id, Number(req.body.quantity));
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Product restocked', data: product });
});
const removeFromQueue = (0, catchAsync_1.default)(async (req, res) => {
    await restock_service_1.RestockServices.removeFromQueue(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Removed from restock queue' });
});
exports.RestockController = { addToRestockQueue, listQueue, restockFromQueue, removeFromQueue };
