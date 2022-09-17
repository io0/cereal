import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export type WackyBoxProps = {
  position: [number, number, number];
};

function WackyBox(props: WackyBoxProps) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, _delta) => ((ref.current as any).rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={props.position}
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

export default WackyBox;
