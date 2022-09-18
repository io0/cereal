import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Environment, OrbitControls, Plane } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";
import Tweakpane from "tweakpane";

import Bowl from "./components/Bowl";
import Cheerio from "./components/Cheerio";

function useSettings() {
  const params = useRef({
    autorotate: true,
    gold: false,
    fruit: false,
    key: 0,
  });
  const [settings, setSettings] = useState(params.current);
  useEffect(() => {
    const pane = new Tweakpane({ title: "Cereal!" });
    pane.addInput(params.current, "autorotate");
    pane.addInput(params.current, "gold");
    pane.addInput(params.current, "fruit");
    pane.addButton({ title: "Reset" }).on("click", () => {
      params.current.key++;
      setSettings({ ...params.current });
    });
    pane.on("change", () => setSettings({ ...params.current }));
    return () => pane.dispose();
  }, []);
  return settings;
}

function Table() {
  return (
    <RigidBody
      colliders="cuboid"
      lockTranslations
      lockRotations
      position={[0, -1.25, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <Box args={[10, 10, 0.5]} receiveShadow>
        <meshStandardMaterial
          color="#8a4e4f"
          metalness={1.0}
          roughness={0.25}
          side={DoubleSide}
        />
      </Box>
    </RigidBody>
  );
}

function App() {
  const settings = useSettings();
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          key={settings.key}
          onCreated={(canvasCtx) => {
            canvasCtx.gl.pixelRatio = window.devicePixelRatio;
            canvasCtx.gl.physicallyCorrectLights = true;
          }}
          shadows
          camera={{ position: [-7, 7, -16], fov: 30 }}
        >
          <OrbitControls makeDefault autoRotate={settings.autorotate} />

          <color attach="background" args={["#fafafa"]} />
          <Environment files="/textures/dresden_square_1k.hdr" />

          {/* <pointLight
            intensity={500}
            position={[10, 30, 10]}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          /> */}

          <Physics>
            {/* <Debug color="green" scale={1.1}> */}
            {[...Array(120)].map((_, i) => (
              <Cheerio
                key={i}
                initialPos={[
                  1.2 * Math.sin(53 * i * i),
                  5 + i / 3,
                  1.2 * Math.sin(93 * i * i),
                ]}
                gold={settings.gold}
                pastel={settings.fruit}
              />
            ))}
            <Table />
            <Bowl />
          </Physics>
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
