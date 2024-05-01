"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_themes_1 = require("next-themes");
const react_1 = __importDefault(require("@tsparticles/react"));
// import configs from "@tsparticles/configs";
function ParticlesComponent(props) {
    const { theme } = (0, next_themes_1.useTheme)();
    return (props.done && (<react_1.default id={props.id} url={theme == "light"
            ? "/particlesjs-config-light.json"
            : "/particlesjs-config-dark.json"}/>));
}
exports.default = ParticlesComponent;
