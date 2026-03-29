"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const conflict_service_1 = require("./conflict.service");
const detectConflicts = (0, catchAsync_1.default)(async (req, res) => {
    const conflicts = await conflict_service_1.ConflictServices.detectConflicts(req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Conflict detection completed', conflicts });
});
exports.ConflictController = { detectConflicts };
