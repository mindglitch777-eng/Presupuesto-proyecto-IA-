// Montos de videos/config.js, copiados a public/config.json por scripts/prep.mjs (en el navegador no hay acceso al repo).
export type Cfg = { corte: number; sena: number; mensual: number; fundador: number; diasPrueba: number; usuario: string };
import cfg from '../../public/config.json';
export const cargarConfig = (): Cfg => cfg as Cfg;
