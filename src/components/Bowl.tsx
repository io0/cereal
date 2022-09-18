import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader";

import bowlObject from "../assets/bowl.glb?url";

function Bowl() {
  const gltf = useLoader(GLTFLoader, bowlObject);
  return (
    <RigidBody colliders="trimesh" position={[0, 1.5, 0]}>
      <primitive object={gltf.scene} scale={3} />
    </RigidBody>
  );
}

export default Bowl;
