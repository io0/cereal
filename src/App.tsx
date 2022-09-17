import { useRef, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Backdrop,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stage,
} from "@react-three/drei";
import {
  Physics,
  useBox,
  usePlane,
  useCylinder,
  useConvexPolyhedron,
  useHeightfield,
  Debug,
} from "@react-three/cannon";
import { TorusGeometry, DoubleSide } from "three";
import { Geometry, ConvexGeometry } from "three-stdlib";

import Bowl from "./components/Bowl";
// import WackyBox from "./components/WackyBox";

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {THREE.BufferGeometry} bufferGeometry
 */
function toConvexProps(bufferGeometry: any) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  geo.mergeVertices();

  const convBufferGeo = new ConvexGeometry(geo.vertices);
  const convGeo = new Geometry().fromBufferGeometry(convBufferGeo);
  convGeo.mergeVertices();

  return [
    convGeo.vertices.map((v) => v.toArray()),
    convGeo.faces.map((f) => [f.a, f.b, f.c]),
    [],
  ];
}

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

const RADIUS = 0.2;
const TUBE = 0.08;

export type CheerioProps = {
  initialPos: [number, number, number];
};

function Cheerio(props: CheerioProps) {
  const geo = useMemo(
    () => toConvexProps(new TorusGeometry(RADIUS, TUBE, 8, 6)),
    []
  );
  const [ref] = useConvexPolyhedron(() => ({
    mass: 1,
    position: props.initialPos,
    args: geo as any,
  }));

  return (
    <mesh ref={ref as any} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
      <torusGeometry args={[RADIUS, TUBE, 64, 48]} />
      <meshStandardMaterial color="#EBAF4C" />
    </mesh>
  );
}

function App() {
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
        <OrbitControls makeDefault />

        <color attach="background" args={["#fff"]} />
        {/* <Backdrop receiveShadow scale={25.0} position={[0, -6, 0]}>
            <meshStandardMaterial color="#353540" />
          </Backdrop> */}
        <Environment preset="city" />

        <ambientLight intensity={5.0} />

        {/* <group>
          <ambientLight intensity={0.08} />
          <pointLight intensity={20} position={[10, 10, 10]} />
        </group> */}

        {/* <WackyBox position={[-1.2, 0, 0]} /> */}
        {/* <WackyBox position={[1.2, 0, 0]} /> */}
        <Physics>
          {/* <Debug color="green" scale={1.1}> */}
          {[...Array(20)].map((_, i) => (
            <Cheerio
              key={i}
              initialPos={[
                4 * (Math.random() - 0.5),
                5 + i,
                4 * (Math.random() - 0.5),
              ]}
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
