"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@react-email/components";
import { roomSchema } from "@repo/common";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormDescription,
  FormMessage,
  ShineBorder,
} from "@repo/ui";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={7} borderWidth={4} className="w-full">
      {" "}
      <Form {...roomForm}>
        <form onSubmit={roomForm.handleSubmit(onRoomFormSubmit)} className="space-y-8 rounded-lg p-8 shadow-md">
          <FormField
            control={roomForm.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join meet with room Id</FormLabel>
                <FormControl>
                  <Input placeholder="Room Id" {...field} />
                </FormControl>
                <FormDescription>Enter the room id to join the room.</FormDescription>
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
