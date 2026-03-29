"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockRoutes = void 0;
const express_1 = require("express");
const stock_controller_1 = require("./stock.controller");
const router = (0, express_1.Router)();
router.post('/deduct', stock_controller_1.StockController.handleStockDeduction);
router.post('/restock', stock_controller_1.StockController.handleStockRestock);
exports.StockRoutes = router;
