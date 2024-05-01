"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const size_1 = require("@/utils/size");
const moment_1 = __importDefault(require("moment"));
function FileCard(props) {
    var _a;
    const { file } = props;
    const handleFileDownload = react_1.default.useCallback((file) => {
        if (!file.blob)
            return;
        const blob = file.blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }, []);
    const progress = (0, react_1.useMemo)(() => {
        if (file && file.recievedSize && file.size) {
            return (file.recievedSize / file.size) * 100;
        }
        return 0;
    }, [file]);
    const convertedTime = (0, react_1.useMemo)(() => file.timestamp
        ? (0, moment_1.default)(new Date(file.timestamp), "MM").fromNow()
        : undefined, [file.timestamp]);
    return (<div>
      <div className="relative mt-3 w-full flex cursor-pointer items-center justify-between rounded-md bg-slate-800 py-2 px-5 font-sans text-white shadow-md hover:animate-pulse">
        <div className="z-10 flex items-center">
          <lucide_react_1.FileIcon className="mr-3"/>
          <div>
            <p className="text-base">
              {file.name} | {`${(_a = file.checksum) === null || _a === void 0 ? void 0 : _a.substring(0, 5)}...`}
            </p>
            <p className="text-slate-50 text-xs">
              {file.recievedSize && (0, size_1.formatBytes)(file.recievedSize)}
              {" / "}
              {(0, size_1.formatBytes)(file.size)}
            </p>
          </div>
        </div>
        <div className="z-10" onClick={() => handleFileDownload(file)}>
          {file.blob && <lucide_react_1.DownloadCloudIcon />}
        </div>
        <div className={`absolute ml-[-20px] h-full rounded-md transition-all ${progress >= 100 && file.checksumMatched
            ? "bg-green-600"
            : "bg-sky-500"}`} style={{ width: `${progress}%` }}></div>
      </div>
      <small className="float-right pr-[16px] text-slate-400 mb-2">
        {convertedTime}
      </small>
    </div>);
}
exports.default = FileCard;
