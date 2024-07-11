"use client";

import { useRoom } from "hooks/use-room";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@repo/ui";
import { useRouter } from "next/navigation";

export default function Room() {
  const router = useRouter();
  const { isDisconnect } = useRoom();
  return (
    isDisconnect && (
      <AlertDialog open={isDisconnect}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Friend has been disconnected</AlertDialogTitle>
            <AlertDialogDescription>Now you have to end this call.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                router.replace("/");
              }}
            >
              Go Back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
