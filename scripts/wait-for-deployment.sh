#!/bin/bash

echo "⏳ Warte auf GitHub Actions Deployment..."

for i in {1..30}; do
  run_status=$(gh run list --limit 1 --json status,conclusion -q '.[0] | "\(.status):\(.conclusion)"')
  timestamp=$(date +%H:%M:%S)

  echo "[$timestamp] Status: $run_status"

  if [[ "$run_status" == "completed:success" ]]; then
    echo "✅ GitHub Actions erfolgreich abgeschlossen!"
    exit 0
  elif [[ "$run_status" == "completed:failure" ]] || [[ "$run_status" == "completed:cancelled" ]]; then
    echo "❌ GitHub Actions fehlgeschlagen!"
    gh run view --log-failed
    exit 1
  fi

  sleep 10
done

echo "⚠️  Timeout nach 5 Minuten erreicht"
exit 1
