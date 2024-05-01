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
Object.defineProperty(exports, "__esModule", { value: true });
class WebRTCSerice {
    constructor() {
        this._peer = new RTCPeerConnection({
            //@ts-ignore
            // sdpSemantics: 'unified-plan',
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478',
                    ],
                },
                {
                    urls: 'turn:turn.p2pshare.tech:3478',
                    username: 'admin',
                    credential: 'admin1',
                },
            ],
        });
    }
}
class PeerService {
    init() {
        var _a;
        if (!this._webRtc) {
            this._webRtc = new WebRTCSerice();
            this.myDataChanel = (_a = this.peer) === null || _a === void 0 ? void 0 : _a.createDataChannel(`file-transfer-${Date.now()}`);
            return this;
        }
    }
    getOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._webRtc) {
                const offer = yield this._webRtc._peer.createOffer();
                yield this._webRtc._peer.setLocalDescription(new RTCSessionDescription(offer));
                return offer;
            }
        });
    }
    getAnswer(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._webRtc) {
                yield this._webRtc._peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = yield this._webRtc._peer.createAnswer();
                yield this._webRtc._peer.setLocalDescription(new RTCSessionDescription(answer));
                return answer;
            }
        });
    }
    setRemoteDesc(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._webRtc) {
                return yield this._webRtc._peer.setRemoteDescription(new RTCSessionDescription(offer));
            }
        });
    }
    get peer() {
        var _a;
        return (_a = this._webRtc) === null || _a === void 0 ? void 0 : _a._peer;
    }
}
const peerService = new PeerService();
exports.default = peerService;
