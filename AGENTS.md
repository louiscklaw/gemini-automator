# AGENTS

## Project Purpose
Automates Google Gemini interactions via Playwright running inside a Docker container. The server receives questions via HTTP and uses a headless Chrome to query `gemini.google.com`.

## Architecture
- `source/server/` — Express.js server (`server.js`) exposing `/ask_gemini` and `/thinking_mode` endpoints
- `source/stub/` — Test clients that call the server (run from host, target container IP `192.168.11.41:3000`)
- `docker/` — Docker Compose config (`_main.yml` + `gemini_agent_1.yml`)
- `docker/images/jenkins_docker_chromium/` — Docker image (base: LinuxServer kasmvnc Ubuntu + Chrome + Node.js 20 + Miniconda)

## Developer Commands
- Start container: `cd docker && docker compose -f _main.yml up -d gemini_agent_1`
- View logs: `cd docker && docker compose -f _main.yml logs -f`
- Run server inside container: `npm run start` (inside `/app`, port 3000)
- Start server with auto-reload: `npx nodemon --exec "node ./server.js"` (in `source/server/`)
- Run test stub from host: `node source/stub/009_test_thinking_mode.js`

## Key Quirks
- Requests are serialized via a promise queue (`queue = queue.then(...)`) in `server.js:9`
- Playwright uses `chromium.launchPersistentContext` with a Chrome profile at `/browser_data_dir`
- Browser anti-detection flags are extensive in `_common/utils/initBrowser.js` — do not simplify
- Healthcheck probes port `6901` (VNC), not the app port
- Container requires external Docker networks `common_network` and `commont_network1`
- Resource limits: 1 CPU, 2GB RAM, 4GB `/dev/shm`
- `BROWSER_HEADED_MODE=1` env var controls headed vs headless (set in compose file)
- Profile config (`profile_setup.js`) contains hardcoded proxy, healthcheck URLs, and chrome data dir

## Docker Compose Env Vars (set in `gemini_agent_1.yml`)
- `CHROME_CLI` — URL to open on start
- `CUSTOM_PORT` — internal HTTP port (default 3000)
- `BROWSER_HEADED_MODE` — 1=headed, 0=headless
- `JENKINS_SECRET` / `AGENT_NAME` — Jenkins agent config
- `FM_HOME=/home/logic/app` — expected working directory inside container
