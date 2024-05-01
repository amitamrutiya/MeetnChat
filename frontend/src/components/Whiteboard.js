"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fabricjs_react_1 = require("fabricjs-react");
const bs_1 = require("react-icons/bs");
const fa_1 = require("react-icons/fa");
const gi_1 = require("react-icons/gi");
const io_1 = require("react-icons/io");
const SocketContext_1 = require("@/app/context/SocketContext");
var TOOL;
(function (TOOL) {
    TOOL[TOOL["PEN"] = 1] = "PEN";
    TOOL[TOOL["SQUARE"] = 2] = "SQUARE";
    TOOL[TOOL["CIRCLE"] = 3] = "CIRCLE";
    TOOL[TOOL["SELECT"] = 4] = "SELECT";
})(TOOL || (TOOL = {}));
const WhiteBoard = (props) => {
    const { remoteSocketId } = props;
    const socket = react_1.default.useContext(SocketContext_1.SocketContext);
    const { editor, onReady } = (0, fabricjs_react_1.useFabricJSEditor)();
    const [selectedTool, setSelectedTool] = react_1.default.useState(null);
    const [colorSelectActive, setColorSelectActive] = react_1.default.useState(false);
    const [colorSelectAnchor, setColorSelectAnchor] = react_1.default.useState();
    const COLORS = react_1.default.useMemo(() => ["#000", "#dc2626", "#65a30d", "#2563eb", "#c026d3"], []);
    const [activeColor, setActiveColor] = react_1.default.useState(COLORS[0]);
    const handleSelectColor = react_1.default.useCallback((color) => setActiveColor(color), []);
    react_1.default.useEffect(() => {
        if (activeColor && editor) {
            //@ts-ignore
            editor.setFillColor();
            editor.setStrokeColor(activeColor);
            editor.canvas.freeDrawingBrush.color = activeColor;
            socket.emit("whiteboard:drawing", {
                action: "COLOR_CHANGE",
                value: activeColor,
                to: remoteSocketId,
            });
            setColorSelectActive(false);
        }
    }, [activeColor, remoteSocketId]);
    react_1.default.useEffect(() => {
        if (editor) {
            editor.canvas.isDrawingMode = true;
            editor.canvas.freeDrawingBrush.width = 20;
        }
    }, []);
    react_1.default.useEffect(() => {
        if (selectedTool && editor) {
            switch (selectedTool) {
                case TOOL.SELECT:
                    editor.canvas.isDrawingMode = false;
                    break;
                case TOOL.PEN:
                    editor.canvas.isDrawingMode = true;
                    break;
                case TOOL.CIRCLE:
                    editor.addCircle();
                    editor.canvas.isDrawingMode = false;
                    break;
                case TOOL.SQUARE:
                    editor.addRectangle();
            }
            socket.emit("whiteboard:drawing", {
                action: "TOOL_CHANGE",
                value: selectedTool,
                to: remoteSocketId,
            });
        }
    }, [selectedTool]);
    const handleIncommingWhiteBoardData = react_1.default.useCallback((data) => {
        const { action, value } = data.data;
        if (action === "WHITEBOARD_CHANGE") {
            editor === null || editor === void 0 ? void 0 : editor.canvas.loadFromJSON(value, () => {
                editor === null || editor === void 0 ? void 0 : editor.canvas.renderAll();
            });
        }
        // if (action === 'TOOL_CHANGE') {
        //   const tool = value as TOOL
        //   setSelectedTool(tool)
        // } else if (action === 'COLOR_CHANGE') {
        //   const color = value as string
        //   setActiveColor(color)
        // }
    }, [editor]);
    const handleCanvasChange = react_1.default.useCallback(() => {
        const _json = editor === null || editor === void 0 ? void 0 : editor.canvas.toJSON();
        socket.emit("whiteboard:drawing", {
            action: "WHITEBOARD_CHANGE",
            value: _json,
            to: remoteSocketId,
        });
    }, [editor, remoteSocketId]);
    react_1.default.useEffect(() => {
        socket.on("whiteboard:data", handleIncommingWhiteBoardData);
        return () => {
            socket.off("whiteboard:data", handleIncommingWhiteBoardData);
        };
    }, [editor]);
    react_1.default.useEffect(() => {
        if (editor) {
            editor.canvas.on("mouse:up", handleCanvasChange);
        }
    }, [editor, remoteSocketId]);
    return (<>
      <fabricjs_react_1.FabricJSCanvas className="mb-2 h-[74vh] w-full rounded-md bg-white" onReady={onReady}/>
      <div className="h-[5vh] w-full  rounded-lg bg-slate-600">
        <div className="flex h-full w-full items-center justify-evenly" id="tools-container">
          <gi_1.GiArrowCursor className={`${selectedTool === TOOL.SELECT && "text-sky-500"}`} onClick={() => setSelectedTool(TOOL.SELECT)}/>
          <bs_1.BsFillPenFill onClick={() => setSelectedTool(TOOL.PEN)} className={`${selectedTool === TOOL.PEN && "text-sky-500"}`}/>
          <io_1.IoMdColorPalette className="rounded-full p-1" aria-describedby="colorPickerIcon" aria-owns={colorSelectActive ? "colorPickerIcon" : undefined} onClick={() => setColorSelectActive(true)} style={{ backgroundColor: activeColor || undefined }}/>
          <fa_1.FaRegCircle onClick={() => setSelectedTool(TOOL.CIRCLE)} className={`${selectedTool === TOOL.CIRCLE && "text-sky-500"}`}/>
          <bs_1.BsSquare onClick={() => setSelectedTool(TOOL.SQUARE)} className={`${selectedTool === TOOL.SQUARE && "text-sky-500"}`}/>
        </div>
      </div>
      <div className={`${colorSelectActive ? "" : "hidden"} absolute top-[200px] left-[400px]`}>
        <div className="relative">
          <button onClick={() => setColorSelectActive(!colorSelectActive)} className="focus:outline-none">
            {/* Button content goes here */}
          </button>
          <div className="absolute z-10 min-w-[200px] rounded-md bg-white p-2 shadow-md mt-2">
            <div className="grid grid-cols-1 gap-1">
              {COLORS &&
            COLORS.map((color) => (<div key={color}>
                    <div onClick={(e) => handleSelectColor(color)} className={`min-h-[60px] min-w-[60px] cursor-pointer rounded-md`} style={{ backgroundColor: color }}/>
                  </div>))}
            </div>
          </div>
        </div>
      </div>
    </>);
};
exports.default = WhiteBoard;
