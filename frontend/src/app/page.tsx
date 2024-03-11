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
    <main className="min-h-screen justify-center  p-5">
      <ParticlesComponent id="tsparticles" done={init} />
      <ModeToggle />
      <div className="absolute w-[95vw]">
        <div className="flex min-h-[80vh] flex-wrap items-center justify-center sm:flex-row">
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
