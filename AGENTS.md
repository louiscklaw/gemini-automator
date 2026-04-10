# AGENTS

## Project Purpose
Automates Google Gemini interactions via Playwright running inside a Docker container. The server receives questions via HTTP and uses a headless Chrome to query `gemini.google.com`.

## Architecture
```
source/server/                           # Express.js server
  server.js                              # Main entry point (port 3000)
  lib/ask_gemini.js                      # Core Gemini interaction logic
  lib/THINKING_MODES.js                  # Thinking mode constants
  _common/utils/initBrowser.js            # Browser initialization with anti-detection
  _common/utils/reportHealthy.js          # Health reporting utilities
  _common/HEALTHCHECK_CAROUSELL_USER.js   # Healthcheck logic
  profile_setup.js                        # Chrome profile configuration
  _POC/                                   # Proof-of-concept experiments
source/stub/                              # Test clients (run from host, target 192.168.11.41:23000)
docker/                                   # Docker Compose config (_main.yml + gemini_agent_1.yml)
docker/images/jenkins_docker_chromium/    # Docker image (base: LinuxServer kasmvnc Ubuntu + Chrome + Node.js 20)
prompts/                                  # Prompt definitions
_doc/                                     # Documentation and result prompts
```

## Developer Commands
- Start container: `cd docker && docker compose -f _main.yml up -d gemini_agent_1`
- View logs: `cd docker && docker compose -f _main.yml logs -f`
- Run server inside container: `cd /app && npm run start` (port 23000)
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
- Container internal ports: HTTP 23000, HTTPS 23001

## Docker Compose Env Vars (set in `gemini_agent_1.yml`)
- `CHROME_CLI` — URL to open on start
- `CUSTOM_PORT` — internal HTTP port (default 3000, but container uses 23000)
- `CUSTOM_HTTPS_PORT` — internal HTTPS port (default 3001, but container uses 23001)
- `BROWSER_HEADED_MODE` — 1=headed, 0=headless
- `JENKINS_SECRET` / `AGENT_NAME` — Jenkins agent config
- `FM_HOME=/home/logic/app` — expected working directory inside container
- `INSTALL_PACKAGES=fonts-noto-cjk` — CJK font support
