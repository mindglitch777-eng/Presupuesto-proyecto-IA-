"""Genera una muestra de cada voz masculina de Edge TTS que habla español (y de las multilingües),
más algunas variantes de tono, para elegir la voz de los videos.
Salida: videos/voces-muestras/*.mp3, LISTA.md y todas.mp4 (todas seguidas, con el nombre en pantalla)."""
import asyncio, os, re, subprocess
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'voces-muestras')
FONT = os.path.join(HERE, 'fonts', 'InterDisplay-Black.otf')
FRASE = ('Sábado, diez de la mañana. Te clavaron. Otra vez. '
         'Si te pasa tres veces por semana, son un millón cuatrocientos cuarenta mil pesos por año. '
         'Comentá bárber y te paso cómo lo uso.')
REPO_RAW = 'https://github.com/mindglitch777-eng/Presupuesto-proyecto-IA-/raw/main/videos/voces-muestras/'
# variantes "propias": la misma voz con otro tono y velocidad
VARIANTES = [
    ('es-AR-TomasNeural', '-8Hz', '+8%', 'Tomás grave'),
    ('es-AR-TomasNeural', '-4Hz', '+15%', 'Tomás rápido'),
    ('es-MX-JorgeNeural', '-6Hz', '+10%', 'Jorge grave'),
]


def pais(v):
    m = re.search(r'- (.+)$', v.get('FriendlyName', ''))
    return m.group(1) if m else v['Locale']


async def main():
    os.makedirs(OUT, exist_ok=True)
    voces = await edge_tts.list_voices()
    elegidas = [v for v in voces if v['Gender'] == 'Male' and (v['Locale'].startswith('es-') or 'Multilingual' in v['ShortName'])]
    elegidas.sort(key=lambda v: (not v['Locale'].startswith('es-'), v['ShortName']))
    filas = [(v['ShortName'], pais(v), '+0Hz', '+0%', v['ShortName']) for v in elegidas]
    filas += [(n, f'variante de {n}', p, r, etiqueta) for n, p, r, etiqueta in VARIANTES]
    hechas = []
    for nombre, origen, pitch, rate, etiqueta in filas:
        archivo = re.sub(r'[^A-Za-z0-9-]+', '_', etiqueta) + '.mp3'
        try:
            await edge_tts.Communicate(FRASE, nombre, rate=rate, pitch=pitch).save(os.path.join(OUT, archivo))
            hechas.append((etiqueta, nombre, origen, pitch, rate, archivo))
            print('ok', etiqueta)
        except Exception as e:
            print('falló', etiqueta, e)

    with open(os.path.join(OUT, 'LISTA.md'), 'w') as f:
        f.write('# Voces masculinas de Edge TTS\n\nTodas dicen la misma frase. Tocá el link para escucharla. '
                'Las multilingües hablan español con el acento de su idioma de origen.\n\n'
                '| # | Voz | Origen | Ajuste | Escuchar |\n|---|---|---|---|---|\n')
        for i, (et, n, o, p, r, a) in enumerate(hechas, 1):
            ajuste = '—' if (p, r) == ('+0Hz', '+0%') else f'tono {p}, velocidad {r}'
            f.write(f'| {i} | `{n}` | {o} | {ajuste} | [{et}]({REPO_RAW}{a}) |\n')

    # un solo video con todas seguidas y el nombre en pantalla
    segs = []
    for i, (et, n, o, p, r, a) in enumerate(hechas, 1):
        seg = os.path.join(OUT, f'_seg{i:02d}.mp4')
        txt = f'{i}. {et}'.replace(':', r'\:').replace("'", '')
        sub = o.replace(':', r'\:').replace("'", '')
        vf = (f"drawtext=fontfile={FONT}:text='{txt}':fontcolor=white:fontsize=64:x=(w-tw)/2:y=h/2-80,"
              f"drawtext=fontfile={FONT}:text='{sub}':fontcolor=0xFFD400:fontsize=44:x=(w-tw)/2:y=h/2+20")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x0A0A0F:s=1080x1920:r=30',
                        '-i', os.path.join(OUT, a), '-af', 'apad=pad_dur=0.6', '-shortest', '-vf', vf,
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-ar', '48000', '-ac', '2', seg], check=True)
        segs.append(seg)
    lista = os.path.join(OUT, '_lista.txt')
    with open(lista, 'w') as f:
        f.write('\n'.join(f"file '{s}'" for s in segs))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy',
                    '-movflags', '+faststart', os.path.join(OUT, 'todas.mp4')], check=True)
    for s in segs + [lista]:
        os.remove(s)


asyncio.run(main())
