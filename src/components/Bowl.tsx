import { Suspense } from "react";
import { useHeightfield } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader";

import bowlObject from "../assets/bowl.gltf?url";

const createHeightField = () => {
  let matrix: number[][] = [];

  var subdivisions = 7;
  for (var i = -subdivisions; i <= subdivisions; i++) {
    const row = [];
    for (var j = -subdivisions; j <= subdivisions; j++) {
      const z = 1 - (i / subdivisions) ** 2 - (j / subdivisions) ** 2;
      var height = Math.max(0.05, 1 - Math.sqrt(Math.max(0, z)));
      row.push(3 * height);
    }
    matrix.push(row);
  }
  return matrix;
};

function Heightfield() {
  const heightField = createHeightField();
  const [ref] = useHeightfield(() => ({
    args: [heightField, { elementSize: 3 / 7.65 }],
    position: [-3, -2, 3],
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return <mesh ref={ref as any}></mesh>;
}

function Bowl() {
  const gltf = useLoader(GLTFLoader, bowlObject);
  return (
    <>
      <Heightfield />
      <Suspense fallback={null}>
        <primitive object={gltf.scene} scale={3} position={[0, -2, 0]} />
      </Suspense>
    </>
  );
}

export default Bowl;
