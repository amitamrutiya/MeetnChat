import { PhoneOffIcon } from "lucide-react";
import React, { useContext } from "react";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { Button } from "./ui/button";
import {
  AudioVideoStreamContext,
  AudioVideoStreamProps,
} from "@/app/context/AudioVideoStream";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/app/context/SocketContext";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EndMeetButtonProps = {
  onStopAudioVideoStream: () => void;
};

function EndMeetButton(props: EndMeetButtonProps) {
  const {
    onStopAudioVideoStream,
  } = props;

  const { audio, video, setAudio, setVideo } = React.useContext(
    AudioVideoStreamContext
  ) as AudioVideoStreamProps;
  const {
    setUserMediaStream,
    userStream,
    setRemoteMediaStream,
    remoteStreams,
  } = useContext(MediaStreamContext) as ProviderProps;

  const { userScreenStream, remoteScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;
  const socket = React.useContext(SocketContext) as Socket;
  const router = useRouter();
  return (
    <div>
      {" "}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant={"destructive"} className="ml-5">
                  <PhoneOffIcon />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to end the call?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be disconnected from the call.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {}}>
                    Cancle
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => {
                      if (userStream) {
                        onStopAudioVideoStream();
                      }
                      if (setUserMediaStream) setUserMediaStream(null);
                      if (setRemoteMediaStream) setRemoteMediaStream([]);
                      if (userScreenStream) {
                        userScreenStream.getTracks().forEach((track) => {
                          track.stop();
                        });
                      }
                      if (remoteScreenStream) {
                        remoteScreenStream.getTracks().forEach((track) => {
                          track.stop();
                        });
                      }
                      socket.emit("user-disconnect");
                      router.push("/");
                    }}
                  >
                    End Call
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipTrigger>
          <TooltipContent className="bg-destructive text-foreground">
            <p>End Call</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default EndMeetButton;
