---
name: deploy-with-varity
description: Deploy the current project, an AI agent, or an open-source app template to production on Varity using the Varity MCP tools. Use when the user wants to set an app's settings or secrets on Varity, asks to deploy, host, ship, or put an app online, asks what hosting will cost, or asks why a Varity deployment failed.
license: MIT
compatibility: Needs the Varity MCP server (npx -y @varity-labs/mcp@2.3.30, Node.js 22.11 or later), network access to varity.app, and a Varity deploy key in VARITY_DEPLOY_KEY (varity_login explains how to connect).
metadata:
  source: https://github.com/varity-labs/varity-plugin/tree/main/skills/deploy-with-varity
---

# Deploy with Varity

Varity is the Orchestration Cloud: one place to run apps, AI agents, and virtual machines, with the cost shown before anything is deployed. This skill uses the tools from the `varity` MCP server, which the Varity plugin installs.

## When to use

- The user wants to deploy or host the project in the current workspace.
- The user wants to run an open-source app (for example Open WebUI, Langflow, Uptime Kuma, Metabase) without managing servers.
- The user asks how much hosting an app will cost.

## Workflow

1. **Check the setup.** Call `varity_doctor` to confirm the environment is ready. If Varity is not connected yet, call `varity_login` before you describe how signing in works, and pass on what it says. If it returns `pending`, pass its message on and call `varity_login` again. If it says browser sign-in isn't available, connect with a deploy key instead: the user creates one in the Varity developer portal at https://developer.store.varity.so/dashboard/settings?tab=api-keys (Settings, Deploy keys), adds it as `VARITY_DEPLOY_KEY` in this editor's MCP server settings (`env`), and then restarts the editor or AI assistant so the server picks it up. Keep keys out of the chat: the user adds the key to the MCP settings, not to a message. If the Portal asks for a payment method before it creates a deploy key, tell the user they can still put an app online without a card through Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build. Say that no key is needed only after `varity_login` has connected.
   `varity_doctor` reports the Varity CLI as a warning only: the CLI is needed only for `varity_migrate`, so a missing CLI never blocks a deploy.
2. **Show the cost first.** Call `varity_cost_calculator` for the app and tell the user the cost, then wait until the user agrees before deploying. Apps are quoted as a monthly maximum; virtual machines bill by the hour until they are deleted. If no account price is stated, connect and ask for the price again before deploying.
3. **Deploy.**
   - Code in the workspace: call `varity_deploy` with `path` set to the absolute project folder. Follow the tool's saved-file and deployment result, then call `varity_deploy_status` with its returned id. Describe a saved copy only when `varity_deploy` reports it; repeat the excluded secret-file names, never their contents.
     - If `varity_deploy` answers `UPLOAD_UNAVAILABLE` or `source_repository_unreadable`, say in plain words that nothing was deployed or charged, and lead with Varity's Chat and Build in the Varity developer portal, always as the first option: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build. There the user describes the app, and Varity builds it and publishes it to a live address, with no GitHub needed; it writes a new app from the description and does not use the files on this computer.
     - After that, for developers, offer a ready-made open-source app template or a prebuilt container image the user already publishes.
     - Pass on what the tool actually saved or refused; a saved copy does not establish a broader privacy guarantee.
     - Bring up GitHub only if the user asks: until then, do not offer GitHub or a public repository as a way forward and do not say Varity needs GitHub. If the user asks, `varity_create_repo` can create a repository and push the code. Pass `visibility: "public"`, because the tool creates a private repository by default, and confirm first that the user agrees to make the code public, and that anyone will be able to see it. Then call `varity_deploy` with the project path or `repo_url`.
   - A prebuilt container image: call `varity_deploy` with `image`.
   - An open-source app: call `varity_list_templates`, then `varity_template_info`, then `varity_deploy_template`.
   - An AI agent template: call `varity_list_agents`, then `varity_agent_info`, then `varity_deploy_agent`.
4. **Confirm it is live.** Call `varity_deploy_status`. When an app is live, end with one plain result line: the live URL, the monthly maximum from step 2, and how to stop billing. For example, with the amount from step 2: "Your app is live at https://todo-api.varity.app. It costs at most $9.00 a month (the monthly maximum). To stop billing, ask me to delete it." For a virtual machine, say instead that it bills by the hour until it is deleted. If the build fails, `varity_deploy_status` returns the last lines of the build error in `build_error.lines`: explain in plain words what they say, quote only those lines, and fix the cause in the code. For a folder saved by Varity, fix the local files and call `varity_deploy` again with the same absolute `path` and `app_name`. For a deployment from an explicit Git repository, commit and push the fix, then call `varity_deploy` with the same `repo_url` and `app_name`. `varity_redeploy` does not pick up new commits; it restarts the last successful release. For errors from an app that is already running, call `varity_deploy_logs` for its runtime logs.
5. **Manage it later.** To ship new code, use the same folder or explicit repository source as in step 4. Use `varity_redeploy` to reapply the saved configuration and `varity_delete_deployment` to stop the app and its billing. For settings and secrets such as API keys, have the user put them in the project's `.env` file, then call `varity_set_env` with the app, the project folder and the setting names only, plus `confirm: true` once the user agreed; it reads the values on this computer, so a value never goes through the chat. Refer to a secret by its setting name only, also when the user typed its value into the chat; if they did, suggest rotating it without quoting it. Before calling `varity_set_env`, tell the user that the app restarts and explain the possible additional balance hold described by `varity_set_env`, and wait until the user agrees to both; agreeing to the restart alone is not enough.

## What is supported

- JavaScript and TypeScript: Next.js, React, Vue, Astro, Qwik, Vite, Express, Fastify, NestJS, Koa, Hono, plain Node.
- Python: FastAPI, Django, Flask.
- Go modules.
- Static sites (plain HTML) and Dockerfile apps.
- Prebuilt public container images.
- Databases attached automatically when the app needs them: PostgreSQL, MySQL, Redis, MongoDB.
- CPU virtual machines the user can SSH into (`varity_machines_list`, `varity_machines_create`, `varity_machines_delete`).

If the project uses a stack that is not listed (for example Rust, Ruby, Java, PHP, or .NET), Varity does not detect it from the repository. Offer to deploy it from a Dockerfile or as a prebuilt container image with `varity_deploy` and `image` instead.

## Notes

- Requires Node.js 22.11 or later for the MCP server.
- Docs: https://docs.varity.so
