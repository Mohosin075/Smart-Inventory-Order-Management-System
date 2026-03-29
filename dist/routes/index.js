"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const express_1 = __importDefault(require("express"));
const public_route_1 = require("../modules/public/public.route");
const support_route_1 = require("../modules/support/support.route");
const upload_route_1 = require("../modules/upload/upload.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const stock_route_1 = require("../modules/stock/stock.route");
const restock_route_1 = require("../modules/restock/restock.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const activity_route_1 = require("../modules/activity/activity.route");
const search_route_1 = require("../modules/search/search.route");
const conflict_route_1 = require("../modules/conflict/conflict.route");
const notification_routes_1 = require("../modules/notification/notification.routes");
const message_routes_1 = require("../modules/message/message.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const review_route_1 = require("../modules/review/review.route");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
const apiRoutes = [
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/notifications', route: notification_routes_1.NotificationRoutes },
    { path: '/public', route: public_route_1.PublicRoutes },
    { path: '/support', route: support_route_1.SupportRoutes },
    { path: '/upload', route: upload_route_1.UploadRoutes },
    { path: '/message', route: message_routes_1.MessageRoutes },
    { path: '/chat', route: chat_routes_1.ChatRoutes },
    { path: '/review', route: review_route_1.ReviewRoutes },
    { path: '/products', route: product_route_1.ProductRoutes },
    { path: '/orders', route: order_route_1.OrderRoutes },
    { path: '/stock', route: stock_route_1.StockRoutes },
    { path: '/restock', route: restock_route_1.RestockRoutes },
    { path: '/dashboard', route: dashboard_route_1.DashboardRoutes },
    { path: '/activity', route: activity_route_1.ActivityRoutes },
    { path: '/search', route: search_route_1.SearchRoutes },
    { path: '/conflict', route: conflict_route_1.ConflictRoutes },
];
apiRoutes.forEach(route => {
    router.use(route.path, route.route);
});
router.get('/status', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Server is running smoothly',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV,
    });
});
exports.default = router;
