#!/bin/sh
# Usage: grok-monitor.sh <claude stream-json file>
# Posts one line only when Sonnet's phase, failure count, commit count or end state changes. Never on a timer.
d=$(dirname "$0"); f="$1"; prev=""
while true; do
  s=$(node "$d/sonnet-phase.js" "$f" 2>/dev/null) || { sleep 60; continue; }
  key=$(node -e "const s=JSON.parse(process.argv[1]);console.log([s.phase,s.fails,s.commits,s.end].join('|'))" "$s")
  if [ "$key" != "$prev" ]; then
    node -e "const s=JSON.parse(process.argv[1]);console.log('Sonnet is '+s.phase+(s.fails?', '+s.fails+' failed call(s)':'')+(s.commits?', '+s.commits+' commit(s)':'')+(s.end?', run ended: '+s.end:'')+'. Last step: '+s.last)" "$s"
    prev=$key
  fi
  case "$key" in *\|*\|*\|?*) break;; esac
  sleep 60
done
