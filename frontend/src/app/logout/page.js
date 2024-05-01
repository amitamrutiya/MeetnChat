"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
function Login() {
    const router = (0, navigation_1.useRouter)();
    const navigate = () => {
        router.push("/api/auth/logout");
    };
    return <button_1.Button onClick={navigate}>Logout</button_1.Button>;
}
exports.default = Login;
