import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { random } from 'remotion';

/** Lienzo 3D a pantalla completa. La cámara se mueve con las props (todo es función del cuadro). */
export const Lienzo3D: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; mira?: [number, number, number]; fov?: number; entorno?: boolean; fondo?: string; niebla?: [string, number, number]; style?: React.CSSProperties }> = ({
  children, cam = [0, 1.5, 7], mira = [0, 0.8, 0], fov = 40, entorno = true, fondo, niebla, style,
}) => (
  <ThreeCanvas width={1080} height={1920} style={{ position: 'absolute', inset: 0, ...style }} camera={{ fov, position: cam, near: 0.1, far: 200 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
    <Camara pos={cam} mira={mira} fov={fov} />
    {entorno && <Entorno />}
    <hemisphereLight args={['#ffffff', '#202030', 0.9]} />
    {fondo && <color attach="background" args={[fondo]} />}
    {niebla && <fog attach="fog" args={niebla} />}
    {children}
  </ThreeCanvas>
);

const Camara: React.FC<{ pos: [number, number, number]; mira: [number, number, number]; fov: number }> = ({ pos, mira, fov }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...mira);
  return null;
};

/** Mapa de entorno de estudio (para que el cromo y el oro reflejen algo). */
export const Entorno: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => { tex.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
};

export const MAT = {
  cromo: { color: '#d8dde6', metalness: 1, roughness: 0.12 },
  oro: { color: '#FFC93C', metalness: 1, roughness: 0.2 },
  cuero: { color: '#34343c', metalness: 0.15, roughness: 0.32 },
  cueroRojo: { color: '#8a0f1f', metalness: 0.1, roughness: 0.4 },
};

/** Sillón de barbero hecho con primitivas. */
export const SillaBarbero: React.FC<{ cuero?: object; metal?: object; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  cuero = MAT.cuero, metal = MAT.cromo, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.85, 0.95, 0.12, 48]} /><meshStandardMaterial {...metal} /></mesh>
    <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.13, 0.16, 0.9, 32]} /><meshStandardMaterial {...metal} /></mesh>
    <mesh position={[0, 1.08, 0.05]}><boxGeometry args={[1.25, 0.26, 1.15]} /><meshStandardMaterial {...cuero} /></mesh>
    <mesh position={[0, 1.95, -0.52]} rotation={[-0.12, 0, 0]}><boxGeometry args={[1.2, 1.55, 0.24]} /><meshStandardMaterial {...cuero} /></mesh>
    <mesh position={[0, 2.85, -0.6]} rotation={[-0.12, 0, 0]}><boxGeometry args={[0.55, 0.32, 0.22]} /><meshStandardMaterial {...cuero} /></mesh>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.72, 1.55, 0.05]}><boxGeometry args={[0.18, 0.14, 1.05]} /><meshStandardMaterial {...cuero} /></mesh>
        <mesh position={[s * 0.72, 1.33, 0.45]}><cylinderGeometry args={[0.04, 0.04, 0.42, 16]} /><meshStandardMaterial {...metal} /></mesh>
        <mesh position={[s * 0.72, 1.33, -0.35]}><cylinderGeometry args={[0.04, 0.04, 0.42, 16]} /><meshStandardMaterial {...metal} /></mesh>
      </group>
    ))}
    <mesh position={[0, 0.62, 0.78]} rotation={[0.5, 0, 0]}><boxGeometry args={[0.9, 0.08, 0.5]} /><meshStandardMaterial {...metal} /></mesh>
  </group>
);

/** Tijera: dos hojas y dos ojos. `abre` en radianes. */
export const Tijera: React.FC<{ abre?: number; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; metal?: object }> = ({
  abre = 0.3, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, metal = MAT.cromo,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    {[-1, 1].map((s) => (
      <group key={s} rotation={[0, 0, (s * abre) / 2]}>
        <mesh position={[0, 0.9, 0]} scale={[0.16, 1.8, 0.05]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial {...metal} /></mesh>
        <mesh position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.115, 0.115, 0.05]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial {...metal} /></mesh>
        <mesh position={[s * 0.22, -0.55, 0]}><torusGeometry args={[0.28, 0.07, 16, 40]} /><meshStandardMaterial color="#111" metalness={0.3} roughness={0.4} /></mesh>
        <mesh position={[s * 0.1, -0.15, 0]} rotation={[0, 0, s * -0.35]} scale={[0.1, 0.5, 0.06]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial {...metal} /></mesh>
      </group>
    ))}
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.14, 20]} /><meshStandardMaterial color="#555" metalness={1} roughness={0.2} /></mesh>
  </group>
);

