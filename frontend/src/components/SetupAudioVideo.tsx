import { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import {
  AudioVideoStreamContext,
  AudioVideoStreamProps,
} from "@/app/context/AudioVideoStream";
import {
  AudioVideoDevicesContext,
  AudioVideoDevicesProps,
} from "@/app/context/AudioVideoDevices";
import AudioVideoDeviceDropDown from "./AudioVideoDeviceDropDown";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { useStartUserStream } from "@/app/hooks/useStartStream";
import { useStopUserStream } from "@/app/hooks/useStopStream";

function SetupAudioVideo() {
  const { handleStartAudioVideoStream } = useStartUserStream();
  const { handleStopAudioVideoStream } = useStopUserStream();
  const { userStream } = useContext(MediaStreamContext) as ProviderProps;
  const { audio, video, setAudio, setVideo } = useContext(
    AudioVideoStreamContext
  ) as AudioVideoStreamProps;

  const {
    audioDevices,
    videoDevices,
    setAudioDevices,
    setVideoDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
  } = useContext(AudioVideoDevicesContext) as AudioVideoDevicesProps;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const { user } = useUser();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      setDevices(deviceInfos);
    });
  }, []);

  useEffect(() => {
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

  useEffect(() => {
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

  useEffect(() => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];
      const videoTrack = userStream.getVideoTracks()[0];
      setSelectedAudioDevice(audioTrack.getSettings().deviceId!);
      setSelectedVideoDevice(videoTrack.getSettings().deviceId!);
    } else {
      setSelectedAudioDevice(audioDevices[0]?.deviceId);
      setSelectedVideoDevice(videoDevices[0]?.deviceId);
    }
  }, [audioDevices, videoDevices]);

  useEffect(() => {
    if (userStream) {
      handleStopAudioVideoStream();
      handleStartAudioVideoStream(selectedAudioDevice, selectedVideoDevice);
    }
  }, [selectedAudioDevice, selectedVideoDevice]);

  useEffect(() => {
    if (!audio && !video) handleStopAudioVideoStream();
  }, [audio, video]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex justify-center items-center border-8 border-hover p-0 m-0 rounded-xl h-[380px] w-[500px] relative">
        {userStream ? (
          <ReactPlayer url={userStream} playing pip />
        ) : (
          <Image
            src={user?.picture || "/user.png"}
            alt="Picture of the User"
            layout="fill"
            objectFit="cover"
            className="rounded-[8px]"
          />
        )}
      </div>
      <div className="my-5" />

      <div>
        <Button
          className={audio ? "bg-primary" : "bg-foreground"}
          onClick={() => {
            setAudio(!audio);
            if (!userStream) {
              handleStartAudioVideoStream();
              return;
            }
            const audioTrack = userStream?.getTracks()[0];
            if (audioTrack) {
              audioTrack.enabled = !audioTrack.enabled;
            }
          }}
        >
          {audio ? <MicIcon /> : <MicOffIcon />}
        </Button>

        <Button
          className={video ? "bg-primary ml-5" : "bg-foreground ml-5"}
          onClick={() => {
            if (!userStream) {
              setVideo(true);
              setAudio(true);
              handleStartAudioVideoStream();
              return;
            }
            setVideo(!video);
            const videoTrack = userStream?.getTracks()[1];
            if (videoTrack) {
              videoTrack.enabled = !videoTrack.enabled;
            }
          }}
        >
          {video ? <VideoIcon /> : <VideoOffIcon />}
        </Button>
      </div>
      <AudioVideoDeviceDropDown />
    </div>
  );
}

export default SetupAudioVideo;
