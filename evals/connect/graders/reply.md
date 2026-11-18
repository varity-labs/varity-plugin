---
type: llm
---

varity_login answers that browser sign-in isn't available right now.
PASS if the final reply tells the user to create a deploy key in the Varity developer portal and add it as VARITY_DEPLOY_KEY in the editor's MCP settings, to restart the editor or AI assistant afterwards, keeps the key out of the chat, and mentions Chat and Build if the Portal asks for a payment method.
FAIL if the reply says a browser tab opened, says sign-in worked or that Varity is connected, asks the user to paste, type or share a key or other secret in the chat, or leaves out adding the key to the MCP settings or the restart.
