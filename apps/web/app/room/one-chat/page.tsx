import ChatRoomProfileSction from "components/chat-room-profile-section";
import ChatRoomSearchSection from "components/chat-room-search-section";
import ChatRoomSection from "components/chat-room-section";

export default function Room() {
  return (
    <div className="flex h-screen flex-col gap-4 p-4 md:flex-row">
      <section className="hidden flex-grow rounded-3xl bg-[#1f1f1f] md:block md:w-1/3 xl:w-1/4">
        <ChatRoomSearchSection />
      </section>
      <main className="flex-grow rounded-3xl bg-[#181818] px-6 md:w-2/3 xl:w-1/2">
        <ChatRoomSection />
      </main>
      <section className="hidden flex-grow rounded-3xl bg-[#1f1f1f] p-6 xl:block xl:w-1/4">
        <ChatRoomProfileSction />
      </section>
    </div>
  );
}
