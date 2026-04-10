# Gemini Automator

The missing Gemini API interface.

Automates Google Gemini interactions via Playwright running inside a Docker container.
The server receives questions via HTTP and uses a headless Chrome to query `gemini.google.com`.

## Architecture

```
source/server/                           # Express.js server (endpoints: /ask_gemini, /thinking_mode)
source/stub/                             # Test clients (run from host machine)
docker/                                  # Docker Compose config
docker/images/jenkins_docker_chromium/   # Docker image (Ubuntu + Chrome + Node.js 20)
prompts/                                 # Prompt definitions
_doc/                                    # Documentation and results
```

## Prerequisites

- Docker with external networks `common_network` and `commont_network1`
- Container IP: `192.168.11.41`
- Internal HTTP port: `23000`, HTTPS: `23001`

## Quick Start

### 1. Start the container

```bash
cd docker
docker compose -f _main.yml up -d gemini_agent_1
docker compose -f _main.yml logs -f
```

### 2. Run the server (inside container)

```bash
docker exec -it gemini_agent_1 bash
cd /app
npm run start
```

Or with auto-reload (on host, after mounting source):

```bash
cd source/server
npx nodemon --exec "node ./server.js"
```

### 3. Send a request (from host)

```bash
node source/stub/009_test_thinking_mode.js
```

## API Endpoints

### GET /thinking_mode

Returns available thinking modes.

```bash
curl http://192.168.11.41:23000/thinking_mode
# Response: ["Fast", "Thinking"]
```

### POST /ask_gemini

Ask a question to Gemini.

```bash
curl -X POST http://192.168.11.41:23000/ask_gemini \
  -H "Content-Type: application/json" \
  -d '{"thinking_mode": "Fast", "question": "Hi, how are you?"}'
```

## Configuration

Key environment variables (set in `docker/gemini_agent_1.yml`):

| Variable               | Default         | Description                |
| ---------------------- | --------------- | -------------------------- |
| `BROWSER_HEADED_MODE`  | 1               | 1=headed, 0=headless       |
| `CUSTOM_PORT`          | 23000           | Internal HTTP port         |
| `CUSTOM_HTTPS_PORT`    | 23001           | Internal HTTPS port        |
| `CHROME_CLI`           | gmail.com       | URL to open on start       |
| `INSTALL_PACKAGES`     | fonts-noto-cjk  | CJK font support           |

Browser and profile settings are in `source/server/profile_setup.js`.

## Development

Test stubs are in `source/stub/` and call the server at `http://192.168.11.41:23000`.

## Image Build (if needed)

```bash
cd docker/images/jenkins_docker_chromium
docker build -t jenkins_docker_chromium .
```
