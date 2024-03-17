"use client";

import React, { useState } from "react";

export interface AudioVideoStreamProps {
  audio: boolean;
  video: boolean;
  setAudio: (audio: boolean) => void;
  setVideo: (video: boolean) => void;
}

export const AudioVideoStreamContext =
  React.createContext<AudioVideoStreamProps | null>(null);

export const AudioVideoStreamProvider: React.FC<React.PropsWithChildren> = (
  props
) => {
  const [audio, setAudio] = useState<boolean>(false);
  const [video, setVideo] = useState<boolean>(false);

  return (
    <AudioVideoStreamContext.Provider
      value={{
        audio,
        video,
        setAudio,
        setVideo,
      }}
    >
      {props.children}
    </AudioVideoStreamContext.Provider>
  );
};
