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
  incommingCallData: IncomingCall;
  handleAcceptIncommingCall: () => void;
  handleRejectIncommingCall: () => void;
}) {
  const {
    incommingCallData,
    handleAcceptIncommingCall,
    handleRejectIncommingCall,
  } = props;
  const [open, setOpen] = useState(true);
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {incommingCallData.user.name} is calling you
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you accept, you will be connected to a video call with them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                handleAcceptIncommingCall();
                setOpen(false);
              }}
            >
              Accept
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                handleRejectIncommingCall();
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
