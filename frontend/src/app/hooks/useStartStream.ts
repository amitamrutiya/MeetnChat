"use client";

import { useContext } from "react";
import peerService from "@/service/peer";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";

export const useStartUserStream = () => {
  const { setUserMediaStream } = useContext(
    MediaStreamContext
  ) as ProviderProps;

  const { setUserMediaScreenStream } = useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const handleStartAudioVideoStream = async (
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
      },
      video: {
        deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
      },
    });

    if (stream && setUserMediaStream) setUserMediaStream(stream);
    for (const track of stream.getTracks()) {
      if (peerService.peer) {
        peerService.peer.addTrack(track, stream);
      }
    }
  };

  const handleStartScreenShareStream = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({});

    if (stream && setUserMediaScreenStream) setUserMediaScreenStream(stream);

    const track = stream.getTracks()[0];
    if (peerService.peer) {
      peerService.peer?.addTrack(track, stream);
    }
  };
  return { handleStartAudioVideoStream, handleStartScreenShareStream };
};
