import { useRef, Suspense, useMemo } from "react";
import { Geometry, ConvexGeometry } from "three-stdlib";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, TorusGeometry } from "three";
import convert from "color-convert";

/**
 * Returns legacy geometry vertices, faces for ConvP
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

function getPastel(seed: number): string {
  const h = ((1000 * Math.sin(100000 * seed)) % 1.0) * 360;
  return "#" + convert.hsl.hex([h, 55, 71]);
}

const RADIUS = 0.2;
const TUBE = 0.08;

export type CheerioProps = {
  initialPos: [number, number, number];
  gold: boolean;
  pastel: boolean;
};

function Cheerio({ initialPos, gold, pastel }: CheerioProps) {
  // const height = useLoader(
  //   TextureLoader,
  //   "/textures/Wall_Plaster_002_Height.png"
  // );
  // const normal = useLoader(
  //   TextureLoader,
  //   "/textures/Wall_Plaster_002_Normal.jpg"
  // );
  // const ao = useLoader(
  //   TextureLoader,
  //   "/textures/Wall_Plaster_002_AmbientOcclusion.jpg"
  // );

  const geo = useMemo(
    () => toConvexProps(new TorusGeometry(RADIUS, TUBE, 8, 6)),
    []
  );
  const [ref] = useConvexPolyhedron(() => ({
    mass: 1,
    position: initialPos,
    rotation: [
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
    ],
    args: geo as any,
  }));

  return (
    <Suspense fallback={null}>
      <mesh ref={ref as any}>
        <torusGeometry args={[RADIUS, TUBE, 64, 48]} />
        <meshStandardMaterial
          color={pastel ? getPastel(initialPos[0]) : "#EBAF4C"}
          metalness={gold ? 1.0 : 0.0}
          roughness={gold ? 0.0 : 0.5}
          // displacementMap={height}
          // normalMap={normal}
          // aoMap={ao}
        />
      </mesh>
    </Suspense>
  );
}

export default Cheerio;
