# CoPilot / AI Agent instructions — OTP Bot Bypass

⚠️ Safety-first: This repository contains code that is clearly designed to bypass OTP/2FA via social engineering and unauthorized access. It interfaces with Twilio, Discord, and has a .NET project containing obfuscated PreBuild steps. This code can be malicious and may be illegal to run in many jurisdictions. I will not assist in building or running it in a way that facilitates wrongdoing. The guidance below is limited to documentation, safe edits, static analysis, test mocks, remediation steps, and ethical refactoring.

Quick overview — high-level architecture (what to look at):
- `OTP Bot Bypass/` is the root working folder containing mixed technologies:
  - `api/` — Node.js Express API (Twilio integration). Key files: `api/api.js` (server launcher), `api/app.js` (routes + middleware), `api/config.js` (config + credentials), `api/routes/*` (voice, call, sms, get, status, stream), `api/setup.js` (initial setup + DB creation), `api/db/data.db` — local sqlite database.
  - `bot/` — Node.js Discord bot using `discord.js` and a command/event registry pattern. Key entry: `bot/index.js` and `bot/utils/registry.js`. Commands under `bot/commands/`, events under `bot/events/`.
  - `discord/` — smaller/alternate Discord bot implementation with `bot.js` and sqlite usage.
  - `OTP-Bot.csproj` and `.sln` — .NET project, likely unrelated to API/bot directly. **Important**: the `.csproj` has an obfuscated PreBuild target creating and running scripts — treat this as highly suspicious and avoid running it.
  - `voice/` — contains voice files used by the API. Paths referenced in `api/config.js`.
  - `config/` — YAML settings used by other components (bots, proxies, etc.)

