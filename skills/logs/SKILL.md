---
name: logs
description: Show recent runtime logs of a live Varity app in plain words. Run as /varity:logs followed by the app name.
argument-hint: "<app name or deployment id>"
disable-model-invocation: true
---

Call `varity_deploy_logs` for this app: $ARGUMENTS

Summarize what the logs show in plain words and quote the lines that matter. If the app failed while building, call `varity_deploy_status` for it instead: it returns the build error lines.
