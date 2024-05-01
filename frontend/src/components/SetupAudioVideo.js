"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_player_1 = __importDefault(require("react-player"));
const button_1 = require("./ui/button");
const lucide_react_1 = require("lucide-react");
const client_1 = require("@auth0/nextjs-auth0/client");
const image_1 = __importDefault(require("next/image"));
const AudioVideoStream_1 = require("@/app/context/AudioVideoStream");
const AudioVideoDevices_1 = require("@/app/context/AudioVideoDevices");
const AudioVideoDeviceDropDown_1 = __importDefault(require("./AudioVideoDeviceDropDown"));
const MediaStream_1 = require("@/app/context/MediaStream");
const useStartStream_1 = require("@/app/hooks/useStartStream");
const useStopStream_1 = require("@/app/hooks/useStopStream");
function SetupAudioVideo() {
    const { handleStartAudioVideoStream } = (0, useStartStream_1.useStartUserStream)();
    const { handleStopAudioVideoStream } = (0, useStopStream_1.useStopUserStream)();
    const { userStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { audio, video, setAudio, setVideo } = (0, react_1.useContext)(AudioVideoStream_1.AudioVideoStreamContext);
    const { audioDevices, videoDevices, setAudioDevices, setVideoDevices, selectedAudioDevice, selectedVideoDevice, setSelectedAudioDevice, setSelectedVideoDevice, } = (0, react_1.useContext)(AudioVideoDevices_1.AudioVideoDevicesContext);
    const [devices, setDevices] = (0, react_1.useState)([]);
    const { user } = (0, client_1.useUser)();
    (0, react_1.useEffect)(() => {
        navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
            setDevices(deviceInfos);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        const uniqueAudioDevices = [];
        const groupIdSet = new Set();
        for (const device of devices) {
            if (device.kind === "audioinput" && !groupIdSet.has(device.groupId)) {
                uniqueAudioDevices.push(device);
                groupIdSet.add(device.groupId);
            }
        }
        setAudioDevices(uniqueAudioDevices);
    }, [devices, setAudioDevices]);
    (0, react_1.useEffect)(() => {
        const uniqueVideoDevices = [];
        const groupIdSet = new Set();
        for (const device of devices) {
            if (device.kind === "videoinput" && !groupIdSet.has(device.groupId)) {
                uniqueVideoDevices.push(device);
                groupIdSet.add(device.groupId);
            }
        }
        setVideoDevices(uniqueVideoDevices);
    }, [devices, setVideoDevices]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (userStream) {
            const audioTrack = userStream.getAudioTracks()[0];
            const videoTrack = userStream.getVideoTracks()[0];
            setSelectedAudioDevice(audioTrack.getSettings().deviceId);
            setSelectedVideoDevice(videoTrack.getSettings().deviceId);
        }
        else {
            setSelectedAudioDevice((_a = audioDevices[0]) === null || _a === void 0 ? void 0 : _a.deviceId);
            setSelectedVideoDevice((_b = videoDevices[0]) === null || _b === void 0 ? void 0 : _b.deviceId);
        }
    }, [audioDevices, videoDevices]);
    (0, react_1.useEffect)(() => {
        if (userStream) {
            handleStopAudioVideoStream();
            handleStartAudioVideoStream(selectedAudioDevice, selectedVideoDevice);
        }
    }, [selectedAudioDevice, selectedVideoDevice]);
    (0, react_1.useEffect)(() => {
        if (!audio && !video)
            handleStopAudioVideoStream();
    }, [audio, video]);
    <style jsx>{`
    .image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `}</style>;
    return (<div className="flex flex-col w-full items-center justify-center">
      <div className="flex justify-center items-center border-8 border-hover p-0 m-0 rounded-xl h-[380px] w-[500px] relative">
        {userStream ? (<react_player_1.default url={userStream} playing pip/>) : user ? (<image_1.default className="rounded-[8px]" layout="fill" objectFit="cover" src={user.picture} alt="Picture of the User"/>) : (<div className="bg-foreground h-[100%] w-[100%] flex justify-center items-center">
            <image_1.default className="rounded-[8px]" height={350} width={350} src={"/user.png"} alt="Picture of the User"/>
          </div>)}
      </div>
      <div className="my-5"/>

      <div>
        <button_1.Button className={audio ? "bg-primary" : "bg-foreground"} onClick={() => {
            setAudio(!audio);
            if (!userStream) {
                handleStartAudioVideoStream();
                return;
            }
            const audioTrack = userStream === null || userStream === void 0 ? void 0 : userStream.getTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
            }
        }}>
          {audio ? <lucide_react_1.MicIcon /> : <lucide_react_1.MicOffIcon />}
        </button_1.Button>

        <button_1.Button className={video ? "bg-primary ml-5" : "bg-foreground ml-5"} onClick={() => {
            if (!userStream) {
                setVideo(true);
                setAudio(true);
                handleStartAudioVideoStream();
                return;
            }
            setVideo(!video);
            const videoTrack = userStream === null || userStream === void 0 ? void 0 : userStream.getTracks()[1];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
            }
        }}>
          {video ? <lucide_react_1.VideoIcon /> : <lucide_react_1.VideoOffIcon />}
        </button_1.Button>
      </div>
      <AudioVideoDeviceDropDown_1.default />
    </div>);
}
exports.default = SetupAudioVideo;
