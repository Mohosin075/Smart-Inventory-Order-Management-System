"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRoutes = void 0;
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const router = (0, express_1.Router)();
router.get('/products', search_controller_1.SearchController.searchProducts);
exports.SearchRoutes = router;
