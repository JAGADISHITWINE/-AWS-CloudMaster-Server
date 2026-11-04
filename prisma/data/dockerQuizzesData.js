/**
 * Module 18: Docker - Interactive Assessment Quizzes
 * Sourced from MicroDegree Docker Guide (Concept Review & Chapter Summaries)
 */

module.exports = [
  // --- TOPIC 1: Container Internals, Namespaces & Docker Architecture ---
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Type 1 vs Type 2 Hypervisors in Cloud Virtualization",
    prompt: "Which of the following correctly pairs a hypervisor type with its architectural definition and real-world example?",
    explanation: "Type 1 (Bare Metal) hypervisors run directly on the physical hardware without a host OS (e.g., VMware ESXi, KVM, Xen, Hyper-V). Type 2 (Hosted) hypervisors run as software applications on top of an existing host OS (e.g., VMware Workstation, Oracle VirtualBox).",
    hintsJson: JSON.stringify(["Type 1 has direct hardware access for enterprise data centers; Type 2 runs on top of a desktop OS like macOS or Windows."]),
    options: [
      {
        optionKey: "A",
        optionText: "Type 1 runs on top of Windows 11 (e.g. VirtualBox); Type 2 runs directly on bare metal (e.g. ESXi).",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Type 1 runs directly on bare metal hardware (e.g. VMware ESXi, KVM); Type 2 runs on top of a host OS (e.g. VirtualBox, VMware Workstation).",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Type 1 is another name for Docker containers; Type 2 is another name for Kubernetes pods.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Both Type 1 and Type 2 hypervisors share the host Linux kernel directly with all guest applications.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Linux Kernel Namespaces Isolation Boundaries",
    prompt: "Which Linux kernel namespace is responsible for isolating hostnames and domain names, allowing each container to have its own unique system hostname?",
    explanation: "The UTS (UNIX Timesharing System) namespace isolates hostnames and NIS domain names. When you run a container, Docker assigns the container ID or custom name as the hostname inside this isolated namespace.",
    hintsJson: JSON.stringify(["Think of the system call uname() or setting a system hostname."]),
    options: [
      {
        optionKey: "A",
        optionText: "PID (Process ID) Namespace",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "NET (Network) Namespace",
        isCorrect: false
      },
      {
        optionKey: "C",
        optionText: "UTS (UNIX Timesharing System) Namespace",
        isCorrect: true
      },
      {
        optionKey: "D",
        optionText: "MNT (Mount) Namespace",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Container Termination with Exit Code 137",
    prompt: "A container running an intensive batch processing job suddenly stops. Running 'docker inspect' shows ExitCode: 137. What does this exit code specifically indicate?",
    explanation: "Exit Code 137 indicates 128 + 9 (SIGKILL). In Docker environments, this almost always means the Linux kernel Out-Of-Memory (OOM) Killer terminated the container's process because its memory consumption exceeded the allocated cgroup ceiling.",
    hintsJson: JSON.stringify(["Standard Unix exit code formula: 128 + Signal Number. Signal 9 is SIGKILL."]),
    options: [
      {
        optionKey: "A",
        optionText: "The container process completed successfully with status 0 and returned a hash code.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "The Linux kernel Out-Of-Memory (OOM) Killer forcefully terminated the process (128 + 9 SIGKILL) for exceeding cgroup memory limits.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "The Dockerfile had a syntax error in the ENTRYPOINT array.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "The container's bridge network IP address had a subnet conflict with the host router.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Docker Client-Server Communication Protocol",
    prompt: "By default on a Linux system, how does the Docker CLI client communicate with the Docker daemon (dockerd)?",
    explanation: "The Docker CLI communicates with dockerd using an HTTP REST API over a local Unix domain socket located at /var/run/docker.sock.",
    hintsJson: JSON.stringify(["It uses a local IPC mechanism represented by a special file under /var/run/."]),
    options: [
      {
        optionKey: "A",
        optionText: "Over public TCP port 80 using standard unencrypted HTTP.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Via an HTTP REST API over the local Unix domain socket '/var/run/docker.sock'.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Through SSH tunneling on port 22 directly into the container namespace.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "By writing flat YAML files into /etc/docker/jobs/ on the host disk.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Security Risk of Adding Users to the 'docker' Group",
    prompt: "Why is adding a developer's regular user account to the 'docker' group on a shared production host considered equivalent to granting full passwordless root access?",
    explanation: "Members of the 'docker' group have read/write access to /var/run/docker.sock. Because dockerd runs as root, any user with socket access can run 'docker run -v /:/host alpine chroot /host' to gain unrestricted root access over the host's files, including /etc/shadow and /etc/sudoers.",
    hintsJson: JSON.stringify(["Think about what happens when a container mounts the host root directory '/'."]),
    options: [
      {
        optionKey: "A",
        optionText: "Because Docker automatically alters /etc/passwd and changes the user's UID to 0 upon login.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Any user with access to the Docker socket can launch a container mounting the host's root filesystem ('-v /:/host') and modify system files with root privileges.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "The 'docker' group disables all Linux kernel cgroups and allows unlimited memory allocation.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "It exposes SSH keys stored in the user's ~/.ssh folder to Docker Hub public registries.",
        isCorrect: false
      }
    ]
  },

  // --- TOPIC 2: Docker Images, Dockerfile Engineering & Registry Distribution ---
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "CMD vs ENTRYPOINT Combined Execution Matrix",
    prompt: "Given the following Dockerfile instructions:\nENTRYPOINT [\"python\", \"app.py\"]\nCMD [\"--workers=2\"]\n\nIf an operator executes 'docker run my-app:1.0 --workers=8', what command is actually executed inside the container?",
    explanation: "When both ENTRYPOINT and CMD are present in exec form, CMD supplies the default arguments to the ENTRYPOINT binary. Supplying CLI arguments on 'docker run' completely overrides CMD. Therefore, 'python app.py' runs with the overridden argument '--workers=8'.",
    hintsJson: JSON.stringify(["CLI arguments override CMD, but append to ENTRYPOINT."]),
    options: [
      {
        optionKey: "A",
        optionText: "python app.py --workers=2 --workers=8",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "python app.py --workers=8",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "--workers=8 (The entrypoint is ignored)",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "The container fails to start due to conflicting argument definitions.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Exec Form vs Shell Form Signal Handling (SIGTERM)",
    prompt: "Why is the Exec Form ('CMD [\"executable\", \"param\"]') strongly recommended over the Shell Form ('CMD executable param') for production Dockerfiles?",
    explanation: "In Shell Form, Docker wraps the command inside '/bin/sh -c', making the shell PID 1. Standard Unix shells do not forward SIGTERM to child processes, preventing the application from performing graceful connection draining during 'docker stop' until it is killed forcefully with SIGKILL after 10 seconds.",
    hintsJson: JSON.stringify(["Consider how Linux signals (SIGTERM) are handled when a shell wraps your application."]),
    options: [
      {
        optionKey: "A",
        optionText: "Shell Form produces larger image layers because it compiles bash from source.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Exec Form executes directly as PID 1, allowing the process to receive SIGTERM signals and shut down gracefully.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Exec Form is required because Docker does not support Linux shells in containers.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Shell Form cannot read environment variables defined with ENV.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Beginner",
    title: "ARG vs ENV Instruction Scope",
    prompt: "What is the primary difference between the ARG and ENV instructions in a Dockerfile?",
    explanation: "ARG defines variables that are available only during the image build process ('docker build --build-arg') and do not persist in the final image or running container. ENV defines persistent environment variables that remain accessible during both build time and in the running container.",
    hintsJson: JSON.stringify(["One is strictly build-time; the other persists into the running container runtime."]),
    options: [
      {
        optionKey: "A",
        optionText: "ARG is used for numeric values; ENV is used for string values.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "ARG variables exist only during build time; ENV variables persist in the image metadata and running container environment.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "ARG variables are encrypted with AWS KMS; ENV variables are stored in plain text.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "ENV instructions cannot be overridden at runtime by 'docker run -e'.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "COPY vs ADD Instruction Discipline",
    prompt: "Why do Docker official best practices recommend using COPY instead of ADD for transferring local files into an image?",
    explanation: "COPY performs a predictable, literal byte-for-byte copy of local files. ADD includes unexpected side-effects: it automatically extracts local tar archives (which may corrupt files if unexpected) and attempts to download remote URLs without cache optimization.",
    hintsJson: JSON.stringify(["ADD has 'magical' auto-decompression features that can introduce unintended behavior."]),
    options: [
      {
        optionKey: "A",
        optionText: "ADD is deprecated in Docker 20+ and will cause builds to fail immediately.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "COPY is transparent and copies files literally, whereas ADD auto-extracts tar archives and fetches remote URLs, risking unintended behavior.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "COPY runs as non-root user by default, while ADD always runs as root.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "ADD does not support copying entire directories.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Alpine musl libc vs Debian glibc Incompatibility",
    prompt: "A Python development team switches from 'python:3.11-slim' to 'python:3.11-alpine'. Their builds for services using NumPy, Pandas, and Cryptography take 30 minutes to complete or fail to start. What is the fundamental technical reason?",
    explanation: "Alpine Linux uses musl libc instead of the standard GNU C Library (glibc). Most pre-compiled Python binary wheels on PyPI are built for glibc (manylinux). On Alpine, pip cannot use pre-compiled wheels and must download source tarballs and compile all C extensions from scratch.",
    hintsJson: JSON.stringify(["Look at the C standard library implementation differences between Alpine and Debian."]),
    options: [
      {
        optionKey: "A",
        optionText: "Alpine Linux does not support Python 3.11 runtimes.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Alpine uses musl libc instead of glibc; pre-compiled manylinux binary wheels on PyPI require glibc, forcing pip to compile from C source.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Alpine Linux requires all Python packages to be signed with Apple Developer certificates.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "The Alpine package manager (apk) permanently disables compiling C extensions.",
        isCorrect: false
      }
    ]
  },

  // --- TOPIC 3: Docker Networking, Storage Volumes & Multi-Container Docker Compose Stacks ---
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Default Bridge vs User-Defined Bridge DNS Resolution",
    prompt: "You start two containers, 'web' and 'api', on Docker's default bridge network ('docker0'). When 'web' tries to connect to 'http://api:8080', DNS resolution fails ('getaddrinfo ENOTFOUND api'). How do you enable automatic container name resolution?",
    explanation: "Docker's default bridge network ('docker0') does NOT provide automatic DNS resolution. Connecting the containers to a user-defined custom bridge network enables Docker's embedded DNS server (127.0.0.11), which automatically resolves container names and service aliases.",
    hintsJson: JSON.stringify(["The default bridge requires legacy --link, while custom bridge networks have built-in DNS."]),
    options: [
      {
        optionKey: "A",
        optionText: "Hardcode the public IP address of the AWS EC2 host inside /etc/hosts.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Create and connect both containers to a user-defined custom bridge network ('docker network create my-net').",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Restart the Docker daemon with the '--allow-all-dns' flag.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Change the container names to match their respective host MAC addresses.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Docker Compose 'depends_on' Startup vs Readiness",
    prompt: "In a Docker Compose file, you configure your web service with 'depends_on: - db'. Upon running 'docker compose up', your web service immediately crashes with 'Connection Refused: db:5432'. Why did this happen?",
    explanation: "'depends_on' only waits for the database container process to start running (PID 1 alive), not for the database engine to finish initialization, replay transaction logs, and open its listening TCP port.",
    hintsJson: JSON.stringify(["Process start does not equal application TCP listening readiness."]),
    options: [
      {
        optionKey: "A",
        optionText: "The 'depends_on' instruction was deprecated in Compose V2 and is completely ignored.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "'depends_on' only waits for the db container to start, not for the database software to finish initializing and accept TCP connections.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "The web container was built with an invalid ENTRYPOINT.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Docker Compose automatically blocks all port traffic between services unless 'expose' is specified.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Docker Compose Healthcheck Readiness Gating",
    prompt: "In Docker Compose V2, how do you correctly configure a service to wait until a dependent database is actually healthy and accepting queries before starting?",
    explanation: "You define a 'healthcheck' block on the database service (e.g. pg_isready) and update the dependent service's 'depends_on' to use: 'depends_on: db: condition: service_healthy'.",
    hintsJson: JSON.stringify(["Look for the condition attribute under depends_on."]),
    options: [
      {
        optionKey: "A",
        optionText: "Set 'sleep 30' in the web service command before starting the app.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Define a 'healthcheck' on the database and specify 'depends_on: <service>: condition: service_healthy' in the dependent service.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Use the '--wait-for-port' flag in 'docker compose up --wait-for-port 5432'.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Run the database on the host network and the web app on the bridge network.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Disaster Risk of 'docker compose down -v'",
    prompt: "What is the critical consequence of executing 'docker compose down -v' on a staging or production server?",
    explanation: "The '-v' (or '--volumes') flag instructs Docker Compose to delete all named volumes defined in the 'volumes:' section, permanently wiping all persistent database files, uploaded media, and stored state.",
    hintsJson: JSON.stringify(["The -v flag stands for volumes."]),
    options: [
      {
        optionKey: "A",
        optionText: "It prints verbose debugging output while stopping containers.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "It removes containers, networks, AND permanently deletes all named persistent data volumes declared in the Compose file.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "It validates the YAML syntax without making any changes to running containers.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "It pauses containers instead of stopping them to save memory.",
        isCorrect: false
      }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "dockerfile-multistage-compose-networking",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Storage Mechanism for Production Databases",
    prompt: "Why should stateful production databases like PostgreSQL and MySQL store their data in Docker Named Volumes rather than the container's default writable layer?",
    explanation: "Named volumes are stored outside the ephemeral container lifecycle under /var/lib/docker/volumes/_data and bypass the Copy-on-Write (CoW) OverlayFS driver, providing native disk I/O performance and data persistence across container updates and restarts.",
    hintsJson: JSON.stringify(["Consider performance (bypassing Copy-on-Write) and lifecycle (surviving container destruction)."]),
    options: [
      {
        optionKey: "A",
        optionText: "Because Docker automatically compresses named volumes using gzip.",
        isCorrect: false
      },
      {
        optionKey: "B",
        optionText: "Named volumes persist data independently of the container lifecycle and bypass the Copy-on-Write storage driver for native I/O speed.",
        isCorrect: true
      },
      {
        optionKey: "C",
        optionText: "Named volumes automatically replicate data across AWS regions without internet access.",
        isCorrect: false
      },
      {
        optionKey: "D",
        optionText: "Containers running on Linux cannot write to the container layer without a license key.",
        isCorrect: false
      }
    ]
  }
];

