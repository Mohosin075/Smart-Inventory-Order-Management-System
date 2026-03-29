"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const ActivitySchema = new mongoose_1.Schema({
    action: { type: String, required: true },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.Activity = (0, mongoose_1.model)('Activity', ActivitySchema);
