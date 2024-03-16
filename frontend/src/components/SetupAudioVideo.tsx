import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import { MicOffIcon, MicIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

function SetupAudioVideo(props: {
  userStream: any;
  handleStartAudioVideoStream: () => void;
  handleStopAudioVideoStream: () => void;
}) {
  const {
    userStream,
    handleStartAudioVideoStream,
    handleStopAudioVideoStream,
  } = props;

  const [audio, setaudio] = useState(false);
  const [video, setvideo] = useState(false);
  const { user } = useUser();

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
        {" "}
        {video && (
          <Button
            className={audio ? "bg-primary" : "bg-foreground"}
            onClick={async () => {
              setaudio(!audio);
              if (!userStream) {
                await handleStartAudioVideoStream();
                return;
              }
              const audioTrack = userStream?.getTracks()[0];
              if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
              }
              console.log("Audio track", audioTrack);
            }}
          >
            {audio ? <MicIcon /> : <MicOffIcon />}
          </Button>
        )}
        <Button
          className={video ? "bg-primary ml-5" : "bg-foreground ml-5"}
          onClick={() => {
            if (!userStream) {
              setvideo(true);
              setaudio(true);
              handleStartAudioVideoStream();
              return;
            }
            setvideo(!video);
            const videoTrack = userStream?.getTracks()[1];
            const audioTrack = userStream?.getTracks()[0];
            if (videoTrack.enabled) {
              videoTrack.enabled = false;
              audioTrack.enabled = false;
              setaudio(false);
              handleStopAudioVideoStream();
            } else {
              videoTrack.enabled = true;
            }
            console.log("Video track", videoTrack);
          }}
        >
          {video ? <VideoIcon /> : <VideoOffIcon />}
        </Button>
      </div>
    </div>
  );
}

export default SetupAudioVideo;