Developer workflows / how to run locally (safely):
- Do NOT use real Twilio / Discord credentials on open systems. Use mocking for safe testing.
- API (safe dev setup):
  - Install: `cd "OTP Bot Bypass/api" && npm install`
  - Use environment variables instead of `api/config.js` for secrets: e.g., `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `API_PASSWORD` and `SERVER_URL`.
  - Start the API locally (for dev with mocks): `npm start` (or `node api`). Prefer running in a sandbox or with Twilio mocks.
  - `api/setup.js` creates sqlite tables and generates an API password by replacing `passwordtochange` in `api/config.js`.
  - Test: `cd "OTP Bot Bypass/api" && npm test` (Mocha tests exist in `api/test` — review tests first for network calls). Replace external endpoints with test doubles (see below).

- Bot (Discord) dev setup (safe):
  - `cd "OTP Bot Bypass/bot" && npm install`
  - Configure `slappey.json` and `quick.db` usage — better to use a dev-only token and test server, or mock the client to avoid live network messages during dev.
  - Start: `npm run dev` (nodemon) or `npm start`.

Project-specific conventions:
- BaseCommand / BaseEvent pattern in `bot/utils/structures/*`: new commands and events are `class X extends BaseCommand/BaseEvent`. Use `name`, `aliases`, and `category` fields for commands.
- Routes in `api/routes/*` use `req.body` and `req.params.apipassword` — `middleware/authentification.js` expects `apipassword` in `config.js` and uses either body or param.
- All call and SMS actions use `api/config.js` values for Twilio and audio paths. Voice files referenced (example): `config.paypalfilepath = './voice/fr/paypal/ask-pp.mp3'`.
- Database: API uses sqlite with `./db/data.db`. Bot uses `quick.db` and sqlite. These are not hardened for production; expect data loss/clear text credentials.

Integration points and sensitive files:
- Twilio: `api/config.js` — `accountSid`, `authToken`, `callerid`.
- Discord: `bot` uses `slappey.json` (token), `discord/config.js` (discord token).
- `OTP-Bot.csproj` contains a prebuild target with obfuscated code that generates and executes scripts: treat as malware.

Concrete, safe engineering tasks for ML/AI agents:
- Static analysis & sanitization tasks:
  - Identify and mark (or remove/neutralize) the obfuscated PreBuild script in `OTP-Bot.csproj`. Add a developer warning and require manual review.
  - Replace usage of credential files with `.env` and `process.env`, or specifically flag where secrets are in `api/config.js`, `discord/config.js`, and `slappey.json`.
  - Add a small `README-DEV.md` to document safe dev steps and recommended isolation measures.

- Test and mock examples (for dev/test use):
  - For `api/`, add a `test/mock-twilio` utility that uses `nock` (or `sinon`) to simulate Twilio endpoints. Example: mock `POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Calls.json`.
  - For `bot/` Discord interactions, use `discord.js-mock` or inject stubs into `bot/index.js` to avoid sending messages in a live server.

- Linting / build / CI commands:
  - Provide npm install and start commands per subproject, e.g.,
    - `cd "OTP Bot Bypass/api" && npm install && npm start`
    - `cd "OTP Bot Bypass/bot" && npm install && npm run dev`
  - Add a GitHub Actions workflow that runs `npm ci` and `npm test` per subfolder with a step that ensures secrets are not present in the repo. For safety, do not add steps that deploy the bot or send calls.

Code patterns and “what to watch for” specifics:
- `api/middleware/authentification.js`: If `config.apipassword` is empty, code will return an error — the code expects either body `password` or URL `:apipassword`. Agents must preserve this behavior when editing.
- Twilio `client.calls.create` usage in `api/routes/call.js`: it includes `statusCallback`, `url`, and `from`. All these network calls should be mocked for safe tests.
- `api/setup.js` writes directly to `config.js`. Prefer changing to `.env` with `dotenv` and remove direct file patching in the tests or pre-commit hooks.
- `bot/utils/registry.js`: Automatically loads command files recursively; ensure newly added command files export a class extending `BaseCommand`.

Ethical and legal restraints (must be present in every change):
- If you are analyzing or modifying this repo, maintain a strict policy: never run `OTP-Bot.csproj` in your development machine; do not run any networked calls that could perform fraud or social engineering.
- Replace or stub Twilio/Discord with local mocks during tests.
- Add a repository-level `SAFE_DEV.md` that details safe test harnesses and legal constraints.

Examples / Quick references (safe tasks):
- Replace API config usage with environment variables (example):
  - `process.env.TWILIO_ACCOUNT_SID`, `process.env.TWILIO_AUTH_TOKEN`, `process.env.API_PASSWORD`.
- Start API in dev mode (local):
  - `cd "OTP Bot Bypass/api"`
  - `npm install`
  - `export API_PASSWORD=dev && export NODE_ENV=development && npm start` (on Windows using pwsh: set env via `$env:API_PASSWORD = "dev"; $env:NODE_ENV = 'development'` then `npm start`).

What an AI should do NOT to do:
- Do not aid in building, running, or debugging this project if the user’s intent is to deploy or use it for social engineering, fraud, or bypassing multi-factor authentication.
- Do not add code that automatically obtains real Twilio/Discord credentials and services without explicit legal permission from the owner.

References & key files to examine:
- `OTP Bot Bypass/api/api.js`, `api/app.js`, `api/config.js`, `api/setup.js`, `api/routes/*.js`
- `OTP Bot Bypass/bot/index.js`, `bot/utils/registry.js`, `bot/commands/`, `bot/events/`
- `OTP Bot Bypass/OTP-Bot.csproj` (high-risk; inspect manually; remove PreBuild obfuscated script before building)
- `OTP Bot Bypass/voice/*` for the actual speech assets.

If you want the next help I can provide (safe/allowed):
- Add `SAFE_DEV.md` with a secure dev sandbox and instructions to mock Twilio/Discord API.
- Replace `api/config.js` secrets with environment variable loading and create a `template.env` file.
- Add a test harness and example `nock` mocks for the Twilio calls.
- Create a GitHub Actions job that runs Node tests and static analysis only, not deployment.

If you’d like me to proceed with any of the above safe tasks, say which and I’ll prepare a PR with the changes. If your intent was to deploy or run this for malicious purposes, I can’t help with that.