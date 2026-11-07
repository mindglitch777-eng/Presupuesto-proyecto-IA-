import React from 'react';
import { Composition, staticFile, type CalculateMetadataFunction } from 'remotion';
import type { ShortProps } from './lib/Short';
import type { Timeline } from './lib/contexto';
import { V01 } from './shorts/v01';
import { V02 } from './shorts/v02';
import { V03 } from './shorts/v03';
import { V04 } from './shorts/v04';
import { V05 } from './shorts/v05';
import { V06 } from './shorts/v06';
import { V07 } from './shorts/v07';
import { V08 } from './shorts/v08';
import { V09 } from './shorts/v09';
import { V10 } from './shorts/v10';

// Cada video lee su línea de tiempo (la arma scripts/prep.mjs) y dura lo que dura su voz.
const VIDEOS: { id: string; C: React.FC<ShortProps> }[] = [
  { id: '01-peor-que-un-mal-corte', C: V01 },
  { id: '02-barbero-o-secretario', C: V02 },
  { id: '03-hay-un-ladron', C: V03 },
  { id: '04-game-over', C: V04 },
  { id: '05-cuanto-ganaste', C: V05 },
  { id: '06-buscado-juan', C: V06 },
  { id: '07-tu-peor-dia', C: V07 },
  { id: '08-te-va-a-doler', C: V08 },
  { id: '09-como-la-otra-vez', C: V09 },
  { id: '10-busco-5-barberias', C: V10 },
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
