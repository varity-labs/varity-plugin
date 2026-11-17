# Varity plugin

Deploy apps and AI agents to production from your AI editor, with the cost shown before you deploy.

[Varity](https://varity.so) is the Orchestration Cloud: one place to run applications, AI agents, and virtual machines. Traffic alone does not change an app's monthly price. This plugin connects your AI coding agent to Varity through the [Varity MCP server](https://github.com/varity-labs/varity-mcp) and adds a `deploy-with-varity` skill that walks the agent through checking the setup, showing the cost, deploying, and sharing the live URL.

## What's included

| Part | What it does |
|---|---|
| `mcp.json`, `.mcp.json`, `gemini-extension.json` | Start the Varity MCP server (`npx -y @varity-labs/mcp@2.3.22`) with 26 tools: deploys, status, logs, open-source app templates, CPU virtual machines, and cost estimates |
| `skills/deploy-with-varity` | Tells the agent when and how to deploy with Varity |
| `plugin.json`, `.claude-plugin`, `.cursor-plugin` | Plugin manifests: `plugin.json` for Agent Plugins clients such as GitHub Copilot CLI and VS Code, `.claude-plugin` for Claude Code, `.cursor-plugin` for Cursor |

## Install

**Claude Code**

```bash
claude plugin marketplace add varity-labs/varity-plugin
claude plugin install varity@varity-plugin
```

**Gemini CLI**

```bash
gemini extensions install https://github.com/varity-labs/varity-plugin
```

**Any MCP client:** add the server directly.

```json
{
  "mcpServers": {
    "varity": { "command": "npx", "args": ["-y", "@varity-labs/mcp@2.3.22"] }
  }
}
```

## Requirements

- Node.js 22.11 or later
- A Varity account and a deploy key from the [developer portal](https://developer.store.varity.so). Export it as `VARITY_DEPLOY_KEY` in the shell that launches your editor or agent, then restart the editor or agent; or sign in once with `varitykit auth login`. MCP server 2.3.22 reads `VARITY_API_KEY` before `VARITY_DEPLOY_KEY`, so leave `VARITY_API_KEY` unset unless it holds your deploy key. Never paste the key into the chat.
- The Varity CLI (`pipx install varitykit`) only for `varity_migrate` and, in MCP server 2.3.22, the template and agent tools

## Data handling

- **Personal data:** the plugin stores no personal data. The MCP server reads your Varity deploy key from `VARITY_DEPLOY_KEY` (or `VARITY_API_KEY`) or the Varity CLI sign-in file and sends it only to the Varity API.
- **What is sent where:**
  - The Varity API at https://varity.app receives deploy, status, logs, pricing and balance requests.
  - Docs search reads https://docs.varity.so.
  - Build, dev server, dependency install and browser tools run on your machine.
  - `varity_create_repo` uses your own GitHub credentials against GitHub.
  - `varity_migrate` clones the GitHub repository you name into a temporary directory.
  - `varity_deploy_status` sends one HTTP request to each listed app's own URL to check that it responds.
  - The MCP server sends no telemetry unless you set the OpenTelemetry `OTEL_EXPORTER_OTLP_*` variables or `BETTERSTACK_MCP_DSN` yourself.
- **Retention:** see the [Varity privacy policy](https://www.varity.so/privacy/).
- **Intended users:** not intended for people under 18.

## Links

- Website: https://varity.so
- Docs: https://docs.varity.so
- Templates: https://varity.so/templates
- Support: support@varity.so or https://www.varity.so/contact/
- Privacy policy: https://www.varity.so/privacy/
- Terms of service: https://www.varity.so/terms/

## License

MIT
