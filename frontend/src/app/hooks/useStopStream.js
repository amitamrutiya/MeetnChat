"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStopUserStream = void 0;
const react_1 = require("react");
const MediaStream_1 = require("@/app/context/MediaStream");
const ScreenStream_1 = require("@/app/context/ScreenStream");
const useStopUserStream = () => {
    const { userStream, setUserMediaStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { userScreenStream, setUserMediaScreenStream } = (0, react_1.useContext)(ScreenStream_1.MediaScreenStreamContext);
    const handleStopAudioVideoStream = () => {
        if (userStream) {
            userStream.getTracks().forEach((track) => {
                track.stop();
            });
            if (setUserMediaStream)
                setUserMediaStream(null);
        }
    };
    const handleStopScreenShareStream = () => {
        if (userScreenStream) {
            userScreenStream.getTracks().forEach((track) => {
                track.stop();
            });
            if (setUserMediaScreenStream)
                setUserMediaScreenStream(null);
        }
    };
    return { handleStopAudioVideoStream, handleStopScreenShareStream };
};
exports.useStopUserStream = useStopUserStream;
