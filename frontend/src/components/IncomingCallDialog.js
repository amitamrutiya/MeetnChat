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
Object.defineProperty(exports, "__esModule", { value: true });
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const react_1 = __importStar(require("react"));
function IncomingCallDialog(props) {
    const { incommingCallData, handleAcceptIncommingCall, handleRejectIncommingCall, } = props;
    const [open, setOpen] = (0, react_1.useState)(true);
    return (<>
      <alert_dialog_1.AlertDialog open={open} onOpenChange={setOpen}>
        <alert_dialog_1.AlertDialogTrigger></alert_dialog_1.AlertDialogTrigger>
        <alert_dialog_1.AlertDialogContent>
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>
              {incommingCallData.user.name} is calling you
            </alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              If you accept, you will be connected to a video call with them.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel onClick={() => {
            handleAcceptIncommingCall();
            setOpen(false);
        }}>
              Accept
            </alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => {
            handleRejectIncommingCall();
            setOpen(false);
        }}>
              Reject
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>
    </>);
}
exports.default = IncomingCallDialog;
