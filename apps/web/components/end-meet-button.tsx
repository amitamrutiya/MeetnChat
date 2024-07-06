import { PhoneOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  TooltipContent,
  Button,
} from "@repo/ui";
import { useStopUserStream } from "../hooks/use-stop-stream";
import { useRecoilValue } from "recoil";
import { SocketContext, userScreenStreamAtom, userStreamAtom } from "@repo/store";
import { useContext } from "react";

function EndMeetButton() {
  const { handleStopAudioVideoStream, handleStopScreenShareStream } = useStopUserStream();
  const userStream = useRecoilValue(userStreamAtom);
  const userScreenStream = useRecoilValue(userScreenStreamAtom);
  const socket = useContext(SocketContext);
  const router = useRouter();

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button size={"icon"} variant={"destructive"}>
                  <PhoneOffIcon />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to end the call?</AlertDialogTitle>
                  <AlertDialogDescription>You will be disconnected from the call.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {}}>Cancle</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => {
                      if (userStream) {
                        handleStopAudioVideoStream();
                      }
                      if (userScreenStream) {
                        handleStopScreenShareStream();
                      }
                      if (socket) socket.emit("user-disconnect");
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
