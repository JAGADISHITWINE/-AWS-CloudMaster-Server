/**
 * Module 18: Docker - Technical Interview Questions & Evaluation Rubrics
 * Sourced from MicroDegree Docker Guide Interview Corners (Sections 1-18)
 */

module.exports = [
  // --- TOPIC 1: Container Internals, Namespaces & Docker Architecture ---
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    title: "What is the Fundamental Unit of Isolation in Virtualization vs Containerization, and What are the 4 Underlying Linux Kernel Features?",
    difficulty: "Intermediate",
    prompt: "In a Senior DevOps interview, the interviewer asks: 'Compare Virtual Machines with Docker Containers at the kernel and architectural level. What is the fundamental unit of isolation in each? Also, explain the 4 specific Linux kernel primitives that make containerization possible without hypervisors.' How do you answer?",
    explanation: "Virtual Machines virtualize physical hardware via a Hypervisor (Type 1 bare-metal like ESXi/KVM or Type 2 hosted like VirtualBox), and their unit of isolation is a complete Guest Operating System with its own kernel. Docker containers virtualize the Operating System, sharing the host Linux kernel directly. Containers are isolated using 4 Linux kernel features: Namespaces (isolation boundary), Control Groups/cgroups (resource metering and quotas), Union File Systems/OverlayFS (layered image assembly with Copy-on-Write), and chroot (filesystem root jailing precursor).",
    hintsJson: JSON.stringify([
      "Hint 1: Contrast the hypervisor layer (hardware abstraction) with the kernel system call layer (OS virtualization).",
      "Hint 2: Name the 6 core Linux namespaces: PID, NET, MNT, IPC, UTS, USER.",
      "Hint 3: Explain what cgroups enforce: CPU shares/quotas, memory limits, and I/O bandwidth.",
      "Hint 4: Describe OverlayFS: lowerdir (read-only layers), upperdir (read-write container layer), and merged view."
    ]),
    recommendedSolution: `### Comprehensive Interview Response:

#### 1. Unit of Isolation: VMs vs Containers
- **Virtual Machines (Hardware Virtualization):**
  - **Unit of Isolation:** Complete Guest OS + Virtual Hardware (Virtual CPU, vRAM, virtual NIC).
  - **Hypervisor:** Type 1 (Bare Metal: VMware ESXi, KVM, Xen, Hyper-V) or Type 2 (Hosted: VirtualBox, VMware Workstation).
  - **Trade-offs:** Heavy footprint (gigabytes per VM), slow boot time (minutes), static memory allocation, but provides hard hardware-level isolation.
- **Docker Containers (Operating System Virtualization):**
  - **Unit of Isolation:** Individual Linux process or process group sharing the host Linux kernel.
  - **Trade-offs:** Extremely lightweight (megabytes), instantaneous startup (milliseconds), dense packing (hundreds per host), but shares kernel vulnerability attack surface.

#### 2. The 4 Underlying Linux Kernel Features:
1. **Linux Namespaces (What the process SEES - Isolation):**
   - **PID Namespace:** Gives the container its own process tree where the main application runs as PID 1.
   - **NET Namespace:** Provides private loopback, virtual interfaces (\`veth\`), IP routing tables, and iptables firewall rules.
   - **MNT Namespace:** Isolates filesystem mount points so the container only sees its own rootfs.
   - **IPC Namespace:** Isolates Inter-Process Communication, POSIX message queues, and shared memory segments.
   - **UTS Namespace:** Isolates hostnames and domain names (\`hostname\` command outputs container ID).
   - **USER Namespace:** Maps container UID/GID to different host UID/GIDs (e.g., container root UID 0 is mapped to host unprivileged UID 100000).

2. **Control Groups (cgroups v1/v2 - What the process CAN USE - Resource Limits):**
   - Meters and enforces hard hardware ceilings:
     - \`cpu.cfs_quota_us\` and \`cpu.cfs_period_us\` (CPU throttling).
     - \`memory.max\` / \`memory.limit_in_bytes\` (RAM limits).
     - \`pids.max\` (Fork-bomb protection).
   - When a container exceeds its memory ceiling, the host kernel invokes the Out-of-Memory (OOM) Killer, terminating the process with Exit Code 137.

3. **Union File System (OverlayFS - How storage is ASSEMBLED):**
   - Combines multiple read-only image layers (\`lowerdir\`) with a single thin ephemeral read-write container layer (\`upperdir\`) into a unified mount point (\`merged\`).
   - Implements **Copy-on-Write (CoW)**: when a file from an image layer is modified, OverlayFS copies the file up to the container's writable layer before modifying it, leaving original layers completely untouched.

4. **chroot (Change Root Jail - Precursor):**
   - The historic Unix system call that changes the apparent root directory (\`/\`) for the current process, preventing access to files outside that directory tree.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Unit of Isolation & Hypervisor Contrast", weight: 30, description: "Explains Guest OS + Hypervisor vs Host Kernel sharing + Process isolation." },
        { name: "Linux Namespaces Depth", weight: 30, description: "Correctly lists and explains at least 4 of the 6 namespaces (PID, NET, MNT, IPC, UTS, USER)." },
        { name: "Cgroups Mechanics & OOMKilled", weight: 20, description: "Explains resource metering (CPU/RAM) and kernel OOM Killer invocation upon threshold breach." },
        { name: "OverlayFS & Copy-on-Write", weight: 20, description: "Details lowerdir, upperdir, merged view, and how CoW prevents image corruption." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Linux Kernel", "Namespaces", "Cgroups", "OverlayFS", "Virtualization"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    title: "Explain Docker's Client-Server Architecture: What is the Exact Division of Labor Between dockerd, containerd, and runc?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'When you type `docker run -d nginx:alpine`, trace the entire execution chain from your keyboard down to the Linux kernel. What is the exact relationship and division of responsibility between the Docker CLI, dockerd, containerd, and runc?' How do you explain this architecture?",
    explanation: "Docker follows a decoupled, modular architecture adhering to Open Container Initiative (OCI) standards. The Docker CLI sends an HTTP REST API call over /var/run/docker.sock to the dockerd daemon. dockerd manages high-level features (CLI API, storage drivers, volume lifecycle, user-defined networks). dockerd calls containerd (high-level runtime daemon) via gRPC. containerd manages image pulls, layer unpacking, and container supervision. containerd spawns runc (OCI reference runtime CLI). runc issues Linux syscalls (clone, setns, cgroups config), hands over execution to the container entrypoint (PID 1), and exits immediately.",
    hintsJson: JSON.stringify([
      "Hint 1: Trace the communication protocols: Unix domain socket REST API -> gRPC -> fork/exec.",
      "Hint 2: Differentiate between high-level runtime (containerd) vs low-level OCI runtime (runc).",
      "Hint 3: Explain why runc is a transient CLI tool that exits after launching the container process.",
      "Hint 4: Mention containerd-shim which stays alive to collect container exit codes and standard I/O."
    ]),
    recommendedSolution: `### Step-by-Step Architecture & Execution Flow:

#### 1. Component Responsibilities:
- **Docker CLI (\`docker\`):**
  - Command-line interface used by engineers.
  - Converts human commands into structured HTTP REST API requests.
- **Docker Daemon (\`dockerd\`):**
  - High-level server daemon listening on \`/var/run/docker.sock\`.
  - Handles authentication, Docker API endpoints, image building (\`docker build\`), bridge networking (\`docker network\`), and volume management.
- **containerd:**
  - Independent, CNCF graduated container runtime supervisor.
  - Handles image downloading/pushing, content-addressable storage, snapshotting (OverlayFS), and container lifecycle state management.
- **containerd-shim:**
  - Lightweight process spawned for each container.
  - Allows daemon restarts without killing running containers; holds open \`stdin\`/\`stdout\`/\`stderr\` and captures container exit codes.
- **runc:**
  - The official OCI (Open Container Initiative) reference implementation of a low-level container runtime.
  - Written in Go, it interacts directly with the Linux kernel.

#### 2. End-to-End Execution Flow (\`docker run -d nginx:alpine\`):
1. **User Command:** User runs \`docker run -d nginx:alpine\`.
2. **REST API Transmission:** Docker CLI translates the command to \`POST /v1.43/containers/create\` and sends it over the Unix domain socket (\`/var/run/docker.sock\`) to \`dockerd\`.
3. **Daemon Delegation:** \`dockerd\` validates credentials, parses network/volume flags, and forwards the container launch request to \`containerd\` over a local **gRPC** socket (\`/run/containerd/containerd.sock\`).
4. **Image & Layer Preparation:** If \`nginx:alpine\` is not cached locally, \`containerd\` pulls layers from the registry, unpacks them via OverlayFS, and creates an OCI runtime bundle consisting of:
   - \`config.json\` (declaring namespaces, cgroups limits, env vars, entrypoint).
   - \`rootfs/\` (the merged container filesystem directory).
5. **Runtime Spawning (runc):** \`containerd\` spawns \`containerd-shim\`, which invokes \`runc create\`.
6. **Kernel Syscall Execution:** \`runc\` reads \`config.json\` and executes Linux system calls:
   - \`clone()\` with flags \`CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS\`.
   - Writes memory/CPU ceiling values into \`/sys/fs/cgroup/\`.
   - Creates virtual ethernet (\`veth\`) pair and configures IP routing.
7. **Process Handover:** \`runc\` executes \`execve()\` to launch \`nginx\` as PID 1 inside the container namespace.
8. **runc Exits:** \`runc\` terminates immediately. \`containerd-shim\` remains as the parent process to supervise the container, stream logs, and report status to \`dockerd\`.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Component Roles (CLI, dockerd, containerd, runc)", weight: 35, description: "Accurately defines the specific boundary and purpose of each component." },
        { name: "IPC Protocols (REST & gRPC)", weight: 20, description: "Identifies Unix socket REST API for CLI->dockerd and gRPC for dockerd->containerd." },
        { name: "OCI Bundle & runc Syscalls", weight: 25, description: "Explains OCI spec (config.json + rootfs) and clone() namespace syscalls." },
        { name: "containerd-shim Role", weight: 20, description: "Explains how containerd-shim allows daemon restarts without stopping containers." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Architecture", "dockerd", "containerd", "runc", "OCI", "containerd-shim"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    title: "Why Does Adding a Regular User to the 'docker' Group Represent a Host Security Risk Equivalent to Passwordless Root?",
    difficulty: "Advanced",
    prompt: "An engineering manager asks: 'Our developers are tired of typing `sudo docker`. Can we just run `sudo usermod -aG docker <developer>` on our shared staging and production EC2 instances?' In an enterprise interview, explain why this is a critical security vulnerability, detail the exact exploit, and discuss secure alternatives.",
    explanation: "Adding a user to the 'docker' group grants read/write permissions to /var/run/docker.sock. Because dockerd runs as root on the host, any user with socket access can launch a container mounting the host's root filesystem ('-v /:/host-root'), granting immediate, unlogged root shell access to modify /etc/shadow, install root backdoors, or alter host system files without ever knowing the sudo password.",
    hintsJson: JSON.stringify([
      "Hint 1: Check permissions of /var/run/docker.sock: srw-rw---- root docker.",
      "Hint 2: Think about what happens when a container mounts host root '/' with read-write access.",
      "Hint 3: Contrast with sudo logging: sudo commands are audited in /var/log/auth.log; docker exec actions bypass host sudo auditing.",
      "Hint 4: Recommend Rootless Docker mode or Podman as enterprise production alternatives."
    ]),
    recommendedSolution: `### Comprehensive Security Analysis & Alternatives:

#### 1. Why the 'docker' Group is Root Equivalent:
- The Docker daemon listens on the Unix socket \`/var/run/docker.sock\`:
  \`\`\`bash
  $ ls -l /var/run/docker.sock
  srw-rw---- 1 root docker 0 Nov  4 10:00 /var/run/docker.sock
  \`\`\`
- Anyone in the \`docker\` group has read and write access to this socket.
- The Docker daemon executes all host operations as **host UID 0 (root)**.
- Therefore, access to the socket is equivalent to unrestricted root API access.

#### 2. The 10-Second Root Escalation Exploit:
An unprivileged user who belongs to the \`docker\` group can trivially obtain a root shell on the host:
\`\`\`bash
# Run an ephemeral container mounting the host's entire root filesystem into /host
docker run --rm -it -v /:/host alpine chroot /host /bin/bash

# You are now the host's root user!
whoami
# Output: root
id
# Output: uid=0(root) gid=0(root)
\`\`\`
The attacker can now:
- View or rewrite \`/etc/shadow\` to change the root password.
- Add an SSH public key directly to \`/root/.ssh/authorized_keys\`.
- Modify \`/etc/sudoers\` to grant themselves permanent \`NOPASSWD: ALL\`.
- All of this occurs completely bypassing host sudo auditing (\`/var/log/auth.log\`).

#### 3. Enterprise Hardening Alternatives:
1. **Rootless Docker Mode:**
   - Runs both \`dockerd\` and containers inside a User Namespace without root privileges.
   - Even if a container mounts host directories or breaks out, the compromised process only has unprivileged rights on the host.
2. **Sudo with Explicit Command Restrictions:**
   - Instead of group membership, allow developers to run specific, pre-vetted commands via \`/etc/sudoers\`:
     \`\`\`text
     %developers ALL=(ALL) /usr/bin/docker ps, /usr/bin/docker logs *
     \`\`\`
3. **Adopt Podman (Daemonless & Rootless by Default):**
   - Podman uses a fork/exec model directly under the user's UID without a centralized root daemon.
   - User root in container maps to unprivileged host user via \`subuid\`/\`subgid\`.
4. **Audit Logging & Socket Protection:**
   - If Docker socket access must be granted in CI, use Docker Socket Proxy (e.g., Tecnativa docker-socket-proxy) to enforce read-only API access and block \`POST /containers/create\` with volume bindings.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Root Equivalence Explanation", weight: 30, description: "Explains socket permissions and daemon UID 0 execution." },
        { name: "Host Root Mount Exploit Demonstration", weight: 30, description: "Details '-v /:/host chroot /host' breakout vector." },
        { name: "Audit Bypass Identification", weight: 20, description: "Explains how socket commands bypass sudo logging (/var/log/auth.log)." },
        { name: "Hardened Alternatives (Rootless/Podman)", weight: 20, description: "Recommends Rootless Docker, Podman, or sudo command filters." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Security", "docker group", "Privilege Escalation", "Rootless Docker", "Podman", "Least Privilege"])
  },

  // --- TOPIC 2: Docker Images, Dockerfile Engineering & Registry Distribution ---
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "Explain CMD vs ENTRYPOINT in Depth: Detail the 3 Syntactic Forms, the Combined Execution Matrix, and the Production Rule of Thumb",
    difficulty: "Intermediate",
    prompt: "In a Docker interview, a very common question is: 'What is the exact difference between CMD and ENTRYPOINT in a Dockerfile? What happens if you define both? How does shell form differ from exec form, and why is shell form dangerous for production containers regarding Linux signals?' How do you answer?",
    explanation: "ENTRYPOINT defines the fixed executable process that will always run as PID 1, while CMD provides default parameters or arguments that can be completely overridden by arguments passed on the 'docker run' CLI. Both instructions have two forms: Exec Form (JSON array: [\"executable\", \"param\"]) which executes directly without a subshell, and Shell Form (plain text: executable param) which executes inside '/bin/sh -c'. Shell form is dangerous in production because the shell becomes PID 1, trapping SIGTERM and preventing graceful shutdown.",
    hintsJson: JSON.stringify([
      "Hint 1: JSON array syntax [\"...\"] is Exec Form; plain string syntax is Shell Form.",
      "Hint 2: In Shell Form, the process is spawned under /bin/sh -c, which does NOT forward SIGTERM to child processes.",
      "Hint 3: Understand the combined execution matrix when both ENTRYPOINT and CMD are present.",
      "Hint 4: State the one-sentence golden rule of thumb for production Dockerfiles."
    ]),
    recommendedSolution: `### Deep Dive: CMD vs ENTRYPOINT

#### 1. Shell Form vs Exec Form:
- **Exec Form (Mandatory for Production):**
  \`\`\`dockerfile
  ENTRYPOINT ["node", "server.js"]
  CMD ["--port=3000"]
  \`\`\`
  - Syntax is a valid JSON array of strings with double quotes.
  - The binary is executed directly via \`execve()\` as **PID 1**.
  - **Signal Handling:** When \`docker stop\` sends \`SIGTERM\`, the application receives the signal directly, allowing clean connection draining and database transaction commits.
- **Shell Form (Anti-Pattern):**
  \`\`\`dockerfile
  CMD node server.js
  \`\`\`
  - Under the hood, Docker executes: \`/bin/sh -c "node server.js"\`.
  - \`/bin/sh\` becomes PID 1, and your application is a child process.
  - **Signal Bug:** Standard Unix shells do **NOT** forward \`SIGTERM\` to child processes. When you run \`docker stop\`, your app never knows it was stopped. It hangs for 10 seconds until Docker issues an abrupt, uncatchable \`SIGKILL\`, risking database corruption and data loss.

#### 2. The Combined Execution Matrix:
When both are defined in a Dockerfile:
| Dockerfile Definition | CLI Arguments Passed at Runtime | Effective Executed Command |
| :--- | :--- | :--- |
| \`ENTRYPOINT ["python", "app.py"]\`<br>\`CMD ["--workers=4"]\` | \`docker run my-image\` | \`python app.py --workers=4\` |
| \`ENTRYPOINT ["python", "app.py"]\`<br>\`CMD ["--workers=4"]\` | \`docker run my-image --debug\` | \`python app.py --debug\` *(CMD replaced!)* |
| \`CMD ["nginx", "-g", "daemon off;"]\` | \`docker run my-image sh\` | \`sh\` *(CMD completely replaced)* |
| \`ENTRYPOINT ["nginx", "-g", "daemon off;"]\` | \`docker run my-image sh\` | \`nginx -g "daemon off;" sh\` *(Fails!)* |

- Notice that CLI arguments at runtime **override CMD**, but are **appended to ENTRYPOINT**!
- To override an ENTRYPOINT, you must explicitly pass the \`--entrypoint\` flag:
  \`docker run --entrypoint sh -it my-image\`

#### 3. Golden Rule of Thumb:
> **"Use ENTRYPOINT for the fixed executable binary that should never change, and use CMD for the default arguments that developers or operators might want to override at runtime."**`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Exec Form vs Shell Form Mechanics", weight: 30, description: "Explains JSON array vs /bin/sh -c execution." },
        { name: "SIGTERM Signal Handling Failure in Shell Form", weight: 30, description: "Details PID 1 shell blocking SIGTERM, causing 10s timeout and SIGKILL." },
        { name: "Combined Execution Matrix & CLI Overrides", weight: 25, description: "Explains how CLI args override CMD and append to ENTRYPOINT." },
        { name: "Production Rule of Thumb", weight: 15, description: "Articulates the standard industry design pattern for container entrypoints." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Dockerfile", "CMD vs ENTRYPOINT", "Exec Form", "Signals", "SIGTERM"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "How Does Docker's Layer Caching Algorithm Decide When to Reuse Layers, and Why Does Instruction Ordering Dictate Build Speed?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Explain exactly how the Docker layer cache works during `docker build`. How does Docker determine whether a layer can be reused from cache for RUN, COPY, and ADD instructions? Why does a single line change in your source code sometimes invalidate subsequent dependencies, and how do you design Dockerfiles to maximize cache hit rates?'",
    explanation: "Docker images are built as a directed acyclic graph of immutable filesystem layers. During build, Docker evaluates instructions sequentially. For non-file commands (RUN, ENV, WORKDIR), it compares the instruction string against parent layer cache. For file commands (COPY, ADD), it calculates cryptographic SHA256 checksums of the files being transferred. If a cache miss occurs, that layer and ALL subsequent layers are invalidated (marked dirty) and must be executed from scratch.",
    hintsJson: JSON.stringify([
      "Hint 1: Non-file instructions (RUN) compare instruction string only.",
      "Hint 2: File copy instructions (COPY/ADD) compare file contents SHA256 checksums.",
      "Hint 3: Invalidation is sequential: once one layer misses, every downstream layer is invalidated.",
      "Hint 4: Order instructions from least-frequently changing (OS packages, dependencies) to most-frequently changing (code)."
    ]),
    recommendedSolution: `### Docker Layer Caching Mechanics & Optimization:

#### 1. How Docker Evaluates Cache per Instruction:
- **For Non-File Instructions (\`RUN\`, \`ENV\`, \`WORKDIR\`, \`EXPOSE\`):**
  - Docker compares the exact text of the instruction string against existing cached layers originating from the same parent layer.
  - *Example:* If \`RUN apt-get update && apt-get install -y curl\` is unchanged, Docker prints \`Using cache\` and skips execution.
  - *Caveat:* Docker does **NOT** check external package repositories! Even if curl 8.5 was released upstream yesterday, Docker will reuse the cached layer from last week because the command string did not change.
- **For File Instructions (\`COPY\` and \`ADD\`):**
  - Docker computes the **SHA256 checksum** of every file being copied from the build context.
  - It compares these checksums against the checksums stored in the cached layer.
  - If file contents, file permissions, or ownership differ, the cache is invalidated.

#### 2. The Cascading Cache Invalidation Rule:
- Cache invalidation is strictly **sequential and downstream**.
- If Step 3 in a 10-step Dockerfile is invalidated, **Step 4 through Step 10 are automatically invalidated**—even if their instructions did not change at all.

#### 3. Anti-Pattern vs Cache-Optimized Pattern:
- **The 45-Minute CI Anti-Pattern:**
  \`\`\`dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY . .                 # BUSTS CACHE ON EVERY SINGLE CODE COMMIT!
  RUN npm install          # Must reinstall 1,200 npm modules every time!
  CMD ["node", "index.js"]
  \`\`\`
  Because \`COPY . .\` includes application code that changes with every commit, its SHA256 changes every build. This invalidates \`RUN npm install\`, forcing a fresh 10-minute network download on every pipeline run.

- **The Cache-Optimized Production Pattern:**
  \`\`\`dockerfile
  FROM node:20-alpine
  WORKDIR /app

  # Step 1: Copy ONLY dependency manifests (Changes infrequently)
  COPY package.json package-lock.json ./

  # Step 2: Install dependencies (Uses cache 98% of the time!)
  RUN npm ci --only=production

  # Step 3: Copy frequently changing application source code
  COPY . .

  USER node
  CMD ["node", "index.js"]
  \`\`\`
  Now, when developers modify a JavaScript or TypeScript file, Steps 1 and 2 output \`Using cache\`. The build jumps straight to Step 3, completing in 2 seconds instead of 10 minutes.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "String Matching vs File Checksum Rules", weight: 35, description: "Explains command string match for RUN vs SHA256 file checksums for COPY/ADD." },
        { name: "Cascading Downstream Invalidation", weight: 25, description: "Explains that a single cache miss invalidates all subsequent steps." },
        { name: "External Repository Stale Cache Caveat", weight: 15, description: "Notes that RUN apt-get install does not re-query upstream mirrors if string matches." },
        { name: "Instruction Ordering Optimization", weight: 25, description: "Demonstrates separating manifest copy from source copy to optimize build times." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Layer Caching", "Build Optimization", "SHA256", "CI/CD Speed", "Dockerfile"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    title: "Why Does Pushing an Updated Version of an Image Complete Significantly Faster Than the Initial Push? (Content-Addressable Layer Deduplication)",
    difficulty: "Intermediate",
    prompt: "A junior engineer observes: 'When I pushed our 500MB container image to AWS ECR / Docker Hub the first time, it took 4 minutes. But when I changed one line of code, built v2, and pushed it, the push completed in 4 seconds. How does Docker's storage model and registry distribution protocol achieve this?'",
    explanation: "Docker images are stored as a stack of independent, immutable filesystem layers, each identified by a cryptographic SHA256 content digest (content-addressable storage). When executing 'docker push', the Docker client negotiates with the registry using the OCI Distribution Specification: it queries whether each layer's SHA256 hash already exists on the registry. Layers already present return 'Layer already exists' and are skipped entirely. Only the newly generated diff layer is transmitted across the network.",
    hintsJson: JSON.stringify([
      "Hint 1: Images are stacks of immutable read-only layers.",
      "Hint 2: Each layer has a unique SHA256 digest based on its exact filesystem tar content.",
      "Hint 3: Explain the OCI Distribution API HEAD request handshake.",
      "Hint 4: Note cross-repository layer sharing within the same registry."
    ]),
    recommendedSolution: `### Content-Addressable Storage & Registry Deduplication:

#### 1. Cryptographic Content-Addressable Storage:
- When a layer is built, Docker packages its filesystem diff into a compressed tarball and computes its **SHA256 cryptographic digest** (e.g. \`sha256:7b5a83...\`).
- If two different images share the exact same base OS (e.g. \`alpine:3.19\`) or dependency layer, that layer produces the **identical SHA256 hash**.

#### 2. The OCI Registry Push Handshake Protocol:
When you run \`docker push my-registry.com/app:v2\`:
1. **Manifest Parsing:** The client inspects the local image manifest, which contains a list of layer digests ordered from bottom to top.
2. **Registry Query (HEAD Request):** For each layer digest, the Docker client sends an HTTP \`HEAD /v2/<name>/blobs/<digest>\` request to the registry.
3. **Layer Existence Check:**
   - If the registry already possesses that blob (from v1 or another image in the account), it responds with \`HTTP 200 OK\`.
   - The CLI displays: \`7b5a83...: Layer already exists\`.
   - **Zero bytes are transmitted over the network for this layer.**
4. **Delta Upload:** If the registry responds with \`HTTP 404 Not Found\` (which occurs only for the modified application code layer), the client uploads only that specific blob via \`POST /v2/<name>/blobs/uploads/\`.
5. **Manifest Commit:** Finally, a tiny (few kilobytes) JSON manifest listing all layer hashes is pushed and tagged as \`v2\`.

#### 3. Enterprise Benefits:
- **Bandwidth & Speed:** Up to 99% reduction in data transfer during continuous deployment cycles.
- **Storage Deduplication:** On AWS ECR or Harbor, layers shared across 50 microservices are stored physically only once on S3/disk.
- **Instant Rollbacks:** Rolling back to a previous image version takes milliseconds because all previous layers are already present on the container host.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Content-Addressable SHA256 Digests", weight: 30, description: "Explains how layer content dictates its cryptographic hash." },
        { name: "Registry Handshake Protocol (HEAD request)", weight: 35, description: "Details OCI Distribution API checking blob existence before uploading." },
        { name: "Delta Transfer Mechanics", weight: 20, description: "Explains that only modified diff layers are transferred." },
        { name: "Storage & Rollback Benefits", weight: 15, description: "Highlights deduplication on AWS ECR/Harbor and rapid rollbacks." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Hub", "AWS ECR", "Registry", "OCI Distribution Spec", "SHA256", "Layer Deduplication"])
  },

  // --- TOPIC 3: Docker Networking, Storage Volumes & Multi-Container Docker Compose Stacks ---
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "Why is a User-Defined Bridge Network Strongly Recommended Over Docker's Default Bridge Network for Multi-Container Communication?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'When running multiple containers on a single Docker host, what is the architectural difference between Docker's default bridge network (`docker0`) and a user-defined bridge network created with `docker network create`? Why should production applications never rely on the default bridge?'",
    explanation: "Docker's default bridge network ('docker0') is a legacy virtual switch that does not provide automatic DNS resolution; containers on the default bridge can only reach each other via IP address or deprecated '--link' flags. User-defined bridge networks feature an embedded Docker DNS resolver (at 127.0.0.11) that automatically resolves container names and service aliases. Additionally, user-defined bridges provide complete network isolation, support dynamic container attachment/detachment without reboot, and provide configurable MTU and subnet settings.",
    hintsJson: JSON.stringify([
      "Hint 1: Default bridge lacks automatic DNS resolution by container name.",
      "Hint 2: User-defined bridge runs an embedded DNS resolver at 127.0.0.11.",
      "Hint 3: All containers join default bridge by default, exposing unrelated apps to packet sniffing.",
      "Hint 4: User-defined bridges can be dynamically connected and disconnected at runtime."
    ]),
    recommendedSolution: `### Architectural Comparison: Default Bridge vs User-Defined Bridge

#### 1. Core Architectural Differences:
| Feature | Default Bridge (\`docker0\`) | User-Defined Bridge (\`docker network create\`) |
| :--- | :--- | :--- |
| **DNS Resolution** | **NO automatic DNS**. Containers must use fragile IP addresses or obsolete \`--link\`. | **Automatic DNS**. Embedded resolver at \`127.0.0.11\` resolves container names and aliases. |
| **Network Isolation** | **Zero isolation**. All containers without \`--network\` join \`docker0\`, allowing unauthenticated lateral access. | **Strict isolation**. Only containers attached to the same custom bridge can communicate. |
| **Dynamic Attachment** | Cannot connect/disconnect running containers; must destroy and recreate container. | Containers can be connected and disconnected dynamically on-the-fly via \`docker network connect\`. |
| **Configuration** | Uses fixed host-level \`docker0\` parameters; altering requires restarting the Docker daemon. | Fully customizable per network: custom subnets (\`--subnet\`), gateways (\`--gateway\`), and MTU. |
| **Environment Sharing** | Legacy \`--link\` injects static environment variables that do not update on restart. | DNS queries update dynamically whenever container IPs change. |

#### 2. The Embedded DNS Resolver Mechanics:
- When a container connects to a user-defined bridge, Docker configures its internal resolver:
  \`\`\`bash
  $ docker exec my-app cat /etc/resolv.conf
  nameserver 127.0.0.11
  options ndots:0
  \`\`\`
- Whenever your application makes an HTTP request to \`http://database:5432\`, the Linux kernel forwards the DNS query to Docker's embedded DNS server on \`127.0.0.11:53\`.
- Docker resolves \`database\` to its current dynamic container IP (e.g. \`172.20.0.4\`).
- If the database container restarts and acquires a new IP (\`172.20.0.7\`), Docker's DNS server updates immediately—no application configuration restart required!

#### 3. Security Implication for Production:
On the default bridge, every single container you test or deploy shares the same broadcast domain. A compromised test container can sniff traffic or scan ports of sensitive production database containers co-located on the same host. User-defined bridges ensure that frontend, backend, and database networks remain strictly compartmentalized.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Automatic DNS Resolution (127.0.0.11)", weight: 35, description: "Explains embedded DNS server vs lack of DNS on default bridge." },
        { name: "Network Isolation & Compartmentalization", weight: 25, description: "Details risk of multi-tenant co-location on default bridge." },
        { name: "Dynamic Connection Capabilities", weight: 20, description: "Explains connecting running containers without restarts." },
        { name: "Custom Subnet & MTU Control", weight: 20, description: "Mentions CIDR/gateway customizability for enterprise networking." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Networking", "Default Bridge", "User-Defined Bridge", "Docker DNS", "127.0.0.11", "Network Security"])
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "What Real Problem Does Docker Compose Solve, and Why Doesn't 'depends_on' Guarantee Application Readiness?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Why do we need Docker Compose if we already have the Docker CLI? In a multi-service Compose stack, why is writing `depends_on: - postgres` insufficient to prevent application crashes on boot, and how do you solve this in Docker Compose V2?'",
    explanation: "Docker Compose provides declarative, version-controlled multi-container lifecycle management, replacing complex, brittle 20-line 'docker run' shell scripts with a standardized YAML file (compose.yaml). However, 'depends_on' by default only waits for the dependency container process to start (PID 1 alive), not for the application inside (like Postgres or MySQL) to complete initialization and open its TCP listening port. In Compose V2, this is solved by combining service 'healthcheck' definitions with 'depends_on: <service>: condition: service_healthy'.",
    hintsJson: JSON.stringify([
      "Hint 1: Contrast imperative docker run commands with declarative compose.yaml specifications.",
      "Hint 2: Understand the difference between container 'Started' (PID 1 running) and application 'Ready' (listening on socket).",
      "Hint 3: Explain the 'healthcheck' directive in Docker Compose.",
      "Hint 4: Use 'condition: service_healthy' under depends_on."
    ]),
    recommendedSolution: `### Comprehensive Analysis: Docker Compose & Readiness Orchestration

#### 1. What Real Problem Docker Compose Solves:
- **The Imperative CLI Hell:**
  Running a 3-tier microservice without Compose requires executing sequential shell commands:
  \`\`\`bash
  docker network create app-net
  docker volume create db-data
  docker run -d --name db --network app-net -v db-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16
  docker run -d --name redis --network app-net redis:alpine
  docker run -d --name api --network app-net -p 3000:3000 -e DB_HOST=db -e REDIS_HOST=redis my-api:1.0
  \`\`\`
  This approach is error-prone, untracked in Git, difficult to share with teammates, and requires writing custom teardown scripts.
- **The Declarative Solution:**
  Docker Compose captures networks, volumes, environment variables, restart policies, and healthchecks in a single \`compose.yaml\` file. One command (\`docker compose up -d\`) launches the entire environment reproducibly on any laptop or CI runner.

#### 2. The 'depends_on' Readiness Trap:
- **How Developers Misunderstand \`depends_on\`:**
  Developers assume \`depends_on: [db]\` means: *"Wait until Postgres is fully booted and accepting SQL queries before starting the API."*
- **What \`depends_on\` Actually Does:**
  It only checks if the container has transitioned to the \`Running\` state (meaning \`dockerd\` spawned the container and PID 1 started).
- **The Race Condition:**
  PostgreSQL takes 5–15 seconds to initialize the data directory, replay WAL files, and bind to port 5432.
  Meanwhile, the Node.js/Python API starts in 500 milliseconds and attempts an immediate database connection.
  The connection is actively refused, causing the API to crash and enter a failure loop.

#### 3. The Production Solution (Healthchecks + Condition):
In Docker Compose V2, you must combine a database healthcheck with \`condition: service_healthy\`:
\`\`\`yaml
services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      database:
        condition: service_healthy  # BLOCKS API UNTIL POSTGRES ACCEPTS CONNECTIONS!
\`\`\`
- \`pg_isready\`: Checks if the server is actually ready to accept client connections.
- \`condition: service_healthy\`: Instructs Compose to hold the API service in a pending state until the database healthcheck transitions to \`healthy\`.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Declarative Value of Compose", weight: 30, description: "Explains Git-tracked declarative YAML vs imperative shell scripts." },
        { name: "depends_on Limitation (Started vs Ready)", weight: 35, description: "Explains container PID 1 start vs database initialization lag." },
        { name: "Healthcheck Implementation Syntax", weight: 20, description: "Defines pg_isready/test, interval, timeout, and retries." },
        { name: "condition: service_healthy Gateway", weight: 15, description: "Shows correct Compose V2 syntax to enforce true startup gating." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Compose", "depends_on", "HEALTHCHECK", "Race Conditions", "Microservices", "Orchestration"])
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    title: "Named Volumes vs Bind Mounts vs tmpfs: Detail Their Underlying Storage Architecture, Host Paths, and Production Use Cases",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Compare Docker's 3 primary storage mechanisms: Named Volumes, Bind Mounts, and tmpfs mounts. Where does each store data on the host filesystem? How do their lifecycles compare to the container's ephemeral writable layer, and what is the ideal production use case for each?'",
    explanation: "Docker containers by default write to an ephemeral Copy-on-Write (CoW) upper layer managed by OverlayFS, which is deleted when the container is removed. Persistent data requires Docker Named Volumes (stored in /var/lib/docker/volumes/<name>/_data, managed by Docker, ideal for production databases), Bind Mounts (maps any arbitrary host file or directory directly, ideal for local development code reload), or tmpfs mounts (stores data purely in host RAM, ideal for sensitive secrets or ultra-high-speed scratch caches).",
    hintsJson: JSON.stringify([
      "Hint 1: Named Volumes live in /var/lib/docker/volumes/ and bypass the OverlayFS CoW layer.",
      "Hint 2: Bind Mounts rely on exact host directory paths (e.g. /home/user/project).",
      "Hint 3: tmpfs is volatile and writes directly to host system memory (RAM).",
      "Hint 4: Relate each mount type to a specific use case: production DB, dev hot-reload, secret tokens."
    ]),
    recommendedSolution: `### Storage Mechanics: Volumes vs Bind Mounts vs tmpfs

#### 1. Detailed Architectural Comparison:
| Storage Type | Host Storage Location | Managed By | Survives Container Deletion? | Ideal Production Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Container Layer (CoW)** | \`/var/lib/docker/overlay2/<id>/diff\` | OverlayFS Storage Driver | **NO** (Deleted with container) | Ephemeral application logs, temporary scratch files. |
| **Named Volume** | \`/var/lib/docker/volumes/<name>/_data\` | Docker Daemon | **YES** (Must be explicitly deleted) | **Production stateful databases** (PostgreSQL, MySQL, Redis, MongoDB). |
| **Bind Mount** | Any arbitrary host path (e.g. \`/data/app\` or \`$(pwd)\`) | Host OS Filesystem | **YES** (Files exist independently on host) | **Local developer code hot-reloading**, host configuration file mounting (\`/etc/hosts\`). |
| **tmpfs Mount** | Host System RAM (Memory only) | Linux Kernel Virtual Memory | **NO** (Cleared on container stop) | **Sensitive credentials/keys**, high-frequency session state, scratch processing. |

#### 2. Performance & The Copy-on-Write (CoW) Difference:
- **Why Database Engines Hate Ephemeral Container Storage:**
  - Writing inside the container's default filesystem forces every write to traverse the OverlayFS Copy-on-Write driver.
  - This introduces significant write latency and CPU overhead, degrading database I/O performance.
- **Why Named Volumes are Fast:**
  - Both Named Volumes and Bind Mounts **completely bypass the OverlayFS driver**.
  - System calls (\`read()\`, \`write()\`) execute at native Linux host kernel speed directly against the block device.

#### 3. Best Practices & Caveats:
- **Named Volumes (Production Standard):**
  - Portable across environments; does not depend on host directory hierarchies.
  - Can be easily backed up, migrated, or encrypted using Docker volume plugins (e.g. AWS EBS volume driver).
  - *Risk:* Accidental deletion via \`docker compose down -v\` (mitigate with \`external: true\`).
- **Bind Mounts (Development Standard):**
  - Allows live editing: editing code on your laptop immediately reflects inside the container without rebuilding the image.
  - *Risk in Production:* High security risk! Mounting host directories grants the container access to host files and creates permission headaches (\`EACCES\`) if host and container UIDs differ.
- **tmpfs (Security Standard for Secrets):**
  - Guarantees that sensitive secrets, decryption keys, or ephemeral JWTs are **never flushed to physical host storage media**, mitigating forensic data recovery risks.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Host Location & Lifecycle Comparison", weight: 35, description: "Identifies /var/lib/docker/volumes vs arbitrary host path vs RAM." },
        { name: "OverlayFS CoW Bypass & Performance", weight: 25, description: "Explains how volumes bypass the Copy-on-Write layer for native disk I/O." },
        { name: "Use Case Mapping (DB vs Dev vs Secrets)", weight: 25, description: "Maps Named Volume->DB, Bind Mount->Dev, tmpfs->Secrets." },
        { name: "Security & Disaster Risks", weight: 15, description: "Highlights bind mount privilege risk and volume -v deletion risk." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker Storage", "Named Volumes", "Bind Mounts", "tmpfs", "OverlayFS", "Database Persistence"])
  }
];

