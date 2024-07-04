"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import Image from "next/image";
import AudioVideoDeviceDropDown from "./audio-video-device-drop-down";
import { useSession } from "next-auth/react";
import { useStartUserStream } from "../hooks/use-start-stream";
import { useStopUserStream } from "../hooks/use-stop-stream";
import { Button } from "@repo/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  audioDevicesAtom,
  isAudioStreamEnabledAtom,
  isVideoStreamEnabledAtom,
  selectedAudioDeviceAtom,
  selectedVideoDeviceAtom,
  userStreamAtom,
  videoDevicesAtom,
} from "@repo/store";

function SetupAudioVideo() {
  const session = useSession();
  const user = session.data?.user;
  const { handleStartAudioVideoStream } = useStartUserStream();
  const { handleStopAudioVideoStream } = useStopUserStream();
  const userStream = useRecoilValue(userStreamAtom);
  const [audio, setAudio] = useRecoilState(isAudioStreamEnabledAtom);
  const [video, setVideo] = useRecoilState(isVideoStreamEnabledAtom);
  const [audioDevices, setAudioDevices] = useRecoilState(audioDevicesAtom);
  const [videoDevices, setVideoDevices] = useRecoilState(videoDevicesAtom);
  const [selectedAudioDevice, setSelectedAudioDevice] = useRecoilState(
    selectedAudioDeviceAtom
  );
  const [selectedVideoDevice, setSelectedVideoDevice] = useRecoilState(
    selectedVideoDeviceAtom
  );

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((_) => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setDevices(devices);
        });
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
    setAudioDevices([...uniqueAudioDevices]);
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
    setVideoDevices([...uniqueVideoDevices]);
  }, [devices, setVideoDevices]);

  useEffect(() => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];
      const videoTrack = userStream.getVideoTracks()[0];
      setSelectedAudioDevice(audioTrack?.getSettings().deviceId!);
      setSelectedVideoDevice(videoTrack?.getSettings().deviceId!);
    } else {
      setSelectedAudioDevice(audioDevices[0]?.deviceId!);
      setSelectedVideoDevice(videoDevices[0]?.deviceId!);
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
  }, [audio, handleStopAudioVideoStream, video]);

  <style jsx>{`
    .image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `}</style>;

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex justify-center items-center border-8 border-hover p-0 m-0 rounded-xl h-[380px] w-[500px] relative">
        {userStream ? (
          <ReactPlayer url={userStream} playing pip />
        ) : session.status === "loading" ? (
          <p>Loading...</p>
        ) : user?.image ? (
          <Image
            className="rounded-[8px]"
            layout="fill"
            objectFit="cover"
            src={user.image}
            alt="Picture of the User"
          />
        ) : (
          <div className="bg-foreground h-[100%] w-[100%] flex justify-center items-center">
            <Image
              className="rounded-[8px]"
              height={350}
              width={350}
              src={"/user.png"}
              alt="Picture of the User"
            />
          </div>
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
