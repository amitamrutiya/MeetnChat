import { FileTransferContext, FileTransferProps } from "@/app/context/FileTransfer";
import useFileTransfer from "@/app/hooks/fileTransferStream";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileIcon, PaperclipIcon } from "lucide-react";
import React, { createRef, useCallback, useContext, useEffect, useState } from "react";
import FileCard from "./FileCard";
import { Button } from "./ui/button";

function FileTransfer() {

  const { availableFiles } = useContext(FileTransferContext) as FileTransferProps;
  const { handleFileTransfer } = useFileTransfer();
  const [file, setFile] = useState<File | undefined>();
  const [fileSnackbarOpen, setFileSnackbarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const dropRef = createRef<HTMLDivElement>();

  const handleChooseFileClick = useCallback(() => {
    if (file) return;
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (e) => {
      e.preventDefault();
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        setFile(file);
      }
    });

    input.click();
  }, [file]);

  const handleOnFileDrop = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    setFile(ev.dataTransfer?.files[0]);
  }, []);

  const handleStopEventAndPropgation = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);

  const onFileTransfer = useCallback(async () => {
    if (handleFileTransfer && file) {
      console.log("Sending File...", file);
      try {
        setLoading(true);
        await handleFileTransfer(file);
      } catch (error) {
        setLoading(false);
        setFileSnackbarOpen(true);
      } finally {
        setFile(undefined);
        setLoading(false);
      }
    }
  }, [file, handleFileTransfer]);

  useEffect(() => {
    if (dropRef.current) {
      dropRef.current.addEventListener(
        "dragenter",
        handleStopEventAndPropgation
      );
      dropRef.current.addEventListener(
        "dragleave",
        handleStopEventAndPropgation
      );
      dropRef.current.addEventListener(
        "dragover",
        handleStopEventAndPropgation
      );
      dropRef.current.addEventListener("drop", handleOnFileDrop);
    }

    return () => {
      if (dropRef.current) {
        dropRef.current.removeEventListener(
          "dragenter",
          handleStopEventAndPropgation
        );
        dropRef.current.removeEventListener(
          "dragleave",
          handleStopEventAndPropgation
        );
        dropRef.current.removeEventListener(
          "dragover",
          handleStopEventAndPropgation
        );
        dropRef.current.removeEventListener("drop", handleOnFileDrop);
      }
    };
  }, []);
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"icon"}>
          <PaperclipIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select your files</DialogTitle>
          <DialogDescription>
            You can send files to your friend
          </DialogDescription>
          <div
            className="h-56 w-full border rounded-md cursor-pointer flex items-center justify-center bg-foreground text-background drop-shadow-md"
            ref={dropRef}
            onClick={handleChooseFileClick}
          >
            {!file && (
              <div className="flex flex-col justify-center items-center">
                <FileIcon className="animate-bounce h-20 w-20" />
                <span className="mt-3 font-sans">Drop files here</span>
              </div>
            )}
            <div>
              {availableFiles &&
                availableFiles.map((file, index) => (
                  <FileCard key={`${file.name}-${index}`} file={file} />
                ))}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" disabled={file ? false : true}>
            Send File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FileTransfer;
