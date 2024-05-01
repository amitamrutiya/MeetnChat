"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
const server_1 = require("next/server");
function middleware(request) {
    var _a;
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/";
    const token = ((_a = request.cookies.get("appSession")) === null || _a === void 0 ? void 0 : _a.value) || "";
    if (!isPublicPath && !token) {
        return server_1.NextResponse.redirect(new URL("/", request.nextUrl));
    }
}
exports.middleware = middleware;
exports.config = {
    matcher: ["/", "/room/group-meet/:room*", "/room", "/logout"],
};
