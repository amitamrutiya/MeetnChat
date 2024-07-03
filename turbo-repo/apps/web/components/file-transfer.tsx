import {
  Button,
  useToast,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui";
import { FileIcon, PaperclipIcon } from "lucide-react";
import React, { useRef, useCallback, useState } from "react";
import useFileTransfer from "../hooks/file-transfer-stream";

function FileTransfer() {
  const { toast } = useToast();
  const { handleFileTransfer } = useFileTransfer();
  const [file, setFile] = useState<File | undefined>();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

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

  const handleOnFileDrop = useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      ev.preventDefault();
      console.log("File Dropped", ev.dataTransfer?.files[0]);
      setFile(ev.dataTransfer?.files[0]);
    },
    []
  );

  const handleStopEventAndPropgation = useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
    },
    []
  );

  const onFileTransfer = useCallback(async () => {
    if (handleFileTransfer && file) {
      console.log("Sending File...", file);
      setFile(undefined);
      try {
        await handleFileTransfer(file);
        setOpen(false);
        toast({
          title: "File Sent to your friend",
          description:
            "The file has been sent successfully it will be available for download in the chat window",
        });
      } catch (error) {
        console.error("Error while sending file", error);
        toast({
          variant: "destructive",
          title: "Error while sending file",
          description: "There was an error while sending the file",
        });
      }
    }
  }, [file, handleFileTransfer]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            onDrop={handleOnFileDrop}
            onDragEnter={handleStopEventAndPropgation}
            onDragLeave={handleStopEventAndPropgation}
            onDragOver={handleStopEventAndPropgation}
            typeof="file"
          >
            {!file && (
              <div className="flex flex-col justify-center items-center">
                <FileIcon className="animate-bounce h-20 w-20" />
                <span className="mt-3 font-sans">Drop files here</span>
              </div>
            )}
            {file && (
              <div className="flex flex-col justify-center items-center">
                <FileIcon className="h-20 w-20" />
                <p className="font-bold">Selected File</p>
                <span className="mt-2 font-sans">{file.name}</span>
                <span className="mt-2 font-sans">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            disabled={file ? false : true}
            onClick={onFileTransfer}
          >
            Send File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FileTransfer;
