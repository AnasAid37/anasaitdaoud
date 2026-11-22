#!/usr/bin/env bash
# Turn a generated image-to-video clip into web-ready hero files.
#
#   bash scripts/prepare-hero-video.sh path/to/generated.mp4 [crossfade_seconds]
#
# Output (picked up automatically by the hero on the next build):
#   src/assets/hero-video/character-loop.mp4   H.264, no audio, faststart (all browsers)
#   src/assets/hero-video/character-loop.webm  VP9, no audio (smaller, modern browsers)
#   src/assets/hero-video/character-loop.webp  first frame, used as the video poster
#
# - The clip is centre-cropped to 9:16 and scaled to 540x960 (it must be generated from
#   scripts/hero-video/start-frame.jpg so it lines up with the set).
# - If the clip was generated WITHOUT the same start/end frame, pass a crossfade duration
#   (e.g. 0.8) to blend its end into its start for a seamless loop.
set -euo pipefail
IN="${1:?usage: prepare-hero-video.sh input.mp4 [crossfade_seconds]}"
XF="${2:-0}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/assets/hero-video"
mkdir -p "$OUT"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

BASE="crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=540:960:flags=lanczos,setsar=1,fps=24"
if awk "BEGIN{exit !($XF > 0)}"; then
  D="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")"
  CUT="$(awk "BEGIN{print $D - $XF}")"
  FILTER="[0:v]${BASE},split[a][b];[a]trim=0:${CUT},setpts=PTS-STARTPTS[main];[b]trim=${CUT}:${D},setpts=PTS-STARTPTS[tail];[tail][main]xfade=transition=fade:duration=${XF}:offset=0,format=yuv420p[v]"
else
  FILTER="[0:v]${BASE},format=yuv420p[v]"
fi

ffmpeg -loglevel error -y -i "$IN" -filter_complex "$FILTER" -map "[v]" -an -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -movflags +faststart "$TMP/master.mp4"
cp "$TMP/master.mp4" "$OUT/character-loop.mp4"
ffmpeg -loglevel error -y -i "$TMP/master.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 -deadline good -cpu-used 2 "$OUT/character-loop.webm"
ffmpeg -loglevel error -y -i "$TMP/master.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/character-loop.webp"
ls -la "$OUT"
echo "Done. Rebuild the site (npm run build) — the hero now plays the real performance."
