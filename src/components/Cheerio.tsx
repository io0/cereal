import { useRef, Suspense, useMemo } from "react";
import { Geometry, ConvexGeometry } from "three-stdlib";
import { useConvexPolyhedron } from "@react-three/cannon";
import { TorusGeometry } from "three";
import convert from "color-convert";

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {import("three").BufferGeometry} bufferGeometry
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
  let h = (seed * 100 * Math.PI * 360) % 360;
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
  const geo = useMemo(
    () => toConvexProps(new TorusGeometry(RADIUS, TUBE, 8, 6)),
    []
  );
  const [ref] = useConvexPolyhedron(() => ({
    mass: 1,
    position: initialPos,
    args: geo as any,
  }));

  return (
    <mesh ref={ref as any} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
      <torusGeometry args={[RADIUS, TUBE, 64, 48]} />
      <meshStandardMaterial
        color={pastel ? getPastel(initialPos[0]) : "#EBAF4C"}
        metalness={gold ? 1.0 : 0.0}
        roughness={gold ? 0.0 : 0.5}
      />
    </mesh>
  );
}

export default Cheerio;
