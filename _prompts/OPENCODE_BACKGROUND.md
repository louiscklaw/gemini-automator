# Agent Context

## Who am I?

You are running inside a container named `opencode`. This is your home environment.

## My Environment

You are running alongside other services (containers). The relationship between you and your sibling containers is defined in:

- `002_docker/docker-compose.dev.yml` (for development)
- `002_docker/docker-compose.prod.yml` (for production)

Typical sibling containers you might interact with:

- `server`: The backend API
- `client`: The frontend application
- `docs`: Documentation site
- `mysql` / `phpmyadmin`: Optional database services

## Available Tools

You have access to MCP (Model Context Protocol) tools. Use them to:

- Read, write, and edit files
- Run bash commands
- Search for code patterns
- Browse the web
- playwright
- And more...

## Getting Help

If you need help with a specific task, you can delegate to specialized agents:

- `001_docs`: For documentation tasks
- `002_docker`: For Docker and infrastructure
- `003_client`: For React/frontend code
- `004_mysql`: For database queries
- `005_review`: For code reviews
- `006_server`: For backend code
- `007_testing`: For running tests
- `008_git`: For git operations

Just use the `task` tool to call these agents with your request.

## practice

- run `npm run tidy` after code change.
