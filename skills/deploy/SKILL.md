---
name: deploy
description: Deploy the current project, a container image, an open-source app template, or an AI agent to Varity, with the cost shown first. Run as /varity:deploy, optionally followed by what to deploy.
argument-hint: "[project folder, GitHub URL, image, or template name]"
disable-model-invocation: true
---

Deploy to Varity by following the `deploy-with-varity` skill from start to finish, including showing the cost and waiting for the user to agree before deploying.

What to deploy: $ARGUMENTS

If nothing is given, deploy the project in the current workspace.
