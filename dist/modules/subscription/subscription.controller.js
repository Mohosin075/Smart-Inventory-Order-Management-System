"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const handleWebhook = (0, catchAsync_1.default)(async (req, res) => {
    // Minimal webhook handler stub — real logic (signature verification, events) should be implemented
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Webhook received' });
});
exports.SubscriptionController = { handleWebhook };
