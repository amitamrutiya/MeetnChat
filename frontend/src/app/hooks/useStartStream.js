"use strict";
"use client";
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
exports.useStartUserStream = void 0;
const react_1 = require("react");
const peer_1 = __importDefault(require("@/service/peer"));
const MediaStream_1 = require("@/app/context/MediaStream");
const ScreenStream_1 = require("@/app/context/ScreenStream");
const useStartUserStream = () => {
    const { setUserMediaStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { setUserMediaScreenStream } = (0, react_1.useContext)(ScreenStream_1.MediaScreenStreamContext);
    const handleStartAudioVideoStream = (audioDeviceId, videoDeviceId) => __awaiter(void 0, void 0, void 0, function* () {
        const stream = yield navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
            },
            video: {
                deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
            },
        });
        if (stream && setUserMediaStream)
            setUserMediaStream(stream);
        for (const track of stream.getTracks()) {
            if (peer_1.default.peer) {
                peer_1.default.peer.addTrack(track, stream);
            }
        }
    });
    const handleStartScreenShareStream = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const stream = yield navigator.mediaDevices.getDisplayMedia({});
        if (stream && setUserMediaScreenStream)
            setUserMediaScreenStream(stream);
        const track = stream.getTracks()[0];
        if (peer_1.default.peer) {
            (_a = peer_1.default.peer) === null || _a === void 0 ? void 0 : _a.addTrack(track, stream);
        }
    });
    return { handleStartAudioVideoStream, handleStartScreenShareStream };
};
exports.useStartUserStream = useStartUserStream;
