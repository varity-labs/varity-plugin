# Varity plugin

Deploy apps, AI agents, and LLMs to production from your AI editor, with the cost shown before you deploy.

[Varity](https://varity.so) is the Orchestration Cloud: one place to run applications, virtual machines, GPUs, and AI models, on one bill with no bandwidth or egress fees added later. This plugin connects your AI coding agent to Varity through the [Varity MCP server](https://github.com/varity-labs/varity-mcp) and adds a `deploy-with-varity` skill that walks the agent through checking the setup, showing the cost, deploying, and sharing the live URL.

## What's included

| Part | What it does |
|---|---|
| `.mcp.json` / `gemini-extension.json` | Starts the Varity MCP server (`npx -y @varity-labs/mcp`) with 26 tools: deploys, status, logs, open-source app templates, virtual machines, and cost estimates |
| `skills/deploy-with-varity` | Tells the agent when and how to deploy with Varity |
| `.claude-plugin`, `.cursor-plugin`, `.plugin` | Plugin manifests for Claude Code, Cursor, and Agent Plugins compatible clients (GitHub Copilot CLI and VS Code) |

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
    "varity": { "command": "npx", "args": ["-y", "@varity-labs/mcp"] }
  }
}
```

## Requirements

- Node.js 22.11 or later
- The Varity CLI for deploys: `pipx install varitykit`
- A Varity account and deploy key from the [developer portal](https://developer.store.varity.so)

## Links

- Website: https://varity.so
- Docs: https://docs.varity.so
- Templates: https://varity.so/templates
- Contact: hello@varity.so

## License

MIT
