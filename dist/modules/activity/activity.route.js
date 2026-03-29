"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRoutes = void 0;
const express_1 = require("express");
const activity_controller_1 = require("./activity.controller");
const router = (0, express_1.Router)();
router.get('/recent', activity_controller_1.ActivityController.getRecentActivities);
exports.ActivityRoutes = router;
