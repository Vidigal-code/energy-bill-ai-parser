#!/bin/sh
set -eu

MODEL_NAME="${OLLAMA_MODEL:-llama3.2-vision}"
OLLAMA_HOST_URL="${OLLAMA_HOST:-http://ollama:11434}"

echo "[ollama-init] waiting for Ollama API at ${OLLAMA_HOST_URL}..."
until curl -fsS "${OLLAMA_HOST_URL}/api/tags" > /dev/null; do
  sleep 2
done

echo "[ollama-init] pulling model ${MODEL_NAME}..."
printf '{"name":"%s"}' "${MODEL_NAME}" \
  | curl -fsS "${OLLAMA_HOST_URL}/api/pull" -H "Content-Type: application/json" -d @-

echo "[ollama-init] model ${MODEL_NAME} is ready."
