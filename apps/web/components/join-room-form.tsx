import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import { currentUser } from "../app/helpers/auth";
import RoomIdForm from "./room-id-form";
import SignInForm from "./sign-in-form";
import SignupForm from "./sign-up-form";

async function JoinRoomForm() {
  const user = await currentUser();
  return (
    <div className="mx-5 flex w-[350px] flex-col items-center justify-center sm:mb-10 sm:w-[400px] md:w-[500px] lg:mb-96">
      {user ? (
        <RoomIdForm />
      ) : (
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <SignInForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default JoinRoomForm;
