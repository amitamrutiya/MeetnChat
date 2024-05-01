"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@auth0/nextjs-auth0/client");
function ProfileClient() {
    var _a, _b;
    const { user, error, isLoading } = (0, client_1.useUser)();
    if (isLoading)
        return <div>Loading...</div>;
    if (error)
        return <div>{error.message}</div>;
    return (user && (<div>
        <img src={(_a = user.picture) !== null && _a !== void 0 ? _a : ""} alt={(_b = user.name) !== null && _b !== void 0 ? _b : ""}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>));
}
exports.default = ProfileClient;
