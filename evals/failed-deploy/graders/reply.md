---
type: llm
---

PASS if the final reply says the deployment failed while building, explains in plain words the build error from the tool output (src/server.ts line 14: a text value is assigned where a number is expected, error TS2322), and says to fix it in the code and deploy again. A clearly marked example of a possible fix is fine.
FAIL if it tells the user to build the project locally to find the error instead of using the error lines, asks for a deploy key or other secret in the chat, blames Varity infrastructure, or states that the build failed with an error other than the one in the tool output.
