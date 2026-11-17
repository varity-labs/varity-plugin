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
    "source": "varity_public_api:/api/deployments"
  },
  "message": "Deployment dep_eval_001: failed (URL not assigned yet)"
}
