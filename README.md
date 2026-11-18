# Varity plugin

Deploy apps and AI agents to production from your AI editor, with the cost shown before you deploy.

[Varity](https://varity.so) is the Orchestration Cloud: one place to run applications, AI agents, and virtual machines. Traffic alone does not change an app's monthly price. This plugin connects your AI coding agent to Varity through the [Varity MCP server](https://github.com/varity-labs/varity-mcp) and adds a `deploy-with-varity` skill that walks the agent through checking the setup, showing the cost, deploying, and sharing the live URL.

## What's included

| Part | What it does |
|---|---|
| `mcp.json`, `.mcp.json`, `gemini-extension.json` | Start the Varity MCP server (`npx -y @varity-labs/mcp@2.3.29`) with 30 tools: browser sign-in, deploys, status with build errors, logs, app settings from a `.env` file, custom domains, open-source app and AI agent templates, CPU virtual machines, and cost estimates |
| `skills/deploy-with-varity` | Tells the agent when and how to deploy with Varity |
| `skills/deploy`, `skills/status`, `skills/env`, `skills/logs` | Commands you run yourself in Claude Code: `/varity:deploy`, `/varity:status`, `/varity:env <project folder> <SETTING_NAME ...>` (names only; values stay in `.env`), `/varity:logs <app>` |
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

**Cursor, Codex, GitHub Copilot CLI, VS Code and Kiro:** these clients load Agent Plugins, which use the root `plugin.json` and `mcp.json`; Cursor also has its own manifest in `.cursor-plugin/plugin.json`. Add the plugin from the client's plugin settings with the repository URL `https://github.com/varity-labs/varity-plugin`. In Kiro, open the Powers panel, choose **Add Custom Power**, then **Import power from GitHub**.

**Skill only:** add the `deploy-with-varity` skill to any agent that reads Agent Skills.

```bash
npx skills add varity-labs/varity-plugin --skill deploy-with-varity
```

The skill needs the Varity MCP server: install the plugin, or add the server to your MCP config as shown below.

**Any MCP client:** add the server directly.

```json
{
  "mcpServers": {
    "varity": {
      "command": "npx",
      "args": ["-y", "@varity-labs/mcp@2.3.29"]
    }
  }
}
```

## Requirements

- Node.js 22.11 or later
- A Varity account. Ask your agent to connect Varity. Where browser sign-in is available, it opens a browser tab where you confirm, and the sign-in is saved on your computer in `~/.varitykit/config.json` (`varity_logout` revokes it on Varity and removes it). Where it is not available yet, and for CI or scripts, set a deploy key from the [developer portal](https://developer.store.varity.so/dashboard/settings?tab=api-keys) as `VARITY_DEPLOY_KEY` in the MCP config (`env`) or the shell that launches your editor or agent. When more than one is set, the server uses `VARITY_DEPLOY_KEY` first, then the saved sign-in, then the legacy `VARITY_API_KEY`. Never paste a key into the chat.
- The Varity CLI (`pipx install varitykit`) only for `varity_migrate`, and optionally to sign in

## Data handling

- **Personal data:** the plugin stores no personal data. The MCP server reads your Varity key from `VARITY_DEPLOY_KEY` (or `VARITY_API_KEY`) or the sign-in file `~/.varitykit/config.json` and sends it only to the Varity API.
- **What is sent where:**
  - The Varity API at https://varity.app receives deploy, status, logs, pricing and balance requests.
  - `varity_set_env` reads only the setting names you list from the project's `.env` file and sends their values only to the Varity API; values never appear in the chat or in the tool's output.
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
