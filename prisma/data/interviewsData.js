module.exports = [
  {
    moduleNumber: 1,
    title: "Explain the difference between an AWS Region and an Availability Zone.",
    difficulty: "Beginner",
    prompt: "A junior engineer on your team asks: 'What is the exact physical and logical difference between an AWS Region and an Availability Zone, and why does my architecture need both?' How would you explain this in an interview?",
    explanation: "Tests foundational knowledge of physical cloud topologies, geographic isolation, latency tradeoffs, and failure domain separation.",
    hintsJson: JSON.stringify([
      "Mention geographic location vs data center facilities.",
      "Explain independent power, cooling, and flood plains.",
      "Discuss synchronous low-latency fiber (<1-2ms) interconnects.",
      "Relate to business requirements: user latency vs high availability."
    ]),
    recommendedSolution: `**Model Answer:**
An **AWS Region** is a distinct, physical geographical area around the world (e.g., us-east-1 in Northern Virginia or ap-south-1 in Mumbai) containing multiple, physically isolated data centers. Each Region is designed to be completely independent from other regions to achieve fault tolerance and data sovereignty compliance.

An **Availability Zone (AZ)** consists of one or more discrete, physical data centers located within a Region. Each AZ has independent power, redundant networking, and backup generators. AZs in the same Region are separated by meaningful physical distance (tens of miles) to protect against local events like power outages or flooding, yet connected via high-speed, private fiber optic links with single-digit millisecond latency.

**Why architecture requires both:**
- **Regions:** Chosen based on compliance/legal requirements, geographic proximity to end users (minimizing round-trip latency), and service availability/cost.
- **Availability Zones:** Used to build **High Availability (HA)** systems. By deploying compute and database instances across 2 or more AZs within a single region, an outage in one physical facility does not bring down the application.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Region Definition", weight: 25, description: "Mentions geographic area, independent failure domain, latency/compliance factors." },
        { name: "AZ Definition", weight: 25, description: "Mentions 1+ physical data centers with redundant power, cooling, network." },
        { name: "Inter-AZ Connectivity", weight: 25, description: "Mentions low-latency private fiber links allowing synchronous replication." },
        { name: "Practical Architecture Application", weight: 25, description: "Explains deploying multi-AZ for high availability vs multi-region for disaster recovery." }
      ]
    }),
    tagsJson: JSON.stringify(["Infrastructure", "Architecture", "Beginner", "Interview"])
  },
  {
    moduleNumber: 2,
    title: "How does the AWS IAM Policy Evaluation Logic work when multiple policies apply?",
    difficulty: "Intermediate",
    prompt: "In AWS IAM, if an employee has three policies attached—one granting AdministratorAccess, one granting ReadOnlyAccess, and one containing an Explicit Deny on s3:DeleteBucket—can the employee delete an S3 bucket? Walk through the complete IAM evaluation engine logic.",
    explanation: "Tests deep understanding of IAM evaluation algorithm, implicit deny default, explicit allow, and explicit deny precedence.",
    hintsJson: JSON.stringify([
      "Start with the default baseline: is everything allowed or denied initially?",
      "What is the golden rule regarding Explicit Deny in IAM?",
      "How do SCPs (Service Control Policies) and Permission Boundaries factor in?"
    ]),
    recommendedSolution: `**Model Answer:**
No, the employee **CANNOT** delete the S3 bucket.

**IAM Evaluation Algorithm Flow:**
1. **Default Baseline (Implicit Deny):** By default, all API requests are denied unless explicitly allowed.
2. **Explicit Deny Check (The Golden Rule):** If there is an **Explicit Deny** anywhere in any applicable policy (Identity-based policy, Resource-based policy, SCP, Permission Boundary, or Session Policy), it **ALWAYS** overrides any and all allows. The evaluation immediately halts and access is denied.
3. **Organizations SCPs:** In an AWS Organizations hierarchy, the action must be allowed by applicable Service Control Policies.
4. **Resource-Based Policies:** Check if a resource policy (e.g. S3 Bucket Policy) allows the action.
5. **Identity-Based Policies:** Check if attached user, group, or role policies explicitly allow the action.
6. **Permission Boundaries & Session Policies:** Must also allow the action if configured.
7. **Final Outcome:** If an Explicit Allow exists and NO Explicit Deny exists, access is granted. Otherwise, it remains denied.

In this scenario, because one policy contains an **Explicit Deny** on \`s3:DeleteBucket\`, it permanently trumps the \`AdministratorAccess\` policy.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Clear Direct Answer", weight: 20, description: "States unequivocally that the user CANNOT delete the bucket." },
        { name: "Explicit Deny Priority", weight: 30, description: "Explains that an Explicit Deny always overrides any Explicit Allow." },
        { name: "Implicit Deny Baseline", weight: 25, description: "Mentions the default deny-by-default behavior." },
        { name: "Evaluation Order / Scope", weight: 25, description: "Mentions role of SCPs, Permission Boundaries, or resource-based policies." }
      ]
    }),
    tagsJson: JSON.stringify(["IAM", "Security", "Policy", "Intermediate", "Interview"])
  },
  {
    moduleNumber: 3,
    title: "Compare Security Groups and Network ACLs (NACLs). When would you use each?",
    difficulty: "Intermediate",
    prompt: "Compare AWS Security Groups and Network ACLs in terms of statefulness, scope, rule evaluation order, and typical real-world use cases. When would you use a NACL instead of a Security Group?",
    explanation: "A classic AWS technical interview question testing cloud network security fundamentals.",
    hintsJson: JSON.stringify([
      "Stateful vs Stateless: what happens to return traffic?",
      "Instance level (ENI) vs Subnet level.",
      "Allow-only rules vs Allow-and-Deny rules.",
      "Use case for NACL: blocking specific malicious IP addresses."
    ]),
    recommendedSolution: `**Model Answer:**

| Dimension | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operating Layer** | Instance / ENI level | Subnet boundary level |
| **Statefulness** | **Stateful**: Outbound response automatically allowed regardless of outbound rules | **Stateless**: Inbound and outbound must be explicitly allowed, including ephemeral ports |
| **Rule Types** | **ALLOW rules only** (Everything else is implicitly denied) | **ALLOW and DENY rules** |
| **Rule Order** | All rules evaluated together | Evaluated sequentially in **numbered order** (lowest number first) |
| **Default Setting** | Inbound: Deny all; Outbound: Allow all | Default NACL: Allow all inbound & outbound |

**When to use a NACL over a Security Group:**
1. **Blocking Malicious IPs / Subnets:** Because Security Groups only support ALLOW rules, you cannot explicitly block a single rogue IP or DDOS scanner (e.g. \`DENY 198.51.100.23/32\`). You must use a NACL numbered DENY rule for this.
2. **Subnet-Wide Coarse Security Guardrail:** As a defense-in-depth perimeter to enforce that an entire database subnet never receives traffic from non-app CIDRs, even if an engineer misconfigures an individual EC2 security group.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Statefulness Explanation", weight: 30, description: "Accurately details that SG is stateful (return traffic auto-allowed) while NACL is stateless." },
        { name: "Scope & Attachment", weight: 20, description: "Identifies SG at instance/ENI level and NACL at subnet level." },
        { name: "Rule Logic & Ordering", weight: 25, description: "Contrasts SG allow-only with NACL numbered rules evaluated sequentially." },
        { name: "Practical Use Case", weight: 25, description: "Explains blocking malicious IPs or subnet-wide guardrails using NACL." }
      ]
    }),
    tagsJson: JSON.stringify(["Networking", "VPC", "Security Groups", "NACL", "Interview"])
  },
  {
    moduleNumber: 9,
    title: "RDS Multi-AZ vs Read Replicas: Architectural Differences & Failover Mechanics",
    difficulty: "Advanced",
    prompt: "What is the exact architectural difference between an RDS Multi-AZ deployment and an RDS Read Replica? Can you use a Multi-AZ standby to serve read traffic? How does automated failover occur during a primary database crash?",
    explanation: "Deep dive into enterprise database replication, disaster recovery vs read scaling, and failover mechanics.",
    hintsJson: JSON.stringify([
      "Synchronous vs Asynchronous replication.",
      "Is the standby instance accessible for read queries?",
      "How does DNS CNAME switching enable seamless failover?"
    ]),
    recommendedSolution: `**Model Answer:**

**Core Differences:**
1. **Purpose:**
   - **Multi-AZ:** Designed for **High Availability (HA) and Disaster Recovery**.
   - **Read Replicas:** Designed for **Read Scalability and Performance**.

2. **Replication Type:**
   - **Multi-AZ:** **Synchronous** physical storage-level replication. When a transaction writes to the primary, it must also be written to the standby's EBS volume before acknowledging COMMIT. RPO is zero.
   - **Read Replicas:** **Asynchronous** logical replication using database engine binary logs. Subject to replication lag under heavy write load.

3. **Accessibility:**
   - **Multi-AZ Standby:** **INACCESSIBLE** for queries. You cannot connect to or read from the standby instance.
   - **Read Replicas:** **ACCESSIBLE**. They have distinct DNS endpoints and actively serve read-only queries.

**Automated Failover Mechanics (RTO ~60-120s):**
When the primary RDS DB fails (hardware failure, loss of AZ, OS crash, or manual reboot with failover):
1. The RDS internal monitoring system detects loss of heartbeat.
2. RDS promotes the passive standby DB in AZ-B to become the new primary writer.
3. RDS automatically flips the primary **DNS CNAME record** (e.g. \`mydb.c123.us-east-1.rds.amazonaws.com\`) to point to the IP address of the newly promoted instance.
4. Applications reconnect using the same database hostname without any code deployment or manual configuration changes.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "HA vs Scaling Distinction", weight: 25, description: "Distinguishes Multi-AZ for HA vs Read Replicas for read scaling." },
        { name: "Replication Mechanics", weight: 25, description: "Contrasts synchronous Multi-AZ with asynchronous Read Replica replication." },
        { name: "Standby Accessibility", weight: 25, description: "Clarifies that the Multi-AZ standby cannot be queried directly." },
        { name: "DNS Failover Mechanism", weight: 25, description: "Explains automatic CNAME flipping to the promoted standby." }
      ]
    }),
    tagsJson: JSON.stringify(["RDS", "Databases", "High Availability", "Aurora", "Advanced", "Interview"])
  },
  {
    moduleNumber: 10,
    title: "How do you mitigate Lambda Cold Starts in production Serverless applications?",
    difficulty: "Advanced",
    prompt: "In a latency-critical customer-facing API backed by AWS Lambda and API Gateway, p99 latency spikes up to 2.5 seconds due to Cold Starts. What causes cold starts under the hood, and what architectural and configuration techniques would you use to eliminate or minimize them?",
    explanation: "Tests serverless internals, Firecracker microVM lifecycle, language runtime choices, and Provisioned Concurrency.",
    hintsJson: JSON.stringify([
      "Explain container initialization vs invocation phases.",
      "Discuss Provisioned Concurrency.",
      "Compare interpreted runtimes (Node/Python) vs compiled runtimes (Java/JVM).",
      "Mention connection pooling outside the handler."
    ]),
    recommendedSolution: `**Model Answer:**

**What Happens During a Cold Start Under the Hood:**
When a Lambda request arrives and no idle execution container exists:
1. **Download:** AWS allocates a Firecracker MicroVM and downloads the function zip/container image.
2. **Runtime Initialization:** Boots the runtime environment (Node.js, Python, JVM).
3. **Module Initialization:** Executes code *outside* the event handler (importing libraries, establishing DB connections, loading ML models).
Only after steps 1-3 complete does the actual event handler execute. Subsequent requests to that warm container take mere milliseconds.

**Strategies to Mitigate & Eliminate Cold Starts:**
1. **Provisioned Concurrency (The Guaranteed Fix):**
   - Configures AWS to keep a pre-warmed pool of initialized execution environments ready 24/7.
   - Eliminates cold starts entirely for traffic within the provisioned threshold, maintaining steady sub-50ms latency.
2. **Runtime & Code Optimization:**
   - Prefer lightweight runtimes with fast boot times (Node.js, Python, or Go/Rust via custom runtime) over heavy runtimes like Java (JVM) or .NET, unless using GraalVM native image.
   - Minimize deployment bundle size: use esbuild / Webpack to tree-shake unused dependencies.
3. **Smart Code Placement (Global Scope):**
   - Place database client instantiation (e.g. \`new PrismaClient()\`) and AWS SDK client initialization OUTSIDE the handler so they execute only once per container life.
4. **Memory Allocation Tuning:**
   - Increasing Lambda memory (e.g. from 256MB to 1792MB) proportionally increases allocated vCPU, drastically speeding up initialization CPU cycles.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Cold Start Anatomy", weight: 25, description: "Details download, runtime boot, and initialization outside handler." },
        { name: "Provisioned Concurrency", weight: 30, description: "Explains pre-warming execution environments with Provisioned Concurrency." },
        { name: "Runtime & Bundle Sizing", weight: 25, description: "Discusses language runtime differences and tree-shaking packages." },
        { name: "Memory / vCPU Tuning", weight: 20, description: "Mentions increasing memory to grant more CPU power during startup." }
      ]
    }),
    tagsJson: JSON.stringify(["Serverless", "Lambda", "Performance", "Optimization", "Advanced", "Interview"])
  },
  {
    moduleNumber: 16,
    title: "Explain Git Rebase vs Git Merge, and what is the Golden Rule of Rebasing?",
    difficulty: "Intermediate",
    prompt: "In a technical interview, the lead architect asks: 'Explain the internal mechanical difference between git merge and git rebase. When should an engineering team use merge versus rebase, and what is the cardinal Golden Rule of Rebasing?' How do you answer?",
    explanation: "Tests deep understanding of Git DAG branch manipulation, linear vs non-linear commit history, and the dangers of rewriting shared remote branches.",
    hintsJson: JSON.stringify([
      "Contrast 3-way merge commits with replay mechanics.",
      "Explain the cosmetic benefits of a linear git log.",
      "State the Golden Rule: Never rebase a public/shared branch."
    ]),
    recommendedSolution: `**Model Answer:**

**Git Merge:**
- Combines two diverging branch histories by creating a new **3-way merge commit** with two parent commits.
- **Pros:** Preserves complete, immutable, chronological history of what happened and when. Safe for shared branches.
- **Cons:** Can produce a chaotic, tangled 'railroad track' git log if many developers frequently merge into main.

**Git Rebase:**
- Takes the unique commits from your feature branch, temporarily stashes them, moves the branch base pointer to the tip of the target branch (e.g. \`main\`), and **replays** your commits one by one with new commit SHAs.
- **Pros:** Creates a clean, perfectly linear commit history. Makes \`git bisect\` and code audits effortless.
- **Cons:** Rewrites commit hashes and timestamps.

**The Golden Rule of Rebasing:**
*Never rebase a branch that has been pushed to a public or shared remote repository where others are collaborating.*
Because rebasing creates new commit SHAs for existing work, rebasing a shared branch forces collaborators to reconcile divergent DAG histories, frequently causing lost work.

**Best Practice Recommendation:**
Use \`git rebase -i\` (interactive rebase) locally on your private feature branch to clean up and squash messy work-in-progress commits before opening a Pull Request. Once approved, merge into main using Squash & Merge or Fast-Forward merge with branch protection.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Merge vs Rebase Mechanics", weight: 30, description: "Explains 3-way merge commit vs commit replay on new base." },
        { name: "DAG & Log Tradeoffs", weight: 25, description: "Discusses linear history benefits vs chronological preservation." },
        { name: "The Golden Rule", weight: 25, description: "Clearly states never to rebase public/shared branches." },
        { name: "Interactive Rebase Practice", weight: 20, description: "Mentions squashing local feature commits before PR submission." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "GitHub", "Rebase", "Merge", "Version Control", "Interview"])
  },
  {
    moduleNumber: 17,
    title: "Declarative vs Scripted Jenkinsfile & Controller-Agent Security Best Practices",
    difficulty: "Intermediate",
    prompt: "Compare Declarative Pipelines with legacy Scripted Pipelines in Jenkins. Furthermore, why is running build workloads on the Jenkins Controller considered a critical operational and security anti-pattern?",
    explanation: "Evaluates modern Pipeline-as-Code standards, syntax structure, and enterprise security architecture for CI/CD controllers.",
    hintsJson: JSON.stringify([
      "Discuss Groovy DSL structure (pipeline {} block vs node {}).",
      "Explain static analysis and error checking in Declarative syntax.",
      "Explain Controller resource starvation and remote code execution blast radius."
    ]),
    recommendedSolution: `**Model Answer:**

**Declarative vs Scripted Pipelines:**
1. **Declarative Pipeline (Modern Standard):**
   - Enclosed in a strict \`pipeline { ... }\` block.
   - Provides a structured, opinionated, and highly readable syntax with predefined sections: \`agent\`, \`stages\`, \`steps\`, \`environment\`, and \`post\`.
   - Offers built-in syntax validation before execution begins and standardized restart-from-stage capabilities.
2. **Scripted Pipeline (Legacy):**
   - Enclosed in a \`node { ... }\` block.
   - Written in free-form Apache Groovy without structural guardrails.
   - While powerful for complex programmatic logic, it is harder to maintain and prone to subtle runtime syntax bugs.

**Why the Controller Must Have 0 Executors (Controller-Agent Isolation):**
Running build scripts directly on the Jenkins Controller is a critical vulnerability:
1. **Denial of Service (Resource Starvation):** A heavy npm compile, Docker build, or runaway loop consumes CPU and RAM on the controller, freezing the web UI and stalling all other pipeline schedules.
2. **Security & Blast Radius:** Build scripts execute with the filesystem permissions of the Jenkins user on the host. An attacker or malicious pull request could read \`/var/jenkins_home/secrets/\`, dump Jenkins credentials, steal SSH keys, and take full control of the CI/CD server.
3. **Best Practice:** Set Controller Executors to **0**. Delegate all builds to isolated ephemeral agents (e.g., dynamic Docker containers or Kubernetes pods spawned on demand).`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Declarative vs Scripted Distinction", weight: 30, description: "Compares pipeline {} vs node {} syntax, structure, and validation." },
        { name: "Controller Resource Starvation", weight: 25, description: "Explains how builds on master freeze controller UI and schedules." },
        { name: "Security Blast Radius", weight: 25, description: "Identifies risk of malicious builds accessing credentials and master secrets." },
        { name: "Ephemeral Agent Architecture", weight: 20, description: "Proposes dynamic Docker or Kubernetes agents as the solution." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "CI/CD", "Declarative Pipeline", "Security", "Architecture", "Interview"])
  },
  {
    moduleNumber: 18,
    title: "Docker Container vs Virtual Machine & Multi-Stage Build Optimization",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Explain precisely how a Docker container differs from a Virtual Machine at the Linux OS kernel level. How do namespaces and cgroups facilitate this, and how do multi-stage Dockerfiles optimize production images?'",
    explanation: "Tests foundational systems knowledge of OS virtualization, Linux kernel primitives, and modern container packaging best practices.",
    hintsJson: JSON.stringify([
      "Hypervisor + Guest OS vs Shared Host Kernel.",
      "Linux Namespaces (isolation) vs Cgroups (resource limits).",
      "Multi-stage builds: compile stage vs minimal runtime stage."
    ]),
    recommendedSolution: `**Model Answer:**

**Containers vs Virtual Machines:**
- **Virtual Machines (Hardware Virtualization):**
  - Run on a Hypervisor (Type 1 like VMware ESXi or Type 2 like VirtualBox/KVM).
  - Each VM contains a complete, isolated **Guest Operating System** (kernel, drivers, systemd, binaries), often consuming several gigabytes of disk and hundreds of megabytes of RAM just to boot. Boot time takes 30-90 seconds.
- **Docker Containers (OS-Level Virtualization):**
  - Share the **Host Operating System Kernel**.
  - A container is simply an isolated standard Linux process running in user space. It boots in milliseconds and uses only the memory the application actually requires.

**The Linux Kernel Primitives Behind Containers:**
1. **Linux Namespaces (Process Isolation - What the container sees):**
   - \`PID\`: Isolated process tree (container PID 1 is distinct from host PID).
   - \`NET\`: Dedicated virtual network interface, IP routing table, and ports.
   - \`MNT\`: Isolated root filesystem mount points.
   - \`IPC\` & \`UTS\`: Isolated inter-process communication and hostname.
2. **Control Groups (cgroups - What the container can use):**
   - Enforces hard quotas and throttling on hardware resources (e.g. limiting a container to 1.5 CPUs and 512MB RAM).

**Multi-Stage Dockerfile Optimization:**
In traditional Dockerfiles, compilers (like GCC, npm, Maven, Go SDK) remain in the final image, bloating sizes to 1GB+ and introducing dozens of CVE vulnerabilities.
Multi-Stage builds allow you to use a heavy builder image in Stage 1 to compile code, and then copy *only* the compiled binary into a minimal Stage 2 image (such as \`alpine\` or \`gcr.io/distroless/static\`). This reduces image size by 80-95% and eliminates build tools from production attack surfaces.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "VM vs Container Core Difference", weight: 30, description: "Explains hypervisor + guest OS vs shared host kernel." },
        { name: "Namespaces & Cgroups", weight: 30, description: "Defines namespaces for process isolation and cgroups for resource quotas." },
        { name: "Multi-Stage Mechanics", weight: 25, description: "Explains copying compiled output to clean minimal runtime image." },
        { name: "Security & Size Benefits", weight: 15, description: "Mentions CVE reduction and massive image shrinkage." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Containers", "Virtual Machines", "Linux Kernel", "Interview"])
  },
  {
    moduleNumber: 19,
    title: "Kubernetes Pod Scheduling Lifecycle from 'kubectl apply' to 'Running'",
    difficulty: "Advanced",
    prompt: "Walk through the entire step-by-step lifecycle when an engineer executes 'kubectl apply -f deployment.yaml'. Detail the exact interactions between kube-apiserver, etcd, kube-scheduler, kube-controller-manager, and kubelet on worker nodes.",
    explanation: "Tests deep architectural mastery of Kubernetes control plane distributed consensus, asynchronous reconciliation, and worker node execution.",
    hintsJson: JSON.stringify([
      "Authentication and validation at kube-apiserver.",
      "Writing desired state to etcd.",
      "Controller Manager creating Pod definitions.",
      "Kube-scheduler 2-phase node selection (filtering & scoring).",
      "Kubelet container runtime invocation and probe checks."
    ]),
    recommendedSolution: `**Model Answer:**

Here is the exact internal sequence when \`kubectl apply -f deployment.yaml\` is executed:

1. **API Server Gateway & Authentication:**
   - \`kubectl\` sends an HTTP POST/PUT request with the YAML payload to **kube-apiserver**.
   - The API Server authenticates the client (TLS certificate/token), validates RBAC authorizations, passes the request through Mutating and Validating Admission Webhooks, and persists the Deployment object to **etcd**.

2. **Controller Manager Reconciles Desired State:**
   - The **Deployment Controller** (inside \`kube-controller-manager\`) watches etcd via Informers.
   - It notices the new Deployment, creates an underlying **ReplicaSet**, and writes it back to the API Server.
   - The **ReplicaSet Controller** sees that desired replicas = 3 while current pods = 0. It creates 3 Pod objects with \`nodeName: null\` (unscheduled pods) and saves them in etcd.

3. **Kube-Scheduler Evaluates Nodes:**
   - The **kube-scheduler** detects unassigned pods (\`nodeName\` is empty) in its scheduling queue.
   - It runs a 2-phase algorithm:
     - **Filtering (Predicates):** Filters out nodes lacking sufficient CPU/RAM, cordoned nodes, or nodes with incompatible taints.
     - **Scoring (Priorities):** Ranks candidate nodes based on resource balance, pod anti-affinity, and spread across Availability Zones.
   - The scheduler selects the winning node and writes a **Binding** to the API Server, setting \`nodeName: worker-node-2\`.

4. **Kubelet Executes on the Worker Node:**
   - The **kubelet** on worker-node-2 watches the API Server and detects a pod assigned to itself.
   - Kubelet calls the Container Runtime Interface (CRI, e.g. containerd) to pull the image and create the container.
   - Kubelet calls the Container Network Interface (CNI, e.g. AWS VPC CNI or Calico) to allocate a pod IP from the subnet.
   - Kubelet calls the Container Storage Interface (CSI) to attach and mount any specified volumes.

5. **Health Probes & Service Registration:**
   - The container starts. Kubelet monitors configured **Readiness Probes**.
   - Once Readiness passes, kubelet informs the API Server that the pod status is **Running** and Ready.
   - The **Endpoints Controller** adds the pod's IP to the matching Kubernetes Service endpoints, and **kube-proxy** updates local packet filter rules (iptables/IPVS) so live traffic routes to the new pod.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "API Server & etcd Persistence", weight: 25, description: "Explains authentication, admission controllers, and state write to etcd." },
        { name: "Deployment & ReplicaSet Controllers", weight: 25, description: "Explains reconciliation loop generating Pod specifications." },
        { name: "Kube-Scheduler 2-Phase Selection", weight: 25, description: "Explains filtering (predicates) and scoring (priorities) to assign nodeName." },
        { name: "Kubelet, CRI/CNI, & Readiness Probes", weight: 25, description: "Details container startup, IP allocation, probes, and service endpoints." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Architecture", "Control Plane", "Scheduling", "Pods", "Interview"])
  },
  {
    moduleNumber: 20,
    title: "Designing a Zero-Downtime End-to-End CI/CD Pipeline on AWS",
    difficulty: "Advanced",
    prompt: "You are asked to architect an enterprise continuous deployment pipeline for a financial microservice. How would you design the pipeline starting from GitHub code commits, through Jenkins CI, Docker containerization, security vulnerability gates, and deploying to an Amazon EKS cluster with zero downtime and automated instant rollbacks?",
    explanation: "Senior architect question testing end-to-end cloud-native engineering, DevSecOps principles, zero-downtime deployment strategies, and observability.",
    hintsJson: JSON.stringify([
      "Diagram the stages from source to production.",
      "Integrate Shift-Left DevSecOps (SonarQube + Trivy).",
      "Explain immutable image tagging using Git commit SHAs.",
      "Detail Kubernetes RollingUpdate parameters (maxSurge, maxUnavailable) and rollback mechanics."
    ]),
    recommendedSolution: `**Model Architecture:**

1. **Source Control & GitOps (GitHub):**
   - Trunk-Based Development with protected \`main\` branch. Direct pushes blocked; requires 1+ peer review and passing CI status checks.
   - Developer opens Pull Request -> GitHub webhook triggers Jenkins PR verification job.

2. **Continuous Integration & DevSecOps (Jenkins):**
   - Runs on dynamic ephemeral Docker/Kubernetes agent nodes.
   - **Stage 1 (Lint & Unit Test):** Executes \`npm test\` with code coverage thresholds.
   - **Stage 2 (Static Code Quality):** SonarQube quality gate verifies 0 critical bugs or security hotspots.
   - **Stage 3 (Docker Build):** Multi-stage build outputs a minimal runtime image tagged with the unique Git commit SHA (\`:sha-8f3e1a\`).
   - **Stage 4 (Container Vulnerability Gate):** Trivy scans image layers. If ANY Critical CVEs with available fixes exist, the build terminates with a failed status.

3. **Secure Artifact Storage (Amazon ECR):**
   - Authenticates using IAM Role for Service Accounts (IRSA) via temporary STS tokens.
   - Pushes image to Amazon ECR with **Image Tag Immutability** enabled, preventing tags from ever being overwritten.

4. **Zero-Downtime Deployment (Amazon EKS):**
   - Jenkins executes \`kubectl set image deployment/app app=123.dkr.ecr...:sha-8f3e1a\`.
   - **Deployment Strategy Configuration:**
     \`\`\`yaml
     strategy:
       type: RollingUpdate
       rollingUpdate:
         maxSurge: 25%       # Spins up new pods first before killing old ones
         maxUnavailable: 0   # Guarantees 100% capacity maintained throughout update
     \`\`\`
   - **Readiness Probes & Graceful Shutdown:**
     - PreStop hook waits 10 seconds for in-flight requests to drain.
     - HTTP readiness probe confirms the new pod is responding with HTTP 200 before receiving traffic.

5. **Automated Rollback & Observability:**
   - Jenkins monitors \`kubectl rollout status deployment/app --timeout=180s\`.
   - If readiness probes fail or pods enter CrashLoopBackOff, the post-failure block executes:
     \`kubectl rollout undo deployment/app\`
   - CloudWatch Container Insights and Prometheus/Grafana monitor latency and 5xx error rates, triggering alerts to Slack/PagerDuty.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "DevSecOps Integration", weight: 25, description: "Includes SonarQube SAST and Trivy container CVE scanning before push." },
        { name: "Immutable Tagging & ECR", weight: 25, description: "Tags with immutable Git SHA rather than 'latest'." },
        { name: "Zero-Downtime Strategy", weight: 25, description: "Explains maxSurge/maxUnavailable and readiness probe gating." },
        { name: "Automated Rollback & Monitoring", weight: 25, description: "Details rollout undo on timeout/crash and CloudWatch observability." }
      ]
    }),
    tagsJson: JSON.stringify(["Architecture", "CI/CD", "DevOps", "Kubernetes", "AWS EKS", "Interview"])
  },
  {
    moduleNumber: 16,
    title: "Explain GitFlow vs Trunk-Based Development for High-Velocity DevOps Teams",
    difficulty: "Intermediate",
    prompt: "In a technical interview for a Senior DevOps / Cloud Engineer, you are asked: 'Our engineering organization currently uses GitFlow with develop, release, and feature branches, but deployments take 2 weeks to reach production. How does Trunk-Based Development work, why are high-performing DevOps teams adopting it, and how do feature flags fit in?' How would you answer?",
    explanation: "Tests understanding of modern version control workflows, continuous integration philosophy, batch sizes, merge friction, and feature toggles.",
    hintsJson: JSON.stringify([
      "Compare long-lived branches (GitFlow) vs short-lived feature branches merged daily (Trunk-Based).",
      "Explain the cost of merge debt and delayed integration feedback.",
      "Explain Feature Toggles/Flags: decoupling code deployment from feature release.",
      "Reference DORA metrics: deployment frequency and lead time for changes."
    ]),
    recommendedSolution: `**Model Answer:**

**GitFlow Overview & Pain Points:**
GitFlow relies on long-lived parallel branches (\`main\`, \`develop\`, \`release/*\`, \`feature/*\`, \`hotfix/*\`). Features remain isolated on feature branches for weeks before merging into \`develop\`.
- **Pain Points:** Leads to massive "merge hell" when long-lived branches converge, creates delayed feedback loops, violates Continuous Integration (code isn't integrated continuously), and results in batch releases with high blast radius.

**Trunk-Based Development (TBD):**
All developers commit short-lived branches directly into a single central branch called "trunk" (usually \`main\`) multiple times a day (at least once every 24 hours).
- **Core Principles:**
  1. Feature branches live for hours, never longer than 1-2 days.
  2. Every commit triggers automated CI tests and builds in minutes.
  3. Releases are tagged directly from trunk or cut into short-lived release branches strictly for stabilization.
  4. Small batch sizes minimize merge conflicts to trivial one-line diffs.

**How Feature Flags (Toggles) Enable TBD:**
To merge incomplete features into trunk without exposing half-built code to end users:
- Engineers wrap code in conditional feature toggles (e.g., \`if (flags.isEnabled('new-checkout-v2')) { ... }\`).
- Code is deployed continuously to production in an "off" state.
- Product managers can toggle features on dynamically for specific user segments (canary testing) without requiring a new deployment.

**Recommendation:** For high-performing DevOps teams pursuing elite DORA metrics, Trunk-Based Development combined with feature flags and robust automated testing is superior to GitFlow.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Workflow Contrast", weight: 25, description: "Accurately contrasts long-lived branches with short-lived trunk integration." },
        { name: "Pain Point Analysis", weight: 25, description: "Explains merge debt, integration delays, and large batch risk in GitFlow." },
        { name: "Feature Flag Integration", weight: 25, description: "Explains decoupling deployment from release via feature toggles." },
        { name: "DevOps Best Practices", weight: 25, description: "Mentions automated CI status checks and continuous deployment alignment." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Branching Strategies", "GitFlow", "Trunk-Based", "DevOps", "Interview"])
  },
  {
    moduleNumber: 16,
    title: "How Does Git Internally Store Data? (Blobs, Trees, Commits & Object Hashes)",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'People often say Git is just a content-addressable key-value store with a VCS interface on top. Explain the internal object model of Git: what happens inside the .git/objects directory when you commit a file?'",
    explanation: "Deep dive into Git internals: Directed Acyclic Graph (DAG), 4 core object types, SHA hashing, and zlib compression.",
    hintsJson: JSON.stringify([
      "Mention the 4 fundamental object types: Blob, Tree, Commit, and Tag.",
      "Explain content addressing: SHA hash derived from header + payload content.",
      "Explain how a Tree represents a directory and links file names to Blob hashes.",
      "Explain Commit objects: Tree pointer + Parent pointer + Author/Committer + message."
    ]),
    recommendedSolution: `**Model Answer:**

Git is fundamentally a **content-addressable filesystem**. Every piece of data stored in Git is saved as an immutable object in \`.git/objects/\`, identified by a 40-character SHA-1 (or 64-char SHA-256) hash. The first 2 characters become the subdirectory name, and the remaining 38 characters form the filename.

**The 4 Fundamental Git Object Types:**

1. **Blob (Binary Large Object):**
   - Stores raw file content only.
   - A Blob does **NOT** store the filename, directory path, or permissions—only the file data itself.
   - If two files in different directories have identical content, Git stores only one Blob, achieving deduplication.

2. **Tree Object (Directory):**
   - Represents a directory structure.
   - Contains a list of entries, where each entry has: file mode (executable, normal file, directory), object type (blob or tree), object SHA hash, and the filename.
   - Nested trees represent subdirectories.

3. **Commit Object:**
   - Represents a point-in-time repository snapshot.
   - Contains:
     - Top-level root **Tree SHA** (the complete state of the project tree).
     - **Parent Commit SHA(s)** (creates the DAG; 0 for root, 1 for normal commit, 2+ for merge commits).
     - Author and Committer metadata (name, email, timestamp).
     - Commit message string.

4. **Annotated Tag Object:**
   - Permanent named pointer to a specific commit, containing tagger metadata, GPG signature, and release message.

**What happens on 'git add' and 'git commit':**
- \`git add file.txt\`: Computes \`sha1("blob " + size + "\\0" + content)\`, compresses via zlib, writes \`.git/objects/xx/yyyy...\`, and records entry in the staging index (\`.git/index\`).
- \`git commit -m "msg"\`: Generates Tree objects from the index, writes the Commit object pointing to the root Tree and parent commit, and updates the branch reference file (e.g. \`.git/refs/heads/main\`) with the new commit hash.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Blob Understanding", weight: 25, description: "Explains blobs store raw data without filenames, enabling deduplication." },
        { name: "Tree Object Structure", weight: 25, description: "Explains trees map filenames and permissions to blob and child tree SHAs." },
        { name: "Commit Object DAG", weight: 25, description: "Explains commit objects point to root tree and parent commits." },
        { name: "Content-Addressable Model", weight: 25, description: "Mentions zlib compression and hash derivation from header + content." }
      ]
    }),
    tagsJson: JSON.stringify(["Git Internals", "DAG", "Blobs", "Trees", "Architecture", "Interview"])
  },
  {
    moduleNumber: 17,
    title: "Secure Enterprise Credential Management & Log Masking in Jenkins",
    difficulty: "Intermediate",
    prompt: "In an enterprise CI/CD pipeline, how do you inject production secrets (AWS IAM keys, SSH private keys, Docker registry passwords) into Jenkins pipeline jobs securely, ensure credentials are never leaked into console output logs, and restrict access based on least privilege?",
    explanation: "Tests knowledge of Jenkins Credentials Provider plugin, environment credential binding, secret masking limitations, and external vault integration.",
    hintsJson: JSON.stringify([
      "Mention Jenkins Credentials Store and scoping (System vs Global vs Folder-level).",
      "Explain the 'withCredentials' binding syntax in Declarative and Scripted pipelines.",
      "Explain how Jenkins secret masking works and its edge-case vulnerabilities (base64, substrings).",
      "Mention enterprise integration with external secret engines like HashiCorp Vault or AWS Secrets Manager."
    ]),
    recommendedSolution: `**Model Answer:**

**1. Jenkins Scoped Credentials Store:**
- Store secrets centrally in the **Jenkins Credentials Store** (encrypted with master key stored in \`secrets/master.key\`).
- Apply **Folder-level Scoping**: Place production credentials inside a restricted "Production" folder accessible only by production pipeline jobs, preventing developer test pipelines from reading production secrets.

**2. Declarative Credential Binding:**
- Never hardcode secrets in the Jenkinsfile or shell scripts.
- Use native credential helper bindings:
  \`\`\`groovy
  environment {
      AWS_CREDS = credentials('aws-production-deployer')
      // Automatically exposes AWS_CREDS_USR and AWS_CREDS_PSW
      REGISTRY_TOKEN = credentials('ecr-auth-token')
  }
  \`\`\`
- Or scoped \`withCredentials\` block:
  \`\`\`groovy
  withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
      sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
  }
  \`\`\`

**3. Automated Console Log Masking & Gotchas:**
- Jenkins automatically replaces matching secret values with \`****\` in console logs.
- **Critical Gotchas to Guard Against:**
  - If a secret is Base64-encoded or URL-encoded inside the script, Jenkins will NOT recognize or mask the encoded string!
  - Avoid running \`set -x\` or printing entire environment dumps (\`printenv\` or \`env\`).
  - Use \`set +x\` before sensitive shell execution to disable bash command echo.

**4. External Secrets Integration (Best Practice):**
- Modern enterprise best practice: Integrate with **HashiCorp Vault** or **AWS Secrets Manager** using short-lived dynamic credentials rather than storing static API keys in Jenkins.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Credentials Store & Scoping", weight: 25, description: "Explains Jenkins credential provider and folder-level role-based isolation." },
        { name: "Pipeline Binding Syntax", weight: 25, description: "Demonstrates withCredentials or credentials() environment directive." },
        { name: "Masking Mechanics & Risks", weight: 25, description: "Details automatic **** masking and edge cases like base64 or bash echo." },
        { name: "Modern Vault Integration", weight: 25, description: "Mentions dynamic secrets via HashiCorp Vault or AWS Secrets Manager." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Security", "Credentials", "DevOps", "Log Masking", "Interview"])
  },
  {
    moduleNumber: 17,
    title: "Declarative Pipeline vs Scripted Pipeline in Jenkins: Deep Architectural Comparison",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'What is the architectural difference between a Declarative Pipeline and a Scripted Pipeline in Jenkins? Which one should an enterprise standardize on, and in what rare scenarios would you still use Scripted syntax?'",
    explanation: "Tests deep knowledge of Jenkins pipeline evolution, syntax validation, AST parsing, flexibility vs maintainability tradeoffs.",
    hintsJson: JSON.stringify([
      "Mention underlying Groovy syntax vs opinionated DSL.",
      "Explain pre-execution syntax validation in Declarative.",
      "Compare error handling: post blocks vs try-catch-finally.",
      "Explain the 'script' block escape hatch in Declarative pipelines."
    ]),
    recommendedSolution: `**Model Answer:**

**Architectural Comparison:**

1. **Declarative Pipeline (\`pipeline { ... }\`):**
   - **Architecture:** Built on top of an opinionated, structured Domain-Specific Language (DSL).
   - **AST Validation:** Jenkins validates the syntax of the entire pipeline at startup *before* allocating worker agents or executing any code.
   - **Structure:** Enforces strict sections: \`pipeline\`, \`agent\`, \`stages\`, \`steps\`, \`post\`.
   - **Error Handling:** Built-in declarative \`post\` conditions: \`always\`, \`success\`, \`failure\`, \`unstable\`, \`cleanup\`.
   - **Visual Integration:** Natively visualizes stages, parallel branches, and restartable stages in Jenkins Blue Ocean and Ocean UI.

2. **Scripted Pipeline (\`node { ... }\`):**
   - **Architecture:** Pure Groovy code executed sequentially inside a Groovy CPS (Continuation-Passing Style) interpreter.
   - **Flexibility:** Complete programmatic power—supports arbitrary \`for\` loops, dynamic stage generation, complex conditional branching, and custom classes.
   - **Drawbacks:** No pre-execution validation; syntax or runtime errors only surface midway through the build. Requires procedural \`try-catch-finally\` blocks for error handling.

**Enterprise Recommendation:**
- **Standardize on Declarative Pipelines** for 95%+ of enterprise pipelines. It guarantees uniform readability across teams, prevents fragile custom Groovy code, and provides standardized post-build notifications.

**When to use Scripted (or Declarative with \`script {}\` escape hatch):**
- When stages must be dynamically generated at runtime (e.g., dynamically discovering 50 test matrices from an external JSON manifest and running them in parallel).
- Complex custom algorithms or Groovy data transformation prior to stage definition.
- Even then, the recommended pattern is to keep the pipeline Declarative and encapsulate complex logic into a reusable **Jenkins Shared Library** or inside a \`script { ... }\` block.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Syntax & AST Distinction", weight: 25, description: "Explains declarative pre-validation vs scripted Groovy runtime execution." },
        { name: "Error Handling & Structure", weight: 25, description: "Contrasts declarative post blocks with scripted try-catch." },
        { name: "Enterprise Best Practice", weight: 25, description: "Strongly recommends Declarative for standardization and maintainability." },
        { name: "Dynamic Scenarios & Shared Libraries", weight: 25, description: "Identifies dynamic stage generation and Jenkins Shared Libraries." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Pipelines", "Declarative", "Scripted", "Groovy", "Interview"])
  },
  {
    moduleNumber: 18,
    title: "Linux Containers vs Virtual Machines: Namespaces, Cgroups & Kernel Architecture",
    difficulty: "Advanced",
    prompt: "In a Senior DevOps interview, explain the exact Linux kernel mechanisms that differentiate a Docker Container from a Type-2 or Type-1 Virtual Machine. Address process isolation, resource throttling, and the storage layer.",
    explanation: "Deep technical interrogation of container fundamentals: Linux kernel sharing, cgroups, namespaces (PID, NET, MNT, IPC, UTS, USER), and OverlayFS vs hypervisors.",
    hintsJson: JSON.stringify([
      "Explain the role of the Hypervisor (Type-1/Type-2) and virtualized hardware in VMs.",
      "Explain that containers are ordinary Linux host processes running in isolated namespaces.",
      "List the key Linux Namespaces: PID, NET, MNT, IPC, UTS, USER.",
      "Explain Control Groups (cgroups v1/v2) for CPU and RAM metering.",
      "Explain Union Filesystems (OverlayFS) copy-on-write."
    ]),
    recommendedSolution: `**Model Answer:**

**1. Virtual Machines (Hardware Virtualization):**
- A VM runs on a **Hypervisor** (Type-1 bare metal like AWS Nitro/ESXi or Type-2 like VirtualBox).
- The hypervisor virtualizes physical hardware (virtual CPU, virtual RAM, virtual NIC, virtual BIOS).
- Each VM runs a **complete guest operating system**, including its own independent kernel, systemd init system, device drivers, and background daemons.
- **Tradeoffs:** High isolation boundary (hardware enforced), but heavy overhead (gigabytes of disk, minutes to boot, substantial RAM footprint per VM).

**2. Containers (Operating System-Level Virtualization):**
- A Container is **NOT** a mini-VM; it is simply a standard Linux host process running under isolation constraints provided directly by the single shared **Host Linux Kernel**.
- Achieved through 3 core kernel subsystems:

  a) **Linux Namespaces (Process Isolation & Visibility):**
     - **PID Namespace:** Provides an isolated process tree where the container entrypoint process is PID 1, completely blind to host processes.
     - **NET Namespace:** Provides an isolated network stack (private loopback, virtual eth0 interface, routing table, iptables rules).
     - **MNT (Mount) Namespace:** Provides an isolated view of the filesystem hierarchy.
     - **UTS Namespace:** Isolates hostname and NIS domain.
     - **IPC Namespace:** Isolates Inter-Process Communication (semaphores, POSIX message queues).
     - **USER Namespace:** Maps container root (UID 0) to an unprivileged non-root UID on the host for defense-in-depth.

  b) **Control Groups (cgroups v1 / cgroups v2 - Resource Throttling):**
     - Meters and enforces hard ceilings on hardware resources: CPU quota, memory limits, blkio (disk I/O throughput), and max process threads (pids limit to prevent fork bombs).

  c) **OverlayFS (Union File System - Copy-on-Write):**
     - Combines lower immutable image layers (\`lowerdir\`) with a single thin writable layer (\`upperdir\`). When a container modifies an existing file, OverlayFS copies the file up to the writable layer on-the-fly (Copy-on-Write), ensuring image layers remain pristine.

**Conclusion:** Containers launch in milliseconds with zero hypervisor tax because they merely spawn a process within configured kernel namespaces and cgroups.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Hypervisor vs Kernel Sharing", weight: 25, description: "Contrasts guest OS kernel virtualization with host kernel process sharing." },
        { name: "Linux Namespaces Breakdown", weight: 25, description: "Names and explains PID, NET, MNT, UTS, IPC, and USER namespaces." },
        { name: "Control Groups (cgroups)", weight: 25, description: "Explains CPU quota, memory limits, and process limits." },
        { name: "Storage Layer (OverlayFS)", weight: 25, description: "Details Copy-on-Write and immutable lower layers." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Linux Kernel", "Namespaces", "Cgroups", "OverlayFS", "Architecture", "Interview"])
  },
  {
    moduleNumber: 18,
    title: "Designing a Hardened, Minimal Production Dockerfile",
    difficulty: "Intermediate",
    prompt: "You are reviewing a Dockerfile submitted by a developer. The resulting image is 1.2GB in size, runs as root, and contains full build toolchains. Walk through the architectural steps and Dockerfile directives you would implement to produce a hardened, sub-100MB production image suitable for zero-trust environments.",
    explanation: "Tests practical mastery of Dockerfile best practices: multi-stage builds, minimal base images (Alpine/Distroless), security user directives, layer optimization, and cache ordering.",
    hintsJson: JSON.stringify([
      "Explain Multi-Stage builds: separating build environment from runtime.",
      "Compare base images: Ubuntu/Debian vs Alpine vs Chainguard/Google Distroless.",
      "Explain running as non-root (USER directive and numeric UIDs).",
      "Explain .dockerignore and layer cache ordering."
    ]),
    recommendedSolution: `**Model Architecture & Implementation:**

1. **Multi-Stage Build Pattern:**
   - Discard compilers (gcc, make, python), SDKs, and source code from the final runtime image.
   - Use a full build container for compiling, then copy only the compiled binary / production assets into a clean minimal runtime base.

2. **Select a Minimal Base Image:**
   - Replace standard \`node:20\` (1GB+) or \`ubuntu\` with **Alpine Linux** (\`node:20-alpine\` ~40MB) or **Distroless** (\`gcr.io/distroless/nodejs20\` ~30MB).
   - Distroless contains ONLY the application and runtime dependencies—no shell (\`sh\`, \`bash\`), no package managers (\`apk\`, \`apt\`), drastically reducing the attack surface against remote code execution.

3. **Run as an Unprivileged Non-Root User:**
   - By default, Docker containers run as root (UID 0). A container breakout could compromise the host.
   - Create and switch to a dedicated non-root user:
     \`\`\`dockerfile
     RUN addgroup -S appgroup && adduser -S appuser -G appgroup
     USER 10001
     \`\`\`

4. **Optimize Layer Caching:**
   - Order directives from least frequently changed to most frequently changed:
     1. Base OS dependencies
     2. \`COPY package*.json ./\`
     3. \`RUN npm ci --only=production\`
     4. \`COPY src/ ./\`
   - Use \`.dockerignore\` to exclude \`.git\`, tests, local node_modules, and docs.

5. **Read-Only Root Filesystem & Dropped Capabilities:**
   - Add \`HEALTHCHECK\` instruction so container orchestrators can verify health independently.
   - In production deployment, launch with \`--read-only\` and \`--cap-drop=ALL\`.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Multi-Stage Build", weight: 25, description: "Separates compiler/build toolchain from the runtime image." },
        { name: "Minimal Base Image", weight: 25, description: "Advocates Alpine or Distroless to eliminate shells and package managers." },
        { name: "Non-Root Principle", weight: 25, description: "Explicitly specifies USER directive with dedicated unprivileged UID." },
        { name: "Layer Cache Ordering & Hygiene", weight: 25, description: "Orders dependency caching before source code and uses .dockerignore." }
      ]
    }),
    tagsJson: JSON.stringify(["Docker", "Dockerfile", "Security", "Multi-Stage", "Distroless", "Interview"])
  },
  {
    moduleNumber: 19,
    title: "Kubernetes Pod Lifecycle, Liveness, Readiness & Startup Probes Deep Dive",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Can you explain the exact lifecycle of a Kubernetes Pod from creation to termination? What is the functional difference between Liveness, Readiness, and Startup Probes, and what catastrophic bug happens if you misconfigure a Readiness probe as a Liveness probe?'",
    explanation: "Tests deep understanding of kubelet probe handlers, pod lifecycle phases, endpoints controllers, and cascading restart loops.",
    hintsJson: JSON.stringify([
      "List Pod lifecycle phases: Pending, Running, Succeeded, Failed, Unknown.",
      "Explain Startup Probe: protects slow-starting legacy apps from premature failure.",
      "Explain Liveness Probe: restarts container when process deadlocks or hangs.",
      "Explain Readiness Probe: controls traffic routing; removes pod IP from Service endpoints.",
      "Explain the catastrophe: heavy traffic causing high latency -> Liveness probe fails -> Pod restarts -> Cascading cluster crash!"
    ]),
    recommendedSolution: `**Model Answer:**

**1. Kubernetes Pod Lifecycle Phases:**
- **Pending:** Pod manifest accepted by API Server, but waiting for scheduler to bind to a node, or images are being downloaded.
- **Running:** Pod bound to a node, all containers created, at least one container is active or starting.
- **Succeeded:** All containers in the pod terminated with exit code 0 (common for CronJobs/Jobs).
- **Failed:** All containers terminated, with at least one container exiting with non-zero status.
- **CrashLoopBackOff:** Kubelet repeatedly tries to restart a crashing container with an exponential backoff delay (10s, 20s, 40s... up to 5m).

**2. The 3 Health Probes Compared:**

| Probe | Trigger Condition | Kubelet Action on Failure | Primary Purpose |
|---|---|---|---|
| **Startup Probe** | Application takes 2-3 mins to boot / warm cache | Kubelet kills & restarts container | Disables Liveness & Readiness checks until app finishes initial boot |
| **Liveness Probe** | Process deadlocked or stuck in an infinite loop | Kubelet **KILLS and RESTARTS** the container | Recovers from unrecoverable process deadlocks |
| **Readiness Probe** | App temporarily overloaded or database pool saturated | Kubelet **REMOVES Pod IP from Service Endpoints** (Does NOT kill) | Stops sending traffic until pod is healthy again |

**3. The Catastrophic Anti-Pattern: Confusing Liveness with Readiness:**
- Suppose your API experiences a traffic spike and database queries slow down from 20ms to 5 seconds.
- If you configure a **Liveness Probe** that checks database connectivity or application latency:
  1. The Liveness probe times out because the pod is overloaded.
  2. Kubelet interprets this as a fatal deadlock and **KILLS the pod**!
  3. The remaining healthy pods now absorb 100% of the traffic spike -> They slow down -> Their Liveness probes fail -> Kubelet kills them too!
  4. Result: **A Cascading Cluster Collapse** where all pods across the cluster restart in an infinite loop!
- **Rule of Thumb:**
  - Liveness probe should only check internal process health (e.g. \`GET /healthz/live\` returning 200 without querying external databases).
  - Readiness probe should check external dependencies (\`GET /healthz/ready\`) so overloaded pods shed traffic safely without getting restarted.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Probe Functional Distinction", weight: 30, description: "Accurately contrasts restart behavior (Liveness) with traffic removal (Readiness)." },
        { name: "Startup Probe Purpose", weight: 20, description: "Explains shielding slow boot times from premature kills." },
        { name: "Cascading Failure Mechanics", weight: 30, description: "Details how misconfigured liveness probes cause cluster-wide crash cascades under load." },
        { name: "Best Practice Guidelines", weight: 20, description: "Advocates lightweight in-memory checks for liveness and dependency checks for readiness." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Pod Lifecycle", "Liveness Probe", "Readiness Probe", "Reliability", "Interview"])
  },
  {
    moduleNumber: 19,
    title: "Kubernetes Service Discovery & Kube-Proxy Packet Routing (iptables vs IPVS)",
    difficulty: "Advanced",
    prompt: "How does a Pod in Kubernetes make an HTTP request to another service (e.g. 'http://payment-service:8080') and have that traffic load-balanced across multiple backend pods? Walk through CoreDNS resolution, Virtual ClusterIP, and Kube-Proxy packet translation using iptables vs IPVS.",
    explanation: "Deep networking question covering Kubernetes internal DNS, synthetic VIPs, and Linux kernel packet filtering engines.",
    hintsJson: JSON.stringify([
      "Explain CoreDNS query: payment-service.namespace.svc.cluster.local.",
      "Explain that ClusterIP is a synthetic Virtual IP (VIP), not bound to any physical interface.",
      "Explain Kube-Proxy watching API server and programming kernel routing tables.",
      "Contrast iptables (O(N) linear evaluation) vs IPVS (O(1) hash table lookup with weighted algorithms)."
    ]),
    recommendedSolution: `**Model Answer:**

**Step-by-Step Packet Traversal:**

1. **DNS Resolution (CoreDNS):**
   - Pod queries the cluster DNS server (CoreDNS, typically at \`10.96.0.10\`, configured in \`/etc/resolv.conf\`).
   - Short name \`payment-service\` expands via search domains to the FQDN:
     \`payment-service.production.svc.cluster.local\`.
   - CoreDNS returns the virtual **ClusterIP** (e.g. \`10.100.50.20\`).

2. **The Nature of ClusterIP:**
   - The ClusterIP is **NOT** a physical network interface, nor does any process listen on it. It is a synthetic Virtual IP (VIP).
   - When the client pod sends a TCP SYN packet destined for \`10.100.50.20:8080\`, the packet leaves the pod veth interface and enters the Linux kernel on the host worker node.

3. **Kube-Proxy & Kernel Packet Redirection:**
   - The **kube-proxy** daemon runs on every node, watching the Kubernetes API Server for changes to Services and EndpointSlices.
   - Kube-Proxy programs the Linux kernel to intercept packets destined for the ClusterIP VIP and rewrite the destination IP to an actual healthy backend Pod IP (DNAT - Destination Network Address Translation).

4. **iptables Mode vs IPVS Mode Comparison:**

   - **iptables Mode (Default in standard clusters):**
     - Kube-Proxy writes sequential iptables chains using the \`statistic\` module to achieve random distribution across pods.
     - **Limitation:** iptables is evaluated sequentially ($O(N)$ complexity). In clusters with 5,000+ services and tens of thousands of pods, the kernel must traverse thousands of sequential iptables rules for every single packet, causing significant CPU spikes and kernel synchronization latency.

   - **IPVS Mode (IP Virtual Server - High Scale):**
     - Leverages Linux IPVS kernel module built specifically for Layer-4 transport load balancing.
     - Implements $O(1)$ hash table lookups, maintaining steady performance regardless of cluster size (100,000+ services).
     - Supports advanced load-balancing algorithms: Round-Robin, Least Connections, Destination Hashing, and Weighted response times.

5. **Modern Evolution (eBPF / Cilium):**
   - Cutting-edge cloud architectures replace kube-proxy entirely with **Cilium eBPF**, bypassing iptables entirely by routing packets directly at the socket level within the Linux kernel.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "CoreDNS Resolution Flow", weight: 20, description: "Explains FQDN resolution and resolv.conf search paths." },
        { name: "Synthetic ClusterIP VIP", weight: 25, description: "Correctly identifies that ClusterIP is a non-routable virtual IP requiring DNAT." },
        { name: "Kube-Proxy Role", weight: 25, description: "Explains watching API server endpoints and programming kernel tables." },
        { name: "iptables vs IPVS vs eBPF", weight: 30, description: "Clearly contrasts O(N) sequential rules with O(1) hash tables and socket-level eBPF." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Networking", "Kube-Proxy", "iptables", "IPVS", "CoreDNS", "Interview"])
  },
  {
    moduleNumber: 19,
    title: "Kubernetes Service Types: ClusterIP vs NodePort vs LoadBalancer vs Ingress",
    difficulty: "Beginner",
    prompt: "A junior engineer asks: 'When should I use ClusterIP, NodePort, LoadBalancer, or an Ingress Controller in Kubernetes?' How do you explain the architectural hierarchy and use cases in a technical interview?",
    explanation: "Tests foundational knowledge of Kubernetes traffic routing primitives, OSI layers (L4 vs L7), and cost efficiency.",
    hintsJson: JSON.stringify([
      "Explain ClusterIP: internal only, default.",
      "Explain NodePort: exposes static port (30000-32767) on all node IPs.",
      "Explain LoadBalancer: provisions cloud provider external load balancer per service.",
      "Explain Ingress: single entrypoint Layer 7 reverse proxy routing multiple hostnames and paths."
    ]),
    recommendedSolution: `**Model Answer:**

**1. ClusterIP (Default - Internal Service-to-Service):**
- **How it works:** Assigns a private virtual IP accessible **ONLY** from within the Kubernetes cluster.
- **Use Case:** Backend microservices, internal databases, caching layers (Redis), and internal APIs that should never be reachable from the public internet.

**2. NodePort (Port Forwarding on Every Node):**
- **How it works:** Opens a high-range static port (default: \`30000-32767\`) across **every single worker node's** physical IP address.
- **Traffic Flow:** Client connects to \`<Node-IP>:31000\` -> Kube-Proxy routes traffic to backend pods.
- **Drawbacks:** Security risk (exposes worker node IPs), port allocation exhaustion, and doesn't support standard HTTP ports (80/443).
- **Use Case:** Development/testing, legacy on-premise infrastructure without cloud load balancers, or internal monitoring collectors.

**3. LoadBalancer (Cloud Provider Layer 4 Integration):**
- **How it works:** Automatically provisions an external cloud load balancer (e.g. AWS Network Load Balancer or Classic ELB) dedicated specifically to that Service.
- **Drawback:** Costly! If you have 50 microservices, creating 50 individual AWS LoadBalancers costs ~$1,000+/month just in load balancer idle fees.
- **Use Case:** Non-HTTP protocols requiring raw TCP/UDP throughput (game servers, MQTT, database endpoints).

**4. Ingress Controller (Layer 7 HTTP/HTTPS Router):**
- **How it works:** An Ingress Controller (e.g. Nginx, Traefik, AWS Load Balancer Controller) acts as a single centralized smart reverse proxy.
- **Features:** Hostname routing (\`api.example.com\` vs \`web.example.com\`), path-based routing (\`/orders\` vs \`/users\`), TLS termination, rate limiting, and CORS headers.
- **Cost Efficiency:** A single cloud load balancer sits in front of the Ingress Controller, routing traffic to hundreds of internal ClusterIP services—saving massive cloud infrastructure costs!`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "ClusterIP Definition", weight: 25, description: "Explains internal private cluster communication." },
        { name: "NodePort Mechanics", weight: 25, description: "Mentions 30000-32767 port opening on all node IPs." },
        { name: "LoadBalancer vs Ingress", weight: 30, description: "Contrasts L4 dedicated cloud balancers with L7 centralized path/host reverse proxies." },
        { name: "Cost & Architectural Justification", weight: 20, description: "Highlights cost savings of single Ingress over multiple cloud load balancers." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Services", "Ingress", "ClusterIP", "Networking", "Interview"])
  },
  {
    moduleNumber: 19,
    title: "How etcd Maintains Consistency in Kubernetes: Raft Consensus & Split-Brain Prevention",
    difficulty: "Advanced",
    prompt: "In Kubernetes, etcd is the single source of truth for all cluster state. Explain how the Raft consensus algorithm works inside etcd, why high-availability etcd clusters strictly require an odd number of members (3, 5, 7), and how etcd prevents split-brain scenarios during network partitions.",
    explanation: "Advanced distributed systems question testing consensus protocols, leader election, log replication, and quorum calculations.",
    hintsJson: JSON.stringify([
      "Explain the roles in Raft: Leader, Follower, Candidate.",
      "Explain Quorum formula: (N / 2) + 1.",
      "Explain why odd numbers (3, 5) tolerate failure without wasting resources.",
      "Explain network partition: how minority partition halts writes while majority continues safely."
    ]),
    recommendedSolution: `**Model Answer:**

**1. The Role of etcd in Kubernetes:**
etcd is a distributed, consistent, key-value store that stores all Kubernetes declarative state (every Pod, Deployment, Secret, ConfigMap, and Event). If etcd data is corrupted or lost, the entire Kubernetes cluster ceases to function.

**2. How the Raft Consensus Algorithm Works:**
Raft ensures that all distributed nodes in the cluster agree on the exact sequence of data changes:
- **Leader Election:**
  - Nodes start as **Followers**. If a follower stops receiving heartbeats from the leader within an election timeout, it becomes a **Candidate** and requests votes.
  - The candidate that wins votes from a strict **majority (Quorum)** becomes the **Leader**.
- **Log Replication:**
  - All write requests from the Kubernetes API Server go strictly to the Leader.
  - The leader writes the entry to its write-ahead log (WAL) and sends \`AppendEntries\` RPCs to all followers.
  - Once a majority of nodes confirm writing the entry, the leader commits it and responds to the API Server.

**3. Quorum Formula & Why Odd Numbers (3, 5, 7) are Mandatory:**
To commit any write or elect a leader, Raft requires a Quorum:
$$\\text{Quorum} = \\lfloor N / 2 \\rfloor + 1$$

| Cluster Size ($N$) | Quorum Needed | Fault Tolerance (Nodes that can fail) |
|---|---|---|
| 1 | 1 | 0 |
| 2 | 2 | 0 (If 1 fails, no quorum!) |
| **3** | **2** | **1 failure tolerated** |
| 4 | 3 | 1 failure tolerated (Adding 4th node adds NO extra fault tolerance!) |
| **5** | **3** | **2 failures tolerated** |

- Notice that a 4-node cluster requires 3 nodes for quorum and can still only survive 1 failure—the same as a 3-node cluster, but with higher networking overhead!
- Therefore, production clusters **always use odd numbers** (typically 3 for standard clusters, 5 for large enterprise clusters).

**4. How Raft Prevents 'Split-Brain' during Network Partitions:**
- Suppose a 5-node cluster is partitioned by a network failure into two halves:
  - **Partition A:** 3 nodes
  - **Partition B:** 2 nodes
- **What happens:**
  - In Partition A, $3 \\ge 3$, so it has Quorum. It can elect a leader and continue serving both reads and writes.
  - In Partition B, it only has 2 nodes. Since $2 < 3$ (fails quorum), it **CANNOT** elect a leader and rejects all write operations!
- Because it is mathematically impossible for both partitions to achieve a strict majority simultaneously ($3 + 3 = 6 > 5$), **Split-Brain is strictly prevented**.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Raft Roles & Log Replication", weight: 25, description: "Explains leader, follower, candidate, heartbeats, and write commits." },
        { name: "Quorum Mathematics", weight: 25, description: "Derives (N/2)+1 formula accurately." },
        { name: "Odd Number Justification", weight: 25, description: "Explains why even numbers add failure overhead without increasing resilience." },
        { name: "Split-Brain Prevention Proof", weight: 25, description: "Demonstrates how network partitions prevent dual leaders via majority requirements." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "etcd", "Raft", "Consensus", "Distributed Systems", "Interview"])
  },
  {
    moduleNumber: 20,
    title: "Zero-Downtime Deployment Strategies: Rolling vs Blue/Green vs Canary Tradeoffs",
    difficulty: "Advanced",
    prompt: "As a Lead Cloud Architect, compare the three primary zero-downtime deployment strategies for enterprise microservices: Rolling Update, Blue/Green Deployment, and Canary Deployment. Detail the infrastructure cost, blast radius, rollback speed, and stateful database schema migration challenges of each.",
    explanation: "Tests senior-level architecture decision making: deployment patterns, infrastructure cost vs risk mitigation, traffic shifting, and backward-compatible database schema migrations.",
    hintsJson: JSON.stringify([
      "Compare Rolling Update (in-place replacement) vs Blue/Green (duplicate identical environments) vs Canary (percentage traffic routing).",
      "Discuss rollback speed: instant pointer switch in Blue/Green vs gradual pod drain in Rolling.",
      "Explain the cost impact: Blue/Green requires 200% peak infrastructure capacity.",
      "Address Database migrations: Expand-and-Contract (Parallel Run) pattern for backward compatibility."
    ]),
    recommendedSolution: `**Model Architecture Comparison:**

### 1. Architectural Strategy Matrix:

| Dimension | Rolling Update (K8s Default) | Blue/Green Deployment | Canary Deployment |
|---|---|---|---|
| **Mechanism** | Incrementally replaces old pods with new pods (\`maxSurge\`, \`maxUnavailable\`) | Runs two identical production environments (Blue=Live, Green=New); router switches traffic 100% | Routes a small percentage (e.g. 5% -> 25% -> 100%) to the new version using service mesh/ALB |
| **Infrastructure Cost** | Low (+25% surge overhead during rollout) | **High (200% capacity)** during deployment window | Low (+5-10% capacity) |
| **Blast Radius** | Medium (all users gradually hit new version) | None during test; 100% upon cutover if undetected bug exists | **Minimal (only 5% of users impacted)** |
| **Rollback Speed** | Slow (requires reverse rolling update: 2-5 mins) | **Instant (< 1 second)** by switching DNS/ALB target group back to Blue | **Instant** by setting traffic weight back to 0% |
| **Complexity** | Simple (native in Kubernetes) | Moderate (requires duplicate infra & DNS/ALB management) | High (requires Service Mesh like Istio or AWS App Mesh, Prometheus metrics analysis) |

### 2. The Critical Database Migration Challenge (Expand and Contract Pattern):
No zero-downtime deployment strategy works if database schema migrations break backward compatibility (e.g., dropping or renaming a column)!
During a Rolling or Canary deployment, **Version 1 and Version 2 run concurrently against the same database**.

**The 3-Phase Expand-and-Contract Pattern:**
1. **Expand (Phase 1):** Add the new column/table without touching the old column. Deploy DB migration first.
2. **Dual-Write (Phase 2):** Deploy Version 2 code to write to both old and new columns, reading from the new column with fallback.
3. **Contract (Phase 3):** Once rollout is 100% stable and verified, run a cleanup migration to drop the obsolete column.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Strategy Breakdown", weight: 25, description: "Compares Rolling vs Blue/Green vs Canary mechanics accurately." },
        { name: "Tradeoff Analysis", weight: 25, description: "Contrasts 200% infrastructure cost vs instant rollback and minimal blast radius." },
        { name: "Canary Metric Gating", weight: 25, description: "Explains progressive percentage routing and automated rollback on error spikes." },
        { name: "Database Schema Backward Compatibility", weight: 25, description: "Details the Expand-and-Contract pattern for concurrent multi-version DB access." }
      ]
    }),
    tagsJson: JSON.stringify(["CI/CD", "Deployments", "Blue-Green", "Canary", "RollingUpdate", "Database Migration", "Interview"])
  }
];

