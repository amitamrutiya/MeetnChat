import React from "react";
import { CloudIcon, FileIcon } from "lucide-react";
import { formatBytes } from "@/utils/size";
import { AvailableFiles } from "@/type";

type FileCardProps = {
  file: AvailableFiles;
};

function FileCard(props: FileCardProps) {
  const { file } = props;
  const handleFileDownload = React.useCallback(
    (file: AvailableFiles) => {
      if (!file.blob) return;
      const blob = file.blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    },
    [file]
  );

  const progress = React.useMemo(() => {
    if (file && file.recievedSize && file.size) {
      return (file.recievedSize / file.size) * 100;
    }
    return 0;
  }, [file]);

  return (
    <div className="relative mt-3 flex cursor-pointer items-center justify-between rounded-md bg-slate-800 py-2 px-5 font-sans text-white shadow-md hover:animate-pulse">
      <div className="z-10 flex items-center">
        <FileIcon fontSize={25} className="mr-3" />
        <div>
          <p className="text-base">
            {file.name} | {`${file.checksum?.substring(0, 6)}...`}
          </p>
          <p className="text-slate-50 text-xs">
            {file.recievedSize && formatBytes(file.recievedSize)}
            {" / "}
            {formatBytes(file.size)}
          </p>
        </div>
      </div>
      <div className="z-10" onClick={() => handleFileDownload(file)}>
        {file.blob && <CloudIcon fontSize={25} />}
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
  );
}

export default FileCard;
