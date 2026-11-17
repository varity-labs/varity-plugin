# Varity plugin

Deploy apps and AI agents to production from your AI editor, with the cost shown before you deploy.

[Varity](https://varity.so) is the Orchestration Cloud: one place to run applications, AI agents, and virtual machines. Traffic alone does not change an app's monthly price. This plugin connects your AI coding agent to Varity through the [Varity MCP server](https://github.com/varity-labs/varity-mcp) and adds a `deploy-with-varity` skill that walks the agent through checking the setup, showing the cost, deploying, and sharing the live URL.

## What's included

| Part | What it does |
|---|---|
| `mcp.json`, `.mcp.json`, `gemini-extension.json` | Start the Varity MCP server (`npx -y @varity-labs/mcp@2.3.27`) with 26 tools: deploys, status, logs, open-source app and AI agent templates, CPU virtual machines, and cost estimates |
| `skills/deploy-with-varity` | Tells the agent when and how to deploy with Varity |
| `plugin.json`, `.claude-plugin`, `.cursor-plugin` | Plugin manifests: `plugin.json` for Agent Plugins clients such as Codex, GitHub Copilot CLI, VS Code and Kiro, `.claude-plugin` for Claude Code, `.cursor-plugin` for Cursor |

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

**Cursor, Codex, GitHub Copilot CLI, VS Code and Kiro:** these clients read the root Agent Plugins `plugin.json` and `mcp.json` (Cursor also reads `.cursor-plugin/plugin.json`). Add the plugin from the client's plugin settings with the repository URL `https://github.com/varity-labs/varity-plugin`. In Kiro, open the Powers panel, choose **Add Custom Power**, then **Import power from GitHub**.

**Qwen Code, Junie and Factory Droid:** install from the same repository through their Claude Code plugin marketplace support.

**Skill only:** add the `deploy-with-varity` skill to any agent that reads Agent Skills.

```bash
npx skills add varity-labs/varity-plugin --skill deploy-with-varity
```

The skill needs the Varity MCP server: install the plugin, or add the server to your MCP config as shown below, and set `VARITY_DEPLOY_KEY`.

**Any MCP client:** add the server directly.

```json
{
  "mcpServers": {
    "varity": {
      "command": "npx",
      "args": ["-y", "@varity-labs/mcp@2.3.27"],
      "env": { "VARITY_DEPLOY_KEY": "<your deploy key>" }
    }
  }
}
```

## Requirements

- Node.js 22.11 or later
- A Varity account and a deploy key from the [developer portal](https://developer.store.varity.so). Set it as `VARITY_DEPLOY_KEY` in the MCP config (`env`) or in the shell that launches your editor or agent, then restart the editor or agent; or sign in with the Varity CLI. When more than one is set, the server uses `VARITY_DEPLOY_KEY` first, then the CLI sign-in, then the legacy `VARITY_API_KEY`. Never paste the key into the chat.
- The Varity CLI (`pipx install varitykit`) only for `varity_migrate`

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
