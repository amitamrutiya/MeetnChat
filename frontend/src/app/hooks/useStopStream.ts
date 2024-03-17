"use client";

import { useContext } from "react";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";

export const useStopUserStream = () => {
  const { userStream, setUserMediaStream } = useContext(
    MediaStreamContext
  ) as ProviderProps;
  const { userScreenStream, setUserMediaScreenStream } = useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const handleStopAudioVideoStream = () => {
    if (userStream) {
      userStream.getTracks().forEach((track) => {
        track.stop();
      });
      if (setUserMediaStream) setUserMediaStream(null);
    }
  };

  const handleStopScreenShareStream = () => {
    if (userScreenStream) {
      userScreenStream.getTracks().forEach((track) => {
        track.stop();
      });
      if (setUserMediaScreenStream) setUserMediaScreenStream(null);
    }
  };

  return { handleStopAudioVideoStream, handleStopScreenShareStream };
};
