# SAFE_DEV.md — Safe development and testing guidance

⚠️ WARNING: This repository contains code that can be leveraged for social engineering and bypassing 2FA. Do NOT run the code against real systems or accounts. The guidance below is intended to help developers inspect, test, and harden the project safely.

Goals:
- Allow local development while avoiding real network calls to Twilio, Discord, or other services
- Replace hard-coded secrets with environment variables
- Provide safe test harness and mocking examples

Local setup (safe):
1. Create a disposable development environment (VM, container, or isolated machine). Do not use personal or production accounts.
2. Use a test Twilio account or mock Twilio calls via `nock`.
3. Use a test Discord server and a bot token for development (preferably a token that can be revoked).

API (`OTP Bot Bypass/api`):
- Use `.env` file for secrets; don't store real credentials in the repository or `config.js`.
- Load environment variables using `dotenv` in development 
  - `npm install dotenv` (locally) and then use `$env:TWILIO_ACCOUNT_SID = 'xxx'; $env:TWILIO_AUTH_TOKEN = 'yyy';` in PowerShell or the `.env` file.
- Start the API locally:
  - cd "OTP Bot Bypass/api"
  - npm install
  - $env:API_PASSWORD = 'devpass'; $env:NODE_ENV = 'development'; npm start

Testing and mocking:
- Use `nock` to mock Twilio endpoints in `api/test` before running `npm test`.
- For Discord bot testing, use `discord.js-mock`, stub the client, or run the bot in a private testing server with mock data.

Database:
- `api/` uses sqlite database `./db/data.db`. Back up the file before editing data.
- `bot/` uses `quick.db` and `discord/db/data.db` — these are for demo/test use only.

Code safety & scanning:
- Manually inspect `OTP-Bot.csproj` (or any other build script) for obfuscated or suspicious commands. Do NOT run them; instead, rewrite or remove the prebuild steps. The `.csproj` here includes such a prebuild target.
- For CI, add a step to run `gitleaks` or `detect-secrets` to validate no credentials are committed.

Disabled/unsafe code:
- Do not run `OTP-Bot.csproj` build on your dev machine until you have sanitized the prebuild target.
- Avoid spinning actual Twilio/Discord calls during automated tests. Replace these calls with mocks or stubs.

If you need help adding unit tests, mocks, or a CI flow that checks for unsafe artifacts, ask and I can add a safe example PR.