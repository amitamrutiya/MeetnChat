"use client";
import { useTheme } from "next-themes";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export default function ParticlesComponent(props: { id: string }) {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const { theme } = useTheme();
  return (
    init && (
      <Particles
        id={props.id}
        url={
          theme == "light"
            ? "/particlesjs-config-light.json"
            : "/particlesjs-config-dark.json"
        }
      />
    )
  );
}
