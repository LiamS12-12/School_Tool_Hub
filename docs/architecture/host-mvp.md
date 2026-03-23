# Host MVP Architecture

## Current Direction

The repo now has two tracks:

- `class_bank/`: the existing module prototype
- `host_app/`: the new shared host shell

## MVP Host Responsibilities

- shared app shell
- shared module navigation
- shared school context
- teacher-scoped defaults
- place for shared design system and shared data models

## Shared Host Data

The host now has an initial shared data backbone with:

- school
- school settings
- users
- classrooms
- students

The host also computes:

- `visibleClassrooms`
- `visibleStudents`

These are teacher-scoped by default and are derived through simple permission helpers.

## Permissions

The first permission model is intentionally small:

- admins can view all classrooms and students
- teachers can view only classrooms they own
- teachers can view only students in classrooms they own
- host settings should eventually be admin-only

## MVP Module Pattern

Each module should eventually plug into the host through:

- `id`
- `name`
- `description`
- `screen`

That is intentionally simple for now. We can expand it later with permissions, routes, and settings pages.

## Next Implementation Step

The next good step is to move shared school entities into a clearer host data model and then begin adapting `class_bank` into a true host module.
