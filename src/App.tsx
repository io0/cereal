import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, usePlane } from "@react-three/cannon";
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
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1.001, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color="#e78688"
        metalness={1.0}
        roughness={0.25}
        side={DoubleSide}
      />
    </mesh>
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
            {[...Array(25)].map((_, i) => (
              <Cheerio
                key={i}
                initialPos={[
                  1 * Math.sin(53 * i * i),
                  5 + i / 3 + 0.5 * Math.sin(83 * i * i),
                  1 * Math.sin(93 * i * i),
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
