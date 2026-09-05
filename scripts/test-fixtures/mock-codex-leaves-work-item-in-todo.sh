#!/usr/bin/env bash

set -euo pipefail

readonly agent_prompt="${!#}"
readonly work_item_directory="${agent_prompt#* at }"
readonly canonical_directory="${work_item_directory% using the implementer skill.*}"

printf '%s\n' "$canonical_directory" >>"$CALL_LOG"
