module.exports = [
  {
    moduleNumber: 1,
    title: "AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure",
    slug: "global-infrastructure-and-architecture",
    description: "Step-by-step AWS account creation, root account hardening, IAM best practices, AWS Budgets $1 guardrails, Cost Explorer accidental charges triage, AWS Support refund resolution, and global Regions/AZs architecture.",
    icon: "globe",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "AWS Free Tier Account Creation, Root Security & IAM Best Practices",
        slug: "aws-account-creation-root-security-iam",
        summary: "Step-by-step account signup prerequisites (email, mobile OTP, card verification), root account MFA hardening, creating non-root IAM users, setting up AWS Budgets $1 threshold alerts, and navigating Free Tier 6-month trial vs Always-Free service limits.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Never use the Root account for daily tasks; lock it down with MFA immediately, create an IAM user for administration, and set a $1 AWS Budget alert before provisioning resources."
      },
      {
        topicNumber: 2,
        title: "Accidental Charges Incident Triage, Cost Explorer & AWS Support Refund Resolution",
        slug: "accidental-charges-cost-explorer-support-refunds",
        summary: "Diagnose surprise cloud bills using AWS Billing Dashboard and Cost Explorer group-by-service/region, immediately terminate runaway resources (unattached Elastic IPs, orphan EBS snapshots, GPU instances), open an Account & Billing support case, write an effective one-time refund appeal, and understand multi-factor fraud detection.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Stopping an EC2 instance stops compute fees but NOT disk storage; delete orphan EBS volumes and release unattached Elastic IPs immediately, and file a polite support case for a one-time courtesy refund."
      },
      {
        topicNumber: 3,
        title: "AWS Global Infrastructure: Regions, Availability Zones & Edge Infrastructure",
        slug: "regions-azs-and-edge-infrastructure",
        summary: "Understand the physical and logical layout of AWS: geographic Regions, isolated Availability Zones (AZs), low-latency Edge Locations, Local Zones, and multi-AZ fault tolerance.",
        difficulty: "Beginner",
        estimatedMinutes: 30,
        keyTakeaway: "Region = Geographic Area (independent isolated zone); AZ = Independent Data Center Group with dedicated power and networking connected by low-latency fiber."
      }
    ]
  },
  {
    moduleNumber: 2,
    title: "IAM, Identity & Access Management",
    slug: "iam-identity-and-access-management",
    description: "Core and advanced identity controls: Users, Groups, Roles, Policies, Permission Boundaries, Federation, MFA, and Least Privilege access.",
    icon: "shield-check",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "IAM Fundamentals & Policy Evaluation Flow",
        slug: "iam-fundamentals-and-policy-evaluation",
        summary: "Master IAM Users, Groups, Roles, and the policy evaluation flow: Principal -> Policy -> Action -> Resource -> Condition.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Prefer IAM Roles over long-term access keys. Secure access starts with least privilege and temporary credentials."
      }
    ]
  },
  {
    moduleNumber: 3,
    title: "Amazon VPC – Advanced Cloud Networking & Traffic Engineering",
    slug: "amazon-vpc-advanced-networking",
    description: "Architect production-grade virtual private clouds: Default vs Custom VPCs, IPv4/IPv6 CIDR subnetting, Internet Gateways, Egress-Only IGWs, Stateful Security Groups vs Stateless NACLs, DNS Firewall, VPC Flow Logs, NAT Gateways, VPC Endpoints, Peering, Site-to-Site VPN, and Transit Gateway.",
    icon: "network",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "VPC Architecture, Subnetting (CIDR), Gateways & Route Tables",
        slug: "vpc-subnetting-gateways-packet-flow",
        summary: "Master Default vs Custom VPCs, CIDR block allocation (/16 and /24), 5 AWS reserved IPs per subnet, Public vs Private subnets, Route Tables (Destination & Target), Internet Gateways, Egress-Only IPv6 Gateways, Carrier Gateways, Elastic IPs, and Bastion Host jump servers.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "A subnet resides strictly within one Availability Zone; public subnets have a route table targeting an Internet Gateway (0.0.0.0/0 -> igw), whereas private subnets route internet-bound traffic through a NAT Gateway."
      },
      {
        topicNumber: 2,
        title: "VPC Security Architecture: Stateful Security Groups, Stateless NACLs, DNS Firewall & Flow Logs",
        slug: "vpc-security-groups-nacls-firewall-flow-logs",
        summary: "Implement defense-in-depth network security: instance-level Stateful Security Groups (allow rules only) vs subnet-level Stateless NACLs (numbered evaluation, explicit allow/deny, ephemeral return ports 1024-65535), Route 53 DNS Firewall (fail-open vs fail-closed), and out-of-band VPC Flow Logs to CloudWatch Logs and S3.",
        difficulty: "Advanced",
        estimatedMinutes: 45,
        keyTakeaway: "Security Groups are stateful (inbound return traffic is automatically permitted), whereas NACLs are stateless and require explicit rules in both directions including ephemeral client return ports."
      },
      {
        topicNumber: 3,
        title: "Hybrid Connectivity & Advanced Routing: NAT Gateways, Endpoints, Peering, VPN & Transit Gateway",
        slug: "vpc-peering-transit-gateway-endpoints-vpn",
        summary: "Deploy managed NAT Gateways, private AWS service connectivity via Gateway Endpoints (S3/DynamoDB) and Interface Endpoints (PrivateLink), non-transitive VPC Peering, Site-to-Site IPsec VPN with dual tunnels, hub-and-spoke AWS Transit Gateway, Traffic Mirroring, and VPC Service Quotas.",
        difficulty: "Advanced",
        estimatedMinutes: 50,
        keyTakeaway: "VPC Peering is non-transitive and creates complex N*(N-1)/2 meshes; AWS Transit Gateway solves this with a centralized star hub interconnecting thousands of VPCs and on-premises networks."
      }
    ]
  },
  {
    moduleNumber: 4,
    title: "EC2 & Compute Architecture",
    slug: "ec2-and-compute-architecture",
    description: "Compute deep dive: AMIs, Instance Types, EBS attachments, Elastic IPs, Placement Groups, User Data bootstrapping, and Purchasing Models.",
    icon: "cpu",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "Amazon EC2 Concepts, Purchasing Models & Lifecycle",
        slug: "ec2-concepts-purchasing-models-lifecycle",
        summary: "Understand On-Demand, Reserved, Savings Plans, Spot, and Dedicated Hosts, plus instance metadata (IMDS) and Graviton ARM processors.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Match instance family and purchasing model (Spot for stateless fault-tolerant, Reserved/Savings Plans for steady state, On-Demand for spikes)."
      }
    ]
  },
  {
    moduleNumber: 5,
    title: "Elastic Load Balancing & Auto Scaling",
    slug: "elastic-load-balancing-and-auto-scaling",
    description: "High Availability & Elasticity: Application Load Balancers (ALB), Network Load Balancers (NLB), Target Groups, and dynamic Auto Scaling Groups (ASG).",
    icon: "activity",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "ELB Types, Routing Rules & Dynamic Auto Scaling",
        slug: "elb-types-routing-rules-auto-scaling",
        summary: "Deploy ALBs for Layer 7 path/host routing, NLBs for ultra-low latency Layer 4, and configure ASGs with Target Tracking and Health Checks.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Goal: High Availability + Elasticity + Cost Optimization. Scale out when demand spikes, scale in when idle."
      }
    ]
  },
  {
    moduleNumber: 6,
    title: "Amazon S3 – Advanced Storage",
    slug: "amazon-s3-advanced-storage",
    description: "Scalable object storage: Versioning, Lifecycle Policies, Cross-Region Replication, Object Lock (WORM), Server-Side Encryption, and 7 Storage Classes.",
    icon: "database",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "S3 Storage Classes, Lifecycle Automation & Bucket Security",
        slug: "s3-storage-classes-lifecycle-security",
        summary: "Select optimal storage classes from Standard to Glacier Deep Archive, implement automated transitions, and lock down buckets with BPA.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Three-pillar security: IAM Policies + Bucket Policies + S3 Block Public Access (BPA)."
      }
    ]
  },
  {
    moduleNumber: 7,
    title: "EBS, EFS & Storage Selection",
    slug: "ebs-efs-and-storage-selection",
    description: "Compare Block vs File vs Object storage. Deep dive into EBS volume types, snapshots, multi-attach, and EFS shared distributed POSIX file system.",
    icon: "hard-drive",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "EBS vs EFS vs S3: Architectural Decision Matrix",
        slug: "ebs-vs-efs-vs-s3-storage-matrix",
        summary: "Identify when to choose persistent block storage (EBS), shared multi-instance file storage (EFS), or scalable object storage (S3).",
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        keyTakeaway: "EBS = 1 EC2 Instance (Block); EFS = Many EC2 Instances (File / NFS); S3 = Global REST API (Object)."
      }
    ]
  },
  {
    moduleNumber: 8,
    title: "AWS Databases – Advanced Overview",
    slug: "aws-databases-advanced-overview",
    description: "Purpose-built databases: RDS, Aurora, DynamoDB (NoSQL), ElastiCache (In-memory), Redshift (OLAP Data Warehouse), DocumentDB, and Neptune (Graph).",
    icon: "layers",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "Purpose-Built AWS Databases & Selection Framework",
        slug: "purpose-built-databases-selection-framework",
        summary: "Evaluate OLTP vs NoSQL vs OLAP vs In-Memory caching vs Graph databases for optimal performance and operational simplicity.",
        difficulty: "Intermediate",
        estimatedMinutes: 35,
        keyTakeaway: "Choose purpose-built databases: RDS/Aurora for ACID relational, DynamoDB for single-digit ms NoSQL, ElastiCache for caching, Redshift for analytics."
      }
    ]
  },
  {
    moduleNumber: 9,
    title: "RDS, Aurora & Database High Availability",
    slug: "rds-aurora-and-database-ha",
    description: "Enterprise database resiliency: Automated Backups, Read Replicas for scale, Multi-AZ for failover, and Aurora distributed self-healing storage.",
    icon: "server",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "Multi-AZ Failover vs Read Replicas & Aurora Architecture",
        slug: "multi-az-vs-read-replicas-aurora",
        summary: "Differentiate synchronous Multi-AZ standby disaster recovery from asynchronous Read Replicas used for offloading read traffic.",
        difficulty: "Intermediate",
        estimatedMinutes: 35,
        keyTakeaway: "Multi-AZ = High Availability / Disaster Recovery; Read Replica = Read Performance & Scalability."
      }
    ]
  },
  {
    moduleNumber: 10,
    title: "Serverless Architecture",
    slug: "serverless-architecture",
    description: "Modern cloud-native apps with zero server management: AWS Lambda, API Gateway, DynamoDB, EventBridge event routing, and Step Functions workflows.",
    icon: "zap",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "AWS Lambda, API Gateway & Event-Driven Patterns",
        slug: "lambda-api-gateway-event-driven-patterns",
        summary: "Build scalable event-driven architectures, handle cold starts, execute within duration limits, and orchestrate with Step Functions.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Serverless = fully managed, auto-scaling, event-driven compute with pure pay-per-use economics."
      }
    ]
  },
  {
    moduleNumber: 11,
    title: "Containers – ECS, EKS & Fargate",
    slug: "containers-ecs-eks-and-fargate",
    description: "Container orchestration on AWS: Elastic Container Service (ECS), Elastic Kubernetes Service (EKS), AWS Fargate serverless compute, and ECR.",
    icon: "box",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "Container Services Comparison: ECS vs EKS vs Fargate",
        slug: "ecs-vs-eks-vs-fargate-comparison",
        summary: "Select the right container engine: AWS-native simplicity with ECS, Kubernetes standards with EKS, or serverless maintenance-free with Fargate.",
        difficulty: "Advanced",
        estimatedMinutes: 40,
        keyTakeaway: "Choose ECS for AWS simplicity, EKS for Kubernetes ecosystem portability, and Fargate to run containers without managing underlying EC2 VMs."
      }
    ]
  },
  {
    moduleNumber: 12,
    title: "Monitoring, Logging & Observability",
    slug: "monitoring-logging-and-observability",
    description: "Full-stack cloud observability: CloudWatch (Metrics, Logs, Alarms, Dashboards), CloudTrail API auditing, AWS Config compliance, and X-Ray tracing.",
    icon: "line-chart",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "CloudWatch, CloudTrail, Config & X-Ray Distributed Tracing",
        slug: "cloudwatch-cloudtrail-config-xray-observability",
        summary: "Build an observability pipeline connecting application logs, metrics, distributed traces, and automated alarm triggers for incident response.",
        difficulty: "Intermediate",
        estimatedMinutes: 35,
        keyTakeaway: "Observability = visibility into system health, performance, and issues. CloudWatch monitors performance; CloudTrail audits API calls; Config tracks compliance."
      }
    ]
  },
  {
    moduleNumber: 13,
    title: "Security, Encryption & Compliance",
    slug: "security-encryption-and-compliance",
    description: "Defense-in-depth: AWS KMS key management, Secrets Manager, AWS WAF, Shield DDoS mitigation, GuardDuty threat detection, and Security Hub.",
    icon: "lock",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "Defense-in-Depth Architecture & 5 Golden Security Rules",
        slug: "defense-in-depth-and-golden-security-rules",
        summary: "Protect workloads at every layer: perimeter WAF/Shield, network security groups, KMS encryption at rest, TLS in transit, and Secrets Manager rotation.",
        difficulty: "Advanced",
        estimatedMinutes: 40,
        keyTakeaway: "5 Golden Rules: (1) Least privilege, (2) Encrypt sensitive data, (3) Rotate secrets, (4) Enable logging, (5) Enforce MFA."
      }
    ]
  },
  {
    moduleNumber: 14,
    title: "DevOps, CI/CD & Infrastructure as Code",
    slug: "devops-cicd-and-infrastructure-as-code",
    description: "Automate delivery and provisioning: CodePipeline, CodeBuild, CodeDeploy, CloudFormation, AWS CDK, Terraform, and zero-downtime deployment strategies.",
    icon: "git-pull-request",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "AWS CI/CD Pipelines & Modern Deployment Strategies",
        slug: "cicd-pipelines-and-deployment-strategies",
        summary: "Implement automated delivery pipelines, compare CloudFormation/CDK vs Terraform, and evaluate Rolling, Blue/Green, and Canary releases.",
        difficulty: "Advanced",
        estimatedMinutes: 45,
        keyTakeaway: "Automate everything with IaC and CI/CD. Use Blue/Green or Canary deployments to eliminate downtime and enable instant rollbacks."
      }
    ]
  },
  {
    moduleNumber: 15,
    title: "AWS Advanced Architecture + Pro Tips",
    slug: "aws-advanced-architecture-pro-tips",
    description: "Production-grade reference architectures, end-to-end multi-tier setups, and the 10 Essential Design Principles for Well-Architected AWS workloads.",
    icon: "award",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "Production Reference Architecture & 10 Design Principles",
        slug: "production-reference-architecture-design-principles",
        summary: "Synthesize all services into a high-availability, fault-tolerant, cost-effective enterprise architecture following AWS Well-Architected principles.",
        difficulty: "Advanced",
        estimatedMinutes: 45,
        keyTakeaway: "Design for failure, deploy Multi-AZ by default, decouple with queues/events, automate with IaC, and right-size continuously."
      }
    ]
  },
  {
    moduleNumber: 16,
    title: "Git & GitHub – Enterprise Source Control & GitOps",
    slug: "git-and-github-enterprise-source-control",
    description: "Master distributed version control, the three-section local repository architecture, Atlassian command cheat sheet workflows, advanced branching, pull request reviews, and GitHub Actions CI/CD automation.",
    icon: "git-branch",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "Git Architecture, Version Control Fundamentals & Three-Section Local Repository",
        slug: "git-fundamentals-branching-merge-strategies",
        summary: "Understand Version Control System (VCS) fundamentals, Centralized vs Distributed architectures (SVN vs Git), Ubuntu/Windows setup, global identity configuration, and the three local sections: Working Directory (untracked), Staging Area (Index/staged), and Local Repository (committed snapshots), plus safe unstaging with 'git rm --cached'.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Every Git clone is a complete backup of project history (no single point of failure). Files transition: Working Directory -> git add -> Staging Area -> git commit -> Local Repository. Unstage safely with 'git rm --cached <file>' without losing disk changes."
      },
      {
        topicNumber: 2,
        title: "Git Command Suite & Cheat Sheet Mastery (History, Diffs, Undoing & Remote Sync)",
        slug: "git-command-suite-cheat-sheet-mastery",
        summary: "Master the complete Atlassian Git Cheat Sheet: git init, git clone, config aliases/editor, git status, git log options (--oneline, -p, --stat, --graph --decorate, --author, --grep), git diff (HEAD, --cached), git reset (soft, hard, pointers), git revert, git clean -n/-f, branching, interactive rebasing (git rebase -i), reflog, and remote sync (fetch, pull --rebase, push --force/--tags/--all).",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Run 'git status' constantly to eliminate guesswork. Inspect with 'git log --graph --oneline', undo safely with 'git revert' or soft reset, dry-run with 'git clean -n', and sync remotes using 'git pull --rebase'."
      },
      {
        topicNumber: 3,
        title: "GitHub Actions CI/CD, Secrets & Enterprise Workflows",
        slug: "github-actions-cicd-matrix-secrets",
        summary: "Automate builds and deployments using YAML workflows: triggers (push, pull_request, schedule), runner environments, matrix builds across OS/Node versions, encrypted secrets, and environment protection rules.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "GitHub Actions provides native CI/CD with reusable composite actions, encrypted environment secrets, and strict branch protection rules to enforce status checks."
      }
    ]
  },
  {
    moduleNumber: 17,
    title: "Jenkins – Enterprise CI/CD Pipeline Automation",
    slug: "jenkins-enterprise-cicd-pipeline-automation",
    description: "Master enterprise continuous integration and delivery with Jenkins: RHEL/CentOS setup, initial unlock, Global Security & Role Strategy RBAC, Controller-Agent distributed architecture, GitHub webhooks, multi-stage Declarative Pipelines, Cron build triggers, email alerts, and automated headless Selenium browser testing with Maven and JUnit XML reports.",
    icon: "play-circle",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "Jenkins Controller-Agent Architecture, Linux Setup & Global Security (RBAC)",
        slug: "jenkins-architecture-master-agents",
        summary: "Master Jenkins core architecture: Java 17 prerequisite, RHEL/CentOS YUM installation, systemctl service daemon, initialAdminPassword unlock wizard, Global Security Realm vs Authorization Strategy (Matrix-based and Role Strategy plugin for least-privilege), and Controller-Agent distributed builds with 'agent any' vs 'agent { label }' and 0 executors on Controller.",
        difficulty: "Intermediate",
        estimatedMinutes: 35,
        keyTakeaway: "Jenkins orchestrates build tools; it does not compile code itself. Never run heavy build workloads on the Controller—set Controller executors to 0 and delegate to dedicated labeled agents. Secure user access using the Role Strategy plugin instead of 'logged-in users can do anything'."
      },
      {
        topicNumber: 2,
        title: "Build Triggers, SCM Integration & Declarative Pipelines (Jenkinsfile & Cron Scheduling)",
        slug: "declarative-jenkinsfile-production-pipelines",
        summary: "Master Jenkins automation workflows: Freestyle vs Pipeline jobs, GitHub webhooks (/github-webhook/ with 'GitHub hook trigger for GITScm polling'), Build Triggers (Manual, Remote token, Build periodically vs Poll SCM, Upstream dependencies), 5-field Cron syntax, Declarative Jenkinsfiles (agent, stages, steps, post failure email notifications), and interactive human approval gates.",
        difficulty: "Advanced",
        estimatedMinutes: 40,
        keyTakeaway: "Prefer GitHub webhooks over Poll SCM for instant event-driven builds. Define all pipelines as version-controlled Declarative Jenkinsfiles in SCM. Use post { failure { mail ... } } to eliminate noisy success alert fatigue, and input steps for production deployment gates."
      },
      {
        topicNumber: 3,
        title: "Automated Testing & Continuous Integration: Selenium, Maven & Headless Test Automation",
        slug: "jenkins-selenium-maven-headless-testing",
        summary: "Automate browser testing in CI/CD: Selenium WebDriver setup in Eclipse/Maven, pom.xml dependencies with test scope, writing robust web tests with explicit waits and driver.quit(), running headless browser tests on Linux CI agents (ChromeDriver/Xvfb), Jenkins Maven Freestyle/Declarative integration, and publishing JUnit XML test reports (**/target/surefire-reports/*.xml) for trend analysis.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Automated Selenium testing in Jenkins eliminates 'works on my machine' flakiness. Run browser tests headlessly on Linux CI agents, always close WebDriver sessions with driver.quit(), and publish JUnit XML reports to track test pass/fail trends over time."
      }
    ]
  },
  {
    moduleNumber: 18,
    title: "Docker – Modern Containerization Deep Dive",
    slug: "docker-modern-containerization-deep-dive",
    description: "Container virtualization fundamentals: Linux namespaces & cgroups, Docker daemon architecture, multi-stage Dockerfile optimization, caching, Docker Compose multi-service stacks, networking, and volumes.",
    icon: "box",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "Container Internals, Namespaces & Docker Architecture",
        slug: "docker-internals-container-architecture",
        summary: "Deconstruct container virtualization: Type 1 vs Type 2 hypervisors, Linux kernel namespaces (PID, NET, MNT, IPC, UTS, USER), Control Groups (cgroups v1/v2), OverlayFS union filesystems, Docker client-server architecture (CLI, REST API, dockerd, containerd, runc), Docker group security risks, and container lifecycle states.",
        difficulty: "Beginner",
        estimatedMinutes: 40,
        keyTakeaway: "Containers are isolated Linux processes sharing the host kernel, not full-blown VMs. The Docker CLI speaks REST over a Unix socket to dockerd, which delegates execution to containerd and the runc OCI runtime."
      },
      {
        topicNumber: 2,
        title: "Docker Images, Dockerfile Engineering & Registry Distribution",
        slug: "docker-images-dockerfile-registries",
        summary: "Master Docker image engineering: read-only immutable layers, content-addressable SHA256 hashes, Dockerfile directives (ARG vs ENV, COPY vs ADD, RUN chaining, WORKDIR, EXPOSE), CMD vs ENTRYPOINT matrix, build context optimization, layer cache invalidation rules, base image selection (Alpine musl vs Debian glibc, Distroless, Scratch), multi-stage builds, and image registries (Docker Hub, Harbor, private registry:2).",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        keyTakeaway: "Order Dockerfile instructions from least-frequently to most-frequently changing to maximize layer cache hits. Use multi-stage builds to discard build tools and compilers from production runtime containers."
      },
      {
        topicNumber: 3,
        title: "Docker Networking, Storage Volumes & Multi-Container Docker Compose Stacks",
        slug: "dockerfile-multistage-compose-networking",
        summary: "Architect connected container systems: default bridge vs user-defined bridge networks with automatic DNS service discovery, host and none drivers, storage persistence (named volumes vs bind mounts vs tmpfs), multi-container orchestration with Docker Compose (docker-compose.yml), service dependencies and healthchecks, container resource quotas, and production incident troubleshooting.",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        keyTakeaway: "User-defined bridge networks provide automatic DNS resolution between containers by service name. Docker Compose depends_on only checks container process start, not application readiness — always combine with healthcheck condition."
      }
    ]
  },
  {
    moduleNumber: 19,
    title: "Kubernetes (K8s) – Production Container Orchestration",
    slug: "kubernetes-production-container-orchestration",
    description: "Enterprise container orchestration: Control Plane (API Server, etcd, Scheduler) & Worker Nodes (Kubelet, Kube-Proxy), Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer), Ingress, ConfigMaps, Secrets, PV/PVC, and Helm.",
    icon: "layers",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "Kubernetes Architecture, Control Plane & Cluster Bootstrapping",
        slug: "kubernetes-architecture-control-plane-nodes",
        summary: "Deconstruct the distributed K8s control plane: kube-apiserver REST gateway, etcd distributed consensus, kube-scheduler placement, kube-controller-manager loops, cloud-controller-manager, Kubelet node agents, kube-proxy iptables/IPVS routing, Container Runtime Interface (CRI: containerd, CRI-O), CoreDNS, CNI plugins (Flannel, Calico), cluster bootstrapping (kind, kubeadm), and manifest anatomy (apiVersion, kind, metadata, spec, status, requests vs limits).",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        keyTakeaway: "Only kube-apiserver talks to etcd directly. The scheduler decides WHICH node runs a Pod; the kubelet on that node actually starts it. Use declarative 'kubectl apply -f' over imperative commands."
      },
      {
        topicNumber: 2,
        title: "Kubernetes Workloads, Core Objects, Networking & Storage Abstractions",
        slug: "kubernetes-objects-workloads-networking-storage",
        summary: "Master core Kubernetes abstractions: Pods, Deployments, ReplicaSets, Namespaces, Service types (ClusterIP, NodePort, LoadBalancer, ExternalName), ConfigMaps & Secrets (base64 vs etcd encryption at rest), PersistentVolumes (PV) & PersistentVolumeClaims (PVC), Reclaim Policies, DaemonSets (per-node agents) vs StatefulSets (ordered names & per-pod PVCs), Jobs & CronJobs, and Ingress routing.",
        difficulty: "Intermediate",
        estimatedMinutes: 50,
        keyTakeaway: "Deployments manage stateless Pods; StatefulSets manage stateful databases with stable identities and persistent PVCs. Services select Pods via label selectors, and Ingress requires an active Ingress Controller."
      },
      {
        topicNumber: 3,
        title: "Zero-Downtime Rollouts, Autoscaling (HPA), Helm Packaging & Production Operations",
        slug: "k8s-workloads-services-networking-helm",
        summary: "Operate production Kubernetes clusters: Deployment rollout upgrades (kubectl set image, rollout status/history/undo), RollingUpdate (maxUnavailable, maxSurge) vs Recreate strategies, Horizontal Pod Autoscaler (HPA) with Metrics Server and CPU thresholds, Helm package manager (Chart.yaml, values.yaml, templates/, install, upgrade, rollback), and incident troubleshooting (Pending, CrashLoopBackOff).",
        difficulty: "Advanced",
        estimatedMinutes: 50,
        keyTakeaway: "RollingUpdate scales the new ReplicaSet up while scaling the old one down, keeping the old ReplicaSet at 0 replicas for instant rollback. HPA strictly requires container resource requests to calculate utilization percentages."
      }
    ]
  },
  {
    moduleNumber: 20,
    title: "Complete End-to-End DevOps & Cloud CI/CD Mastery",
    slug: "complete-end-to-end-devops-cloud-cicd",
    description: "Synthesize the full modern cloud-native engineering stack: Git commit -> GitHub webhook -> Jenkins pipeline -> Docker build & security scan -> AWS ECR -> Kubernetes (EKS) automated blue/green rolling deployment.",
    icon: "cpu",
    level: "Advanced",
    topics: [
      {
        topicNumber: 1,
        title: "The Unified Pipeline: GitHub + Jenkins + Docker + K8s + AWS",
        slug: "end-to-end-devops-pipeline-github-jenkins-docker-k8s-aws",
        summary: "Build an enterprise-grade automated deployment pipeline connecting GitHub source control, Jenkins CI automation, Docker containerization, Trivy vulnerability scanning, Amazon ECR container registry, and Amazon EKS Kubernetes clusters.",
        difficulty: "Advanced",
        estimatedMinutes: 55,
        keyTakeaway: "Modern DevOps integrates Developer velocity with Cloud resilience: code changes automatically test, package, scan, and deploy with zero downtime and instant rollback capabilities."
      }
    ]
  }
];
