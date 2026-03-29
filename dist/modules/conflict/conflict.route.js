"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictRoutes = void 0;
const express_1 = require("express");
const conflict_controller_1 = require("./conflict.controller");
const router = (0, express_1.Router)();
router.post('/detect', conflict_controller_1.ConflictController.detectConflicts);
exports.ConflictRoutes = router;
