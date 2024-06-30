"use client";

import GroupSearchSection from "./_components/group-search-section";
import GroupChatSection from "./_components/group-chat-section";

export default function Room() {
  return (
    <div className="flex h-screen gap-4 p-4 md:flex-row">
      <section className="hidden flex-grow rounded-3xl bg-[#1f1f1f] md:block md:w-1/3 xl:w-1/4">
        <GroupSearchSection />
      </section>

      <main className="flex-grow rounded-3xl bg-[#181818] px-3 md:w-2/3 xl:w-3/4">
        <GroupChatSection />
      </main>
    </div>
  );
}
