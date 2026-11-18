---
name: deploy-with-varity
description: Deploy the current project, an AI agent, or an open-source app template to production on Varity using the Varity MCP tools. Use when the user asks to deploy, host, ship, or put an app online, asks what hosting will cost, or asks why a Varity deployment failed.
license: MIT
compatibility: Needs the Varity MCP server (npx -y @varity-labs/mcp@2.3.27, Node.js 22.11 or later), network access to varity.app, and a Varity deploy key in VARITY_DEPLOY_KEY.
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

1. **Check the setup.** Call `varity_doctor` to confirm the environment is ready. Deploys, templates and agents need only a Varity deploy key, set as `VARITY_DEPLOY_KEY` in the environment of the MCP server (the shell that launches the user's editor or agent, then restart it, or the server's `env` in the MCP config). If no key is configured, call `varity_login`: it opens the developer portal page where the user creates a deploy key and explains where to put it. Never ask the user to paste the key into the chat.
   `varity_doctor` reports the Varity CLI as a warning only: the CLI is needed only for `varity_migrate`, so a missing CLI never blocks a deploy.
2. **Show the cost first.** Call `varity_cost_calculator` for the app and tell the user the cost, then wait until the user agrees before deploying. Apps are quoted as a monthly maximum; virtual machines bill by the hour until they are deleted.
3. **Deploy.**
   - Code in the workspace: Varity builds code from a public GitHub repository today, so it cannot read private code from this computer. Never offer to make the code public as the first option. If the project is already in a public GitHub repository, call `varity_deploy` with the project path (Varity reads the Git `origin` remote) or with `repo_url`; Varity detects the framework, builds it, and attaches the databases it needs. Otherwise, tell the user in plain words that Varity can only build from public code today, and offer the paths that keep the code private first: a ready-made open-source app template, or a prebuilt container image the user already publishes. Only if the user then chooses to publish the code, `varity_create_repo` can create a GitHub repository and push it: pass `visibility: "public"`, because the tool creates a private repository by default, and confirm first that the user agrees to make the code public. Then call `varity_deploy` with the project path or `repo_url`.
   - A prebuilt container image: call `varity_deploy` with `image`.
   - An open-source app: call `varity_list_templates`, then `varity_template_info`, then `varity_deploy_template`.
   - An AI agent template: call `varity_list_agents`, then `varity_agent_info`, then `varity_deploy_agent`.
4. **Confirm it is live.** Call `varity_deploy_status`. When an app is live, end with one plain result line: the live URL, the monthly maximum from step 2, this sentence exactly: "Traffic alone does not change an app's monthly price.", and how to stop billing. For example: "Your app is live at https://todo-api.varity.app. It costs at most $9.00 a month (the monthly maximum). Traffic alone does not change an app's monthly price. To stop billing, ask me to delete it." For a virtual machine, say instead that it bills by the hour until it is deleted, and never use the traffic sentence. If the build or deploy fails, `varity_deploy_status` shows the failed stage and an action code, not the build output; explain them in plain words and have the user build the project locally (for example `npm run build`, or `varity_build`) to see the exact error. Varity builds from the Git repository, so the fix must be committed and pushed, then deployed with `varity_deploy` using the same repository and app name: that builds the latest pushed commit into the same app. `varity_redeploy` does not pick up new commits; it restarts the last successful release. For errors from an app that is already running, call `varity_deploy_logs` for its runtime logs.
5. **Manage it later.** To ship new code, push it and call `varity_deploy` again with the same repository and app name. Use `varity_redeploy` to reapply the saved configuration and `varity_delete_deployment` to stop the app and its billing. Environment variables and secrets are set in the Varity developer portal, never through the chat.

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
