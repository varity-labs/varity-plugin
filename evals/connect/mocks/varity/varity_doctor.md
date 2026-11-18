{
  "success": true,
  "data": {
    "ready": false,
    "cli_deploy_ready": false,
    "deploy_key_source": null,
    "checks": [
      {
        "name": "Node.js",
        "status": "pass",
        "version": "v22.19.0",
        "message": "Node.js v22.19.0 detected"
      },
      {
        "name": "npm",
        "status": "pass",
        "version": "10.9.3",
        "message": "npm 10.9.3 detected"
      },
      {
        "name": "varitykit CLI",
        "status": "warn",
        "message": "varitykit CLI is not installed; only varity_migrate needs it.",
        "fix": "pipx install varitykit"
      },
      {
        "name": "Authentication",
        "status": "fail",
        "message": "Varity is not connected on this computer.",
        "fix": "Call varity_login to connect Varity in the browser."
      },
      {
        "name": "GitHub Token",
        "status": "warn",
        "message": "No GitHub authentication found; varity_create_repo requires a GitHub CLI session or GITHUB_TOKEN/GH_TOKEN environment variable.",
        "fix": "Run `gh auth login`, or set GITHUB_TOKEN/GH_TOKEN in the MCP process environment. Do not pass a token in chat."
      }
    ]
  },
  "message": "Varity is not connected yet. Call varity_login to connect it in the browser."
}
