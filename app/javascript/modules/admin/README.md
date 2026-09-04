# Admin module

This module contains the React pages and shared UI used by the administration
routes. Use this map to find code before adding or moving a file.

## Directory layout

```text
admin/
├── index.js                 # Public exports for the admin module
├── components/              # Reusable admin UI and record views
├── hooks/                   # Reusable React hooks for admin state and data
├── pages/                   # Route-level pages, grouped by domain
│   ├── collections/
│   ├── instance-settings/
│   ├── interviews/
│   ├── languages/
│   ├── metadata/
│   ├── permissions/
│   ├── projects/
│   ├── registry/
│   ├── roles/
│   ├── task-types/
│   ├── translations/
│   └── uploads/
└── utils/                   # Shared data, form, query, and sorting helpers
```

## Where code belongs

- Put route-level screens in `pages/`. Group a screen and its forms or search
  components under the relevant domain directory.
- Put reusable presentation or form-building pieces in `components/`.
- Put reusable stateful logic in `hooks/`. Keep Redux dispatch and selector
  details in hooks when a page needs them.
- Put side-effect-free transformations and helpers in `utils/`.
- Add exports to the nearest barrel file (`index.js`) when other modules need
  the item. Keep page-internal helpers local unless they have a second use.

React components use `.jsx`; hooks, utilities, and tests use `.js` unless they
contain JSX.
