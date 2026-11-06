import { Composition, AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';
const Test = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = spring({ frame: f, fps });
  return <AbsoluteFill style={{ background: '#7C4DFF', justifyContent: 'center', alignItems: 'center' }}><div style={{ fontSize: 160, color: 'white', transform: `scale(${s})`, fontWeight: 900 }}>HOLA 💈</div></AbsoluteFill>; };
export const RemotionRoot = () => <Composition id="Test" component={Test} durationInFrames={30} fps={30} width={1080} height={1920} />;
