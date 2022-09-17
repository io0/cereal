import { useRef, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Backdrop,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, usePlane } from "@react-three/cannon";
import { DoubleSide } from "three";
import { useTweaks } from "use-tweaks";

import Bowl from "./components/Bowl";
import Cheerio from "./components/Cheerio";
// import WackyBox from "./components/WackyBox";

function Table() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2.01, 0],
  }));

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color="#ce8788"
        metalness={1.0}
        roughness={0.25}
        side={DoubleSide}
      />
    </mesh>
  );
}

function App() {
  const settings = useTweaks({
    rotate: false,
    gold: false,
    pastel: false,
  }) as any;

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Canvas
        onCreated={(canvasCtx) => {
          canvasCtx.gl.pixelRatio = window.devicePixelRatio;
          canvasCtx.gl.physicallyCorrectLights = true;
        }}
        shadows
      >
        <PerspectiveCamera makeDefault fov={30} position={[-10, 5, -18]} />
        <OrbitControls makeDefault autoRotate={settings.rotate} />

        <color attach="background" args={["#f8f8f8"]} />
        {/* <Backdrop receiveShadow scale={25.0} position={[0, -6, 0]}>
          <meshStandardMaterial color="#353540" />
        </Backdrop> */}
        <Environment preset="city" />

        <ambientLight intensity={0.8} />

        {/* <group>
          <ambientLight intensity={0.08} />
          <pointLight intensity={20} position={[10, 10, 10]} />
        </group> */}

        {/* <WackyBox position={[-1.2, 0, 0]} /> */}
        {/* <WackyBox position={[1.2, 0, 0]} /> */}
        <Physics>
          {/* <Debug color="green" scale={1.1}> */}
          {[...Array(25)].map((_, i) => (
            <Cheerio
              key={i}
              initialPos={[
                1 * Math.sin(53 * i * i),
                5 + i,
                1 * Math.sin(93 * i * i),
              ]}
              gold={settings.gold}
              pastel={settings.pastel}
            />
          ))}
          {/* <Cheerio initialPos={[0, 4, 2]} />
            <Cheerio initialPos={[2, 5, -1]} />
            <Cheerio initialPos={[1, 5, 2]} />
            <Cheerio initialPos={[1, 8, 2]} />
            <Cheerio initialPos={[1, 9, 2]} />
            <Cheerio initialPos={[-1, 5, 0]} /> */}
          <Table />
          <Bowl />
          {/* </Debug> */}
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
