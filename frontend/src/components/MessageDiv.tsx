import { Message } from "@/type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

function MessageDiv(props: Message) {
  const { from, message, isSelf, displayPicture, timestamp } = props;

  const convertedTime = React.useMemo(
    () => (timestamp ? moment(new Date(timestamp), "MM").fromNow() : undefined),
    [timestamp]
  );
  return (
    <div>
      <div className="flex items-center pb-0">
        {!isSelf && (
          <div className="mr-3">
            <Avatar className="bg-slate-500 shadow-xl">
              <AvatarImage src={displayPicture} />
              <AvatarFallback>CN</AvatarFallback>
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
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <small
        className={`${
          isSelf ? "pl-[16px]" : "float-right pr-[16px]"
        } text-slate-400`}
      >
        {convertedTime && convertedTime}
      </small>
    </div>
  );
}

export default MessageDiv;
