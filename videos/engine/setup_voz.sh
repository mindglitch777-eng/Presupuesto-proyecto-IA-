#!/bin/sh
# Descarga la voz argentina (Piper es_AR daniela, convertida por sherpa-onnx) y las dependencias de Python.
set -e
cd "$(dirname "$0")/.."
mkdir -p voces && cd voces
for m in vits-piper-es_MX-claude-high vits-piper-es_AR-daniela-high vits-piper-es_MX-ald-medium; do
  [ -d "$m" ] || { curl -sL -o "$m.tar.bz2" "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/$m.tar.bz2"; tar xjf "$m.tar.bz2"; rm "$m.tar.bz2"; }
done
pip install --break-system-packages "sherpa-onnx<2" soundfile num2words numpy
