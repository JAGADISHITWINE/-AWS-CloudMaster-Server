module.exports = [
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
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
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
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
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
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
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    title: "Why is Git Considered Safer Against Data Loss Than Centralized Systems Like SVN?",
    difficulty: "Beginner",
    prompt: "In a DevOps engineering interview, the interviewer asks: 'Why is Git's Distributed Version Control (DVCS) model considered substantially safer against data loss and catastrophic outages compared to centralized systems like SVN or CVS?' How do you explain the architectural difference?",
    explanation: "Tests understanding of Centralized vs Distributed VCS architecture, single points of failure, full clone backups, and disaster recovery.",
    hintsJson: JSON.stringify([
      "Discuss where the repository history resides in CVCS vs DVCS.",
      "Explain the consequence if a central SVN server crashes or suffers disk corruption.",
      "Explain what every 'git clone' contains: a 100% full mirror of all commits, tags, and branches."
    ]),
    recommendedSolution: `**Model Answer:**

**1. Centralized Version Control (CVCS - e.g., SVN):**
- In a centralized system, the entire project revision history, branch database, and commit logs reside **exclusively on a single central remote server**.
- Developers only check out a lightweight snapshot of the latest working files.
- **The Single Point of Failure (SPOF):** If that central SVN server goes offline, no developer can commit, branch, or view history. If the central disk suffers fatal corruption without a verified offsite backup, the entire project's historical evolution is permanently lost.

**2. Distributed Version Control (DVCS - Git):**
- In Git, every single developer who executes \`git clone\` downloads a **complete, standalone replica of the entire repository history**—including all past commits, every branch, every tag, and all cryptographic snapshots.
- **Resilience Against Data Loss:** Every developer's local machine acts as a full off-site backup. If GitHub, GitLab, or the central hosting server were completely destroyed tomorrow, **any single developer's local clone** can be pushed to a new server to fully restore the complete project history without losing a single commit or author attribution.
- Furthermore, because Git uses cryptographic SHA-1/SHA-256 hashes to link parent commits, any corruption in data is immediately detected by Git's content-addressable hash validation.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Architectural Comparison", weight: 30, description: "Contrasts central server dependency (SVN) with distributed local clones (Git)." },
        { name: "Single Point of Failure Analysis", weight: 30, description: "Identifies central server outage/corruption risk in CVCS." },
        { name: "Full Clone Disaster Recovery", weight: 25, description: "Explains how any developer clone can restore 100% of repository history." },
        { name: "Cryptographic Integrity", weight: 15, description: "Mentions content-addressable SHA hashing preventing silent bit-rot." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "DVCS", "SVN", "Architecture", "Data Safety", "Disaster Recovery"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    title: "Give Practical Reasons Why a Developer Prefers Git's Distributed Model Day-to-Day",
    difficulty: "Beginner",
    prompt: "An interviewer asks: 'Aside from disaster recovery, give practical, real-world reasons why a software or DevOps engineer would prefer Git's distributed model over a centralized system in their daily work.' What practical advantages do you highlight?",
    explanation: "Focuses on daily developer productivity: offline work, instant local commit speed, cheap branching, and local staging flexibility.",
    hintsJson: JSON.stringify([
      "Mention working without network access (e.g., flights, commute, outages).",
      "Explain the speed difference between local file system operations vs network socket roundtrips.",
      "Discuss cheap local feature branching and atomic local commits."
    ]),
    recommendedSolution: `**Model Answer:**

**1. 100% Offline Productivity:**
- In Git, version control happens at the individual workstation level first. A developer can commit, branch, view historical logs, inspect diffs, and switch branches completely offline (e.g. while traveling on an airplane, during internet outages, or behind strict firewalls).
- Centralized tools like SVN require an active network connection to the central server for every commit, diff, or branch creation.

**2. Zero Network Latency & Blazing Fast Performance:**
- Because operations execute against the local \`.git\` folder on local NVMe/SSD storage, commands like \`git commit\`, \`git status\`, \`git diff\`, and \`git log\` execute in milliseconds.
- In CVCS, every commit involves network handshake, remote locking, and wire serialization.

**3. Frictionless, Cheap Local Branching:**
- A Git branch is merely a lightweight 41-byte movable pointer to a commit hash. Creating a branch (\`git checkout -b feature\`) is instantaneous and consumes almost zero disk space.
- Engineers can experiment freely, create throwaway spike branches, and delete them locally without polluting the remote team repository.

**4. Granular, Atomic Staging with Staging Area (Index):**
- Developers can stage and commit small, logical units of work locally without bothering teammates or triggering premature CI pipeline builds until they are ready to \`git push\`.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Offline Work Capabilities", weight: 30, description: "Explains committing and reviewing history without internet connectivity." },
        { name: "Local NVMe Speed vs Network Roundtrips", weight: 25, description: "Contrasts local millisecond commands with remote network latency." },
        { name: "Cheap Branching Economics", weight: 25, description: "Explains lightweight 41-byte branch pointers vs heavy server branches." },
        { name: "Granular Local Staging", weight: 20, description: "Discusses grouping atomic commits locally before pushing to remote." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Developer Experience", "Productivity", "Branching", "DVCS"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    title: "Walk Through the Three Sections of Git and Why Git Uses a Separate Staging Area",
    difficulty: "Beginner",
    prompt: "During a technical screening: 'Explain the three sections a file moves through on a local machine before becoming part of Git's history. Why does Git bother with a separate Staging Area instead of committing the working directory directly like SVN?'",
    explanation: "Evaluates understanding of Git's three-tree architecture (Working Directory, Staging Area/Index, Local Repository) and the intentional purpose of selective staging.",
    hintsJson: JSON.stringify([
      "Name the 3 sections: Working Directory, Staging Area (Index), and Local Repository.",
      "Explain the state of files in each section: untracked, staged, and committed.",
      "Explain why committing directly would lead to messy, cluttered commits."
    ]),
    recommendedSolution: `**Model Answer:**

**The Three Sections of Git:**
1. **Working Directory (Workspace):**
   - The actual folder on disk where you create, modify, and delete files.
   - Files here are **untracked** (Git knows they exist on disk but has not started tracking their history) or **modified** (tracked files with unstaged edits).
   - Moving to next section: \`git add <file>\`.

2. **Staging Area (Index / Cache):**
   - An intermediate memory area (\`.git/index\`) that acts as a staging dock or preview zone for the next commit snapshot.
   - Files here are **staged**—marked as 'ready to be permanently recorded' in the project ledger.
   - Moving backward: \`git rm --cached <file>\` or \`git reset <file>\` moves files back to Working Directory without losing disk edits.
   - Moving forward: \`git commit -m "<msg>"\`.

3. **Local Repository (.git DAG):**
   - Where actual version controlling happens.
   - Contains immutable, cryptographically hashed commit snapshots, trees, blobs, and branches.
   - Files here are **committed**—permanently retrievable milestones in the repository history.

**Why Git Uses a Separate Staging Area Instead of Committing Directly:**
- **Intentional, Atomic Commits:** In real-world software engineering, developers often edit multiple files simultaneously (e.g. implementing Feature A, fixing a bug in Feature B, and leaving temporary debug logs in Config C).
- Without a staging area, you would be forced to commit all changes together in one massive, noisy commit.
- The Staging Area allows you to selectively choose exactly which files and line changes belong together (\`git add -p\`), crafting clean, atomic, easily auditable commits with focused messages.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Three Sections Identification", weight: 35, description: "Accurately describes Working Directory, Staging Area, and Local Repo." },
        { name: "State Transitions & Commands", weight: 25, description: "Explains git add, git commit, and unstaging with git rm --cached." },
        { name: "Rationale for Staging Area", weight: 30, description: "Explains atomic commit grouping vs dumping all edits blindly." },
        { name: "Clarity & Professional Terminology", weight: 10, description: "Uses precise Git terms (Index, DAG, untracked, staged)." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Three Sections", "Staging Area", "Index", "Core Concepts"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    title: "Accidental 'git add' on Wrong File: Safest Recovery and Why 'git status' is Vital",
    difficulty: "Beginner",
    prompt: "An interviewer asks: 'Suppose you accidentally ran git add on a sensitive file (.env containing API tokens) or an unintended file. What is the safest way to undo this before committing? Why is git status considered the single most important command in Git?'",
    explanation: "Tests knowledge of safe unstaging commands (git rm --cached vs git reset) and the critical role of git status in preventing mistakes.",
    hintsJson: JSON.stringify([
      "Distinguish between 'git rm --cached' and destructive 'git rm'.",
      "Mention 'git reset <file>' as an equivalent alternative.",
      "Explain the 3 status states reported by 'git status': Untracked (red), Staged (green), and Unmodified/Committed."
    ]),
    recommendedSolution: `**Model Answer:**

**1. The Safest Way to Undo an Accidental 'git add':**
- Run:
  \`\`\`bash
  git rm --cached <filename>
  # OR equivalently:
  git reset <filename>
  # OR modern Git:
  git restore --staged <filename>
  \`\`\`
- **Why this is safe:** \`git rm --cached\` removes the file from the Staging Area (index) while leaving the physical file on your disk completely intact and unchanged. It safely transitions the file from "staged for commit" back to "untracked" or "modified".
- **CRITICAL WARNING:** Never run plain \`git rm <filename>\` without the \`--cached\` flag! Plain \`git rm\` physically deletes the file from disk, causing permanent data loss for uncommitted files.

**2. Why 'git status' is Considered the Most Important Git Command:**
- \`git status\` provides an **instant, unambiguous radiographic scan** of the entire three-section repository state:
  - **Red text:** Untracked new files or modified files in the Working Directory.
  - **Green text:** Files currently staged in the Index ready to be committed.
  - **Branch state:** Which branch HEAD points to and whether local is ahead/behind remote.
- Running \`git status\` constantly—before staging, immediately after staging, and right before running \`git commit\`—completely eliminates guesswork and prevents accidental commits of secrets, debug code, or broken files.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Safe Unstaging Syntax", weight: 35, description: "Names 'git rm --cached' or 'git reset' to unstage without deleting disk files." },
        { name: "Caution Against Plain 'git rm'", weight: 25, description: "Explicitly warns that plain 'git rm' destroys the file on disk." },
        { name: "Role of 'git status'", weight: 30, description: "Explains how git status eliminates guesswork across all three sections." },
        { name: "Engineering Discipline", weight: 10, description: "Recommends checking status before and after every staging action." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Unstaging", "git status", "Safety", "Common Mistakes"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    title: "Emergency Response: AWS Credentials Leaked in Git History — Complete DAG Purging",
    difficulty: "Advanced",
    prompt: "During an emergency security incident, a developer committed and pushed an AWS IAM Secret Access Key to a public GitHub repository 20 commits ago. Automated bots crawled the repository within 90 seconds. As the Lead DevOps/SecOps Engineer: What is your immediate incident response sequence? Explain why running 'git rm' in a new commit fails to resolve the security breach, and detail the exact architectural procedure to purge the credential from the Git DAG across all branches, tags, and reflogs.",
    explanation: "Tests enterprise security incident response, Git content-addressable storage mechanics (blobs, trees, commits), and irreversible history rewriting using modern tools like git-filter-repo.",
    hintsJson: JSON.stringify([
      "First priority: Credential revocation and IAM rotation in AWS (never assume the secret is safe).",
      "Explain why 'git rm' leaves blobs in historical commit trees and git reflog.",
      "Detail 'git-filter-repo' (recommended by Git core team over legacy git filter-branch or BFG).",
      "Explain expiring reflogs and forcing aggressive garbage collection: 'git reflog expire' and 'git gc --prune=now'.",
      "Mention force pushing with '--force-with-lease' and invalidating GitHub's cache."
    ]),
    recommendedSolution: `**Model Answer & Production Incident Response Runbook:**

### Phase 1: Immediate Containment (AWS Cloud Level - T+0 to T+5 mins)
*Crucial Principle: Assume the credential is fully compromised the instant it reached the remote.*
1. **Immediate Revocation in AWS IAM:**
   - Log into AWS Console / CLI with root/admin credentials.
   - Deactivate or delete the compromised Access Key ID immediately:
     \`\`\`bash
     aws iam update-access-key --access-key-id AKIAEXAMPLE --status Inactive --user-name compromised-user
     aws iam delete-access-key --access-key-id AKIAEXAMPLE --user-name compromised-user
     \`\`\`
2. **Audit AWS CloudTrail:**
   - Query CloudTrail logs for all API calls made with the compromised \`accessKeyId\` over the last 24 hours to check for unauthorized resource provisioning (e.g. rogue EC2 crypto-mining instances, IAM backdoor role creation, or S3 bucket data exfiltration).

---

### Phase 2: Why 'git rm' in a New Commit Fails
Running \`git rm secret.json && git commit -m "delete secret"\` only removes the file from the **new HEAD snapshot**.
- The secret **still resides permanently** in the previous 20 commit objects, in the tree objects referencing the blob hash, in the repository packfiles, and in \`git reflog\`.
- Anyone who runs \`git clone\` or \`git checkout <commit-sha>\` can read the secret in plain text.

---

### Phase 3: Total DAG History Eradication (Git Repository Level)
To permanently expunge the secret from all commits, branches, and tags, we rewrite the repository history using \`git-filter-repo\` (the official tool recommended by the Git core team):

1. **Install and Run git-filter-repo:**
   \`\`\`bash
   # Create a fresh mirror clone to avoid reference corruption
   git clone --mirror https://github.com/organization/production-app.git repo-purge
   cd repo-purge

   # Completely strip the sensitive file across every historical commit:
   git filter-repo --invert-paths --path server/config/secrets.json
   # OR replace the secret string itself across all files:
   # git filter-repo --replace-text expressions.txt
   \`\`\`

2. **Purge Reflogs & Execute Aggressive Garbage Collection:**
   \`\`\`bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   \`\`\`

3. **Force Push the Sanitized History:**
   \`\`\`bash
   git remote add origin https://github.com/organization/production-app.git
   git push origin --force --all
   git push origin --force --tags
   \`\`\`

4. **Contact GitHub Support:**
   - GitHub retains orphaned cached commit SHAs in pull requests and view views on their backend for up to 90 days. Contact GitHub Support to request an immediate **ref cache purge** for the repository.

---

### Phase 4: Long-Term Prevention Guardrails
- **Pre-commit Hooks:** Enforce automated secrets scanning on developer laptops using \`gitleaks\` or \`trufflehog\`.
- **GitHub Push Protection:** Enable Secret Scanning with automatic Push Protection in GitHub Repository Settings to block commits containing cloud tokens before they ever leave the workstation.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Immediate Cloud Containment", weight: 25, description: "Prioritizes immediate IAM key deactivation and CloudTrail blast radius audit." },
        { name: "Git DAG Blob Understanding", weight: 25, description: "Explains why git rm fails to remove blobs from parent commit trees." },
        { name: "History Rewriting Execution", weight: 30, description: "Provides precise steps for git-filter-repo, reflog expiration, and aggressive gc." },
        { name: "Enterprise Prevention & Guardrails", weight: 20, description: "Recommends pre-commit hooks, GitHub push protection, and backend cache purge." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Security", "AWS IAM", "Incident Response", "git-filter-repo", "Advanced"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    title: "High-Severity Outage: Automated Bug Hunting in 1,000 Commits via 'git bisect run'",
    difficulty: "Intermediate",
    prompt: "Following a release containing 600 merged commits across 30 engineers, checkout conversions abruptly drop by 25% due to a silent JSON payload serialization bug. The bug is deterministic and reproducible via a terminal curl command or automated test script. Nobody knows which commit introduced the regression. Explain the mathematical mechanics of 'git bisect', how to automate the diagnosis in under 60 seconds using 'git bisect run', and how to handle commits that fail to compile due to unrelated syntax errors.",
    explanation: "Evaluates knowledge of Git's binary search diagnostics, test automation integration with exit codes, and operational edge cases (git bisect skip).",
    hintsJson: JSON.stringify([
      "Explain binary search complexity: O(log2 N). 600 commits takes only ~9 to 10 checks.",
      "Explain exit code protocol: 0 = good, 1-127 (except 125) = bad, 125 = untestable/skip.",
      "Detail 'git bisect start', 'git bisect bad', 'git bisect good', and 'git bisect run'.",
      "Mention 'git bisect reset' to restore the working directory after finding the culprit."
    ]),
    recommendedSolution: `**Model Answer:**

### 1. Mathematical Mechanics of 'git bisect'
- In a release with $N = 600$ commits, testing each commit manually in linear order requires $O(N) = 600$ test executions.
- \`git bisect\` uses **Binary Search** across the repository commit Directed Acyclic Graph (DAG):
  $$\\text{Steps} = \\lceil \\log_2(600) \\rceil = 10 \\text{ iterations}$$
- Git checks out the exact middle commit between the known 'good' commit and the 'bad' commit. Depending on the test result, it halves the search space until only the culprit commit remains.

---

### 2. Full Automation via 'git bisect run'
Instead of manually compiling and testing 10 times, you can delegate the entire diagnostic search to a shell script:

**Step 1: Write an automated test script (\`test-runner.sh\`):**
\`\`\`bash
#!/bin/bash
# test-runner.sh
# 1. Build the microservice
npm run build --silent || exit 125   # Code 125 signals Git to SKIP unbuildable commits!

# 2. Run the specific regression unit test
npm test -- -t "serializes checkout payload correctly"
# The test command automatically returns exit code 0 on PASS, or non-zero on FAIL.
\`\`\`
\`\`\`bash
chmod +x test-runner.sh
\`\`\`

**Step 2: Initialize the Bisect Session:**
\`\`\`bash
git bisect start
git bisect bad HEAD                  # Current broken release tag / commit
git bisect good v2.4.0               # Last known good release tag where checkout worked
\`\`\`

**Step 3: Launch the Automated Binary Search:**
\`\`\`bash
git bisect run ./test-runner.sh
\`\`\`
Git will automatically check out commits, execute \`./test-runner.sh\`, read the exit code, and converge on the broken commit in seconds. Output:
\`\`\`
7a8b9c0d1e2f is the first bad commit
Author: engineer@company.com
Date:   Tue Nov 3 14:22:10 2026
    fix(order): refactor payment serialization format
\`\`\`

**Step 4: Conclude and Reset:**
\`\`\`bash
git bisect reset                     # Returns HEAD back to where you started
\`\`\`

---

### 3. Handling Unrelated Compilation Failures (Exit Code 125)
If intermediate commits cannot be tested because a broken asset or syntax error prevents the application from building:
- In manual mode: run \`git bisect skip\`. Git will pick a neighboring commit.
- In automated script mode: exit with **code 125** (\`exit 125\`). Git specifically reserves code 125 to mean *"this commit is untestable; skip it and pick another candidate"*.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Binary Search Algorithmic Foundation", weight: 25, description: "Explains O(log2 N) efficiency vs O(N) linear manual auditing." },
        { name: "Automated Bisect Execution", weight: 35, description: "Details git bisect start, good/bad markers, and git bisect run with test scripts." },
        { name: "Exit Code Protocol (0 vs 125)", weight: 25, description: "Explains return codes and specifically exit code 125 for skipped/untestable commits." },
        { name: "Session Cleanup", weight: 15, description: "Mentions running git bisect reset to restore developer workspace." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Debugging", "git bisect", "Automation", "Performance", "Intermediate"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    title: "Surgical Release Management: Git Cherry-Pick vs Merge for Zero-Downtime Hotfixes",
    difficulty: "Intermediate",
    prompt: "A critical zero-day remote code execution vulnerability is identified in production ('v2.4-stable'). A senior developer already committed the fix on an active, fast-moving feature branch ('feature/order-v3'), but that feature branch contains 42 other unreviewed commits that cannot be deployed to production under any circumstances. Walk through how you surgically extract only the security fix into production using 'git cherry-pick'. What are the operational risks of cherry-picking, and how does the '-x' flag maintain traceability?",
    explanation: "Tests enterprise release engineering, surgical commit extraction, handling cherry-pick conflicts, and commit provenance tracking.",
    hintsJson: JSON.stringify([
      "Explain the purpose of git cherry-pick: applying the diff patch of a single specific commit SHA.",
      "Explain the '-x' flag: appends '(cherry picked from commit ...)' to preserve traceability.",
      "Explain why merging the entire branch is unacceptable in high-stakes production deployments.",
      "Discuss the risk of duplicate commits and future merge reconciliation."
    ]),
    recommendedSolution: `**Model Answer:**

### 1. Why Git Merge is Inappropriate Here
- Running \`git merge feature/order-v3\` into \`v2.4-stable\` would integrate all 42 incomplete, unverified feature commits into production, introducing massive risk and violating release change controls.
- What is needed is **surgical isolation**: applying strictly the single commit containing the security patch without pulling in any adjacent work.

---

### 2. Step-by-Step Surgical Cherry-Pick Workflow

**Step 1: Locate the Security Patch Commit Hash:**
\`\`\`bash
git log --oneline feature/order-v3 -n 10
# Output: 4f2c1a8 fix(security): sanitize user inputs against CVE-2026-4421
\`\`\`

**Step 2: Create a Dedicated Hotfix Branch from Production:**
\`\`\`bash
git checkout -b hotfix/cve-2026-4421 v2.4-stable
\`\`\`

**Step 3: Execute the Cherry-Pick with Provenance Tracking:**
\`\`\`bash
git cherry-pick -x 4f2c1a8
\`\`\`
- **Why the '-x' flag is essential:** It automatically appends a standardized metadata line to the commit message:
  \`(cherry picked from commit 4f2c1a8b9c0d1e2f...)\`
  This provides immutable traceability for security auditors and prevents confusion during future merge reconciliation.

**Step 4: Resolving Potential Cherry-Pick Conflicts:**
If the cherry-picked patch conflicts with older code in \`v2.4-stable\`:
\`\`\`bash
# 1. Check conflicted files
git status
# 2. Resolve conflict markers in code editor
# 3. Stage resolved file:
git add src/middleware/sanitizer.js
# 4. Conclude cherry-pick without creating extra commit:
git cherry-pick --continue
\`\`\`

**Step 5: Verify, Tag, and Deploy:**
\`\`\`bash
# Verify the patch is atomic and isolated:
git show HEAD
# Run test suite and merge into production:
git checkout v2.4-stable
git merge --ff-only hotfix/cve-2026-4421
git tag -a v2.4.1 -m "release: patch CVE-2026-4421"
git push origin v2.4-stable --tags
\`\`\`

---

### 3. Operational Risks of Cherry-Picking
1. **Duplicate Commits (Different SHAs):** Because cherry-pick calculates a new patch on a different parent, the new commit receives a brand-new SHA hash. Later, when \`feature/order-v3\` is merged into main, Git must reconcile two commits containing the same logical changes.
2. **Missing Dependencies:** If the hotfix commit depended on utility functions introduced 2 commits prior on the feature branch, the cherry-picked code will fail to compile unless those dependencies are also identified and backported.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Surgical Isolation Rationale", weight: 25, description: "Explains why merging the feature branch violates production release controls." },
        { name: "Step-by-Step CLI Execution", weight: 35, description: "Details branch creation from production tag, cherry-pick with -x, and conflict resolution." },
        { name: "Traceability with '-x' Flag", weight: 20, description: "Explains how -x maintains provenance back to the original source commit SHA." },
        { name: "Operational Risk Analysis", weight: 20, description: "Discusses duplicate commit SHAs and uncarried code dependencies." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Release Engineering", "git cherry-pick", "Hotfix", "Zero Downtime", "Intermediate"])
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    title: "Scaling Enterprise Git Monorepos: Git LFS, Shallow Clones & Sparse Checkout",
    difficulty: "Advanced",
    prompt: "Your enterprise engineering organization maintains a 25 GB monolithic Git repository containing web services, Docker base images, and machine learning model weights (.onnx, .bin). CI/CD pipeline checkout times take 18 minutes, and developers run out of laptop storage. How do you re-architect this repository? Contrast Git LFS with Git Blobs, explain shallow vs blobless clones, and detail how Sparse Checkout allows developers to work on a single microservice folder.",
    explanation: "Evaluates enterprise repository scaling, large binary handling, Git LFS pointer mechanics, and modern clone optimization flags.",
    hintsJson: JSON.stringify([
      "Explain Git LFS: stores tiny text pointer files in Git; stores heavy binaries in object storage (S3).",
      "Explain Shallow Clone ('--depth 1') vs Partial/Blobless Clone ('--filter=blob:none').",
      "Explain Sparse Checkout ('git sparse-checkout set <folder>') for downloading only relevant directories.",
      "Discuss CI/CD pipeline acceleration from 18 minutes down to 30 seconds."
    ]),
    recommendedSolution: `**Model Architecture & Scaling Strategy:**

### 1. The Monorepo Storage Problem
Standard Git stores all file revisions as complete compressed zlib **blobs** in \`.git/objects/\`. When binary files (weights, video assets, container archives) are updated repeatedly, the \`.git\` folder balloons exponentially because binaries cannot be delta-compressed efficiently.

---

### 2. Architectural Solution 1: Git LFS (Large File Storage)
- **Mechanics:** Instead of committing raw 500 MB binary files into the Git commit tree, Git LFS commits a tiny **130-byte pointer file** containing the SHA-256 hash and file size.
- The actual binary payloads are uploaded via HTTP to external cloud object storage (e.g. AWS S3 / GitHub LFS storage).
- **Implementation:**
  \`\`\`bash
  # Install and track binary patterns:
  git lfs install
  git lfs track "*.onnx" "*.tar.gz" "*.mp4"
  git add .gitattributes
  git commit -m "chore: track large models with Git LFS"
  \`\`\`
- **Developer Benefit:** Clones only download pointer files; binary files are fetched lazily on-demand.

---

### 3. Architectural Solution 2: Sparse Checkout (Local Workspace Optimization)
In a monorepo with 100 microservices, an engineer working on the \`payment-service\` should never have to download or mount the remaining 99 services:
\`\`\`bash
# 1. Initialize clone with sparse checkout disabled:
git clone --no-checkout https://github.com/org/enterprise-monorepo.git
cd enterprise-monorepo

# 2. Enable sparse-checkout in cone mode:
git sparse-checkout init --cone

# 3. Specify only the target microservice folder:
git sparse-checkout set services/payment-service shared/libs

# 4. Checkout working tree:
git checkout main
\`\`\`
**Result:** The engineer's disk only populates \`services/payment-service\` and \`shared/libs\`. The other 20+ GB of files remain unpopulated on disk!

---

### 4. Architectural Solution 3: CI/CD Pipeline Acceleration
In Jenkins or GitHub Actions runners, downloading the full 10-year commit history on every build is wasteful:
1. **Shallow Clone (\`--depth 1\`):**
   \`\`\`bash
   git clone --depth 1 -b main https://github.com/org/repo.git
   \`\`\`
   Downloads strictly the latest commit snapshot without historical parents.
2. **Blobless Clone (\`--filter=blob:none\`):**
   \`\`\`bash
   git clone --filter=blob:none https://github.com/org/repo.git
   \`\`\`
   Downloads all commit metadata and tree structures for all branches (so \`git log\` and \`git merge\` work instantaneously), but downloads file blobs only when a file is actively checked out.
- **Outcome:** CI checkout latency drops from **18 minutes to ~15 seconds**, saving gigabytes of runner network bandwidth.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Git LFS Architecture & Pointer Mechanics", weight: 30, description: "Explains pointer text files in Git DAG vs external object storage (S3)." },
        { name: "Sparse Checkout Workflow", weight: 25, description: "Details sparse-checkout cone mode for isolating specific microservice directories." },
        { name: "Shallow vs Blobless Clone Optimization", weight: 25, description: "Contrasts --depth 1 with --filter=blob:none for CI/CD acceleration." },
        { name: "Enterprise Performance Impact", weight: 20, description: "Quantifies checkout latency reduction from 18 minutes to seconds." }
      ]
    }),
    tagsJson: JSON.stringify(["Git", "Monorepo", "Git LFS", "Sparse Checkout", "Performance", "CI/CD", "Advanced"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
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
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
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
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
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
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
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
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
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
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    title: "Architecting Zero-Trust AWS Authentication in GitHub Actions with OpenID Connect (OIDC)",
    difficulty: "Advanced",
    prompt: "In an enterprise Cloud & DevOps security interview: 'Why is storing long-lived AWS IAM Access Keys and Secret Keys inside GitHub Actions Secrets considered an unacceptable security risk in production? Detail how to implement OpenID Connect (OIDC) between GitHub Actions and AWS IAM, how token exchange works cryptographically, and how IAM trust policies prevent unauthorized repositories from assuming privileged roles.'",
    explanation: "Evaluates zero-trust cloud security, credential lifecycle, temporary STS credentials via OIDC federation, and least-privilege IAM trust policy condition keys.",
    hintsJson: JSON.stringify([
      "Explain the risk of static long-lived IAM keys (leakage, rotation overhead, lack of scoping).",
      "Explain OIDC federation: GitHub's OIDC IdP issues a signed JWT with claims (repo, branch, environment).",
      "Detail 'aws-actions/configure-aws-credentials' requesting temporary STS AssumeRoleWithWebIdentity credentials.",
      "Detail IAM Trust Policy conditions: StringEquals on 'token.actions.githubusercontent.com:sub' and 'aud: sts.amazonaws.com'."
    ]),
    recommendedSolution: `**Model Answer:**

**The Danger of Long-Lived Static AWS Credentials:**
1. **Blast Radius & Leakage:** Long-lived IAM keys (\`AKIA...\`) stored in GitHub Secrets never expire automatically. If printed in debugging logs, cloned by untrusted forks, or compromised via a supply-chain dependency attack, attackers gain permanent cloud access.
2. **Rotation Overhead:** Rotating keys across dozens of repositories and microservices is manual, error-prone, and frequently skipped.

**The Modern Enterprise Solution: OpenID Connect (OIDC) Federation:**
OIDC allows GitHub Actions workflows to authenticate directly with AWS IAM using short-lived (default 1 hour) temporary credentials issued by AWS STS, eliminating long-lived secrets completely.

**Cryptographic Token Exchange Workflow:**
1. **GitHub Runner requests a JWT:** When a workflow step runs \`aws-actions/configure-aws-credentials\`, GitHub's OIDC provider issues a cryptographically signed JSON Web Token (JWT) containing verifiable claims (\`sub\`, \`aud\`, \`repository\`, \`ref\`).
2. **Workflow calls AWS STS:** The action calls \`sts:AssumeRoleWithWebIdentity\`, sending the JWT and target IAM Role ARN to AWS.
3. **AWS IAM validates the Token:** AWS verifies GitHub's public OIDC keys (\`https://token.actions.githubusercontent.com\`) and evaluates the IAM Role's **Trust Relationship Policy**.
4. **STS returns Temporary Credentials:** AWS STS generates temporary credentials (\`AccessKeyId\`, \`SecretAccessKey\`, \`SessionToken\`) with least-privilege permissions that automatically expire in 60 minutes.

**Configuring the IAM Role Trust Policy (Least-Privilege Scoping):**
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:my-org/my-production-app:ref:refs/heads/main"
        }
      }
    }
  ]
}
\`\`\`
*Critical Security Note:* Always constrain the \`sub\` (subject) claim to the exact organization, repository, and branch to prevent other GitHub users or untrusted feature branches from assuming your role.

**GitHub Actions Workflow Configuration:**
\`\`\`yaml
permissions:
  id-token: write   # Required to request the GitHub OIDC JWT
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://prod-static-assets/
\`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Static Key Vulnerabilities", weight: 20, description: "Identifies risks of static IAM credentials and lack of automatic rotation." },
        { name: "OIDC Handshake Mechanics", weight: 30, description: "Explains signed JWT exchange with AWS STS AssumeRoleWithWebIdentity." },
        { name: "Trust Policy Condition Keys", weight: 30, description: "Specifies strict condition checks for 'sub' and 'aud' claims." },
        { name: "Workflow Implementation", weight: 20, description: "Includes 'id-token: write' permission and aws-actions configuration." }
      ]
    }),
    tagsJson: JSON.stringify(["GitHub Actions", "AWS IAM", "OIDC", "Security", "STS", "Zero Trust", "Interview"])
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    title: "Designing Resilient CI/CD Pipelines: GitHub Actions Matrix Builds, Concurrency & Environment Protection",
    difficulty: "Intermediate",
    prompt: "A SaaS company runs a polyglot microservice backend and cross-platform CLI tool. How do you design a GitHub Actions workflow that: (1) runs unit tests across multiple Node.js versions (18, 20) and Operating Systems (ubuntu-latest, windows-latest) in parallel without duplicating YAML, (2) automatically cancels redundant in-flight builds when a developer pushes subsequent commits to an open PR, and (3) enforces human peer approval before deploying to the 'production' cloud environment?",
    explanation: "Tests practical mastery of GitHub Actions matrix strategies, concurrency group cancellation, and GitHub Environments with deployment protection rules.",
    hintsJson: JSON.stringify([
      "Explain 'strategy.matrix' with combinations of os and node-version.",
      "Explain 'concurrency' with group keys and 'cancel-in-progress: true'.",
      "Explain GitHub Environments, environment secrets, and Required Reviewers protection gates."
    ]),
    recommendedSolution: `**Model Answer:**

**1. Parallel Multi-Dimensional Testing via Strategy Matrix:**
Instead of copying and pasting separate workflow files, define a \`strategy.matrix\`. GitHub Actions multiplies the matrix dimensions, running 4 isolated parallel runner jobs simultaneously:
\`\`\`yaml
jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false  # Don't cancel other jobs if one OS fails
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
\`\`\`

**2. Eliminating Wasted Compute with Concurrency Groups:**
When developers push 3 rapid commits to an active Pull Request, 3 separate CI pipelines trigger. To prevent queue congestion and cut GitHub Actions billing costs, define a \`concurrency\` block with \`cancel-in-progress: true\`:
\`\`\`yaml
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`
*Mechanics:* Any newly pushed commit immediately terminates all executing jobs from the prior commit on that PR branch, ensuring only the latest commit consumes runner minutes.

**3. Enterprise Deployment Gates with GitHub Environments:**
To ensure zero unauthorized deployments to production:
- Create a GitHub **Environment** named \`production\` under Repository Settings -> Environments.
- Enable **Required Reviewers**: Specify the DevOps Lead or SRE team. Deployment automatically pauses until an authorized reviewer clicks "Review deployments -> Approve".
- Bind Production Secrets (e.g. database credentials) strictly to the \`production\` environment, keeping them completely inaccessible to feature branch PRs.
\`\`\`yaml
jobs:
  deploy-prod:
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
        env:
          PROD_DB_HOST: \${{ secrets.PROD_DB_HOST }}
\`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Matrix Strategy Definition", weight: 35, description: "Demonstrates strategy.matrix syntax across multiple OS and runtime versions." },
        { name: "Concurrency Group Optimization", weight: 30, description: "Explains cancel-in-progress to save runner compute on rapid commits." },
        { name: "Environment Protection Gates", weight: 35, description: "Explains GitHub Environments, required approvers, and environment secret scoping." }
      ]
    }),
    tagsJson: JSON.stringify(["GitHub Actions", "CI/CD", "Matrix Builds", "Concurrency", "Environments", "DevOps", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
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
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
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
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    title: "What Does Jenkins Actually Automate & What Is a Jenkins Plugin Conceptually?",
    difficulty: "Beginner",
    prompt: "In a fundamental DevOps engineering interview: 'In one sentence, what does Jenkins actually automate? What is a Jenkins plugin conceptually, and why does Jenkins rely on plugins instead of bundling everything natively?' How do you answer?",
    explanation: "Tests foundational understanding of Jenkins as an automation orchestrator rather than a build tool, and its modular plugin architecture.",
    hintsJson: JSON.stringify([
      "State clearly that Jenkins orchestrates build/test/deploy tools in repeatable automated sequences.",
      "Explain that a plugin extends Jenkins core functionality to integrate external tools (Git, Maven, Slack).",
      "Mention that the plugin model keeps the core server lightweight while supporting infinite toolchains."
    ]),
    recommendedSolution: `**Model Answer:**

**In One Sentence, What Jenkins Automates:**
Jenkins automates the **end-to-end orchestration** of building, testing, and deploying software—triggering the right development tools in the correct sequence automatically whenever code changes, instead of an engineer executing manual commands by hand.

**What is a Jenkins Plugin Conceptually?**
A Jenkins plugin is an independently versioned software module that extends Jenkins' core capabilities to integrate with external tools, cloud providers, and services. 
- *Examples:*
  - **Git Plugin:** Enables Jenkins to poll repositories, clone branches, and checkout commits.
  - **Maven Plugin:** Provides build step execution and automated POM parsing.
  - **Email-ext Plugin:** Generates customizable HTML email notifications upon build failure.
  - **Role Strategy Plugin:** Replaces basic permissions with enterprise Role-Based Access Control (RBAC).

**Why Jenkins Relies on Plugins:**
1. **Lightweight Core:** The Jenkins core remains compact, focused strictly on scheduling, user management, and execution queues.
2. **Infinite Extensibility:** No single vendor can bundle every programming language, test framework, and cloud provider. Plugins allow the open-source community to support emerging technologies (Docker, Kubernetes, AWS, Terraform) without modifying core Jenkins code.
3. **Decoupled Lifecycle:** Plugins can be patched and updated independently of the core Jenkins LTS release cycle.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Core Orchestrator Definition", weight: 40, description: "Accurately identifies Jenkins as an orchestrator of external tools rather than a compiler." },
        { name: "Plugin Conceptual Model", weight: 35, description: "Explains how plugins extend core functionality with external tool integrations." },
        { name: "Architectural Rationale", weight: 25, description: "Explains lightweight core and decoupled update lifecycle benefits." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Orchestration", "Plugins", "CI/CD", "Architecture", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    title: "Why Is 'Logged-In Users Can Do Anything' Dangerous & How Does the Role Strategy Plugin Enforce Least Privilege?",
    difficulty: "Intermediate",
    prompt: "During an enterprise security audit: 'Why is configuring 'Logged-in users can do anything' considered an unacceptable security risk in production? Detail how the Role Strategy plugin enables fine-grained authorization, and how you would design roles for Developers and QA engineers.'",
    explanation: "Evaluates Jenkins authorization models, blast radius of compromised credentials, and role-based access control (RBAC) implementation.",
    hintsJson: JSON.stringify([
      "Explain that 'Logged-in users can do anything' grants full administrative control to any authenticated account.",
      "Detail the Role Strategy plugin: Global Roles, Item (Project) Roles, and Node Roles.",
      "Specify permissions for Developers (Job/Build, Job/Read, Job/Workspace) vs QA (Job/Read, Job/Build) vs Admins."
    ]),
    recommendedSolution: `**Model Answer:**

**The Danger of 'Logged-in users can do anything':**
1. **Violates Principle of Least Privilege:** Any authenticated user—regardless of role, seniority, or contractor status—receives complete administrative control.
2. **Security Vulnerability:** Any user can modify global security realms, delete critical production pipelines, read plaintext secrets from the Credentials Store, or execute arbitrary Groovy scripts via the Script Console (Remote Code Execution on the host).
3. **Operational Hazard:** An accidental configuration mistake by an inexperienced user can delete production deployment steps or alter release triggers.

**How the Role Strategy Plugin Solves It:**
The **Role-based Authorization Strategy** plugin replaces flat permissions with reusable, named roles categorized into three tiers:
1. **Global Roles:** Govern overall instance access (Administer, Read).
2. **Item Roles (Project Roles):** Governed by regex patterns (e.g. \`frontend-.*\`, \`payment-service-.*\`), defining what actions users can execute against specific jobs.
3. **Node Roles:** Govern which worker agents users can configure or take offline.

**Enterprise Role Architecture Example:**
- **Administrator Role:**
  - Permissions: Overall -> Administer (Full control).
  - Assigned strictly to Senior DevOps / SRE engineers.
- **Developer Role:**
  - Global: Overall -> Read.
  - Item Role (\`dev-.*\`): Job -> Read, Job -> Build, Job -> Workspace, Job -> Cancel.
  - Excluded: Job -> Configure, Job -> Delete, Credentials.
- **QA Automation Role:**
  - Global: Overall -> Read.
  - Item Role (\`qa-.*\`): Job -> Read, Job -> Build.
  - Excluded: Job -> Configure, Job -> Workspace modification.

**Outcome:** Users only possess the exact permissions required for their daily responsibilities, containing the blast radius of human error or compromised credentials.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Risk Analysis of Flat Permissions", weight: 30, description: "Identifies RCE, credential tampering, and accidental job deletion risks." },
        { name: "Role Strategy Mechanics", weight: 35, description: "Explains Global Roles and regex-based Item Roles." },
        { name: "Practical Role Architecture", weight: 35, description: "Accurately scopes Developer and QA roles without Configure/Administer rights." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Security", "RBAC", "Role Strategy", "Least Privilege", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    title: "Why Distribute Workloads Across Dedicated Agents Instead of the Controller, and Why Set Controller Executors to 0?",
    difficulty: "Intermediate",
    prompt: "In a CI/CD architecture interview: 'Why should build workloads never run directly on the Jenkins Controller? What happens when a build crashes or exhausts memory on the controller, and how does the 'agent' directive route workloads to specific labeled nodes?'",
    explanation: "Tests distributed Jenkins architecture, executor starvation, UI responsiveness, and workload isolation via node labels.",
    hintsJson: JSON.stringify([
      "Explain Controller responsibilities: UI, scheduling, plugin orchestration, credentials.",
      "Explain risks of build execution on Controller: JVM memory starvation, CPU spikes, UI crashes, security exposure.",
      "Explain Controller executors = 0 best practice.",
      "Explain agent directive: 'agent any' vs 'agent { label 'slave2' }'."
    ]),
    recommendedSolution: `**Model Answer:**

**Why Never Run Builds on the Jenkins Controller:**
1. **Resource Starvation & UI Freezes:** The Controller runs the Jenkins web interface, job scheduler, and webhook receiver. If a resource-intensive build (e.g. multi-threaded C++ compilation, large Docker image build) runs on the Controller, it can consume 100% CPU and exhaust JVM heap memory, causing the web UI to crash and dropping all active pipelines.
2. **Security & Blast Radius:** The Controller hosts the master encryption key (\`secrets/master.key\`) and system credentials. Malicious or untrusted build scripts executing on the Controller can inspect Controller disk files and compromise enterprise credentials.
3. **Horizontal Scalability:** A single Controller cannot scale vertically to support hundreds of concurrent builds. Distributing workloads across agents enables linear horizontal scaling.

**Enterprise Best Practice: Setting Controller Executors to 0:**
Under **Manage Jenkins -> Manage Nodes -> Built-In Node**, set **# of executors** to **0**.
- This guarantees the Controller is dedicated purely to orchestration, scheduling, and UI management, and will never accept build workloads.

**How Workloads Route to Specific Labeled Agents:**
Agents (worker nodes) register with the Controller and carry descriptive labels (e.g. \`linux-builder\`, \`windows-net\`, \`docker-agent\`).
In Declarative Pipelines, the \`agent\` directive dictates scheduling:
- \`agent any\`: Jenkins assigns the build to any available online agent with spare executor capacity based on load balancing.
- \`agent { label 'windows-net' }\`: Jenkins strictly pins the stage or entire pipeline to an agent labeled \`windows-net\`, ensuring tools specific to that OS (like MSBuild) are guaranteed to be present.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Controller Isolation Rationale", weight: 35, description: "Explains memory starvation, UI crashes, and credential exposure." },
        { name: "Controller Executors = 0", weight: 30, description: "Identifies setting built-in node executors to 0 as mandatory best practice." },
        { name: "Agent Directive & Labeling", weight: 35, description: "Contrasts agent any with agent { label '...' } for environment pinning." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Controller-Agent", "Master-Slave", "Architecture", "Distributed Builds", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    title: "Walk Through the End-to-End GitHub Webhook CI Trigger Sequence & What to Verify When Builds Don't Fire",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Walk through what happens, end to end, from the moment a software developer runs 'git push' to GitHub, through webhook delivery, to Jenkins executing the build. If the webhook delivery in GitHub shows HTTP 200 OK with a green checkmark, but Jenkins never triggers the job, what is the exact misconfiguration?'",
    explanation: "Tests deep operational knowledge of event-driven CI/CD integration, webhook payloads, and Jenkins build trigger bindings.",
    hintsJson: JSON.stringify([
      "Trace the flow: git push -> GitHub fires POST /github-webhook/ -> Jenkins GitHub plugin receives payload -> Matches SCM URL -> Checks 'GitHub hook trigger for GITScm polling' -> Enqueues build.",
      "Identify the misconfiguration: Job is missing the 'GitHub hook trigger for GITScm polling' checkbox."
    ]),
    recommendedSolution: `**Model Answer:**

**End-to-End Event Flow:**
1. **Developer Push:** An engineer runs \`git push origin feature/auth\` to GitHub.
2. **GitHub Webhook Trigger:** GitHub detects the push event and immediately issues an HTTP POST payload containing commit metadata, branch name, and repository URL to Jenkins' webhook endpoint:
   \`http://<jenkins-url>:8080/github-webhook/\`
3. **Jenkins Ingestion:** The Jenkins **GitHub plugin** receives the JSON payload, verifies optional HMAC-SHA256 signatures, and parses the repository URL (\`repository.url\` / \`clone_url\`).
4. **Job Matching & Dispatch:** Jenkins scans all registered jobs whose Source Code Management (SCM) matches the Git repository URL.
5. **Execution:** Jenkins checks if the matching job has webhook triggers enabled, enqueues the build in the scheduler queue, allocates an executor on a matching agent, checks out the commit, and begins stage execution.

**Troubleshooting: GitHub Shows Green Check (200 OK), But Jenkins Never Triggers:**
If GitHub shows **HTTP 200 OK**, the network routing, firewall, and Jenkins web server are 100% operational.
The failure is inside Jenkins job configuration:
1. **Missing Trigger Checkbox (Primary Root Cause):** Under the job's **Build Triggers**, the checkbox **'GitHub hook trigger for GITScm polling'** is unchecked! Jenkins receives the event successfully but was never instructed to act upon it for this job.
2. **SCM URL Mismatch:** The repository URL in the job configuration differs slightly from the GitHub payload (e.g. \`https://github.com/org/repo.git\` vs \`git@github.com:org/repo.git\`, or case sensitivity differences).
3. **Branch Specifier Mismatch:** The job is configured to build strictly \`refs/heads/main\`, but the push occurred on a feature branch without multibranch pipeline discovery.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "End-to-End Flow Sequence", weight: 40, description: "Traces push, HTTP POST payload, plugin receipt, and job matching." },
        { name: "Root Cause Diagnosis", weight: 40, description: "Pinpoints missing 'GitHub hook trigger for GITScm polling' checkbox." },
        { name: "Edge Case Awareness", weight: 20, description: "Mentions SCM URL mismatches or branch specifier filters." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "GitHub Webhooks", "CI/CD", "Build Triggers", "GITScm", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    title: "Build Periodically vs Poll SCM: Architectural Differences, Resource Costs & 5-Field Cron Syntax",
    difficulty: "Intermediate",
    prompt: "A junior engineer asks: 'What is the practical difference between 'Build periodically' and 'Poll SCM'? When should each be used, what are the resource trade-offs against GitHub webhooks, and how is the 5-field cron syntax structured in Jenkins?' How do you explain this?",
    explanation: "Evaluates understanding of scheduled triggers vs commit polling, Git server overhead, and cron scheduling syntax.",
    hintsJson: JSON.stringify([
      "Explain Build periodically: runs build unconditionally on a clock.",
      "Explain Poll SCM: checks Git repo on schedule; runs build ONLY if new commits exist.",
      "List the 5 fields: minute, hour, day-of-month, month, day-of-week.",
      "Give cron examples: */5 * * * *, H 2 * * 1-5.",
      "Contrast both with event-driven Webhooks."
    ]),
    recommendedSolution: `**Model Answer:**

**Practical Difference:**
- **Build Periodically:** Triggers a full build execution (compiling, testing, packaging) on a fixed clock schedule, **regardless of whether any code has changed**.
  - *Best For:* Nightly cleanup jobs, scheduled security vulnerability scans, or batch reconciliation reports.
- **Poll SCM:** Contacts the remote Git repository on a schedule and checks for new commit SHAs. If no new commits exist since the last build, it exits immediately. It **only triggers a build if new code is found**.
  - *Best For:* Legacy firewalled Git servers that cannot send inbound webhooks to Jenkins.

**Resource Trade-Offs (vs GitHub Webhooks):**
- **Polling (Inefficient):** Running Poll SCM every minute across 100 jobs issues 144,000 Git network requests a day, causing high CPU load, bandwidth consumption, and triggering Git API rate limits.
- **Webhooks (Event-Driven):** Zero polling overhead. Builds trigger in sub-second latency only when real commits are pushed.

**Jenkins 5-Field Cron Syntax:**
Structured in five space-separated fields:
\`\`\`
*     *     *     *     *
┬     ┬     ┬     ┬     ┬
│     │     │     │     │
│     │     │     │     └───── Day of Week (0 - 7) (0 and 7 = Sun)
│     │     │     └────────── Month (1 - 12)
│     │     └─────────────── Day of Month (1 - 31)
│     └──────────────────── Hour (0 - 23)
└───────────────────────── Minute (0 - 59)
\`\`\`

**Common Cron Examples:**
- \`*/5 * * * *\`: Runs every 5 minutes.
- \`10 */5 * * *\`: Runs at minute 10 of every 5th hour.
- \`* */2 * * 1-5\`: Runs at minute 1 of every 2 hours, Monday through Friday.
- \`H 2 * * *\`: Runs once nightly between 2:00 AM and 2:59 AM (using hash \`H\` for distributed jitter).`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Build Periodically vs Poll SCM", weight: 35, description: "Accurately contrasts unconditional builds with commit-conditional builds." },
        { name: "5-Field Cron Anatomy", weight: 35, description: "Explains minute, hour, day-of-month, month, day-of-week in order." },
        { name: "Webhook Comparison & Best Practice", weight: 30, description: "Explains polling network overhead and advocates webhooks." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Build Triggers", "Cron", "Poll SCM", "Build Periodically", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    title: "Architecting Actionable Notifications with Email-ext & SMTP: Why Use 'post { failure }' Instead of Every Build?",
    difficulty: "Intermediate",
    prompt: "In a production alerting discussion: 'What two separate pieces of configuration does email notification in Jenkins require? Why is notifying only on failure (via post { failure { ... } }) vastly superior to notifying on every successful build, and how do you prevent alert fatigue?'",
    explanation: "Tests knowledge of email plugin architecture, SMTP setup, and DevOps alerting best practices.",
    hintsJson: JSON.stringify([
      "Two configuration pieces: Email-ext plugin (templating) and SMTP server in Manage Jenkins -> Configure System.",
      "Explain alert fatigue: 100 successful emails cause developers to filter emails to trash.",
      "Explain post { failure { ... } } keeping alerts high-signal and actionable."
    ]),
    recommendedSolution: `**Model Answer:**

**The Two Required Pieces of Configuration:**
1. **The Email Extension Plugin (Email-ext):** Installed via Manage Plugins to provide flexible email templating, token substitution (\`\${BUILD_URL}\`, \`\${CHANGES}\`), and conditional triggers.
2. **A Working Outgoing SMTP Mail Server:** Configured under **Manage Jenkins -> Configure System (System settings)** under **Extended E-mail Notification**, specifying SMTP server host (\`smtp.gmail.com\`), port (465/587), SSL/TLS flags, and authentication credentials (e.g. Gmail App Password).

**Why 'post { failure { ... } }' is Vastly Superior to Every Build:**
- **Eliminating Alert Fatigue:** If a team merges 40 pull requests a day, sending an email for every successful build generates 40 noisy emails. Developers quickly create Gmail inbox rules routing all Jenkins emails directly to Trash. When a real production build breaks, nobody notices!
- **High Signal-to-Noise Ratio:** Placing notifications inside \`post { failure { mail ... } }\` ensures developers are only notified when their code has introduced an error that requires immediate engineering intervention.
- **State Change Notifications:** An advanced pattern is notifying on \`unstable\` or \`fixed\` (notifying the team the moment a previously failing build is restored to green).

**Declarative Pipeline Syntax Example:**
\`\`\`groovy
post {
    always {
        cleanWs()
    }
    failure {
        mail to: 'backend-team@example.com',
             subject: "[FAILED] \${currentBuild.fullDisplayName}",
             body: "Build failed! Please inspect console logs at: \${env.BUILD_URL}"
    }
}
\`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Two Configuration Elements", weight: 30, description: "Identifies Email-ext plugin and global SMTP server configuration." },
        { name: "Alert Fatigue Psychology", weight: 35, description: "Explains how noisy success notifications destroy alerting effectiveness." },
        { name: "Declarative post Implementation", weight: 35, description: "Shows failure condition block with actionable log URL." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Notifications", "Email-ext", "SMTP", "Alert Fatigue", "post block", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    title: "Implementing Interactive Human Approval Gates in Declarative Pipelines with the 'input' Step",
    difficulty: "Intermediate",
    prompt: "A financial compliance policy states: 'Automated test suites can run continuously, but promoting code to the production cloud environment must require explicit interactive human sign-off from a Release Lead.' How do you implement this in a Declarative Jenkinsfile using the 'input' step, and how do you protect against hanging pipelines?",
    explanation: "Tests implementation of interactive gates in CI/CD pipelines, authorization scoping, and timeout guardrails.",
    hintsJson: JSON.stringify([
      "Explain the 'input' directive placed inside a stage.",
      "Show parameters: message, ok, submitter.",
      "Explain wrapping input in a 'timeout' block to prevent hanging pipelines."
    ]),
    recommendedSolution: `**Model Answer:**

**Implementing the Approval Gate:**
To satisfy enterprise change management and SOC2 compliance, Jenkins Declarative Pipelines provide the native \`input\` step, which pauses execution until an authorized human explicitly reviews and approves the stage.

**Declarative Pipeline Implementation:**
\`\`\`groovy
stage('Production Deployment Gate') {
    steps {
        timeout(time: 2, unit: 'HOURS') {
            input message: "Approve deployment of version \${env.BUILD_NUMBER} to Production?",
                  ok: "Deploy to Production",
                  submitter: "release-managers,lead-devops",
                  submitterParameter: "APPROVED_BY"
        }
    }
}
stage('Deploy to Production') {
    steps {
        echo "Deploying to production, approved by: \${APPROVED_BY}"
        sh './deploy-prod.sh'
    }
}
\`\`\`

**Key Parameters Explained:**
1. **\`message\` & \`ok\`:** Provides clear contextual prompt and confirmation button in the Jenkins web UI and Blue Ocean.
2. **\`submitter\`:** Restricts approval permissions strictly to users or groups authorized to promote code (e.g. \`release-managers\`), preventing unauthorized developers from approving their own releases.
3. **\`timeout(time: 2, unit: 'HOURS')\`:** **Critical Guardrail.** If the release lead is unavailable or abandons the build, the pipeline automatically times out and aborts after 2 hours, releasing executor resources and preventing pipeline queues from deadlocking.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "input Directive Implementation", weight: 35, description: "Accurately demonstrates input step syntax inside a dedicated stage." },
        { name: "Authorization Scoping", weight: 30, description: "Uses submitter parameter to restrict approval rights." },
        { name: "Timeout Guardrails", weight: 35, description: "Explains timeout wrapping to prevent resource locking on abandoned builds." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Pipelines", "input step", "Approval Gates", "Compliance", "Production Safety", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    title: "Why Run Selenium Automated Browser Tests Through Maven & Jenkins Rather Than Manually in Eclipse?",
    difficulty: "Beginner",
    prompt: "A QA lead asks: 'Our team already executes Selenium tests manually inside Eclipse before releases. Why should an organization invest in running Selenium tests headlessly through Maven and Jenkins in a continuous integration pipeline? What operational and reliability benefits does this provide?'",
    explanation: "Contrasts manual IDE-based testing with automated CI/CD pipeline execution, dependency management, and regression prevention.",
    hintsJson: JSON.stringify([
      "Explain Maven: resolves exact dependencies and browser driver versions on any machine, eliminating 'works on my machine'.",
      "Explain Jenkins: runs tests automatically on every commit/PR, ensuring immediate regression detection.",
      "Explain trend reporting: JUnit test results tracked over time to identify flaky tests."
    ]),
    recommendedSolution: `**Model Answer:**

Running Selenium tests manually inside Eclipse relies on human memory, local machine quirks, and is fundamentally unscalable. Shifting to Maven and Jenkins provides three transformative benefits:

**1. Environment Independence & Dependency Management (Maven):**
- In Eclipse, tests often depend on manually downloaded JAR files stored in arbitrary local folders, causing the classic *"it works on my machine because of the JARs I happened to add"* problem.
- Maven's \`pom.xml\` declares exact versions of \`selenium-java\` and \`junit\` with transitives. Any machine—whether a developer's laptop or a fresh Linux CI agent—resolves the exact identical dependency graph every time.

**2. Automated & Continuous Regression Testing (Jenkins):**
- Manual testing in Eclipse only happens when a developer remembers to run it before a release.
- In Jenkins, tests run **automatically on every single Git push, pull request, or scheduled nightly build**. Regressions are detected within minutes of a bad commit, shrinking root-cause analysis time from weeks to seconds.

**3. Historical Metrics & Flaky Test Visibility:**
- Running tests in Eclipse only shows a temporary green/red bar.
- Jenkins archives standardized JUnit XML reports over time, rendering interactive graphs of pass/fail trends, test duration growth, and pinpointing intermittent (flaky) tests across releases.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Maven Reproducibility Rationale", weight: 35, description: "Contrasts manual Eclipse JARs with declarative pom.xml dependencies." },
        { name: "Continuous Integration Rationale", weight: 35, description: "Explains automated execution on push vs relying on manual human triggers." },
        { name: "Historical Analytics", weight: 30, description: "Mentions JUnit XML test trend graphs and flaky test identification." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Selenium", "Maven", "Automated Testing", "CI/CD", "Quality Assurance", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    title: "Describe the Full End-to-End CI/CD Test Pipeline from Git Push to JUnit XML Report Publishing",
    difficulty: "Intermediate",
    prompt: "Walk through the full end-to-end architecture of an automated testing pipeline: from code push in Git, through Maven compilation, headless browser execution on Linux CI agents, and publishing JUnit XML test reports in Jenkins.",
    explanation: "Evaluates comprehensive understanding of the complete toolchain integration: Git -> Jenkins -> Maven -> Headless Selenium -> JUnit reports.",
    hintsJson: JSON.stringify([
      "Step 1: Code push triggers webhook.",
      "Step 2: Jenkins agent checks out code.",
      "Step 3: Maven resolves dependencies and invokes Surefire plugin.",
      "Step 4: ChromeDriver launches headless Chrome and runs tests.",
      "Step 5: driver.quit() cleans up processes.",
      "Step 6: post { always { junit '...' } } parses XML reports."
    ]),
    recommendedSolution: `**Model Answer:**

**The Complete End-to-End Testing Architecture:**

1. **Trigger & Checkout:**
   - A developer pushes code to GitHub. A webhook fires to Jenkins, triggering the pipeline.
   - The Jenkins Controller dispatches the build to an agent node with Java and Chrome installed.
   - Step: \`checkout scm\` clones the latest repository revision into the agent workspace.

2. **Maven Build & Test Execution:**
   - The pipeline executes \`sh 'mvn test'\`.
   - Maven reads \`pom.xml\`, resolves \`selenium-java\` and \`junit\`, and compiles test classes into \`target/test-classes\`.
   - Maven Surefire Plugin launches the test suite.

3. **Headless Browser Automation:**
   - Selenium initializes \`ChromeDriver\` with \`--headless=new\` and \`--no-sandbox\`.
   - Chrome runs in the background without a physical GUI monitor.
   - WebDriver navigates to target URLs, interacts with elements, and verifies JUnit assertions (\`assertEquals\`).
   - In the \`@After\` teardown method, \`driver.quit()\` terminates the browser process and frees system memory.

4. **JUnit Report Generation & Publishing:**
   - Surefire captures test execution results, execution duration, and stack traces into standardized XML files: \`target/surefire-reports/TEST-*.xml\`.
   - The Jenkinsfile \`post { always { junit '**/target/surefire-reports/*.xml' } }\` step parses these XML files unconditionally.
   - Jenkins displays per-test pass/fail breakdowns, failure screenshots, and updates the project's **Test Result Trend** graph.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Full Toolchain Integration", weight: 30, description: "Correctly connects Git, Jenkins, Maven, Selenium, and JUnit." },
        { name: "Headless Execution Mechanics", weight: 35, description: "Explains headless browser launch, execution, and driver.quit() teardown." },
        { name: "Surefire XML Archival", weight: 35, description: "Explains Surefire XML generation and Jenkins junit report publishing." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Selenium", "Maven", "JUnit", "CI/CD Pipeline", "End-to-End", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    title: "Investigating Selenium Test Divergence: Passes Locally in Eclipse but Fails on Linux Jenkins Agent",
    difficulty: "Intermediate",
    prompt: "A developer complains: 'My Selenium test passes 100% of the time when I run it in Eclipse on my laptop, but it consistently fails when executed by the Jenkins CI agent on Linux.' As the DevOps/QA Lead, what are the four most likely root causes you would investigate?",
    explanation: "Tests real-world debugging of environment drift, headless vs headed timing, browser driver versions, and display dependencies.",
    hintsJson: JSON.stringify([
      "Investigate 1: Headless vs Headed mode and missing GUI display on Linux.",
      "Investigate 2: Browser and ChromeDriver version mismatches.",
      "Investigate 3: Missing system dependencies (fonts, Xvfb, shared memory).",
      "Investigate 4: Timing differences and race conditions (Thread.sleep vs WebDriverWait)."
    ]),
    recommendedSolution: `**Model Answer:**

When Selenium tests diverge between a local workstation and a CI agent, the root cause is almost always **environment drift**. I investigate four primary areas:

**1. Headless vs. Headed Execution & Missing Display:**
- On a laptop, tests run headed (visible browser window). On a Linux CI server, there is no physical monitor.
- If the test does not specify \`--headless=new\`, Chrome crashes immediately with \`Chrome failed to start: exited abnormally\`.
- Furthermore, headless browsers default to a small viewport (e.g. 800x600). Elements visible on a 1080p laptop screen may collapse into a hamburger menu or fall below the fold in headless mode. Fix: Set \`options.addArguments("--window-size=1920,1080")\`.

**2. Browser & ChromeDriver Version Mismatch:**
- The developer's laptop has matching Chrome and ChromeDriver versions.
- If the Linux CI agent has auto-updated Chrome to v124 while ChromeDriver is pinned to v122, tests fail with \`SessionNotCreatedException\`.

**3. Timing & Resource Contention (Race Conditions):**
- Laptops often have dedicated CPU and GPU acceleration. CI agents run under shared virtualized CPU loads where network and DOM rendering can take longer.
- If tests rely on hardcoded \`Thread.sleep(2000)\`, the CI agent may take 2.2 seconds to render, causing \`NoSuchElementException\`. Fix: Replace sleeps with explicit \`WebDriverWait\`.

**4. Missing Linux OS Dependencies & Shared Memory (/dev/shm):**
- Linux containers allocate only 64MB to \`/dev/shm\` by default, causing Chrome to crash when loading large DOMs. Fix: Pass \`--disable-dev-shm-usage\` and \`--no-sandbox\`.
- Missing standard web fonts (like Microsoft Core Fonts or Noto) can alter CSS layouts and button positions.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Display & Viewport Differences", weight: 30, description: "Identifies headless crashes and viewport size differences." },
        { name: "Browser/Driver Version Alignment", weight: 25, description: "Identifies version mismatch exceptions." },
        { name: "Timing & Asynchronous Rendering", weight: 25, description: "Explains CI CPU contention and replacing sleep with WebDriverWait." },
        { name: "Linux System Primitives", weight: 20, description: "Mentions /dev/shm shared memory exhaustion and missing font libraries." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Selenium", "Debugging", "Environment Drift", "Headless", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    title: "Why Publish JUnit Test Result Reports as a Post-Build Action Rather Than Relying on Overall Build Status?",
    difficulty: "Beginner",
    prompt: "An interviewer asks: 'In a Jenkins pipeline, why is publishing the JUnit test result report as a post-build action (post { always { junit '...' } }) critical, rather than just relying on whether the overall build status is green or red?'",
    explanation: "Tests understanding of test analytics, test trend visualization, flaky test tracking, and post-build always execution.",
    hintsJson: JSON.stringify([
      "Explain overall build status: only gives binary pass/fail without test names.",
      "Explain JUnit XML reports: provides per-test-case metrics, stack traces, and failure trends.",
      "Explain why 'always' condition is critical: parses reports even when tests fail."
    ]),
    recommendedSolution: `**Model Answer:**

**The Limitations of Overall Build Status:**
The overall build status is merely a binary flag (Success / Failure). If a build fails, all the developer sees is a red status. To find out what broke, they must manually scroll through 5,000 lines of raw console log output, wasting valuable engineering time.

**Why Publishing the JUnit Test Result Report is Critical:**
1. **Per-Test Granular Visibility:**
   - Jenkins parses Surefire XML files and provides a structured web interface listing exact test method names, assertion errors, and failure stack traces in one click.
2. **Historical Trend Tracking:**
   - Jenkins renders an interactive **Test Result Trend** graph on the project dashboard. Engineers can see whether test execution time is degrading over releases or if test counts are increasing.
3. **Isolating Flaky vs. Broken Tests:**
   - Jenkins highlights test age (e.g. *"Failed in build #42, broken for 3 builds"*). This immediately differentiates an intermittent flaky test from a newly introduced regression.
4. **Why 'always' is Mandatory:**
   - In Declarative Pipelines, the step must be placed inside \`post { always { junit '**/target/surefire-reports/*.xml' } }\`.
   - If placed inside \`success\`, the report is only published when all tests pass! The moment a test fails, the publisher would be skipped—completely blinding the team to which test caused the failure.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Binary Status Limitation", weight: 30, description: "Explains the inefficiency of searching raw console logs." },
        { name: "Granular Analytics & Trends", weight: 40, description: "Highlights per-test stacktraces, duration trends, and flaky test isolation." },
        { name: "post { always } Requirement", weight: 30, description: "Explains why reports must be published unconditionally on failure." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "JUnit", "Test Reporting", "Surefire", "Metrics", "Best Practices", "Interview"])
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    title: "Configuring Headless Chrome WebDriver for Containerized Linux CI Runners with ChromeDriver & Xvfb",
    difficulty: "Advanced",
    prompt: "Explain the technical challenges of running graphical browser tests on Linux CI servers without physical monitors. Detail how to configure ChromeOptions for headless execution (--headless=new, --no-sandbox, --disable-dev-shm-usage) and how Xvfb (Virtual Framebuffer) provides an alternative display emulator.",
    explanation: "Deep dive into Linux graphics subsystems, headless Chrome architecture, container security constraints, and virtual display servers.",
    hintsJson: JSON.stringify([
      "Explain that Linux servers lack an X11 graphical display server.",
      "Detail ChromeOptions: --headless=new, --no-sandbox, --disable-dev-shm-usage, --window-size.",
      "Explain Xvfb: virtual memory display emulator (xvfb-run mvn test)."
    ]),
    recommendedSolution: `**Model Answer:**

**The Technical Challenge:**
Desktop browsers (Chrome, Firefox) are designed to interact with a display server (X11 or Wayland on Linux, Quartz on macOS). Standard enterprise CI/CD runners (AWS EC2 Linux instances, Docker containers, Kubernetes pods) operate in headless server environments with no physical monitor, GPU, or active X server (\`DISPLAY\` variable is unset). Attempting to open a graphical browser throws: \`Gtk-WARNING **: cannot open display: :0\`.

**Approach 1: Modern Native Headless Chrome (Recommended):**
Google Chrome includes a native headless mode that executes the full Chromium rendering engine (Blink + V8) in memory without requiring any graphical display server.

**Required Configuration in Java:**
\`\`\`java
ChromeOptions options = new ChromeOptions();

// 1. Enable modern headless mode (Chrome 109+)
options.addArguments("--headless=new");

// 2. Disable OS user sandbox (Mandatory in Docker/root containers)
options.addArguments("--no-sandbox");

// 3. Prevent shared memory crashes (/dev/shm exhaustion)
options.addArguments("--disable-dev-shm-usage");

// 4. Force standard desktop resolution (Prevents responsive layout shifts)
options.addArguments("--window-size=1920,1080");

// 5. Disable GPU hardware acceleration
options.addArguments("--disable-gpu");

WebDriver driver = new ChromeDriver(options);
\`\`\`

**Why '--no-sandbox' and '--disable-dev-shm-usage' are Crucial in CI:**
- **\`--no-sandbox\`:** Docker containers typically run without \`SYS_ADMIN\` Linux kernel capabilities. Chrome's multi-process security sandbox requires specific namespace isolation that fails inside unprivileged containers unless disabled.
- **\`--disable-dev-shm-usage\`:** Linux shared memory (\`/dev/shm\`) defaults to 64MB in Docker. Complex single-page apps (React/Angular) quickly exhaust this space, crashing the renderer. This flag forces Chrome to use the standard \`/tmp\` directory.

**Approach 2: Virtual Framebuffer (Xvfb):**
If legacy tests or third-party plugins require a genuine X11 display environment:
1. Install Xvfb: \`sudo yum install xorg-x11-server-Xvfb -y\` (or \`apt-get install xvfb\`).
2. Run tests wrapped inside a virtual framebuffer:
   \`xvfb-run --auto-servernum --server-args="-screen 0 1920x1080x24" mvn test\`
- Xvfb emulates an X11 display entirely in system RAM, allowing headed browsers to run without physical hardware.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Display Server Subsystem Challenge", weight: 25, description: "Explains lack of X11/Wayland display server on Linux runners." },
        { name: "ChromeOptions Rationale", weight: 40, description: "Explains --headless=new, --no-sandbox, and --disable-dev-shm-usage mechanics." },
        { name: "Xvfb Virtual Framebuffer Alternative", weight: 35, description: "Explains in-memory display emulation via xvfb-run." }
      ]
    }),
    tagsJson: JSON.stringify(["Jenkins", "Selenium", "Headless Chrome", "Xvfb", "Linux", "Docker", "Advanced", "Interview"])
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
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
    topicSlug: "docker-images-dockerfile-registries",
    topicNumber: 2,
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
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
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
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
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
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
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
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
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

const dockerInterviews = require('./dockerInterviewsData.js');
module.exports.push(...dockerInterviews);

const kubernetesInterviews = require('./kubernetesInterviewsData.js');
module.exports.push(...kubernetesInterviews);

const awsAccountInterviews = require('./awsAccountInterviewsData.js');
module.exports.push(...awsAccountInterviews);

const awsVpcInterviews = require('./awsVpcInterviewsData.js');
module.exports.push(...awsVpcInterviews);

const awsTopicClassifiedInterviews = require('./awsTopicClassifiedInterviewsData.js');
module.exports.push(...awsTopicClassifiedInterviews);




