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
  }
];
