{
  "success": true,
  "data": {
    "ready": true,
    "connected": false,
    "cli_deploy_ready": false,
    "deploy_key_source": null,
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
        "status": "fail",
        "message": "Not signed in to Varity yet (no deploy key found in VARITY_DEPLOY_KEY, the sign-in file ~/.varitykit/config.json or VARITY_API_KEY)",
        "fix": "Call varity_login to connect. If browser sign-in is switched on, it opens a browser tab and the user confirms there. If it answers SIGN_IN_UNAVAILABLE, tell the user: \"Browser sign-in isn't available right now. You can connect with a deploy key instead: create one at https://developer.store.varity.so/dashboard/settings?tab=api-keys and add it as VARITY_DEPLOY_KEY in your editor's MCP settings, then restart your editor or AI assistant. Keep the key out of the chat. If the Portal asks for a payment method before it creates the key, you can still put a site online today without a card using Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build\""
      },
      {
        "name": "GitHub Token",
        "status": "warn",
        "message": "No GitHub authentication found; varity_create_repo requires a GitHub CLI session or GITHUB_TOKEN/GH_TOKEN environment variable.",
        "fix": "Run `gh auth login`, or set GITHUB_TOKEN/GH_TOKEN in the MCP process environment. Do not pass a token in chat."
      }
    ],
    "note": "Development tools (varity_build, varity_dev_server) are ready. Fix the following 1 issue before deploying:",
    "cli_issues": [
      "Call varity_login to connect. If browser sign-in is switched on, it opens a browser tab and the user confirms there. If it answers SIGN_IN_UNAVAILABLE, tell the user: \"Browser sign-in isn't available right now. You can connect with a deploy key instead: create one at https://developer.store.varity.so/dashboard/settings?tab=api-keys and add it as VARITY_DEPLOY_KEY in your editor's MCP settings, then restart your editor or AI assistant. Keep the key out of the chat. If the Portal asks for a payment method before it creates the key, you can still put a site online today without a card using Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build\""
    ]
  },
  "message": "Not connected yet: call varity_login to connect Varity. Ready for development (init, build, dev server work). Fix 1 issue before deploying: Call varity_login to connect. If browser sign-in is switched on, it opens a browser tab and the user confirms there. If it answers SIGN_IN_UNAVAILABLE, tell the user: \"Browser sign-in isn't available right now. You can connect with a deploy key instead: create one at https://developer.store.varity.so/dashboard/settings?tab=api-keys and add it as VARITY_DEPLOY_KEY in your editor's MCP settings, then restart your editor or AI assistant. Keep the key out of the chat. If the Portal asks for a payment method before it creates the key, you can still put a site online today without a card using Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build\""
}
