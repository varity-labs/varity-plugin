{
  "success": true,
  "data": {
    "ready": true,
    "cli_deploy_ready": false,
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
        "status": "fail",
        "message": "varitykit CLI is not installed",
        "fix": "pip install varitykit"
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
    ],
    "note": "Development tools (varity_build, varity_dev_server) are ready. Important: varity_deploy also requires a working varitykit CLI, fix the following 1 issue before deploying:",
    "cli_issues": [
      "pip install varitykit"
    ]
  },
  "message": "Ready for development (init, build, dev server work). Fix 1 issue before deploying: pip install varitykit"
}
