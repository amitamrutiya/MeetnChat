"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const nextjs_auth0_1 = require("@auth0/nextjs-auth0");
exports.GET = (0, nextjs_auth0_1.handleAuth)();
// /api/auth/login: The route used to perform login with Auth0.
// /api/auth/logout: The route used to log the user out.
// /api/auth/callback: The route Auth0 will redirect the user to after a successful login.
// /api/auth/me: The route to fetch the user profile from.
