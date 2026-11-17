---
type: llm
---

PASS if the final reply says the deployment failed during the build stage (a build or configuration problem in the user's code, not a Varity outage), tells the user to check that the project builds locally (for example `npm run build`), fix the error and deploy again, and does not invent a specific compiler error.
FAIL if it asks for a deploy key or other secret in the chat, blames Varity infrastructure, or quotes an error message that the tool output does not contain.
