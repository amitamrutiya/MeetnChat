import React from "react";
import moment from "moment";
import { Message } from "@repo/common";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui";

function MessageDiv(props: Message) {
  const { from, message, isSelf, displayPicture, timestamp } = props;

  const convertedTime = React.useMemo(
    () => (timestamp ? moment(new Date(timestamp), "MM").fromNow() : undefined),
    [timestamp]
  );
  return (
    <div className="mb-2">
      <div className="flex items-center w-full pb-0">
        {!isSelf && (
          <div className="mr-3">
            <Avatar className="bg-slate-500 shadow-xl">
              <AvatarImage src={displayPicture} />
              <AvatarFallback>Other</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={`rounded-2xl ${
            isSelf ? "rounded-tr-none" : "rounded-tl-none"
          } ${
            isSelf ? "bg-slate-700" : "bg-sky-600"
          } p-2 text-white shadow-xl flex-grow`}
        >
          {message}
        </div>
        {isSelf && (
          <div className="ml-3">
            <Avatar className="bg-slate-500 shadow-xl">
              <AvatarImage src={displayPicture} />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <small
        className={`${
          isSelf ? "pl-[16px]" : "float-right pr-[16px]"
        } text-slate-400 mb-2`}
      >
        {convertedTime && convertedTime}
      </small>
    </div>
  );
}

export default MessageDiv;
