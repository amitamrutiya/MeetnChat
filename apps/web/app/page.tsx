import { FlipWords, Globe, Spotlight } from "@repo/ui";
import IconCardButton from "../components/icon-card-button";
import JoinRoomForm from "../components/join-room-form";
import Navbar from "../components/navbar";

export default function Home() {
  const words = ["Omegal", "Google Meet", "Whatsapp"];
  return (
    <main className="absolute inset-0 -z-10 h-dvh w-full items-center overflow-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <Navbar />
      <div className="absolute flex flex-col items-center text-center">
        <div
          className={`min-h-10vh my-5 cursor-pointer bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl`}
        >
          <div className="flex justify-center">
            Miss <FlipWords words={words} />?
          </div>
          All in one Website for Meet
        </div>
        <div className="flex min-h-[80ovh] flex-col-reverse lg:flex-row">
          <div className="flex flex-grow flex-wrap items-center justify-center lg:w-2/3">
            <IconCardButton />
          </div>
          <div className="my-10 hidden w-1 border-r-4 bg-slate-100 lg:block"></div>
          <section className="join-room flex flex-grow items-center justify-center lg:w-1/3">
            <JoinRoomForm />
          </section>
        </div>
        <Globe />
      </div>
    </main>
  );
}
