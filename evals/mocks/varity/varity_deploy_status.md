{
  "success": true,
  "data": {
    "deployment": {
      "id": "dep_eval_001",
      "name": "todo-api",
      "appName": "todo-api",
      "url": "https://varity.app/todo-api/",
      "status": "failed",
      "timestamp": "2026-11-17T01:40:00Z",
      "billing": null,
      "run_id": "run_eval_001",
      "outcome": {
        "code": "build_failed",
        "message": "npm run build exited with code 1. src/server.ts(12,7): error TS2322: Type 'string' is not assignable to type 'number'."
      },
      "run_status": "failed",
      "http_probe": {
        "outcome": "http_error",
        "http_status": 404,
        "latency_ms": 120
      }
    },
    "source": "varity_public_api:/api/deployments"
  },
  "message": "Deployment dep_eval_001: failed at https://varity.app/todo-api/"
}
