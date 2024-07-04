import React, { useCallback, useMemo } from "react";
import { DownloadCloudIcon, FileIcon } from "lucide-react";
import moment from "moment";
import { AvailableFiles } from "@repo/common";
import { formatBytes } from "../app/utils/size";

type FileCardProps = {
  file: AvailableFiles;
};

function FileCard(props: FileCardProps) {
  const { file } = props;

  const handleFileDownload = useCallback((file: AvailableFiles) => {
    if (!file.blob) return;
    const blob = file.blob;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, []);

  const progress = useMemo(() => {
    if (file && file.recievedSize && file.size) {
      return (file.recievedSize / file.size) * 100;
    }
    return 0;
  }, [file]);

  const convertedTime = useMemo(
    () =>
      file.timestamp
        ? moment(new Date(file.timestamp), "MM").fromNow()
        : undefined,
    [file.timestamp]
  );

  return (
    <div>
      <div className="relative mt-3 w-full flex cursor-pointer items-center justify-between rounded-md bg-slate-800 py-2 px-5 font-sans text-white shadow-md hover:animate-pulse">
        <div className="z-10 flex items-center">
          <FileIcon className="mr-3" />
          <div>
            <p className="text-base">
              {file.name} | {`${file.checksum?.substring(0, 5)}...`}
            </p>
            <p className="text-slate-50 text-xs">
              {file.recievedSize && formatBytes(file.recievedSize)}
              {" / "}
              {formatBytes(file.size)}
            </p>
          </div>
        </div>
        <div className="z-10" onClick={() => handleFileDownload(file)}>
          {file.blob && <DownloadCloudIcon />}
        </div>
        <div
          className={`absolute ml-[-20px] h-full rounded-md transition-all ${
            progress >= 100 && file.checksumMatched
              ? "bg-green-600"
              : "bg-sky-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <small className="float-right pr-[16px] text-slate-400 mb-2">
        {convertedTime}
      </small>
    </div>
  );
}

export default FileCard;