/** Textura con texto dibujado en un canvas (para carteles, billetes, signos). */
export const useTextura = (texto: string, o: { w?: number; h?: number; bg?: string; color?: string; size?: number; borde?: string; peso?: number } = {}) => {
  const { w = 512, h = 256, bg = '#fff', color = '#000', size = 160, borde, peso = 900 } = o;
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d')!;
    if (bg !== 'transparent') { x.fillStyle = bg; x.fillRect(0, 0, w, h); }
    if (borde) { x.strokeStyle = borde; x.lineWidth = w / 40; x.strokeRect(w / 80, w / 80, w - w / 40, h - w / 40); }
    x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `${peso} ${size}px "Inter Display", sans-serif`;
    texto.split('\n').forEach((l, i, arr) => x.fillText(l, w / 2, h / 2 + (i - (arr.length - 1) / 2) * size * 1.05));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [texto, w, h, bg, color, size, borde, peso]);
};

/** Cartel plano con texto (doble cara opcional). */
export const Cartel: React.FC<{ texto: string; w?: number; h?: number; bg?: string; color?: string; size?: number; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; borde?: string; grosor?: number; emisivo?: boolean }> = ({
  texto, w = 2, h = 1, bg = '#fff', color = '#000', size = 160, position, rotation, scale = 1, borde, grosor = 0.06, emisivo,
}) => {
  const tex = useTextura(texto, { w: 512, h: Math.round((512 * h) / w), bg, color, size, borde });
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh><boxGeometry args={[w, h, grosor]} /><meshStandardMaterial attach="material-0" color={bg} /><meshStandardMaterial attach="material-1" color={bg} /><meshStandardMaterial attach="material-2" color={bg} /><meshStandardMaterial attach="material-3" color={bg} />
        {emisivo ? <meshBasicMaterial attach="material-4" map={tex} toneMapped={false} /> : <meshStandardMaterial attach="material-4" map={tex} roughness={0.5} />}
        {emisivo ? <meshBasicMaterial attach="material-5" map={tex} toneMapped={false} /> : <meshStandardMaterial attach="material-5" map={tex} roughness={0.5} />}
      </mesh>
    </group>
  );
};

/** Billete genérico (verde o rojo) con el monto. */
export const Billete: React.FC<{ monto?: string; color?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({ monto = '$', color = '#3BB273', position, rotation, scale = 1 }) => (
  <Cartel texto={monto} w={1.6} h={0.75} bg={color} color="#0b2e1a" size={150} borde="#0b2e1a" grosor={0.01} position={position} rotation={rotation} scale={scale} />
);

/** Pedazos que salen volando desde el centro (estallido) en función de `t` (0 = entero). */
export const Estallido: React.FC<{ t: number; n?: number; mat?: object; radio?: number; seed?: string; tam?: number }> = ({ t, n = 60, mat = MAT.cromo, radio = 1, seed = 'e', tam = 0.22 }) => (
  <group>
    {Array.from({ length: n }, (_, i) => {
      const a = random(seed + i) * Math.PI * 2, b = (random(seed + 'b' + i) - 0.3) * Math.PI;
      const v = 2 + random(seed + 'v' + i) * 4;
      const d = t * v;
      const p: [number, number, number] = [Math.cos(a) * Math.cos(b) * (radio * random(seed + 'r' + i) + d), 1.2 + Math.sin(b) * (radio + d) - t * t * 0.4, Math.sin(a) * Math.cos(b) * (radio * random(seed + 'z' + i) + d)];
      const s = tam * (0.5 + random(seed + 's' + i));
      return <mesh key={i} position={p} rotation={[t * 6 * random(seed + 'x' + i), t * 5 * random(seed + 'y' + i), t * 4]} scale={[s, s * 0.6, s * 0.3]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial {...(i % 3 === 0 ? MAT.cuero : mat)} /></mesh>;
    })}
  </group>
);

/** Figura de vóxeles a partir de un dibujo de texto ("#" = cubo). */
export const Voxeles: React.FC<{ dibujo: string[]; color?: string; tam?: number; position?: [number, number, number]; rotation?: [number, number, number]; emisivo?: number; t?: number }> = ({ dibujo, color = '#FFD60A', tam = 0.2, position, rotation, emisivo = 0.3, t = 1 }) => {
  const cubos: [number, number][] = [];
  dibujo.forEach((fila, y) => [...fila].forEach((c, x) => { if (c === '#') cubos.push([x, y]); }));
  const w = Math.max(...dibujo.map((d) => d.length)), h = dibujo.length;
  return (
    <group position={position} rotation={rotation}>
      {cubos.map(([x, y], i) => {
        const k = Math.max(0, Math.min(1, t * 1.6 - (i / cubos.length) * 0.6));
        return <mesh key={i} position={[(x - w / 2) * tam, (h / 2 - y) * tam + (1 - k) * 3, 0]} scale={k * tam * 0.95}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={emisivo} roughness={0.4} /></mesh>;
      })}
    </group>
  );
};

export const SIGNO = ['.####.', '##..##', '....##', '...##.', '..##..', '..##..', '......', '..##..'];
