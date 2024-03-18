"use client";

import React, { FC, PropsWithChildren, createContext, useState } from "react";

export interface ProviderScreenProps {
  remoteScreenStream: MediaStream | null;
  userScreenStream: MediaStream | null;
  setUserMediaScreenStream?: (stream: MediaStream | null) => void;
  setScreenRemoteMediaStream?: (stream: MediaStream) => void;
}

export const MediaScreenStreamContext =
  createContext<ProviderScreenProps | null>(null);

export const MediaScreenStreamProvider: FC<PropsWithChildren> = (
  props
) => {
  const [ScreenRemoteMediastream, setScreenRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const [userMediaScreenStream, setUserMediaScreenStream] =
    useState<MediaStream | null>(null);

  return (
    <MediaScreenStreamContext.Provider
      value={{
        remoteScreenStream: ScreenRemoteMediastream,
        userScreenStream: userMediaScreenStream,
        setScreenRemoteMediaStream,
        setUserMediaScreenStream,
      }}
    >
      {props.children}
    </MediaScreenStreamContext.Provider>
  );
};
