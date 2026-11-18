---
name: env
description: Set an app's settings and secrets on Varity from the project's .env file, by setting name only. Run as /varity:env followed by the project folder and the setting names.
argument-hint: "<project folder> <SETTING_NAME> [SETTING_NAME ...]"
disable-model-invocation: true
license: MIT
metadata:
  source: https://github.com/varity-labs/varity-plugin/tree/main/skills/env
---

Set settings on a Varity app from the project's `.env` file: $ARGUMENTS

The arguments are a project folder and setting names such as `OPENAI_API_KEY`. Values stay in the `.env` file on this computer and never go through the chat. If an argument contains a value (for example `NAME=value`), use only the name before `=`, do not repeat the value, and ask the user to put the value in `.env` instead. Refer to each secret by its name only, also when warning that a value was typed into the chat.

1. Find the app's name: ask the user, or call `varity_deploy_status` to list the apps.
2. Tell the user which setting names will be sent, then get agreement to the restart and its hold as step 5 of the `deploy-with-varity` skill says, before calling `varity_set_env`.
3. Call `varity_set_env` once with the app, the absolute project folder path, the setting names, and `confirm: true` because the user agreed in step 2. If the settings are in another file such as `.env.production`, pass its name as `env_file`. If it times out, call `varity_deploy_status` instead of calling it again.
