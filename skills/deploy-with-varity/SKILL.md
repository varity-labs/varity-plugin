---
name: deploy-with-varity
description: Deploy the current project, an AI agent, or an open-source app template to production on Varity using the Varity MCP tools. Use when the user asks to deploy, host, ship, or put an app online, or asks what hosting will cost.
---

# Deploy with Varity

Varity is the Orchestration Cloud: one place to run apps, AI agents, virtual machines, GPUs, and models, with the monthly cost shown before anything is deployed. This skill uses the tools from the `varity` MCP server bundled with this plugin.

## When to use

- The user wants to deploy or host the project in the current workspace.
- The user wants to run an open-source app (for example Open WebUI, Langflow, Uptime Kuma, Metabase) without managing servers.
- The user asks how much hosting an app will cost.

## Workflow

1. **Check the setup.** Call `varity_doctor` to confirm the environment is ready. Deploys need the Varity CLI (`pipx install varitykit`) and a deploy key. If no key is configured, call `varity_login`: it opens the developer portal settings page, and the user then runs `varitykit auth login` in their own terminal to enter the key. Never ask the user to paste the key into the chat.
2. **Show the cost first.** Call `varity_cost_calculator` for the app and tell the user the monthly cost before deploying.
3. **Deploy.**
   - Code in the workspace: the project must be pushed to a Git repository. If it is not, `varity_create_repo` can create a GitHub repository and push it. Then call `varity_deploy` with the project path (Varity reads the Git `origin` remote) or with `repo_url`. Varity detects the framework, builds it, and attaches the databases it needs.
   - A prebuilt container image: call `varity_deploy` with `image`.
   - An open-source app: call `varity_list_templates`, then `varity_template_info`, then `varity_deploy_template`.
4. **Confirm it is live.** Call `varity_deploy_status` and share the live URL. If the deploy fails, call `varity_deploy_logs` and explain the error in plain words.
5. **Manage it later.** Use `varity_redeploy` to reapply the saved configuration and `varity_delete_deployment` to stop the app and its billing. Environment variables and secrets are set in the Varity developer portal, never through the chat.

## What is supported

- JavaScript and TypeScript: Next.js, React, Vue, Astro, Vite, Express, Fastify, NestJS, Koa, Hono, plain Node.
- Python: FastAPI, Django, Flask.
- Static sites and Dockerfile apps.
- Databases attached automatically when the app needs them: PostgreSQL, MySQL, Redis, MongoDB.
- GPU workloads for AI agents and self-hosted models.

If the project uses a stack that is not listed (for example Go, Rust, Ruby, Java, PHP, or .NET), tell the user it is not supported yet instead of trying to deploy it.

## Notes

- Always show the cost before deploying and wait for the user to agree.
- Requires Node.js 22.11 or later for the MCP server.
- Docs: https://docs.varity.so
