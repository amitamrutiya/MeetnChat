"use client";
import { useTheme } from "next-themes";

import Particles from "@tsparticles/react";
// import configs from "@tsparticles/configs";

export default function ParticlesComponent(props: {
  id: string;
  done: boolean;
}) {
  const { theme } = useTheme();
  return (
    props.done && (
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
