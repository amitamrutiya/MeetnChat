"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStreamProvider = exports.MediaStreamContext = void 0;
const react_1 = __importDefault(require("react"));
exports.MediaStreamContext = react_1.default.createContext(null);
const MediaStreamProvider = (props) => {
    const [remoteMediastreams, setRemoteMediaStream] = react_1.default.useState([]);
    const [userMediaStream, setUserMediaStream] = react_1.default.useState(null);
    return (<exports.MediaStreamContext.Provider value={{
            remoteStreams: remoteMediastreams,
            userStream: userMediaStream,
            setRemoteMediaStream,
            setUserMediaStream,
        }}>
      {props.children}
    </exports.MediaStreamContext.Provider>);
};
exports.MediaStreamProvider = MediaStreamProvider;
