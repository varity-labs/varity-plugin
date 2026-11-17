---
name: deploy-with-varity
description: Deploy the current project, an AI agent, or an open-source app template to production on Varity using the Varity MCP tools. Use when the user asks to deploy, host, ship, or put an app online, asks what hosting will cost, or asks why a Varity deployment failed.
---

# Deploy with Varity

Varity is the Orchestration Cloud: one place to run apps, AI agents, and virtual machines, with the cost shown before anything is deployed. This skill uses the tools from the `varity` MCP server bundled with this plugin.

## When to use

- The user wants to deploy or host the project in the current workspace.
- The user wants to run an open-source app (for example Open WebUI, Langflow, Uptime Kuma, Metabase) without managing servers.
- The user asks how much hosting an app will cost.

## Workflow

1. **Check the setup.** Call `varity_doctor` to confirm the environment is ready. Deploys need only a Varity deploy key: either `VARITY_DEPLOY_KEY` exported in the shell that launches the user's editor or agent (then restart the editor or agent), or a sign-in with `varitykit auth login`. If no key is configured, call `varity_login`: it opens the developer portal settings page where the user creates a deploy key to use in one of those two ways. Never ask the user to paste the key into the chat.
   The Varity CLI (`pipx install varitykit`) is needed only for `varity_migrate` and, in MCP server 2.3.22, the template and agent tools. When `varity_doctor` reports only the CLI as missing, a deploy of the user's own code or image can still go ahead.
2. **Show the cost first.** Call `varity_cost_calculator` for the app and tell the user the cost, then wait until the user agrees before deploying. Apps are quoted as a monthly maximum; virtual machines bill by the hour until they are deleted.
3. **Deploy.**
   - Code in the workspace: the project must be pushed to a Git repository. If it is not, `varity_create_repo` can create a GitHub repository and push it. Then call `varity_deploy` with the project path (Varity reads the Git `origin` remote) or with `repo_url`. Varity detects the framework, builds it, and attaches the databases it needs.
   - A prebuilt container image: call `varity_deploy` with `image`.
   - An open-source app: call `varity_list_templates`, then `varity_template_info`, then `varity_deploy_template`.
4. **Confirm it is live.** Call `varity_deploy_status` and share the live URL. If the build or deploy fails, `varity_deploy_status` shows the failed stage and an action code, not the build output; explain them in plain words and have the user build the project locally (for example `npm run build`, or `varity_build`) to see the exact error. Varity builds from the Git `origin` remote, so the fix must be committed and pushed before deploying again with `varity_redeploy` or `varity_deploy`. For errors from an app that is already running, call `varity_deploy_logs` for its runtime logs.
5. **Manage it later.** Use `varity_redeploy` to reapply the saved configuration and `varity_delete_deployment` to stop the app and its billing. Environment variables and secrets are set in the Varity developer portal, never through the chat.

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
