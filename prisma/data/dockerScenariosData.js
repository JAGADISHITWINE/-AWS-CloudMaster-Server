/**
 * Module 18: Docker - Real-time Scenario-Based Troubleshooting Questions
 * Sourced from MicroDegree Docker Guide (Section 18 & Concept Chapters)
 */

module.exports = [
  // --- TOPIC 1: Container Internals, Namespaces & Docker Architecture ---
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    title: "Scenario: Container Exits Immediately with Status Code 0 / No Output (Background vs Foreground PID 1 Process)",
    difficulty: "Beginner",
    prompt: "A developer builds an image for an Ubuntu-based microservice and runs: 'docker run -d --name my-app my-ubuntu-app:1.0'. The terminal outputs a container ID, indicating success. However, running 'docker ps' shows nothing running. Running 'docker ps -a' shows: 'STATUS: Exited (0) 3 seconds ago'. The developer checks logs with 'docker logs my-app' and sees no error messages or output. Why did the container exit immediately with code 0, and how do you fix it?",
    explanation: "A Docker container lives only as long as its primary process (PID 1) continues running. If the startup script or command launches a background daemon and exits, or runs a shell without an interactive terminal, PID 1 terminates with exit code 0. Linux kernel namespaces and cgroups associated with the container are immediately reaped by the host kernel.",
    hintsJson: JSON.stringify([
      "Hint 1: Check PID 1 lifecycle in containers: when PID 1 exits, the entire container stops.",
      "Hint 2: Verify whether the container entrypoint runs a daemon in background mode (e.g. 'service nginx start') instead of foreground.",
      "Hint 3: Inspect the container exit status and command using 'docker inspect my-app --format \"{{.State.ExitCode}} {{.Config.Cmd}}\"'.",
      "Hint 4: For non-daemon containers like Ubuntu/Alpine, running without '-it' or a long-running process results in instant exit."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Diagnose the Container Lifecycle & Exit Code:**
   - Run: \`docker inspect my-app --format 'State: {{.State.Status}} | ExitCode: {{.State.ExitCode}} | Cmd: {{json .Config.Cmd}}'\`
   - Notice that Exit Code is \`0\`. In Linux, status code 0 indicates normal, successful execution. The process was not killed; it simply reached the end of its instructions and exited.

2. **Understand the Root Cause (Container PID 1 Rule):**
   - In a VM, init/systemd runs as PID 1 and manages multiple background daemons indefinitely.
   - In a Docker container, the command specified in \`CMD\` or \`ENTRYPOINT\` runs directly as PID 1.
   - If the Dockerfile specifies:
     \`\`\`dockerfile
     CMD ["service", "nginx", "start"]
     \`\`\`
     The \`service\` command spawns nginx as a background daemon, returns status code 0 to the shell, and the shell process terminates. Because PID 1 terminates, the Docker engine tears down the container.

3. **Resolution Strategies for Foreground Execution:**
   - **For Web Servers (Nginx / Apache):**
     Configure the process to run in the foreground:
     \`\`\`dockerfile
     # WRONG: CMD ["service", "nginx", "start"]
     # CORRECT:
     CMD ["nginx", "-g", "daemon off;"]
     \`\`\`
   - **For Background Worker Scripts:**
     Ensure your application script stays alive, listening for incoming events:
     \`\`\`dockerfile
     CMD ["node", "worker.js"] # or python -u app.py
     \`\`\`
   - **For Interactive Debugging / Base OS Containers:**
     If running an interactive distribution like Ubuntu or Alpine for debugging, attach standard input and a pseudo-TTY:
     \`\`\`bash
     docker run -it --name debug-box ubuntu:22.04 bash
     \`\`\`
     Or if running in detached background mode:
     \`\`\`bash
     docker run -d --name bg-box ubuntu:22.04 sleep infinity
     \`\`\`

4. **Verification:**
   - Relaunch with foreground command: \`docker run -d --name my-app-fixed my-ubuntu-app:2.0\`
   - Run \`docker ps\` and verify status: \`Up 45 seconds\`.
   - Run \`docker top my-app-fixed\` to confirm PID 1 is actively executing in the foreground.`,
    tagsJson: JSON.stringify(["Docker", "PID 1", "Container Lifecycle", "Exit Code 0", "Daemon Off"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    title: "Scenario: Unsecured TCP-Exposed Docker Daemon Exploitation & Privilege Escalation via Host Root Bind-Mount",
    difficulty: "Advanced",
    prompt: "During a security penetration test of your AWS cloud infrastructure, an auditor flags an unencrypted, public TCP port 2375 exposed on a production Docker host. Within 10 minutes, the auditor accesses the host's /etc/shadow file and leaves a test file in /root/audit.txt without having SSH credentials to the server. How did the attacker leverage the Docker daemon architecture to escalate privileges to root, and how do you harden the Docker daemon?",
    explanation: "The Docker daemon (dockerd) runs with root privileges on the Linux host. By default, it communicates locally via the Unix domain socket /var/run/docker.sock. If dockerd is misconfigured to listen on an unauthenticated TCP socket (-H tcp://0.0.0.0:2375), any remote network client can instruct dockerd to spawn a container mounting the host's root directory ('-v /:/host-root'), granting immediate root write access over the entire host OS.",
    hintsJson: JSON.stringify([
      "Hint 1: Review Docker client-server architecture: the CLI speaks REST API to dockerd.",
      "Hint 2: Port 2375 is standard unencrypted Docker REST API; Port 2376 is encrypted TLS.",
      "Hint 3: Understand how volume mounts ('-v /:/host') break boundary isolation when the daemon runs as root.",
      "Hint 4: Inspect /etc/docker/daemon.json and systemd drop-in configuration files."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Security Remediation:

1. **Analyze the Attack Vector (Daemon Remote Execution & Breakout):**
   - The attacker ran from an external machine:
     \`\`\`bash
     docker -H tcp://<target-ip>:2375 run --rm -v /:/host-root alpine sh -c "echo 'attacker_keys' >> /host-root/root/.ssh/authorized_keys"
     \`\`\`
   - Because \`dockerd\` runs as root on the host, it created a mount namespace with the host's root filesystem mapped into \`/host-root\`. The container process had unrestricted write access to the host's \`/etc/shadow\`, crontabs, and system files.

2. **Audit Open Sockets and Configuration Files:**
   - Check listening ports on the host:
     \`\`\`bash
     sudo netstat -tlpn | grep dockerd
     # Output: tcp 0 0 0.0.0.0:2375 0.0.0.0:* LISTEN 1184/dockerd
     \`\`\`
   - Inspect \`/etc/docker/daemon.json\` and systemd override:
     \`\`\`bash
     sudo cat /etc/docker/daemon.json
     sudo systemctl cat docker.service
     \`\`\`

3. **Remediation Steps:**
   - **Step 1: Remove Plain TCP Listener:**
     Edit \`/etc/docker/daemon.json\` to restrict communication to the local Unix domain socket:
     \`\`\`json
     {
       "hosts": ["unix:///var/run/docker.sock"]
     }
     \`\`\`
   - **Step 2: If Remote Access is Required, Enforce Mutual TLS (mTLS on Port 2376):**
     Generate CA, server, and client certificates, and configure \`/etc/docker/daemon.json\`:
     \`\`\`json
     {
       "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
       "tlsverify": true,
       "tlscacert": "/etc/docker/certs/ca.pem",
       "tlscert": "/etc/docker/certs/server-cert.pem",
       "tlskey": "/etc/docker/certs/server-key.pem"
     }
     \`\`\`
   - **Step 3: Enable User Namespaces (userns-remap):**
     Add user namespace remapping in \`/etc/docker/daemon.json\` so root inside containers maps to an unprivileged UID (e.g. UID 100000) on the host:
     \`\`\`json
     {
       "userns-remap": "default"
     }
     \`\`\`
   - **Step 4: Reload and Restart Docker Engine:**
     \`\`\`bash
     sudo systemctl daemon-reload
     sudo systemctl restart docker
     \`\`\`

4. **Verification:**
   - Verify port 2375 is closed: \`sudo netstat -tlpn | grep 2375\` (no output).
   - Test unauthorized remote connection: \`docker -H tcp://<target-ip>:2375 info\` -> \`Cannot connect to the Docker daemon\`.`,
    tagsJson: JSON.stringify(["Docker Security", "dockerd", "Privilege Escalation", "Port 2375", "mTLS", "userns-remap"])
  },

  // --- TOPIC 2: Docker Images, Dockerfile Engineering & Registry Distribution ---
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "Scenario: Alpine musl libc vs GNU glibc Dynamic Linker Incompatibility Crash in Python/Node C-Extensions",
    difficulty: "Advanced",
    prompt: "A DevOps team decides to migrate all company Python microservices from 'python:3.11-slim' (Debian-based, ~140MB) to 'python:3.11-alpine' (Alpine-based, ~50MB) to minimize container storage. While simple scripts run fine, microservices using pandas, numpy, and cryptography either crash on startup with 'Error loading shared library ld-linux-x86-64.so.2: No such file or directory' or increase CI build times from 3 minutes to 35 minutes during 'pip install'. What is the root cause, and how do you resolve it?",
    explanation: "Alpine Linux uses musl libc, whereas mainstream Linux distributions (Ubuntu, Debian, RHEL) use GNU C Library (glibc). Most pre-compiled Python binary wheels on PyPI (manylinux wheels) link against glibc. On Alpine, pip cannot find compatible pre-compiled wheels, so it falls back to downloading source tarballs and compiling C/C++ extensions from scratch (requiring gcc, g++, make). If a compiled binary is directly copied into Alpine, it fails dynamically linking to ld-linux-x86-64.so.2.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect the C standard library implementation of Alpine Linux: musl libc vs glibc.",
      "Hint 2: Review PyPI manylinux wheels: they are compiled against glibc, not musl.",
      "Hint 3: Use 'ldd' inside the container on the compiled binary to inspect dynamic linker dependencies.",
      "Hint 4: Weigh image size savings (90MB) against build time penalty (30 mins of compiling) and runtime performance."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Diagnose the Dynamic Linker Error:**
   - Run inside the Alpine container:
     \`\`\`bash
     docker run -it --rm python:3.11-alpine sh
     / # python -c "import numpy"
     # Traceback: ImportError: Error loading shared library ld-linux-x86-64.so.2: No such file or directory
     \`\`\`
   - Check the system C library:
     \`\`\`bash
     / # ldd /bin/sh
     # /lib/ld-musl-x86_64.so.1 (0x7f...) -> musl libc!
     \`\`\`

2. **Understand the Build Penalty:**
   - On Debian/Ubuntu (\`python:3.11-slim\`), \`pip install pandas numpy\` downloads pre-built \`.whl\` binary files in 5 seconds.
   - On Alpine, pip detects musl and rejects \`manylinux\` binary wheels. It must download the full C/Fortran source code and compile on every build, requiring \`gcc\`, \`g++\`, \`musl-dev\`, and taking up to 30 minutes of CPU time. Furthermore, memory allocation algorithms in musl can cause Python scientific workloads to run 1.5x–2x slower.

3. **Recommended Resolution Options:**
   - **Industry Standard Solution (Recommended):**
     Use Debian slim images for Python applications with native C-extensions or scientific libraries:
     \`\`\`dockerfile
     FROM python:3.11-slim
     WORKDIR /app
     COPY requirements.txt .
     RUN pip install --no-cache-dir -r requirements.txt
     COPY . .
     USER 10001
     CMD ["python", "app.py"]
     \`\`\`
     *Result:* Fast 10-second builds, instant pre-compiled wheel downloads, and native glibc performance.
   - **Alternative (If Alpine is Mandated by Corporate Policy):**
     Install Alpine's pre-compiled community packages or \`gcompat\` (glibc compatibility layer):
     \`\`\`dockerfile
     FROM python:3.11-alpine
     RUN apk add --no-cache gcompat libstdc++
     \`\`\`
     Or install system packages directly via APK rather than compiling via PIP:
     \`\`\`dockerfile
     RUN apk add --no-cache py3-numpy py3-pandas py3-cryptography
     \`\`\`

4. **Verification:**
   - Build image with \`python:3.11-slim\` and time the build:
     \`\`\`bash
     time docker build -t py-app:slim .
     \`\`\`
   - Verify build completes in under 30 seconds and runtime imports succeed without linker errors.`,
    tagsJson: JSON.stringify(["Docker", "Alpine", "musl libc", "glibc", "Python", "Manylinux Wheels"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "Scenario: Accidental 'docker system prune -a' on Shared Host Deleting Pre-Cached Production Deployment Images",
    difficulty: "Intermediate",
    prompt: "An on-call DevOps engineer notices that a production host's root disk partition reached 92% disk utilization. To quickly free up disk space, the engineer SSHs into the server and runs: 'docker system prune -a --volumes'. The command frees 120GB of space. However, 15 minutes later, an automated CI/CD canary deployment begins. Instead of deploying in 30 seconds, the deployment times out after 15 minutes because every single microservice base image (Node, Java, Python, Nginx) has been erased and must be pulled across the internet simultaneously, saturating network bandwidth. What did '-a' do, and how do you implement safe Docker cleanup?",
    explanation: "'docker system prune' removes only stopped containers, unused networks, and dangling images (untagged images showing as <none>). Adding the '-a' (--all) flag instructs Docker to delete ALL images not currently associated with a running container, including pre-cached production base images and previous release rollback images. Adding '--volumes' wipes any unattached persistent storage volumes.",
    hintsJson: JSON.stringify([
      "Hint 1: Differentiate between dangling images (<none>) vs unused images.",
      "Hint 2: Review the flags of 'docker system prune': -a removes ALL unused images, not just dangling ones.",
      "Hint 3: Understand how image caching protects CI/CD rollback and cold-start performance.",
      "Hint 4: Implement scheduled maintenance scripts with explicit filter flags."
    ]),
    recommendedSolution: `### Step-by-Step Incident Recovery & Preventative Maintenance:

1. **Understand What Happened:**
   - \`docker system prune\` (safe): Deletes stopped containers, unused networks, and dangling (\`<none>\`) images created during failed builds.
   - \`docker system prune -a\` (destructive on shared hosts): Deletes every image not referenced by an active, running container. Rollback images and base images used by CI jobs are wiped.
   - \`--volumes\` (high danger): Deletes any named volume not currently mounted by a container, risking data loss for stopped databases.

2. **Immediate Remediation (Mitigate WAN Saturation):**
   - Pull the required production base images sequentially rather than allowing simultaneous pulls to saturate the link:
     \`\`\`bash
     docker pull node:20-alpine
     docker pull python:3.11-slim
     docker pull nginx:alpine
     \`\`\`

3. **Implement Safe, Automated Docker Disk Maintenance:**
   - **Rule 1: Never use \`-a\` in unattended cron jobs on production hosts.**
   - **Rule 2: Prune only dangling images and stopped containers older than 24 hours:**
     \`\`\`bash
     # Clean stopped containers older than 24h
     docker container prune --filter "until=24h" -f

     # Clean only dangling (<none>) images
     docker image prune -f

     # Clean unused build cache older than 48h
     docker builder prune --filter "until=48h" -f
     \`\`\`
   - **Rule 3: Protect Critical Images Using Labels:**
     Tag key base images with a label to exempt them from pruning:
     \`\`\`bash
     docker image prune -a --filter "label!=keep=true" -f
     \`\`\`

4. **Address the Real Root Cause (Log Rotation):**
   - In 90% of cases, Docker disk exhaustion is caused by unrotated JSON container logs in \`/var/lib/docker/containers/*/*.log\`.
   - Configure global log rotation in \`/etc/docker/daemon.json\`:
     \`\`\`json
     {
       "log-driver": "json-file",
       "log-opts": {
         "max-size": "20m",
         "max-file": "3"
       }
     }
     \`\`\`
   - Reload daemon: \`sudo systemctl restart docker\`. Containers will now cap log consumption at 60MB maximum.`,
    tagsJson: JSON.stringify(["Docker Maintenance", "docker system prune", "Dangling Images", "Disk Cleanup", "Log Rotation"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "Scenario: Unintended Archive Auto-Extraction and Build Invalidation Bug Caused by ADD vs COPY in Production Dockerfile",
    difficulty: "Beginner",
    prompt: "An application requires an uncompressed tarball archive 'seed-dataset.tar.gz' to be placed at '/app/data/' so the application can verify its cryptographic checksum before running an internal ingestion script. The developer writes: 'ADD seed-dataset.tar.gz /app/data/'. When the container boots, the application crashes with 'FileNotFoundError: /app/data/seed-dataset.tar.gz not found'. Upon inspecting the container, the developer finds hundreds of extracted files in '/app/data/' instead of the tarball. Why did this happen, and what is the strict rule for ADD vs COPY?",
    explanation: "The Dockerfile 'ADD' instruction has special built-in behavior: if the source is a recognized local compression format (tar, gzip, bzip2, xz), Docker automatically unpacks and decompresses the archive into the destination directory. Conversely, 'COPY' strictly copies files and directories byte-for-byte without extraction.",
    hintsJson: JSON.stringify([
      "Hint 1: Compare the feature differences between ADD and COPY in Dockerfiles.",
      "Hint 2: ADD auto-extracts local tar archives into the target directory.",
      "Hint 3: COPY copies the exact archive file as-is without touching its compression format.",
      "Hint 4: Docker official best practices recommend COPY in virtually all scenarios."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Identify the Ingestion Failure:**
   - Inspect the container filesystem:
     \`\`\`bash
     docker run --rm my-app ls -la /app/data/
     \`\`\`
   - Notice that \`seed-dataset.tar.gz\` does not exist. Instead, the extracted contents (e.g. \`table1.csv\`, \`table2.csv\`) are present.
   - The application expects the raw tarball to compute its SHA256 checksum against an S3 catalog entry before unzipping.

2. **Differentiate ADD vs COPY Specifications:**
   - **COPY (Recommended Standard):**
     - Copies local files or directories from the build context into the container filesystem.
     - Performs a literal, byte-for-byte copy.
     - Preserves file structure and compression format.
     - Highly predictable and cache-friendly.
   - **ADD (Specialized / Discouraged for standard copies):**
     - Automatically decompresses local tar archives (\`.tar\`, \`.tar.gz\`, \`.tgz\`, \`.tar.bz2\`).
     - Supports downloading files from remote HTTP/HTTPS URLs (discouraged because it invalidates layer caching and creates bloated layers).

3. **Resolution:**
   - Update the Dockerfile to replace \`ADD\` with \`COPY\`:
     \`\`\`dockerfile
     # WRONG: Auto-extracts the tarball
     # ADD seed-dataset.tar.gz /app/data/

     # CORRECT: Copies the tarball intact
     WORKDIR /app
     COPY seed-dataset.tar.gz /app/data/
     \`\`\`

4. **Golden Rule of Thumb for Dockerfile Authors:**
   - **Always use COPY by default.**
   - Use ADD **only** when you specifically want Docker to extract a local tarball directly into the image rootfs (e.g. installing custom rootfs archives: \`ADD rootfs.tar.xz /\`).
   - For remote files, avoid \`ADD https://...\`; use \`RUN curl -sSL https://... | tar -xz -C /target\` chained in a single layer to clean up the downloaded archive immediately.`,
    tagsJson: JSON.stringify(["Docker", "Dockerfile", "ADD vs COPY", "Layer Optimization", "Best Practices"])
  },

  // --- TOPIC 3: Docker Networking, Storage Volumes & Multi-Container Docker Compose Stacks ---
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "Scenario: Service Name DNS Resolution Failure on Default Bridge Network vs User-Defined Custom Bridge",
    difficulty: "Intermediate",
    prompt: "A developer starts two containers manually for testing: 'docker run -d --name mysql-db -e MYSQL_ROOT_PASSWORD=secret mysql:8.0' and 'docker run -d --name backend-api my-api:1.0'. In the API configuration, DB_HOST is set to 'mysql-db'. The API container crashes on startup with: 'Error: getaddrinfo ENOTFOUND mysql-db'. However, running 'docker inspect mysql-db' reveals its IP is 172.17.0.2, and changing DB_HOST to 172.17.0.2 allows the API to connect. Why did DNS resolution fail by container name, and why is hardcoding IP addresses dangerous?",
    explanation: "By default, containers attach to Docker's default bridge network ('docker0'). The default bridge does NOT have automatic container name DNS resolution enabled; it only supports obsolete '--link' syntax. In contrast, user-defined custom bridge networks provide an internal DNS server (127.0.0.11) that automatically resolves container names and service aliases.",
    hintsJson: JSON.stringify([
      "Hint 1: Check what network the containers joined: run 'docker inspect <container> --format \"{{json .NetworkSettings.Networks}}\"'.",
      "Hint 2: Understand the difference between the default 'bridge' network and user-defined bridge networks.",
      "Hint 3: Hardcoding container IPs fails because Docker assigns dynamic IPs on every container restart.",
      "Hint 4: Test name resolution from inside the container using 'nslookup' or 'ping'."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Diagnose the DNS Resolution Failure:**
   - Execute an interactive lookup from inside the API container:
     \`\`\`bash
     docker exec -it backend-api ping mysql-db
     # Output: ping: bad address 'mysql-db'
     \`\`\`
   - Check the network settings:
     \`\`\`bash
     docker network inspect bridge
     \`\`\`
   - Both containers are on the default bridge named \`bridge\`. On this default network, Docker disables its embedded DNS resolver.

2. **Why Hardcoding 172.17.0.2 is a Production Anti-Pattern:**
   - If \`mysql-db\` restarts, or if another container boots first after a server reboot, Docker allocates IP addresses sequentially.
   - \`mysql-db\` may receive \`172.17.0.3\`, immediately breaking the API with connection refused.

3. **Resolution: Create and Connect to a User-Defined Bridge Network:**
   - **Step 1: Create a custom bridge network:**
     \`\`\`bash
     docker network create --driver bridge my-app-net
     \`\`\`
   - **Step 2: Connect the running containers to the new network:**
     \`\`\`bash
     docker network connect my-app-net mysql-db
     docker network connect my-app-net backend-api
     \`\`\`
     *Or launch them on the custom network from the beginning:*
     \`\`\`bash
     docker run -d --name mysql-db --network my-app-net -e MYSQL_ROOT_PASSWORD=secret mysql:8.0
     docker run -d --name backend-api --network my-app-net -e DB_HOST=mysql-db my-api:1.0
     \`\`\`

4. **Verify Embedded DNS Resolution:**
   - Inspect container's nameserver:
     \`\`\`bash
     docker exec backend-api cat /etc/resolv.conf
     # Output: nameserver 127.0.0.11 (Embedded Docker DNS Resolver)
     \`\`\`
   - Test resolution:
     \`\`\`bash
     docker exec backend-api ping -c 2 mysql-db
     # 64 bytes from 172.18.0.2: icmp_seq=1 ttl=64 time=0.082 ms
     \`\`\`
   - The embedded DNS resolver at \`127.0.0.11\` dynamically tracks container IP reassignments and updates DNS records instantly.`,
    tagsJson: JSON.stringify(["Docker Networking", "Bridge Network", "Docker DNS", "127.0.0.11", "Service Discovery"])
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "Scenario: Database Service Crash in Docker Compose Due to depends_on Started vs Ready Healthcheck Race Condition",
    difficulty: "Intermediate",
    prompt: "A microservices application is defined in docker-compose.yml. The web API service includes 'depends_on: - db'. When running 'docker compose up', both containers start simultaneously. However, the web API crashes after 3 seconds with 'ECONNREFUSED 172.20.0.2:5432' and restarts repeatedly. Running 'docker compose ps' shows db is Up (PostgreSQL is still generating initial cryptographic keys and schema tables). Why didn't depends_on prevent the API from crashing, and how do you implement a true readiness gate?",
    explanation: "'depends_on' in Docker Compose controls only container startup order, NOT application readiness. Compose marks the database container as 'started' as soon as its PID 1 process begins executing. However, databases like PostgreSQL, MySQL, and MongoDB take 10–20 seconds to initialize filesystems, run migrations, and open their listening TCP sockets. Without healthcheck conditions, dependent services crash immediately.",
    hintsJson: JSON.stringify([
      "Hint 1: Understand the difference between container 'Running' state vs application 'Ready' state.",
      "Hint 2: Review Docker Compose V2 depends_on syntax: condition: service_healthy.",
      "Hint 3: Configure a database healthcheck instruction using 'pg_isready' or 'mysqladmin ping'.",
      "Hint 4: Observe container status in 'docker compose ps': check for '(health: starting)' vs '(healthy)'."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Understand the Startup Race Condition:**
   - In \`compose.yaml\`:
     \`\`\`yaml
     services:
       api:
         depends_on:
           - db
     \`\`\`
   - Docker Compose starts \`db\`. Within 100 milliseconds, \`db\` is in the 'Running' state.
   - Compose immediately starts \`api\`.
   - \`api\` initializes in 1 second and immediately tries to connect to \`db:5432\`.
   - PostgreSQL is still executing its first-run initialization script (\`initdb\`, WAL replay) and has not bound port 5432.
   - The TCP connection is actively refused, causing the API to exit.

2. **Resolution: Implement Docker Healthchecks with depends_on Condition:**
   - Update \`compose.yaml\` to add a native \`healthcheck\` to the database service and update \`depends_on\` on the API:
     \`\`\`yaml
     services:
       db:
         image: postgres:16-alpine
         environment:
           - POSTGRES_PASSWORD=secret
         volumes:
           - pgdata:/var/lib/postgresql/data
         healthcheck:
           test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
           interval: 5s
           timeout: 3s
           retries: 5
           start_period: 10s

       api:
         build: .
         ports:
           - "3000:3000"
         depends_on:
           db:
             condition: service_healthy
         environment:
           - DB_HOST=db

     volumes:
       pgdata:
     \`\`\`

3. **Key Parameters Explained:**
   - \`test\`: Uses \`pg_isready\` utility included with PostgreSQL to test if the server is accepting client connections.
   - \`start_period: 10s\`: Grace period allowing the container to boot without premature failure counts.
   - \`condition: service_healthy\`: Explicitly blocks Docker Compose from launching \`api\` until \`db\` transitions from \`(health: starting)\` to \`(healthy)\`.

4. **Verification:**
   - Run: \`docker compose up --build\`
   - Observe terminal logs:
     1. \`[+] Container db Starting\`
     2. \`[+] Container db Waiting for healthy\`
     3. \`[+] Container db Healthy\`
     4. \`[+] Container api Starting\`
   - The API connects on the very first try with zero connection refused errors.`,
    tagsJson: JSON.stringify(["Docker Compose", "depends_on", "HEALTHCHECK", "Race Conditions", "PostgreSQL", "Readiness"])
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "Scenario: Data Loss Disaster Recovery After Accidental 'docker compose down -v' on Production Database",
    difficulty: "Advanced",
    prompt: "An operations engineer preparing for an application version upgrade runs 'docker compose down -v' to clean up before deploying the new version. After running 'docker compose up -d', the team discovers that all customer database records, user tables, and transaction histories have vanished—the PostgreSQL database started completely empty. What caused this disaster, how can the team recover, and what architectural safeguards prevent this permanently?",
    explanation: "The '-v' (or '--volumes') flag in 'docker compose down' explicitly directs Docker to remove all named volumes declared in the 'volumes:' section of compose.yaml. When docker compose up runs subsequently, Docker creates brand-new, empty named volumes. Without pre-existing automated backups or external volume definitions, all data is permanently lost.",
    hintsJson: JSON.stringify([
      "Hint 1: Review the documentation for 'docker compose down -v': -v removes named volumes.",
      "Hint 2: Contrast 'docker compose down' (safe) vs 'docker compose down -v' (destructive).",
      "Hint 3: Explore the 'external: true' volume declaration in Docker Compose.",
      "Hint 4: Review disaster recovery steps using automated snapshots (AWS EBS) or database logical dumps."
    ]),
    recommendedSolution: `### Step-by-Step Incident Analysis & Architectural Safeguards:

1. **Understand What Happened:**
   - \`docker compose down\`: Stops containers and removes containers and networks. **Named volumes are preserved on disk** under \`/var/lib/docker/volumes/\`.
   - \`docker compose down -v\`: **Destroys all named volumes and deletes all files inside them.**
   - In production, running \`-v\` is equivalent to executing \`rm -rf /var/lib/postgresql/data\`.

2. **Immediate Disaster Recovery Protocol:**
   - **Step 1: Stop Writes Immediately:** Run \`docker compose stop\` to prevent new containers from writing empty templates over disk blocks.
   - **Step 2: Check for AWS EBS Snapshots or pg_dump S3 Backups:**
     If running on AWS EC2, check AWS Console for automated EBS Volume Snapshots or S3 backup buckets:
     \`\`\`bash
     aws s3 ls s3://company-db-backups/daily/
     aws s3 cp s3://company-db-backups/daily/db-backup-2026-11-04.sql.gz .
     \`\`\`
   - **Step 3: Restore Database:**
     Create a new volume, extract the SQL dump, and import:
     \`\`\`bash
     docker volume create db_restored
     # Import database dump
     gunzip -c db-backup-2026-11-04.sql.gz | docker run -i --rm -v db_restored:/var/lib/postgresql/data postgres:16-alpine psql -U postgres
     \`\`\`

3. **Architectural Safeguards to Prevent Recurrence Permanently:**
   - **Safeguard 1: Mark Production Volumes as 'external: true' in Compose:**
     \`\`\`yaml
     services:
       db:
         image: postgres:16-alpine
         volumes:
           - prod_pgdata:/var/lib/postgresql/data

     volumes:
       prod_pgdata:
         external: true # COMPOSE WILL REFUSE TO DELETE THIS VOLUME EVEN WITH -v!
     \`\`\`
     *How it works:* An external volume must be created beforehand with \`docker volume create prod_pgdata\`. If anyone runs \`docker compose down -v\`, Compose throws an error and refuses to delete external volumes.
   - **Safeguard 2: CI/CD Pipeline Linting:**
     Add a git pre-commit hook and CI lint check that fails any pull request or deployment script containing \`compose down -v\` or \`compose down --volumes\`.
   - **Safeguard 3: Automated Nightly Backups:**
     Run an automated sidecar container or cron job streaming compressed pg_dump archives to encrypted S3 with Object Lock (WORM).`,
    tagsJson: JSON.stringify(["Docker Compose", "Data Loss", "Named Volumes", "Disaster Recovery", "external: true", "PostgreSQL"])
  }
];

