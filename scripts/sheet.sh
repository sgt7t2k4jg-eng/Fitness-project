#!/bin/sh
# contact sheet of build/stills for quick visual QA
cd "$(dirname "$0")/../build/stills" && ffmpeg -y -loglevel error -pattern_type glob -i 't*.png' -vf "scale=360:-1,tile=${1:-5}x${2:-2}" -frames:v 1 ../sheet.png
