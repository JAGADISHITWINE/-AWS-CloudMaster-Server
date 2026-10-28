module.exports = [
  {
    moduleNumber: 1,
    title: "AWS Global Infrastructure & Architecture",
    slug: "global-infrastructure-and-architecture",
    description: "Master Regions, Availability Zones, Edge Locations, Local Zones, AWS Global Network backbone, and multi-tier reference architectures.",
    icon: "globe",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "Regions, Availability Zones & Edge Infrastructure",
        slug: "regions-azs-and-edge-infrastructure",
        summary: "Understand the physical and logical layout of AWS: geographic Regions, isolated Availability Zones (AZs), low-latency Edge Locations, and Local Zones.",
        difficulty: "Beginner",
        estimatedMinutes: 30,
        keyTakeaway: "Region = Geographic Area (independent isolated zone); AZ = Independent Data Center Group with dedicated power and networking."
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
    title: "Amazon VPC – Advanced Networking",
    slug: "amazon-vpc-advanced-networking",
    description: "Architect secure virtual networks using VPCs, Public & Private Subnets, Route Tables, IGWs, NAT Gateways, Stateful Security Groups, and Stateless NACLs.",
    icon: "network",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "VPC Subnetting, Gateways & Packet Flow",
        slug: "vpc-subnetting-gateways-packet-flow",
        summary: "Design isolated networks, routing traffic through Internet Gateways and NAT Gateways, comparing Stateful Security Groups vs Stateless NACLs.",
        difficulty: "Intermediate",
        estimatedMinutes: 40,
        keyTakeaway: "Security Groups are Stateful (return traffic auto-allowed); NACLs are Stateless (rules evaluated separately in both directions)."
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
    description: "Master distributed version control, advanced branching strategies, pull request workflows, branch protection rules, GitHub Actions CI/CD automation, matrix testing, and GitOps fundamentals.",
    icon: "git-branch",
    level: "Beginner",
    topics: [
      {
        topicNumber: 1,
        title: "Git Fundamentals, Branching & Merge Strategies",
        slug: "git-fundamentals-branching-merge-strategies",
        summary: "Understand the three-tree architecture (Working Dir, Staging Index, Commit History), branching models (GitFlow vs Trunk-Based), Fast-Forward vs Three-Way merges, and Rebase vs Merge.",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Commits are immutable snapshots of the repository DAG. Use feature branches, interactive rebasing for clean history, and never rebase public shared branches."
      },
      {
        topicNumber: 2,
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
    description: "Enterprise continuous integration and delivery with Jenkins: Controller-Agent distributed architecture, Declarative Jenkinsfile syntax, plugins, GitHub webhooks, multi-branch pipelines, and artifact deployment.",
    icon: "play-circle",
    level: "Intermediate",
    topics: [
      {
        topicNumber: 1,
        title: "Jenkins Controller-Agent Architecture & Setup",
        slug: "jenkins-architecture-master-agents",
        summary: "Understand Jenkins master/controller orchestration, static vs dynamic ephemeral agents (Docker/K8s), plugin ecosystem, security realms, and credentials management.",
        difficulty: "Intermediate",
        estimatedMinutes: 35,
        keyTakeaway: "Never execute build workloads on the Jenkins controller. Delegate jobs to ephemeral agent nodes using SSH or Docker agents to ensure security and isolation."
      },
      {
        topicNumber: 2,
        title: "Declarative Pipelines & Production Jenkinsfile Mastery",
        slug: "declarative-jenkinsfile-production-pipelines",
        summary: "Author production-grade Declarative Jenkinsfiles: pipeline directives (stages, steps, post actions), environment variables, credential binding, parallel execution, SonarQube code scanning, and automated notifications.",
        difficulty: "Advanced",
        estimatedMinutes: 45,
        keyTakeaway: "Store your Jenkinsfile in source control next to application code (Pipeline-as-Code). Use post-build conditions (always, success, failure) for automated rollbacks and alerts."
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
        summary: "Deconstruct how containers work: Linux cgroups for resource quotas, namespaces for process isolation, Union File Systems (OverlayFS), and the Docker engine lifecycle (Client, dockerd, containerd, runc).",
        difficulty: "Beginner",
        estimatedMinutes: 35,
        keyTakeaway: "Containers are isolated Linux processes sharing the host kernel, not full-blown virtual machines. They start in milliseconds with minimal memory overhead."
      },
      {
        topicNumber: 2,
        title: "Dockerfile Multi-Stage Builds, Compose & Networking",
        slug: "dockerfile-multistage-compose-networking",
        summary: "Craft hardened, lightweight production images with multi-stage builds, non-root USER directives, .dockerignore, bridge/host/overlay networks, named volume persistence, and multi-container Docker Compose definitions.",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        keyTakeaway: "Use multi-stage builds to discard build tools and compilers from the final runtime image. Run as a non-root user and never store sensitive secrets in image layers."
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
        title: "Kubernetes Architecture, Control Plane & Core Primitives",
        slug: "kubernetes-architecture-control-plane-nodes",
        summary: "Master the K8s distributed architecture: kube-apiserver, etcd key-value store, kube-scheduler, kube-controller-manager, Kubelet node agent, kube-proxy routing, and the fundamental Pod lifecycle.",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        keyTakeaway: "Kubernetes operates via declarative state: you define the desired state in YAML, and controllers continuously reconcile the actual state to match."
      },
      {
        topicNumber: 2,
        title: "Workloads, Services, Ingress, Helm & Troubleshooting",
        slug: "k8s-workloads-services-networking-helm",
        summary: "Deploy resilient microservices using Deployments, ReplicaSets, Services, Nginx Ingress Controllers, ConfigMaps, Secrets, PersistentVolumes, Helm charts, and diagnose CrashLoopBackOff & OOMKilled pods.",
        difficulty: "Advanced",
        estimatedMinutes: 50,
        keyTakeaway: "Decouple pods using Services and Ingress. Always set CPU/memory requests and limits, configure Liveness and Readiness probes, and manage releases with Helm."
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
