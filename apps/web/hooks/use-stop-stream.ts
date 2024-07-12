"use client";

import { useRecoilState } from "recoil";
import { userScreenStreamAtom, userStreamAtom } from "@repo/store";

export const useStopUserStream = () => {
  const [userMediaStrem, setUserMediaStream] = useRecoilState(userStreamAtom);
  const [userScreenStream, setUserMediaScreenStream] = useRecoilState(userScreenStreamAtom);

  const handleStopAudioVideoStream = () => {
    if (userMediaStrem) {
      userMediaStrem.getTracks().forEach((track) => {
        track.stop();
      });
      if (userMediaStrem) setUserMediaStream(null);
    }
  };

  const handleStopScreenShareStream = () => {
    if (userScreenStream) {
      userScreenStream.getTracks().forEach((track: any) => {
        track.stop();
      });
      if (setUserMediaScreenStream) setUserMediaScreenStream(null);
    }
  };

  return { handleStopAudioVideoStream, handleStopScreenShareStream };
};
