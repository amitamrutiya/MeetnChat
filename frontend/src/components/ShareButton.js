"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareButton = void 0;
const react_icons_1 = require("@radix-ui/react-icons");
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
function ShareButton() {
    return (<dialog_1.Dialog>
      <dialog_1.DialogTrigger asChild>
        <button_1.Button>Share Link</button_1.Button>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent className="sm:max-w-md">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Share Room link</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Share this link with others to invite them to the room.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label_1.Label htmlFor="link" className="sr-only">
              Link
            </label_1.Label>
            <input_1.Input id="link" defaultValue={window.location.href} readOnly/>
          </div>
          <button_1.Button type="submit" size="sm" className="px-3" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
        }}>
            <span className="sr-only">Copy</span>
            <react_icons_1.CopyIcon className="h-4 w-4"/>
          </button_1.Button>
        </div>
        <dialog_1.DialogFooter className="sm:justify-start">
          <dialog_1.DialogClose asChild>
            <button_1.Button type="button" variant="secondary">
              Close
            </button_1.Button>
          </dialog_1.DialogClose>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
exports.ShareButton = ShareButton;
