import { IncomingCall } from "@/type";
import React from "react";

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
  return (
    <div className="fixed bottom-0 right-0 p-5">
      <div className="flex items-center justify-center">
        <h6 className="font-sans text-slate-400">
          {incommingCallData.user.name} is calling you
        </h6>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handleAcceptIncommingCall}
          className="bg-green-500 p-2 rounded-md m-2"
        >
          Accept
        </button>
        <button
          onClick={handleRejectIncommingCall}
          className="bg-red-500 p-2 rounded-md m-2"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default IncomingCallDialog;
