"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileTransferStream_1 = __importDefault(require("@/app/hooks/fileTransferStream"));
const dialog_1 = require("@/components/ui/dialog");
const lucide_react_1 = require("lucide-react");
const react_1 = __importStar(require("react"));
const button_1 = require("./ui/button");
const use_toast_1 = require("./ui/use-toast");
function FileTransfer() {
    const { toast } = (0, use_toast_1.useToast)();
    const { handleFileTransfer } = (0, fileTransferStream_1.default)();
    const [file, setFile] = (0, react_1.useState)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const dropRef = (0, react_1.useRef)(null);
    const handleChooseFileClick = (0, react_1.useCallback)(() => {
        if (file)
            return;
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
    const handleOnFileDrop = (0, react_1.useCallback)((ev) => {
        var _a, _b;
        ev.preventDefault();
        console.log("File Dropped", (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0]);
        setFile((_b = ev.dataTransfer) === null || _b === void 0 ? void 0 : _b.files[0]);
    }, []);
    const handleStopEventAndPropgation = (0, react_1.useCallback)((ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);
    const onFileTransfer = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (handleFileTransfer && file) {
            console.log("Sending File...", file);
            setFile(undefined);
            try {
                yield handleFileTransfer(file);
                setOpen(false);
                toast({
                    title: "File Sent to your friend",
                    description: "The file has been sent successfully it will be available for download in the chat window",
                });
            }
            catch (error) {
                console.error("Error while sending file", error);
                toast({
                    variant: "destructive",
                    title: "Error while sending file",
                    description: "There was an error while sending the file",
                });
            }
        }
    }), [file, handleFileTransfer]);
    return (<dialog_1.Dialog open={open} onOpenChange={setOpen}>
      <dialog_1.DialogTrigger>
        <button_1.Button size={"icon"}>
          <lucide_react_1.PaperclipIcon />
        </button_1.Button>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent>
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Select your files</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            You can send files to your friend
          </dialog_1.DialogDescription>
          <div className="h-56 w-full border rounded-md cursor-pointer flex items-center justify-center bg-foreground text-background drop-shadow-md" ref={dropRef} onClick={handleChooseFileClick} onDrop={handleOnFileDrop} onDragEnter={handleStopEventAndPropgation} onDragLeave={handleStopEventAndPropgation} onDragOver={handleStopEventAndPropgation} typeof="file">
            {!file && (<div className="flex flex-col justify-center items-center">
                <lucide_react_1.FileIcon className="animate-bounce h-20 w-20"/>
                <span className="mt-3 font-sans">Drop files here</span>
              </div>)}
            {file && (<div className="flex flex-col justify-center items-center">
                <lucide_react_1.FileIcon className="h-20 w-20"/>
                <p className="font-bold">Selected File</p>
                <span className="mt-2 font-sans">{file.name}</span>
                <span className="mt-2 font-sans">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>)}
          </div>
        </dialog_1.DialogHeader>
        <dialog_1.DialogFooter>
          <button_1.Button type="submit" disabled={file ? false : true} onClick={onFileTransfer}>
            Send File
          </button_1.Button>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
exports.default = FileTransfer;
