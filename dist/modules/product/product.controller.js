"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const product_service_1 = require("./product.service");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { name } = req.body;
    const category = await product_service_1.ProductServices.createCategory(name);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: 'Category created successfully', category });
});
const listCategories = (0, catchAsync_1.default)(async (req, res) => {
    const categories = await product_service_1.ProductServices.listCategories();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: categories });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await product_service_1.ProductServices.updateCategory(id, name);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Category updated successfully', category: updated });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await product_service_1.ProductServices.deleteCategory(id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Category deleted successfully' });
});
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const product = await product_service_1.ProductServices.createProduct(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: 'Product created successfully', product });
});
const listProducts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_service_1.ProductServices.listProducts({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        categoryId: req.query.category
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: result.data, meta: result.meta });
});
const getProduct = (0, catchAsync_1.default)(async (req, res) => {
    const product = await product_service_1.ProductServices.getProduct(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: product });
});
const updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const updated = await product_service_1.ProductServices.updateProduct(req.params.id, req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Product updated', data: updated });
});
const restockProduct = (0, catchAsync_1.default)(async (req, res) => {
    const updated = await product_service_1.ProductServices.restockProduct(req.params.id, req.body.quantity);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Product restocked', data: updated });
});
const deleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    await product_service_1.ProductServices.deleteProduct(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Product deleted' });
});
exports.ProductController = {
    createCategory,
    createProduct,
    listProducts,
    getProduct,
    updateProduct,
    restockProduct,
    listCategories,
    deleteProduct,
    updateCategory,
    deleteCategory
};
