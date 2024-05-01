"use strict";
"use client";
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
const react_player_1 = __importDefault(require("react-player"));
const ai_1 = require("react-icons/ai");
const AudioVideoBar_1 = __importDefault(require("./AudioVideoBar"));
const MediaStream_1 = require("@/app/context/MediaStream");
const ScreenStream_1 = require("@/app/context/ScreenStream");
const MeetControllerBar_1 = __importDefault(require("./MeetControllerBar"));
const MeetDashboard = (props) => {
    const { remoteSocketId, whiteboardID, remoteUser } = props;
    const { userStream, remoteStreams } = react_1.default.useContext(MediaStream_1.MediaStreamContext);
    const { userScreenStream } = react_1.default.useContext(ScreenStream_1.MediaScreenStreamContext);
    const [pinVideo, setPinVideo] = (0, react_1.useState)(null);
    const handlePinVideo = react_1.default.useCallback((id) => {
        const foundStream = remoteStreams.find((stream) => stream.id == id);
        if (foundStream) {
            setPinVideo(foundStream);
        }
        else if (userStream && userStream.id == id) {
            setPinVideo(userStream);
        }
        else if (userScreenStream && userScreenStream.id == id) {
            setPinVideo(userScreenStream);
        }
    }, [userStream, remoteStreams, userScreenStream]);
    const handleUnPinVideo = react_1.default.useCallback(() => {
        setPinVideo(null);
    }, []);
    return (<div className="mt-5  text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 md:col-span-2 sm:col-span-1 xs:col-span-1">
          {pinVideo ? (<div className="group relative">
              <react_player_1.default key={pinVideo.id} width="100%" height="100%" url={pinVideo} playing controls={true} pip muted={pinVideo.id === (userStream === null || userStream === void 0 ? void 0 : userStream.id)}/>
              <button className="absolute top-[50%] left-0 right-0 hid  den group-hover:block" onClick={handleUnPinVideo}>
                <ai_1.AiFillPushpin className="m-auto" size={30} title="UnPin video"/>
              </button>
            </div>) : (<iframe src={`https://witeboard.com/${whiteboardID}`} height="100%" width="100%"/>)}
        </div>
        <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 xs:col-span-1">
          <div className="mb-2 h-[74vh] overflow-auto">
            <AudioVideoBar_1.default pinVideoObj={pinVideo} pinVideo={handlePinVideo} unPinVideo={handleUnPinVideo} remoteUser={remoteUser}/>
          </div>
          <MeetControllerBar_1.default remoteSocketId={remoteSocketId}/>
        </div>
      </div>
    </div>);
};
exports.default = MeetDashboard;
