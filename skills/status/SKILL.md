---
name: status
description: Show the status of the user's Varity deployments, or of one app, in plain words. Run as /varity:status, optionally followed by an app name.
argument-hint: "[app name or deployment id]"
disable-model-invocation: true
---

Call `varity_deploy_status` for the app named here, or with no deployment to list them all: $ARGUMENTS

Answer in plain words: whether each app is live, its URL, and, when shown, what it has cost so far this month. If a build failed, explain the lines in `build_error.lines` and quote only those lines.
