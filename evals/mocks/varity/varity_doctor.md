{
  "success": true,
  "data": {
    "ready": true,
    "connected": true,
    "cli_deploy_ready": true,
    "deploy_key_source": "env:VARITY_DEPLOY_KEY",
    "checks": [
      {
        "name": "Node.js",
        "status": "pass",
        "version": "v22.22.3",
        "message": "Node.js v22.22.3 detected"
      },
      {
        "name": "npm",
        "status": "pass",
        "version": "10.9.8",
        "message": "npm 10.9.8 detected"
      },
      {
        "name": "varitykit CLI",
        "status": "warn",
        "message": "varitykit CLI is not installed; only varity_migrate needs it.",
        "fix": "pipx install varitykit"
      },
      {
        "name": "Authentication",
        "status": "pass",
        "message": "Authentication verified by the Varity public interface"
      },
      {
        "name": "GitHub Token",
        "status": "warn",
        "message": "No GitHub authentication found; varity_create_repo requires a GitHub CLI session or GITHUB_TOKEN/GH_TOKEN environment variable.",
        "fix": "Run `gh auth login`, or set GITHUB_TOKEN/GH_TOKEN in the MCP process environment. Do not pass a token in chat."
      }
    ]
  },
  "message": "Environment is ready! All prerequisites are met, you can build, develop, and deploy apps with Varity."
}
