import React from 'react';
import { Composition, staticFile, type CalculateMetadataFunction } from 'remotion';
import type { ShortProps } from './lib/Short';
import type { Timeline } from './lib/contexto';
import { C01 } from './shorts/c01';

// Campaña Silla Llena (CAMPANA.md). La versión anterior está en src/shorts-viejos/ y no se registra.
// Cada video lee su línea de tiempo (la arma scripts/prep.mjs) y dura lo que dura su voz.
const VIDEOS: { id: string; C: React.FC<ShortProps> }[] = [
  { id: '01-tu-barberia-se-muere', C: C01 },
];

const meta: CalculateMetadataFunction<ShortProps & { id: string }> = async ({ props }) => {
  const tl: Timeline = await fetch(staticFile(`shorts/${props.id}/timeline.json`)).then((r) => r.json());
  return { durationInFrames: tl.total, fps: tl.fps, props: { ...props, timeline: tl } };
};

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map(({ id, C }) => (
      <Composition key={id} id={'v' + id.slice(0, 2)} component={C as React.FC<any>} width={1080} height={1920} fps={30} durationInFrames={300}
        defaultProps={{ id, guias: false, timeline: null as unknown as Timeline }} calculateMetadata={meta} />
    ))}
  </>
);
