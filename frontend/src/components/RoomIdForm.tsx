import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import roomSchema from "@/schemas/roomSchema";
import ShineBorder from "./ui/shine-border";

function RoomIdForm() {
  const router = useRouter();
  const roomForm = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomId: "",
    },
  });
  function onRoomFormSubmit(values: z.infer<typeof roomSchema>) {
    router.push(`/room/group-meet/${values.roomId}`);
  }

  return (
    <ShineBorder
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      duration={7}
      borderWidth={4}
    >
      {" "}
      <Form {...roomForm}>
        <form
          onSubmit={roomForm.handleSubmit(onRoomFormSubmit)}
          className="w-full p-8 space-y-8 bg-secondary rounded-lg shadow-md"
        >
          <FormField
            control={roomForm.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join meet with room Id</FormLabel>
                <FormControl>
                  <Input placeholder="Room Id" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the room id to join the room.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </ShineBorder>
  );
}

export default RoomIdForm;
