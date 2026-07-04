# Project Context

This project is a frontend application.

Backend already exists and is deployed separately.

Backend stack:

- Strapi
- Supabase
- Firebase

The frontend consumes the backend API only.

Never implement backend responsibilities.

Never access PostgreSQL directly.

Never create SQL queries.

IMPORTANT:
This repository is developed on Windows.

Never use bash filesystem commands.
Never use PowerShell filesystem commands.

For every filesystem operation, execute Node.js scripts using the fs module.
Assume shell commands are unreliable and should be avoided.