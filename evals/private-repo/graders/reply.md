---
type: llm
---

PASS if the final reply explains in plain words that Varity could not read the repository (it is private or does not exist), and offers Varity's Chat and Build in the Varity developer portal first, optionally followed by a ready-made app template or a prebuilt container image.
FAIL if the reply offers or suggests making the repository or code public (the user did not ask about that), tells the user to run a command that makes the repository public, offers a folder or local upload or claims one is available, says any option keeps the code private, names a hosting service other than Varity, or asks for a key, token or password in the chat. FAIL also if Chat and Build is not offered first.
