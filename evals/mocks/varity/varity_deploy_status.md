{
  "success": true,
  "data": {
    "deployment": {
      "id": "dep_eval_001",
      "name": "todo-api",
      "appName": "todo-api",
      "runtime": "dynamic",
      "status": "failed",
      "timestamp": "2026-11-17T01:40:00Z",
      "billing": {
        "state": null,
        "currency": "USD",
        "accrued_this_month_usd": "unavailable",
        "billing_basis": "unavailable",
        "active_seconds_this_month": null
      },
      "run_id": "run_eval_001",
      "outcome": {
        "classification": "expected_rejection",
        "stage": "build",
        "code": "configuration_rejected",
        "action_code": "check_configuration",
        "diagnostic_code": null,
        "terminal_at": "2026-11-17T01:42:10Z"
      },
      "run_status": "failed",
      "http_probe": {
        "outcome": "not_applicable"
      }
    },
    "source": "varity_public_api:/api/deployments",
    "build_error": {
      "stage": "build",
      "lines": [
        "> todo-api@1.0.0 build",
        "> tsc -p tsconfig.json",
        "src/server.ts(14,7): error TS2322: Type 'string' is not assignable to type 'number'.",
        "Build failed with exit code 2"
      ],
      "complete": true
    },
    "run_stage": "build"
  },
  "message": "Deployment dep_eval_001: latest run failed (expected_rejection, configuration_rejected; action check_configuration). Deployment status: failed (URL not assigned yet). Any amount set aside for this attempt is released automatically. The build stopped with an error; its last 4 line(s) are in build_error.lines. Fix that in the app's code, then deploy again with varity_deploy."
}
