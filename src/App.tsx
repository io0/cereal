import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Box,
  Cylinder,
  Environment,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { DoubleSide, TextureLoader } from "three";
import Tweakpane from "tweakpane";

import Bowl from "./components/Bowl";
import Cheerio from "./components/Cheerio";
import { RigidBodyApi } from "@react-three/rapier/dist/declarations/src/types";

function useSettings() {
  const params = useRef({
    autorotate: true,
    gold: false,
    fruit: false,
    table: 0,
    key: 0,
  });
  const [settings, setSettings] = useState(params.current);
  useEffect(() => {
    const pane = new Tweakpane({ title: "Cereal!" });
    pane.addInput(params.current, "autorotate");
    pane.addInput(params.current, "gold");
    pane.addInput(params.current, "fruit");
    pane.addInput(params.current, "table", { min: 0, max: 1 });
    pane.addButton({ title: "Reset" }).on("click", () => {
      params.current.key++;
      setSettings({ ...params.current });
    });
    pane.on("change", () => setSettings({ ...params.current }));
    return () => pane.dispose();
  }, []);
  return settings;
}

function Table({ table }: { table: number }) {
  const tableRef = useRef<RigidBodyApi>(null);

  const color = useLoader(
    TextureLoader,
    "/textures/wood_table_001_diff_1k.jpg"
  );
  const roughness = useLoader(
    TextureLoader,
    "/textures/wood_table_001_rough_1k.jpg"
  );

  useEffect(() => {
    tableRef.current?.setTranslation({ x: 0, y: table, z: 0 });
  }, [table]);

  return (
    <>
      <RigidBody
        ref={tableRef}
        colliders="cuboid"
        lockTranslations
        lockRotations
        ccd
      >
        <Box args={[10, 0.5, 10]} receiveShadow position={[0, -1.25, 0]}>
          <meshStandardMaterial
            map={color}
            roughnessMap={roughness}
            side={DoubleSide}
          />
        </Box>

        <Cylinder args={[0.5, 0.5, 8, 16, 32]} position={[0, -5.25, 0]}>
          <meshStandardMaterial map={color} roughnessMap={roughness} />
        </Cylinder>
      </RigidBody>
    </>
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
          camera={{ position: [-7, 7, -16], fov: 35 }}
        >
          <OrbitControls
            makeDefault
            autoRotate={settings.autorotate}
            autoRotateSpeed={0.5}
          />

          {/* <color attach="background" args={["#fafafa"]} /> */}
          <Environment background files="/textures/dresden_square_2k.hdr" />

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
            <Table table={settings.table} />
            <Bowl />
          </Physics>

          <Stats />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
