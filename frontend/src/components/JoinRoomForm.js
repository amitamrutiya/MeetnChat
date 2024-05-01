"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("@hookform/resolvers/zod");
const react_hook_form_1 = require("react-hook-form");
const zodschema_1 = __importDefault(require("@/lib/zodschema"));
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const client_1 = require("@auth0/nextjs-auth0/client");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
function JoinRoomForm() {
    const { user } = (0, client_1.useUser)();
    const router = (0, navigation_1.useRouter)();
    // 1. Define your form.
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(zodschema_1.default),
        defaultValues: {
            roomId: "",
        },
    });
    function onSubmit(values) {
        router.push(`/room/group-meet/${values.roomId}`);
    }
    return (<div className="sm:mx-10 sm:my-[70%] w-full flex items-center justify-center mt-10">
      {user ? (<form_1.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="sm:w-48 space-y-7 w-full pr-5">
            <form_1.FormField control={form.control} name="roomId" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Join meet with room Id</form_1.FormLabel>
                  <form_1.FormControl>
                    <input_1.Input placeholder="Room Id" {...field}/>
                  </form_1.FormControl>
                  <form_1.FormDescription>
                    Enter the room id to join the room.
                  </form_1.FormDescription>
                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
            <button_1.Button type="submit">Submit</button_1.Button>
          </form>
        </form_1.Form>) : (<div>
          <div className="text-2xl font-bold text-primary mb-5">
            Please Login to Use
          </div>
          <link_1.default href="/api/auth/login" passHref>
            <button_1.Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded border-2 border-transparent hover:border-purple-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 animate-pulse w-[100%]">
              Login
            </button_1.Button>
          </link_1.default>
        </div>)}
    </div>);
}
exports.default = JoinRoomForm;
