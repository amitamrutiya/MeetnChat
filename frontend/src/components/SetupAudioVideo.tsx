import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SetupAudioVideo(props: {
  userStream: any;
  handleStartAudioVideoStream: (
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => void;
  handleStopAudioVideoStream: () => void;
}) {
  const {
    userStream,
    handleStartAudioVideoStream,
    handleStopAudioVideoStream,
  } = props;

  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const { user } = useUser();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      setDevices(deviceInfos);
    });
  }, []);

  const audioDevices = useMemo(() => {
    const uniqueAudioDevices = [];
    const groupIdSet = new Set();

    for (const device of devices) {
      if (device.kind === "audioinput" && !groupIdSet.has(device.groupId)) {
        uniqueAudioDevices.push(device);
        groupIdSet.add(device.groupId);
      }
    }

    return uniqueAudioDevices;
  }, [devices]);

  const videoDevices = useMemo(() => {
    const uniqueVideoDevices = [];
    const groupIdSet = new Set();

    for (const device of devices) {
      if (device.kind === "videoinput" && !groupIdSet.has(device.groupId)) {
        uniqueVideoDevices.push(device);
        groupIdSet.add(device.groupId);
      }
    }

    return uniqueVideoDevices;
  }, [devices]);

  useEffect(() => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];
      const videoTrack = userStream.getVideoTracks()[0];
      setSelectedAudioDevice(audioTrack.getSettings().deviceId);
      setSelectedVideoDevice(videoTrack.getSettings().deviceId);
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
      <div className="flex justify-center items-center my-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-foreground">Select Audio Devices</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Audio Devices</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedAudioDevice}
              onValueChange={setSelectedAudioDevice}
            >
              {audioDevices.map((device) => (
                <DropdownMenuRadioItem
                  key={device.deviceId}
                  value={device.deviceId}
                >
                  {device.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-foreground ml-5">Select Video Devices</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Video Devices</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedVideoDevice}
              onValueChange={setSelectedVideoDevice}
            >
              {videoDevices.map((device) => (
                <DropdownMenuRadioItem
                  key={device.deviceId}
                  value={device.deviceId}
                >
                  {device.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default SetupAudioVideo;
