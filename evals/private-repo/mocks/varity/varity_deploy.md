{
  "success": false,
  "error": {
    "code": "source_repository_unreadable",
    "message": "Varity could not read this repository: it is private or unreachable. Varity cannot read private repositories from the MCP yet. No deployment or charge was created.",
    "suggestion": "Make the repository public (gh repo edit acme/private-crm --visibility public --accept-visibility-change-consequences) and call varity_deploy again, or deploy a prebuilt container image with the image argument."
  }
}
