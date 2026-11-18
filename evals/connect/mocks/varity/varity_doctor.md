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
    "next_steps": [
      "Call varity_login to connect. If browser sign-in is switched on, it opens a browser tab and the user confirms there. If it answers SIGN_IN_UNAVAILABLE, tell the user: \"Browser sign-in isn't available right now. You can connect with a deploy key instead: create one at https://developer.store.varity.so/dashboard/settings?tab=api-keys and add it as VARITY_DEPLOY_KEY in your editor's MCP settings, then restart your editor or AI assistant. Keep the key out of the chat. If the Portal asks for a payment method before it creates the key, you can still put a site online today without a card using Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build\""
    ]
  },
  "message": "Local development and deployment are not ready. Development: . Deployment: Call varity_login to connect. If browser sign-in is switched on, it opens a browser tab and the user confirms there. If it answers SIGN_IN_UNAVAILABLE, tell the user: \"Browser sign-in isn't available right now. You can connect with a deploy key instead: create one at https://developer.store.varity.so/dashboard/settings?tab=api-keys and add it as VARITY_DEPLOY_KEY in your editor's MCP settings, then restart your editor or AI assistant. Keep the key out of the chat. If the Portal asks for a payment method before it creates the key, you can still put a site online today without a card using Chat and Build: https://developer.store.varity.so/dashboard/ai-gateway?tab=chat&mode=build\"."
}
