"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import IconCardButton from "@/components/ui/icon-card-button";
import { loadFull } from "tsparticles";
import { Engine } from "@tsparticles/engine";
import { initParticlesEngine } from "@tsparticles/react";
import ParticlesComponent from "../components/ui/particles";
import functions from "./data/functions";

export default function Home() {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  return (
    <main className="min-h-screen justify-center p-5">
      <ParticlesComponent id="tsparticles" done={init} />
      <ModeToggle />
      <div className="flex flex-col items-center absolute w-[95vw]">
        <div
          className={`text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer ${
            init ? "animate-fadeIn" : ""
          }`}
        >
          All in one Website for Meet
        </div>{" "}
        <div className="mt-[10%] flex min-h-[80vh] flex-wrap justify-center sm:flex-row">
          {functions.map((f, i) => (
            <IconCardButton
              key={i}
              onClick={() => {}}
              text={f.title}
              subtext={f.subtitle}
              description={f.description}
              icon1={<f.icon1 />}
              icon2={<f.icon2 />}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
