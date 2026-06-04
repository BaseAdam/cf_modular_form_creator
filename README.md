# Modular Form Creator — Frontend

A React frontend for a Resources management workflow. Resources are created as
**drafts**, filled in through two independent modules (**Basic Info** and
**Project Details**), and moved to **completed** via a provisioning action once
the business rules are satisfied. Built against a fixed Express/Mongo backend —
the backend contract and the design system are treated as read-only.

## Quick start

### Option A — full stack with Docker

Brings up frontend + backend + MongoDB with a single command:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5001

### Option B — local dev (Vite dev server)

Requires the backend running and reachable (e.g. `docker compose up backend mongo`,
or a backend on `localhost:5001`).

```bash
npm install
cp .env.example .env   # defaults to http://localhost:5001
npm run dev            # http://localhost:5173
```

### Business rules → code

| Rule (from the spec)                                              | Where                                |
| ---------------------------------------------------------------- | ------------------------------------ |
| Name is set on creation and cannot change                        | create flow (`resourcesApi.create`)  |
| Project Details unlocked only after Basic Info is complete       | `rules.canEditProjectDetails`        |
| Provisioning requires a draft with both modules complete         | `rules.canProvision`                 |
| A completed resource cannot be provisioned again                 | `rules.canProvision` (draft guard)   |
| Completed-resource edits buffer locally, persist on submit (PUT) | `hooks/useModuleEditor`              |

## Testing

```bash
npm test
```