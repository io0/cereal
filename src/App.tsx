import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, _delta) => ((ref.current as any).rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[1, 2, 1]} />
      {/* <meshStandardMaterial color={hovered ? "hotpink" : "orange"} /> */}
      <meshNormalMaterial />
    </mesh>
  );
}
function Plane(props: any) {
  return (
    <mesh scale={5} rotation-x={-Math.PI / 2} position-y={-2}>
      <planeGeometry />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Canvas>
        <color attach="background" args={["black"]} />
        <OrbitControls makeDefault autoRotate />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Plane />
      </Canvas>
    </div>
  );
}

export default App;
