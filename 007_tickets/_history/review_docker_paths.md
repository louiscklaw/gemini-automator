# Technical Implementation Plan: Docker Path Review & Correction

As the Project Manager and Lead Architect, I have analyzed the ticket `@007_tickets/review_002_docker_folder_path.md`. Following the recent project migration, it is critical to ensure that the container orchestration layer correctly references the new directory structure to avoid deployment failures.

---

## 1. Ticket Analysis & Requirement Gathering

### Core Objective

The goal is to audit all `docker-compose*.yml` files and associated shell scripts within the `002_docker/` directory to identify and fix incorrect file paths, build contexts, and volume mappings caused by the reorganization of the workspace.

### Affected Components

- **Infrastructure (`002_docker`)**: Docker Compose files, shell scripts (`run.sh`, `dc_*.sh`), and volume definitions.
- **Source Integration**: The links between the Docker orchestration layer and the source code now residing in `003_source/client` and `003_source/server`.

### Assumptions & Ambiguities

- **The `run.sh` Script**: The ticket explicitly mentions testing with `002_docker/run.sh`. However, the previous migration created `dc_up.sh` and `dc_dev.sh`. It is unclear if `run.sh` is an existing script that was missed or if it should be created as a wrapper.
- **Network Accessibility**: The verification relies on access to `http://192.168.11.170/`. It is assumed the environment is configured to route this IP to the local Docker containers.

---

## 2. Baseline & Regression Strategy (The "Before" State)

To prevent regressions and quantify the fix, we must first document the current failure state.

### Baseline Verification Steps

1. **Execution Attempt**: Attempt to start the environment using the mentioned script:
   - `bash /workspace/002_docker/run.sh` (or `dc_up.sh` if `run.sh` is missing).
2. **Error Capture**:
   - Run `docker compose ps` to identify containers that are `Exited` or `Restarting`.
   - Run `docker compose logs` to capture specific "No such file or directory" or "build context" errors.
3. **Connectivity Check**: Attempt to curl the endpoint:
   - `curl -I http://192.168.11.170/` and record the response code (e.g., 502 Bad Gateway or 404 Not Found).

---

## 3. Technical Planning & Task Breakdown

The following tasks are sequenced to ensure a systematic correction and verification process:

| Task ID | Task Description                                                                                                                                          | Assigned Agent | Priority |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :------- |
| **T1**  | **Path Audit**: Read all `docker-compose*.yml` and scripts in `002_docker/`. Map every relative path to the current filesystem to identify discrepancies. | `@002_docker`  | High     |
| **T2**  | **Build Context Correction**: Update `build: context` paths in compose files to point correctly to `../003_source/client` and `../003_source/server`.     | `@002_docker`  | High     |
| **T3**  | **Volume Mapping Fix**: Audit and update all volume mounts to ensure they point to `002_docker/volumes` or the correct source assets.                     | `@002_docker`  | High     |
| **T4**  | **Entrypoint Script Alignment**: Verify if `run.sh` exists. If not, create it as a standardized entry point that calls the necessary `dc_*.sh` scripts.   | `@002_docker`  | Medium   |
| **T5**  | **Functional Verification**: Execute the updated startup sequence and verify that all containers are `healthy`.                                           | `@007_testing` | High     |
| **T6**  | **End-to-End Connectivity Test**: Verify the application is fully accessible and functional at `http://192.168.11.170/`.                                  | `@007_testing` | High     |

---

## 4. Estimation & Risk Assessment

### Effort Estimation

- **Audit & Correction (T1-T4)**: Low to Medium Complexity $\rightarrow$ 2-4 hours.
- **Verification & Testing (T5-T6)**: Low Complexity $\rightarrow$ 1-2 hours.

### Risks & Mitigations

- **Risk**: **Incorrect Volume Overwrites**. Incorrectly mapping a host directory to a container could overwrite critical data in `002_docker/volumes`.
  - _Mitigation_: Always use specific subdirectories for volumes and verify paths with `ls` before applying the compose file.
- **Risk**: **Environment Mismatch**. Fixing paths for "Dev" might break "Prod" configurations if they use different relative nesting.
  - _Mitigation_: Audit `docker-compose.dev.yml` and `docker-compose.prod.yml` separately.

---

## 5. Verification Plan (The "After" State)

### Success Criteria

1. **Container Health**: `docker compose ps` shows all services as `Up (healthy)`.
2. **Log Cleanliness**: `docker compose logs` shows no "file not found" errors during the boot sequence.
3. **HTTP Accessibility**: A request to `http://192.168.11.170/` returns a `200 OK` response and renders the application UI.

### Final Tests

- Run `bash /workspace/002_docker/run.sh`.
- Verify that the backend can communicate with the database using the updated volume paths.

---

## 6. Code Review

All changes to `.yml` and `.sh` files must be reviewed by **`@005_review`**.

**Requirement**: Every modification must include a comment indicating the specific path corrected (e.g., `# Fixed build context to point to 003_source`).
