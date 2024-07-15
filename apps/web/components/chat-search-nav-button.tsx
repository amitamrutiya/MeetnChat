import { Button } from "@repo/ui";
import { chat } from "hooks/use-chat";
import { Mail, MessageCircleMore, UsersRound } from "lucide-react";

const ChatSearchNavButton = () => {
  const { setSelectedTab, fetchFrequentChatUsers, selectedTab, fetchContacts, fetchInviteUser } = chat();
  return (
    <div className="Menu mb-4 flex justify-evenly">
      <Button
        variant="outline"
        className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Chats" ? "bg-primary" : ""}`}
        onClick={async () => {
          setSelectedTab(null);
          await fetchFrequentChatUsers();
          setSelectedTab("Chats");
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <MessageCircleMore />
          <p>Chats</p>
        </div>
      </Button>
      <Button
        variant="outline"
        className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Contacts" ? "bg-primary" : ""}`}
        onClick={async () => {
          setSelectedTab(null);
          await fetchContacts();
          setSelectedTab("Contacts");
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <UsersRound />
          <p>Contacts</p>
        </div>
      </Button>
      <Button
        variant="outline"
        className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Invite" ? "bg-primary" : ""}`}
        onClick={async () => {
          setSelectedTab(null);
          await fetchInviteUser();
          setSelectedTab("Invite");
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <Mail />
          <p>Invite</p>
        </div>
      </Button>
    </div>
  );
};

export default ChatSearchNavButton;
