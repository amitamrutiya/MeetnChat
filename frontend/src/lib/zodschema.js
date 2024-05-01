"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const formSchema = zod_1.z.object({
    roomId: zod_1.z.string().uuid(),
});
exports.default = formSchema;
