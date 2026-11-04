/**
 * Module 18: Docker - Dedicated Topic Labs
 * Derived from MicroDegree Complete Docker Concept Guide
 */

module.exports = {
  "docker-internals-container-architecture": {
    title: "Lab 18.1: Linux Kernel Primitives, Container Lifecycle & Resource Quotas",
    level: "Beginner",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Linux workstation or AWS EC2 Ubuntu/Debian instance with Docker Engine installed.",
    requiredPermissions: "Sudo privileges or membership in the docker group to execute docker commands.",
    cleanupGuide: "Stop and prune all demo containers: docker rm -f $(docker ps -aq --filter name=lab181-) 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 18.1: Linux Kernel Primitives & Docker Architecture ==="
echo "[+] Validating Docker Engine: dockerd -> containerd -> runc..."
echo "[+] Inspecting namespaces: PID, NET, MNT, IPC, UTS, USER..."
echo "[+] Applying cgroup limits: memory=256m, cpus=0.5..."
echo "[+] Simulating OOMKilled condition (Exit Code 137)..."
echo "[+] Container lifecycle state machine verified: Created -> Running -> Paused -> Stopped."`,
    steps: [
      {
        stepNumber: 1,
        title: "Verify Docker Client-Server Architecture & Engine Components",
        description: "Inspect the Docker installation to verify the division of labor between the Docker CLI client, dockerd daemon, containerd supervisor, and runc OCI runtime.",
        consoleInstruction: "Query Docker version details and examine daemon info to understand client-server communication over the Unix socket.",
        cliCommand: "docker version\ndocker info | grep -E 'Server Version|Storage Driver|Cgroup Driver|Operating System'\nls -l /var/run/docker.sock",
        expectedOutput: "Client and Server versions displayed. Storage Driver: overlay2, Cgroup Driver: systemd, Socket owned by root:docker.",
        verificationTip: "Verify that 'Server' section displays containerd commit and runc version matching OCI specifications.",
        troubleshooting: "If 'Cannot connect to the Docker daemon' appears, verify systemd service with 'sudo systemctl status docker'."
      },
      {
        stepNumber: 2,
        title: "Demystify Linux Kernel Namespaces (PID, Mount, Network Isolation)",
        description: "Launch an isolated container and inspect how the Linux host kernel provisions separate PID, Network, and Mount namespaces for the container process.",
        consoleInstruction: "Start a background container, discover its host PID, and use the Linux 'lsns' tool to view its active namespaces.",
        cliCommand: "docker run -d --name lab181-ns nginx:alpine\nCONTAINER_PID=$(docker inspect --format '{{.State.Pid}}' lab181-ns)\necho \"Container Host PID: $CONTAINER_PID\"\nsudo lsns -p $CONTAINER_PID\ndocker exec lab181-ns ps -ef",
        expectedOutput: "lsns lists distinct mnt, net, pid namespaces for the process. Inside container, ps -ef shows nginx running as PID 1.",
        verificationTip: "Notice that inside the container nginx is PID 1, but on the host OS it has an independent high PID number.",
        troubleshooting: "If lsns command is missing, install util-linux package: sudo apt-get install -y util-linux."
      },
      {
        stepNumber: 3,
        title: "Enforce Physical Resource Quotas via Linux Control Groups (Cgroups)",
        description: "Apply strict CPU and memory ceilings to a container to prevent noisy neighbors from exhausting host system resources.",
        consoleInstruction: "Run a stress container with memory and CPU constraints and observe real-time resource utilization via docker stats.",
        cliCommand: "docker run -d --name lab181-stress --memory=256m --cpus=0.5 alpine sh -c 'while true; do :; done'\ndocker stats --no-stream lab181-stress",
        expectedOutput: "docker stats reports CPU pinned at ~50.0% and memory limit at 256MiB.",
        verificationTip: "Ensure CPU % does not exceed 50.0% regardless of host core count due to cfs_quota enforcement.",
        troubleshooting: "Depending on whether your host uses cgroups v1 or v2, the path will reside under /sys/fs/cgroup/memory or system.slice."
      },
      {
        stepNumber: 4,
        title: "Simulate Out-of-Memory Killer (OOMKilled) and Diagnose Exit Code 137",
        description: "Trigger the Linux kernel Out-of-Memory killer by allocating memory exceeding the cgroup limit and inspect the resulting exit code.",
        consoleInstruction: "Run a container limited to 32MB RAM that immediately allocates 100MB of memory, then inspect its termination details.",
        cliCommand: "docker run --name lab181-oom --memory=32m python:3.11-alpine python3 -c \"x = ' ' * 100 * 1024 * 1024\" || true\ndocker inspect --format 'State: {{.State.Status}} | ExitCode: {{.State.ExitCode}} | OOMKilled: {{.State.OOMKilled}}' lab181-oom",
        expectedOutput: "State: exited | ExitCode: 137 | OOMKilled: true",
        verificationTip: "Exit Code 137 represents 128 + 9 (SIGKILL), indicating the Linux kernel forcefully terminated the container process.",
        troubleshooting: "If container finishes without crashing, ensure memory allocation size is greater than the specified --memory quota."
      },
      {
        stepNumber: 5,
        title: "Master Container Lifecycle State Machine Transitions",
        description: "Transition a container through all lifecycle states: Created, Running, Paused (cgroup freezer), Stopped, and Removed.",
        consoleInstruction: "Execute lifecycle commands in sequence and check container status flags after each transition.",
        cliCommand: "docker create --name lab181-lifecycle alpine sleep 120\ndocker ps -a --filter name=lab181-lifecycle --format '{{.Names}}: {{.Status}}'\ndocker start lab181-lifecycle\ndocker pause lab181-lifecycle\ndocker inspect --format '{{.State.Status}} (Paused: {{.State.Paused}})' lab181-lifecycle\ndocker unpause lab181-lifecycle\ndocker stop -t 5 lab181-lifecycle\ndocker rm lab181-lifecycle",
        expectedOutput: "Container progresses through Created -> Up -> Paused (Paused: true) -> Exited (0) -> successfully removed.",
        verificationTip: "Verify that 'docker pause' uses kernel cgroup freezer rather than sending signals, freezing process instructions instantly.",
        troubleshooting: "If docker stop hangs, check if the process is ignoring SIGTERM; it will be force-killed with SIGKILL after the timeout."
      },
      {
        stepNumber: 6,
        title: "Security Audit: Docker Group Host Root Escalation Analysis",
        description: "Analyze why adding regular users to the 'docker' group provides root-equivalent control over the host operating system.",
        consoleInstruction: "Demonstrate how an unprivileged user with Docker access can mount the host root filesystem and inspect security files.",
        cliCommand: "id\ndocker run --rm -v /:/host-root alpine head -n 3 /host-root/etc/shadow",
        expectedOutput: "Root shadow password hashes printed from the host system, demonstrating root breakout capability.",
        verificationTip: "In enterprise production environments, use rootless Docker mode or sudo with explicit command whitelisting instead.",
        troubleshooting: "If permission denied accessing /etc/shadow, ensure Docker daemon is running as default root daemon."
      }
    ]
  },
  "docker-images-dockerfile-registries": {
    title: "Lab 18.2: Multi-Stage Dockerfile Engineering, Layer Caching Optimization & Registry Distribution",
    level: "Intermediate",
    estimatedMinutes: 45,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Docker Engine installed locally.",
    requiredPermissions: "Local docker daemon permissions.",
    cleanupGuide: "docker rm -f lab182-registry 2>/dev/null && docker rmi $(docker images -q 'lab182*') 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 18.2: Docker Images, Dockerfile Engineering & Registries ==="
echo "[+] Analyzing unoptimized image: 1.12GB with build tools and vulnerabilities"
echo "[+] Adding .dockerignore and re-ordering instructions for layer caching..."
echo "[+] Building hardened multi-stage image with Alpine runtime..."
echo "[+] Result: 1.12GB shrunk to 38MB (96.6% reduction)!"
echo "[+] Pushing deduplicated layers to local private registry localhost:5000..."`,
    steps: [
      {
        stepNumber: 1,
        title: "Analyze Bloated Single-Stage Dockerfile Anti-Patterns",
        description: "Create and build an unoptimized single-stage Dockerfile to inspect layer sizes, build cache inefficiencies, and root execution risks.",
        consoleInstruction: "Create a sample Node.js application and build it with a single-stage Dockerfile containing dev tools.",
        cliCommand: "mkdir -p /tmp/lab182-demo && cd /tmp/lab182-demo\ncat << 'EOF' > package.json\n{\"name\": \"demo-app\", \"version\": \"1.0.0\", \"dependencies\": {\"express\": \"^4.19.2\"}}\nEOF\ncat << 'EOF' > server.js\nconst express = require('express');\nconst app = express();\napp.get('/', (req, res) => res.send('Production Ready Container!'));\napp.listen(3000, () => console.log('Listening on 3000'));\nEOF\ncat << 'EOF' > Dockerfile.bloated\nFROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\nEOF\ndocker build -t lab182-bloated:v1 -f Dockerfile.bloated .\ndocker images lab182-bloated:v1\ndocker history lab182-bloated:v1",
        expectedOutput: "Image built with size exceeding 1.1GB, containing compilers, python, and operating system packages.",
        verificationTip: "Run 'docker history lab182-bloated:v1' to inspect how each instruction contributed to image bloat.",
        troubleshooting: "If npm install fails, verify outbound internet access to registry.npmjs.org."
      },
      {
        stepNumber: 2,
        title: "Implement Docker Layer Caching & Build Context Optimization",
        description: "Prevent unnecessary rebuilds and cache invalidations by adding a .dockerignore file and separating dependency installation from code copying.",
        consoleInstruction: "Create a .dockerignore file and reorder Dockerfile instructions so dependencies are cached across code changes.",
        cliCommand: "cd /tmp/lab182-demo\ncat << 'EOF' > .dockerignore\nnode_modules\n.git\n*.log\n.env\nEOF\ncat << 'EOF' > Dockerfile.cached\nFROM node:20-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\nEOF\ndocker build -t lab182-cached:v1 -f Dockerfile.cached .\necho '// Minor comment edit' >> server.js\ndocker build -t lab182-cached:v2 -f Dockerfile.cached .",
        expectedOutput: "Second build output prints 'Using cache' for package.json and npm install steps, completing in under 2 seconds.",
        verificationTip: "Verify that npm install was not re-executed during the second build despite server.js changing.",
        troubleshooting: "If cache is busted, ensure package.json timestamps or checksums did not change."
      },
      {
        stepNumber: 3,
        title: "Engineer Production Multi-Stage Build with Alpine musl & Distroless",
        description: "Separate compile-time dependencies from the runtime container using a multi-stage build, slashing final image footprint.",
        consoleInstruction: "Write a two-stage Dockerfile that compiles code in Stage 1 and copies only production artifacts into a minimal Alpine image.",
        cliCommand: "cd /tmp/lab182-demo\ncat << 'EOF' > Dockerfile.multistage\n# Stage 1: Build & Dependencies\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Stage 2: Hardened Runtime\nFROM node:20-alpine\nWORKDIR /app\n# Security: Run as unprivileged node user (UID 1000)\nUSER node\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./package.json\nCOPY server.js ./\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\nEOF\ndocker build -t lab182-multistage:v1 -f Dockerfile.multistage .\ndocker images | grep lab182",
        expectedOutput: "lab182-multistage:v1 built with size ~140MB (compared to 1.1GB bloated image), dropping ~85% of unnecessary layers.",
        verificationTip: "Notice how build tools and package caches remain trapped in the builder stage and never enter the runtime image.",
        troubleshooting: "Ensure paths in 'COPY --from=builder' match the exact directory created in the builder stage."
      },
      {
        stepNumber: 4,
        title: "Differentiate ARG vs ENV and CMD vs ENTRYPOINT Directives",
        description: "Master build-time parameters (ARG) vs runtime configuration (ENV) and compare shell form vs exec form for CMD and ENTRYPOINT.",
        consoleInstruction: "Build an image utilizing ARG for build metadata, ENV for application runtime flags, and exec-form ENTRYPOINT with default CMD arguments.",
        cliCommand: "cd /tmp/lab182-demo\ncat << 'EOF' > Dockerfile.directives\nFROM alpine:3.19\nARG APP_VERSION=1.0.0\nENV ENVIRONMENT=production\nENV VERSION=$APP_VERSION\nRUN echo \"Building version: $APP_VERSION\"\nENTRYPOINT [\"echo\", \"App running:\"]\nCMD [\"default-worker\"]\nEOF\ndocker build --build-arg APP_VERSION=2.5.0 -t lab182-directives:v1 -f Dockerfile.directives .\ndocker run --rm lab182-directives:v1\ndocker run --rm lab182-directives:v1 custom-scheduler",
        expectedOutput: "First run outputs 'App running: default-worker'. Second run outputs 'App running: custom-scheduler' (CMD overridden by CLI args).",
        verificationTip: "Confirm that passing CLI arguments overrides CMD while preserving ENTRYPOINT as the fixed executable.",
        troubleshooting: "If CMD arguments are not passed to ENTRYPOINT, verify that both use JSON exec array format [\"arg\"]."
      },
      {
        stepNumber: 5,
        title: "Harden Security: Implement Non-Root USER & Verify Privilege Drop",
        description: "Enforce least-privilege security by creating an unprivileged service account inside the container to prevent container breakout exploits.",
        consoleInstruction: "Add an explicit user creation and USER directive, verify the process UID inside the container, and test file write permissions.",
        cliCommand: "cd /tmp/lab182-demo\ncat << 'EOF' > Dockerfile.security\nFROM alpine:3.19\nRUN addgroup -g 10001 appgroup && \\\n    adduser -u 10001 -G appgroup -s /bin/sh -D appuser && \\\n    mkdir -p /app && chown -R appuser:appgroup /app\nWORKDIR /app\nUSER 10001:10001\nCMD [\"id\"]\nEOF\ndocker build -t lab182-security:v1 -f Dockerfile.security .\ndocker run --rm lab182-security:v1",
        expectedOutput: "uid=10001(appuser) gid=10001(appgroup) groups=10001(appgroup)",
        verificationTip: "Verify that the user ID is 10001 (non-zero), confirming the process runs with unprivileged host permissions.",
        troubleshooting: "Ensure WORKDIR permissions are chowned before switching to USER, or unprivileged writes will fail."
      },
      {
        stepNumber: 6,
        title: "Deploy Private Docker Registry & Verify Content-Addressable Deduplication",
        description: "Deploy an in-cluster private Docker registry (registry:2), tag and push images, and observe layer deduplication across pushes.",
        consoleInstruction: "Spin up a local private registry container on port 5000, tag the multistage image, push to the registry, and test offline pulls.",
        cliCommand: "docker run -d -p 5000:5000 --name lab182-registry registry:2\ndocker tag lab182-multistage:v1 localhost:5000/demo-app:1.0.0\ndocker push localhost:5000/demo-app:1.0.0\necho '// update' >> server.js\ndocker build -t localhost:5000/demo-app:1.0.1 -f Dockerfile.multistage .\ndocker push localhost:5000/demo-app:1.0.1",
        expectedOutput: "Second push displays 'Layer already exists' for base layers and dependencies, transferring only the modified application layer.",
        verificationTip: "Query the private registry catalog: curl http://localhost:5000/v2/_catalog",
        troubleshooting: "If push fails with 'connection refused', ensure the registry container is healthy and port 5000 is open."
      }
    ]
  },
  "dockerfile-multistage-compose-networking": {
    title: "Lab 18.3: Custom Bridge Networking, Named Volume Persistence & Multi-Service Docker Compose Stack",
    level: "Intermediate",
    estimatedMinutes: 45,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Docker Engine and Docker Compose V2 installed locally.",
    requiredPermissions: "Local Docker daemon execution permissions.",
    cleanupGuide: "cd /tmp/lab183-compose && docker compose down && docker volume rm lab183-compose_pgdata 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 18.3: Docker Compose, Networking & Volumes ==="
echo "[+] Creating custom bridge network app-net with DNS 127.0.0.11..."
echo "[+] Validating persistent storage with Named Volumes..."
echo "[+] Launching multi-tier Compose stack: Frontend + API + PostgreSQL..."
echo "[+] Verifying healthcheck readiness: pg_isready..."
echo "[+] Stack healthy! Testing safe teardown vs down -v prevention."`,
    steps: [
      {
        stepNumber: 1,
        title: "Contrast Default Bridge (docker0) vs User-Defined Custom Bridge Networking",
        description: "Demonstrate that containers on the default bridge cannot resolve each other by container name, while user-defined bridge networks provide automatic DNS resolution.",
        consoleInstruction: "Create two containers on the default bridge and test name resolution, then create a custom bridge network and verify automatic DNS.",
        cliCommand: "docker run -d --name lab183-c1 alpine sleep 3600\ndocker run -d --name lab183-c2 alpine sleep 3600\ndocker exec lab183-c1 ping -c 1 lab183-c2 || echo \"Default bridge DNS failed as expected!\"\ndocker network create --driver bridge lab183-custom-net\ndocker network connect lab183-custom-net lab183-c1\ndocker network connect lab183-custom-net lab183-c2\ndocker exec lab183-c1 ping -c 2 lab183-c2",
        expectedOutput: "Ping by container name succeeds on lab183-custom-net with 0% packet loss via internal DNS 127.0.0.11.",
        verificationTip: "Check /etc/resolv.conf inside the container: 'docker exec lab183-c1 cat /etc/resolv.conf' (points to nameserver 127.0.0.11).",
        troubleshooting: "If ping fails, ensure both containers are connected to the same custom bridge network via 'docker inspect lab183-custom-net'."
      },
      {
        stepNumber: 2,
        title: "Configure Persistent Storage: Named Volumes vs Ephemeral Writable Layer",
        description: "Prove that data written to a container's writable layer is permanently lost upon deletion, while Docker Named Volumes persist independently.",
        consoleInstruction: "Create a named volume, start a Postgres database mounted to that volume, insert test data, destroy the container, and recreate it.",
        cliCommand: "docker volume create lab183-db-vol\ndocker run -d --name lab183-db -e POSTGRES_PASSWORD=mysecret -v lab183-db-vol:/var/lib/postgresql/data postgres:16-alpine\nsleep 5\ndocker exec -i lab183-db psql -U postgres -c \"CREATE TABLE customers (id SERIAL, name TEXT); INSERT INTO customers (name) VALUES ('Acme Corp');\"\ndocker rm -f lab183-db\ndocker run -d --name lab183-db-new -e POSTGRES_PASSWORD=mysecret -v lab183-db-vol:/var/lib/postgresql/data postgres:16-alpine\nsleep 5\ndocker exec -i lab183-db-new psql -U postgres -c \"SELECT * FROM customers;\"",
        expectedOutput: "Query returns 'Acme Corp' intact from the recreated container, confirming named volume persistence.",
        verificationTip: "Inspect volume metadata: 'docker volume inspect lab183-db-vol' to see Mountpoint /var/lib/docker/volumes/...",
        troubleshooting: "If psql fails immediately, allow a few additional seconds for Postgres to complete database initialization."
      },
      {
        stepNumber: 3,
        title: "Author Declarative Multi-Service compose.yaml (API, PostgreSQL, Redis)",
        description: "Create a production-grade multi-container specification using Docker Compose V2, specifying services, networks, volumes, and environment variables.",
        consoleInstruction: "Create a project directory and compose.yaml with Node API, PostgreSQL, and Redis cache.",
        cliCommand: "mkdir -p /tmp/lab183-compose && cd /tmp/lab183-compose\ncat << 'EOF' > compose.yaml\nservices:\n  api:\n    image: node:20-alpine\n    working_dir: /app\n    command: sh -c \"npm init -y && npm install express pg && node -e \\\"require('http').createServer((q,s)=>s.end('API OK')).listen(4000)\\\"\"\n    ports:\n      - \"4000:4000\"\n    environment:\n      - DB_HOST=db\n      - REDIS_HOST=cache\n    networks:\n      - backend-net\n    depends_on:\n      db:\n        condition: service_healthy\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      - POSTGRES_PASSWORD=secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    networks:\n      - backend-net\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 5s\n      timeout: 3s\n      retries: 5\n\n  cache:\n    image: redis:7-alpine\n    networks:\n      - backend-net\n\nnetworks:\n  backend-net:\n    driver: bridge\n\nvolumes:\n  pgdata:\nEOF\ndocker compose config",
        expectedOutput: "compose.yaml validated successfully with all services, networks, and volumes parsed without syntax errors.",
        verificationTip: "Always run 'docker compose config' to validate YAML syntax and variable interpolation before launching.",
        troubleshooting: "Ensure valid 2-space indentation; tabs are forbidden in YAML specifications."
      },
      {
        stepNumber: 4,
        title: "Resolve Startup Race Conditions: Configure Healthchecks & depends_on Condition",
        description: "Eliminate the common 'database not ready' crash by coupling service healthchecks with the depends_on condition.",
        consoleInstruction: "Start the multi-container stack in detached mode and observe the service dependency startup order.",
        cliCommand: "cd /tmp/lab183-compose\ndocker compose up -d\ndocker compose ps",
        expectedOutput: "Containers started in order: db starts first -> healthcheck enters (healthy) -> api container starts. Status shows 'healthy'.",
        verificationTip: "Run 'docker inspect --format \"{{.State.Health.Status}}\" $(docker compose ps -q db)' to inspect health state.",
        troubleshooting: "If api fails to start, verify that the healthcheck command inside the db container succeeds."
      },
      {
        stepNumber: 5,
        title: "Execute Multi-Container Operations (logs, exec, stats, restart)",
        description: "Practice operational management commands across the Compose multi-service fleet.",
        consoleInstruction: "Query unified logs, follow streaming logs, execute commands inside services, and test non-disruptive service restart.",
        cliCommand: "cd /tmp/lab183-compose\ndocker compose logs --tail=20 db\ndocker compose exec db psql -U postgres -c '\\l'\ndocker compose restart api\ndocker compose ps",
        expectedOutput: "PostgreSQL databases listed; api restarted smoothly without affecting database or cache containers.",
        verificationTip: "Notice that 'docker compose logs' prefixes each line with the originating service name in distinct terminal colors.",
        troubleshooting: "If exec fails with TTY error in scripts, pass -T flag: docker compose exec -T db psql ..."
      },
      {
        stepNumber: 6,
        title: "Disaster Recovery Drill: Safe Teardown vs Fatal 'down -v' Prevention",
        description: "Demonstrate the critical difference between 'docker compose down' (which preserves data volumes) and 'docker compose down -v' (which destroys databases).",
        consoleInstruction: "Stop the Compose stack safely, verify volume persistence, and document strict production safeguards against the -v flag.",
        cliCommand: "cd /tmp/lab183-compose\ndocker compose down\ndocker volume ls | grep pgdata\necho \"Safe teardown complete: Named volume 'pgdata' is preserved on host disk.\"\necho \"CRITICAL WARNING: 'docker compose down -v' deletes all volumes! Never run in production.\"",
        expectedOutput: "Containers and networks removed, but pgdata volume remains intact in 'docker volume ls'.",
        verificationTip: "In production CI/CD scripts, configure lint checks to reject any pipeline containing 'docker compose down -v'.",
        troubleshooting: "If a volume is accidentally deleted without backups, recovery from disk blocks is rarely possible with union filesystems."
      }
    ]
  }
};

