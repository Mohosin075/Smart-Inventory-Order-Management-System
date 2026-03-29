"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restock = void 0;
const mongoose_1 = require("mongoose");
const RestockSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
}, { timestamps: true });
exports.Restock = (0, mongoose_1.model)('Restock', RestockSchema);
