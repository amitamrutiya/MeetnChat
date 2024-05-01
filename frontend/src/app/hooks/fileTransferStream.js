"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peer_1 = __importDefault(require("@/service/peer"));
const crypto_1 = require("crypto");
const react_1 = require("react");
function useFileTransfer() {
    const secret = (0, react_1.useMemo)(() => "$3#Ia", []);
    const handleFileTransfer = (0, react_1.useCallback)((file) => {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (peer_1.default.myDataChanel) {
                let buffer = yield file.arrayBuffer();
                const bufferString = JSON.stringify(buffer);
                const hash = (0, crypto_1.createHmac)("md5", secret)
                    .update(bufferString)
                    .digest("hex");
                try {
                    peer_1.default.myDataChanel.send(JSON.stringify({
                        name: file.name,
                        size: file.size,
                        checksum: hash,
                    }));
                }
                catch (error) {
                    reject();
                }
                let offset = 0;
                let maxChunkSize = 1024 * 26;
                peer_1.default.myDataChanel.binaryType = "arraybuffer";
                try {
                    const send = () => {
                        var _a, _b;
                        while (buffer.byteLength) {
                            if (peer_1.default &&
                                peer_1.default.myDataChanel &&
                                ((_a = peer_1.default === null || peer_1.default === void 0 ? void 0 : peer_1.default.myDataChanel) === null || _a === void 0 ? void 0 : _a.bufferedAmount) >
                                    ((_b = peer_1.default === null || peer_1.default === void 0 ? void 0 : peer_1.default.myDataChanel) === null || _b === void 0 ? void 0 : _b.bufferedAmountLowThreshold)) {
                                peer_1.default.myDataChanel.onbufferedamountlow = () => {
                                    if (peer_1.default && peer_1.default.myDataChanel)
                                        peer_1.default.myDataChanel.onbufferedamountlow = null;
                                    send();
                                };
                                return;
                            }
                            const chunk = buffer.slice(0, maxChunkSize);
                            buffer = buffer.slice(maxChunkSize, buffer.byteLength);
                            if (peer_1.default && peer_1.default.myDataChanel)
                                peer_1.default === null || peer_1.default === void 0 ? void 0 : peer_1.default.myDataChanel.send(chunk);
                        }
                        resolve();
                    };
                    send();
                }
                catch (err) {
                    reject();
                }
            }
        }));
    }, [secret]);
    return { handleFileTransfer };
}
exports.default = useFileTransfer;
