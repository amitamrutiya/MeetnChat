import ChatRoomProfileSction from "components/chat-room-profile-section";
import ChatRoomSearchSection from "components/chat-room-search-section";
import ChatRoomSection from "components/chat-room-section";

export default function Room() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 h-screen">
      <section className="flex-grow bg-[#1f1f1f] rounded-3xl xl:w-1/4 md:w-1/3 md:block hidden">
        <ChatRoomSearchSection />
      </section>
      <main className="px-6 flex-grow bg-[#181818] rounded-3xl xl:w-1/2 md:w-2/3">
        <ChatRoomSection />
      </main>
      <section className="p-6 flex-grow bg-[#1f1f1f] rounded-3xl xl:w-1/4 xl:block hidden">
        <ChatRoomProfileSction />
      </section>
    </div>
  );
}
