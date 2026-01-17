# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A learning project demonstrating Node.js HTTP server fundamentals using only built-in modules (no external dependencies).

## Commands

- **Run the server**: `node app.js`
- **Access**: http://localhost:3000

No build, test, or lint commands - this is a minimal educational project with no package.json.

## Architecture

Single-file architecture in `app.js`:
- Uses Node.js built-in `http` module
- Simple if-else routing pattern for URL matching
- Hardcoded port 3000

## Endpoints

| Endpoint | Response Type | Description |
|----------|---------------|-------------|
| `/` | text/plain | Hello World |
| `/time` | text/plain | Current time |
| `/random` | text/plain | Random number 0-99 |
| `/greet?name=<name>` | text/plain | Personalized greeting |
| `/html` | text/html | Styled HTML page |
| `/json` | application/json | JSON with message, timestamp, random |
| `/headers` | application/json | Echo request headers |

## Patterns

- Query parameters parsed using `URL` API with `searchParams`
- Proper `Content-Type` headers set for each response type
- No error handling - uses sensible defaults (e.g., "Guest" for missing name)
