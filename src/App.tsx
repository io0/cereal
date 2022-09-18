import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";
import Tweakpane from "tweakpane";

import Bowl from "./components/Bowl";
import Cheerio from "./components/Cheerio";
// import WackyBox from "./components/WackyBox";

function useSettings() {
  const params = useRef({
    autorotate: true,
    gold: false,
    fruit: false,
  });
  const [settings, setSettings] = useState(params.current);
  useEffect(() => {
    const pane = new Tweakpane({ title: "Cereal!" });
    pane.addInput(params.current, "autorotate");
    pane.addInput(params.current, "gold");
    pane.addInput(params.current, "fruit");
    pane.on("change", () => setSettings({ ...params.current }));
    return () => pane.dispose();
  }, []);
  return settings;
}

function Table() {
  return (
    <RigidBody
      colliders="cuboid"
      position={[0, -1.001, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <Plane args={[10, 10]} receiveShadow>
        <meshStandardMaterial
          color="#e78688"
          metalness={1.0}
          roughness={0.25}
          side={DoubleSide}
        />
      </Plane>
    </RigidBody>
  );
}

function App() {
  const settings = useSettings();
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          onCreated={(canvasCtx) => {
            canvasCtx.gl.pixelRatio = window.devicePixelRatio;
            canvasCtx.gl.physicallyCorrectLights = true;
          }}
          shadows
        >
          <PerspectiveCamera makeDefault fov={30} position={[-7, 8, -16]} />
          <OrbitControls makeDefault autoRotate={settings.autorotate} />

          {/* <Backdrop receiveShadow scale={25.0} position={[0, -6, 0]}>
            <meshStandardMaterial color="#353540" />
          </Backdrop> */}
          <color attach="background" args={["#fafafa"]} />
          <Environment files="/textures/dresden_square_1k.hdr" />

          {/* <group>
            <ambientLight intensity={0.08} />
            <pointLight intensity={20} position={[10, 10, 10]} />
          </group> */}

          {/* <WackyBox position={[-1.2, 0, 0]} /> */}
          {/* <WackyBox position={[1.2, 0, 0]} /> */}
          <Physics>
            {/* <Debug color="green" scale={1.1}> */}
            {[...Array(150)].map((_, i) => (
              <Cheerio
                key={i}
                initialPos={[
                  1.2 * Math.sin(53 * i * i),
                  5 + i / 2,
                  1.2 * Math.sin(93 * i * i),
                ]}
                gold={settings.gold}
                pastel={settings.fruit}
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
      </Suspense>
    </div>
  );
}

export default App;
