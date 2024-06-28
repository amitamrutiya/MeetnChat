import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomIdForm from "./RoomIdForm";
import SignInForm from "./SignInForm";
import SignupForm from "./SignupForm";
import { currentUser } from "@/lib/auth";

async function JoinRoomForm() {
  const user = await currentUser();
  return (
    <div className="mx-5 sm:w-[400px] md:w-[500px] w-[350px] flex flex-col justify-center items-center lg:mb-96 sm:mb-10 ">
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
