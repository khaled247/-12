Admin Dashboard Cleanup — Checklist
=================================

This document lists the tasks to finish polishing the admin dashboard and how to use the new shared components added to the project.

Completed developer deliverables:
- Reusable table component: `src/components/Table.jsx` (client-side sort + pagination)
- Standard form controls: `src/components/FormControls.jsx` (`Input`, `Select`, `TimeInput`)
- Dashboard KPI widget: `src/components/DashboardKPI.jsx`

How to use the Table component
- Import: `import Table from 'src/components/Table.jsx'`
- Props: `columns` (array of { key, label, sortable, align, render }), `data` (array), `pageSize` (number)

How to use form controls
- Import: `import { Input, Select, TimeInput } from 'src/components/FormControls.jsx'`
- They render accessible labels and use `.input-field` styles from `src/index.css`.

Next recommended steps (manual work / QA):
1. Replace ad-hoc tables in `Appointments`, `Customers`, and `Products` with `Table`.
2. Migrate forms to use `Input` / `Select` / `TimeInput` to unify spacing and validation hooks.
3. Add unit/integration tests around critical flows (booking creation/editing, receipts persistence).
4. Run accessibility audit (axe / Lighthouse) and address issues related to focus order and contrast.
5. Add E2E tests for booking → receipts → edit flows.

Deployment checklist
- Ensure environment variables for Firebase are set.
- Run build locally and smoke test: `npm run build && npm run preview`.
- Verify localStorage migrations if changing `royalcuts_receipts` schema.
