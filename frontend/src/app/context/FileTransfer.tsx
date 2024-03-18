"use client";

import { AvailableFiles } from "@/type";
import React, { createContext } from "react";

export type FileTransferProps = {
  availableFiles: AvailableFiles[];
  setAvailableFiles: React.Dispatch<React.SetStateAction<AvailableFiles[]>>;
};

export const FileTransferContext = createContext<FileTransferProps | null>(
  null
);

export const FileTransferProvider: React.FC<React.PropsWithChildren> = (
  props
) => {
  const [availableFiles, setAvailableFiles] = React.useState<AvailableFiles[]>(
    []
  );

  return (
    <FileTransferContext.Provider value={{ availableFiles, setAvailableFiles }}>
      {props.children}
    </FileTransferContext.Provider>
  );
};
