"use client"

import React, { useState } from "react";

export interface AudioVideoDevicesProps {
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  setAudioDevices: (devices: MediaDeviceInfo[]) => void;
  setVideoDevices: (devices: MediaDeviceInfo[]) => void;
  selectedAudioDevice: string;
  selectedVideoDevice: string;
  setSelectedAudioDevice: (deviceId: string) => void;
  setSelectedVideoDevice: (deviceId: string) => void;
}

export const AudioVideoDevicesContext =
  React.createContext<AudioVideoDevicesProps | null>(null);

export const AudioVideoDevicesProvider: React.FC<React.PropsWithChildren> = (
  props
) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");

  return (
    <AudioVideoDevicesContext.Provider
      value={{
        audioDevices,
        videoDevices,
        setAudioDevices,
        setVideoDevices,
        selectedAudioDevice,
        selectedVideoDevice,
        setSelectedAudioDevice,
        setSelectedVideoDevice,
      }}
    >
      {props.children}
    </AudioVideoDevicesContext.Provider>
  );
};
