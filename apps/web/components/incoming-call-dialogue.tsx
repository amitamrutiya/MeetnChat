"use client";

import { IncomingCall } from "@repo/common";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/ui";
import { useState } from "react";

function IncomingCallDialog(props: {
  incomingCallData: IncomingCall;
  handleAcceptIncomingCall: () => void;
  handleRejectIncomingCall: () => void;
}) {
  const { incomingCallData, handleAcceptIncomingCall, handleRejectIncomingCall } = props;
  const [open, setOpen] = useState(true);
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{incomingCallData.user.name} is calling you</AlertDialogTitle>
            <AlertDialogDescription>
              If you accept, you will be connected to a video call with them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                handleAcceptIncomingCall();
                setOpen(false);
              }}
            >
              Accept
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                handleRejectIncomingCall();
                setOpen(false);
              }}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default IncomingCallDialog;
