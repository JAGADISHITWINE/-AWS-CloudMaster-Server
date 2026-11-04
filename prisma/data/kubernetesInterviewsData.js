/**
 * Module 19: Kubernetes - Technical Interview Questions & Evaluation Rubrics
 * Sourced from MicroDegree Kubernetes Guide Interview Corners (Sections 1-10)
 */

module.exports = [
  // --- TOPIC 1: Kubernetes Architecture, Control Plane & Cluster Bootstrapping ---
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    topicNumber: 1,
    title: "Draw and Explain the High-Level Kubernetes Architecture in an Enterprise Interview",
    difficulty: "Intermediate",
    prompt: "In a Senior Cloud Architect / DevOps interview, you are asked: 'Step up to the whiteboard and draw the high-level Kubernetes architecture. Clearly delineate the boundary between the Control Plane and Worker Nodes. Explain the exact role of each component and trace what happens from a kubectl command down to a running container.' How do you present this?",
    explanation: "The Control Plane consists of kube-apiserver (central stateless REST gateway), etcd (distributed Raft key-value store; the sole source of truth), kube-scheduler (evaluates node capacity, taints, and affinity to assign pods), and kube-controller-manager (runs reconciliation loops: node, replicaset, endpoints). Worker Nodes run the kubelet (node agent that reconciles PodSpecs with the runtime), kube-proxy (programs iptables/IPVS rules for Service virtual IPs), and the Container Runtime (containerd/CRI-O via CRI).",
    hintsJson: JSON.stringify([
      "Hint 1: Draw two distinct boxes: Control Plane (Master) and Worker Nodes.",
      "Hint 2: Explicitly highlight that ONLY kube-apiserver communicates directly with etcd.",
      "Hint 3: Point out the Container Runtime Interface (CRI) and explain that dockershim was removed in K8s 1.24+.",
      "Hint 4: Clarify that the scheduler assigns the node, but the kubelet on that node spawns the container."
    ]),
    recommendedSolution: `### High-Level Architectural Whiteboard Response:

#### 1. Control Plane Components (The Airport Control Tower):
- **kube-apiserver:**
  - The central front-end REST API gateway for the entire cluster.
  - Handles authentication (mTLS, tokens), authorization (RBAC), and admission control (mutating/validating webhooks).
  - Stateless and horizontally scalable behind a cloud load balancer.
  - **Crucial Architectural Rule:** It is the **ONLY** component allowed to communicate directly with etcd.
- **etcd Store:**
  - Distributed, highly-available, consistent key-value store using the Raft consensus algorithm.
  - Holds the entire cluster state (nodes, pods, secrets, configs)—the single authoritative source of truth.
- **kube-scheduler:**
  - Watches for newly created Pods that lack an assigned node (\`spec.nodeName == ""\`).
  - Executes a two-phase placement pipeline: **Filtering** (disqualifies nodes without CPU/RAM or with untolerated taints) and **Scoring** (ranks remaining nodes for spread, affinity, and resource availability).
  - *Key Distinction:* It does **not** launch containers; it merely writes a binding back to the API server.
- **kube-controller-manager:**
  - Runs multiple asynchronous reconciliation loops bundled into a single binary:
    - *Node Controller:* Detects node heartbeats and handles eviction after 5-minute timeout.
    - *ReplicaSet Controller:* Ensures running pod count matches \`spec.replicas\`.
    - *Endpoints Controller:* Populates Service IP endpoints when pods match label selectors.
- **cloud-controller-manager:**
  - Decouples cloud-specific logic (AWS NLB provisioning, EBS volume attachment) from core K8s code.

#### 2. Worker Node Components (The Runways & Ground Crew):
- **kubelet:**
  - The primary agent running on every worker node.
  - Reads PodSpecs assigned by the API server and interfaces with the container runtime via CRI to start/stop containers.
  - Executes container health checks (Liveness, Readiness, Startup probes) and reports node status.
  - *Boundary Rule:* A container started manually via \`docker run\` on the host is invisible to kubelet.
- **kube-proxy:**
  - Network proxy running on every node.
  - Programs kernel **iptables** NAT rules or **IPVS** connection tables to route traffic directed to Service virtual IPs across healthy Pod endpoints.
- **Container Runtime (via CRI):**
  - The software that actually pulls images and runs containers (e.g. \`containerd\`, \`CRI-O\`).
  - Direct Docker Engine integration (\`dockershim\`) was removed in Kubernetes 1.24, but Docker-built OCI-compliant images run natively without modification.

#### 3. Core Add-ons:
- **CoreDNS:** Cluster-internal DNS server for service discovery (\`<svc>.<ns>.svc.cluster.local\`).
- **CNI Plugin (Calico/Flannel/Cilium):** Provisions virtual interfaces and assigns private IPs to Pods.
- **Metrics Server:** Scrapes resource metrics from kubelet cAdvisor endpoints to power \`kubectl top\` and the Horizontal Pod Autoscaler (HPA).`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Control Plane vs Worker Node Segregation", weight: 30, description: "Correctly groups and explains all components in their respective planes." },
        { name: "etcd Access & API Server Boundary", weight: 25, description: "Explicitly states that only kube-apiserver accesses etcd directly." },
        { name: "Scheduler vs Kubelet Responsibility", weight: 25, description: "Explains scheduler assigns node; kubelet spawns the container via CRI." },
        { name: "CRI & Add-on Awareness", weight: 20, description: "Explains containerd/CRI-O, CoreDNS, CNI plugins, and Metrics Server." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes Architecture", "Control Plane", "Worker Node", "etcd", "kubelet", "kube-proxy", "Interview"])
  },
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    topicNumber: 1,
    title: "Bootstrapping with kubeadm vs Managed Kubernetes (EKS/GKE/AKS): Operational Trade-Offs",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'What is the exact operational difference between self-managing a Kubernetes cluster bootstrapped via kubeadm and using a cloud managed service like Amazon EKS, Azure AKS, or Google GKE? When would an enterprise choose one over the other?'",
    explanation: "With kubeadm, the operations team is 100% responsible for the entire infrastructure lifecycle: provisioning VMs, running kubeadm init/join, securing etcd clusters with manual snapshot backups, orchestrating control plane version upgrades, and patching host OS vulnerabilities. With Managed Kubernetes (EKS/AKS/GKE), the cloud provider guarantees a highly available, multi-AZ control plane SLA, automates etcd backups and master upgrades, leaving the customer responsible only for worker node pools and application workloads.",
    hintsJson: JSON.stringify([
      "Hint 1: Contrast who manages the Control Plane and etcd in both models.",
      "Hint 2: Review operational burdens: etcd backups, certificate rotation, and minor version upgrades.",
      "Hint 3: Consider compliance, on-premises data centers, and air-gapped environments.",
      "Hint 4: Factor in cost: cloud provider control plane hourly charge ($0.10/hr on AWS EKS) vs engineer operational time."
    ]),
    recommendedSolution: `### Comprehensive Operational Trade-Off Analysis:

#### 1. Responsibility Matrix:
| Responsibility Domain | Self-Managed via kubeadm | Managed K8s (Amazon EKS / GKE / AKS) |
| :--- | :--- | :--- |
| **Control Plane Provisioning** | Manual (\`kubeadm init\`, flags, CIDR) | Automated 1-click or Terraform provisioned |
| **Control Plane High Availability** | Manual setup of 3+ masters + external LB | Cloud provider SLA (99.95% uptime across AZs) |
| **etcd Backups & Maintenance** | **Customer Responsibility** (snapshots, disk I/O, defrag) | **Cloud Provider Managed** (fully automated) |
| **Control Plane Upgrades** | Manual (\`kubeadm upgrade plan/apply\`) | Automated in-place or blue/green master updates |
| **PKI & TLS Cert Rotation** | Manual rotation before 1-year expiry | Fully automated managed certificate rotation |
| **Cloud Provider API Integration** | Requires manual cloud-controller-manager setup | Native integration with IAM, VPC CNI, EBS, NLB |
| **Worker Node Management** | Customer provisions and joins nodes | Managed Node Groups / Serverless Fargate / Karpenter |

#### 2. When to Choose Managed Kubernetes (Amazon EKS):
- **Standard Enterprise Default:** Recommended for 95% of cloud workloads.
- **Cost Efficiency:** While AWS charges $0.10/hour ($73/month) per EKS cluster control plane, this cost is negligible compared to the salary cost of DevOps engineers maintaining HA etcd clusters manually.
- **Deep Cloud Integration:** Native integration with AWS IAM (IRSA / Pod Identity), AWS VPC CNI (giving Pods native AWS VPC IPs), and Amazon EBS CSI drivers.

#### 3. When to Choose Self-Managed kubeadm:
- **On-Premises Data Centers:** Running Kubernetes on bare-metal servers or VMware vSphere without cloud hyper-scalers.
- **Air-Gapped & Sovereign Clouds:** Military, defense, or strict banking environments where outbound internet access to AWS APIs is forbidden.
- **Custom Kernel / Experimental Flags:** Scenarios requiring bespoke alpha/beta API flags or custom kernel modules that managed cloud providers intentionally restrict.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Control Plane Ownership Contrast", weight: 35, description: "Explains customer owns etcd/masters in kubeadm vs cloud provider SLA in EKS." },
        { name: "Lifecycle Maintenance Awareness", weight: 25, description: "Highlights certificate rotation, etcd snapshotting, and version upgrades." },
        { name: "Cloud Integration Mechanisms", weight: 20, description: "Mentions IAM integration (IRSA), VPC CNI, and automated load balancing." },
        { name: "Strategic Selection Justification", weight: 20, description: "Provides realistic enterprise criteria for on-premises/air-gapped vs cloud." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "kubeadm", "Amazon EKS", "Managed K8s", "etcd Backups", "Cluster Operations"])
  },

  // --- TOPIC 2: Kubernetes Workloads, Core Objects, Networking & Storage Abstractions ---
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    topicNumber: 2,
    title: "Why Do We Almost Never Create Bare Pods in Production, and How Do Workload Controllers Differ?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'If a Pod is the fundamental unit of deployment in Kubernetes, why is creating bare Pods (via `kubectl run` or a raw Pod manifest) considered a severe anti-pattern in production? Compare the 4 major workload controllers: Deployments, StatefulSets, DaemonSets, and Jobs.'",
    explanation: "Bare Pods have zero self-healing capability: if a worker node crashes, experiences a kernel panic, or the Pod process exits, nothing recreates the Pod. Workload controllers act as higher-level supervisors: Deployments manage stateless Pods with rolling updates and auto-healing; StatefulSets provide stable ordered identities (db-0, db-1) and dedicated per-Pod persistent volumes; DaemonSets guarantee exactly one Pod runs on every node for infrastructure agents; Jobs run batch workloads to successful completion.",
    hintsJson: JSON.stringify([
      "Hint 1: What happens to a bare Pod when its underlying EC2 worker node terminates?",
      "Hint 2: Compare Deployments (stateless) vs StatefulSets (databases).",
      "Hint 3: Explain the unique operational purpose of DaemonSets (one pod per node).",
      "Hint 4: Contrast Jobs (run to completion) with Deployments (run indefinitely)."
    ]),
    recommendedSolution: `### Comprehensive Workload Controller Breakdown:

#### 1. Why Bare Pods are Forbidden in Production:
- **No Self-Healing:** A bare Pod has no controller reconciliation loop watching over it. If its node is terminated by AWS Auto Scaling, or if the node runs out of memory, the Pod is gone forever.
- **No Zero-Downtime Rollouts:** Bare Pods cannot be updated in-place without deleting and recreating them, resulting in customer-facing downtime.
- **No Autoscaling:** The Horizontal Pod Autoscaler (HPA) cannot manage bare Pods; it requires a controller target (Deployment or StatefulSet).

#### 2. Comparison of the 4 Major Workload Controllers:
| Controller | Primary Use Case | Pod Identity | Storage Model | Scaling Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Deployment** | Stateless microservices (React web, Node/Java REST APIs) | **Interchangeable** (Random hash suffix: \`web-84f9b-abcde\`) | None, or shared ReadWriteMany | Freely scalable up/down; supports rolling updates and rollbacks |
| **StatefulSet** | Clustered databases (PostgreSQL, MongoDB, Kafka, ZooKeeper) | **Stable, Ordered** (\`db-0\`, \`db-1\`, \`db-2\`) | **Dedicated per-Pod PVC** via \`volumeClaimTemplates\` | Ordered sequential startup and termination; stable headless DNS |
| **DaemonSet** | Node-level infrastructure agents (Fluentd logging, Datadog/Prometheus Node Exporter, CNI plugins) | Exactly **One Pod per Node** | Node hostPath or host network | Tied 1:1 to node count; automatically adds pods as new nodes join |
| **Job / CronJob** | Batch processing, one-off DB schema migrations, nightly reports | Ephemeral | Ephemeral or temporary PVC | Runs to **completion** (exit code 0); does **not** restart on success |

#### 3. Key Interview Takeaways:
- **For Batch Tasks:** Never use a Deployment for a database migration script; a Deployment will mistakenly restart the completed script indefinitely, executing migrations repeatedly. Always use a **Job**.
- **For Clustered Databases:** Never use a Deployment for stateful databases; when a Deployment reschedules, it assigns a random name and mounts the same volume, risking split-brain and corruption. Always use a **StatefulSet**.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Bare Pod Failure Mechanics", weight: 25, description: "Explains lack of self-healing and node termination vulnerability." },
        { name: "Deployment vs StatefulSet Mechanics", weight: 35, description: "Contrasts random hash vs stable ordinal identity and per-pod PVCs." },
        { name: "DaemonSet Infrastructure Role", weight: 20, description: "Identifies 1 pod per node pattern for monitoring, logging, and CNI." },
        { name: "Job vs Long-Running Controllers", weight: 20, description: "Explains run-to-completion semantics vs indefinite restart loops." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Pod", "Deployment", "StatefulSet", "DaemonSet", "Job", "Workloads"])
  },
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    topicNumber: 2,
    title: "Kubernetes Storage Subsystem: How PVs, PVCs, and StorageClasses Decouple Storage from Applications",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Explain how storage works in Kubernetes. Why does a developer write a PersistentVolumeClaim (PVC) instead of referencing a PersistentVolume (PV) directly? What role does a StorageClass play in dynamic provisioning, and what are the 3 volume reclaim policies?'",
    explanation: "Kubernetes implements a clean abstraction boundary between application developers and infrastructure storage. A PersistentVolume (PV) is an actual storage resource in the cluster (e.g. an AWS EBS volume). A PersistentVolumeClaim (PVC) is a developer's request for storage (capacity and access mode). The StorageClass acts as a dynamic provisioner: when a PVC requests storage, the StorageClass automatically creates the underlying cloud disk and PV on-the-fly. Reclaim policies (Retain, Delete, Recycle) dictate what happens to the underlying cloud storage when the PVC is deleted.",
    hintsJson: JSON.stringify([
      "Hint 1: Compare PVC to a pod request and PV to a node's physical resource.",
      "Hint 2: Explain dynamic provisioning via StorageClass vs manual admin static provisioning.",
      "Hint 3: Understand the access modes: ReadWriteOnce (RWO) vs ReadWriteMany (RWX).",
      "Hint 4: Define the 3 reclaim policies: Retain, Delete, Recycle."
    ]),
    recommendedSolution: `### Deep Dive: Kubernetes Storage Architecture

#### 1. Why Pods Reference PVCs Instead of PVs:
- **Portability & Separation of Concerns:**
  - A developer authoring an application should only care: *"My database needs 50GB of persistent storage."*
  - The developer should **not** need to know whether the cluster runs on AWS (EBS gp3), Azure (Managed Disks), Google Cloud (Persistent Disks), or an on-premises SAN (NFS/Ceph).
  - The **PVC** is the developer's abstract storage ticket.
  - The **PV** is the actual cloud disk provisioned by the infrastructure.
  - By referencing the PVC in the Pod spec, the identical application manifest can be deployed across AWS, GCP, and local kind clusters without changing a single line of YAML.

#### 2. The Dynamic Provisioning Workflow (StorageClass):
1. **Developer creates a PVC:** Specifies \`storageClassName: gp3\` and requests \`100Gi\` with access mode \`ReadWriteOnce\`.
2. **CSI Driver Interception:** The Kubernetes volume controller detects the unbound PVC and invokes the AWS EBS CSI driver configured by the StorageClass.
3. **Cloud API Call:** The CSI driver makes an AWS API call: \`ec2:CreateVolume\` in the appropriate Availability Zone.
4. **PV Auto-Creation:** Kubernetes creates a PersistentVolume object representing the newly created AWS EBS volume and binds it 1:1 to the PVC.
5. **Node Attachment & Mount:** When the Pod schedules to a worker node, the kubelet volume manager attaches the EBS disk to the EC2 instance (\`ec2:AttachVolume\`), formats the filesystem (ext4/xfs), and mounts it into the container directory.

#### 3. Storage Reclaim Policies:
When a developer deletes a PersistentVolumeClaim (\`kubectl delete pvc\`), the Reclaim Policy determines the fate of the underlying physical storage:
- **Delete (Default for Dynamic Provisioning):**
  - Automatically deletes both the Kubernetes PV and the physical cloud disk (e.g. the AWS EBS volume is deleted from AWS).
  - Ideal for ephemeral environments, but dangerous if accidentally run on production databases.
- **Retain:**
  - Deleting the PVC leaves the PersistentVolume and physical cloud disk completely intact.
  - The PV enters the \`Released\` state, preventing other claims from overwriting data until an administrator manually recovers or rebinds it.
  - **Mandatory production standard for mission-critical databases.**
- **Recycle (Deprecated):**
  - Performs a basic scrub (\`rm -rf /data/*\`) and makes the volume available for binding again. Deprecated in favor of dynamic provisioning.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "PV vs PVC Abstraction Layer", weight: 35, description: "Explains developer storage claim vs infrastructure physical disk decoupling." },
        { name: "StorageClass Dynamic Provisioning Workflow", weight: 30, description: "Details CSI driver calling cloud APIs to create volumes on-demand." },
        { name: "Reclaim Policies (Retain vs Delete)", weight: 20, description: "Explains data retention vs automatic cloud volume deletion on PVC removal." },
        { name: "Access Modes (RWO vs RWX)", weight: 15, description: "Contrasts single-node block storage (EBS) with multi-node shared storage (EFS)." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "PersistentVolume", "PVC", "StorageClass", "AWS EBS", "CSI Driver", "Storage"])
  },

  // --- TOPIC 3: Zero-Downtime Rollouts, Autoscaling (HPA), Helm Packaging & Production Operations ---
  {
    moduleNumber: 19,
    topicSlug: "k8s-workloads-services-networking-helm",
    topicNumber: 3,
    title: "RollingUpdate vs Recreate Deployment Strategies: Mechanics, maxUnavailable, and maxSurge",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Explain the internal mechanics of a Kubernetes RollingUpdate. What do `maxUnavailable` and `maxSurge` control? If an application update has breaking database schema changes, why is RollingUpdate dangerous, and what strategy should you choose instead?'",
    explanation: "RollingUpdate achieves zero-downtime application upgrades by gradually creating new ReplicaSet pods while terminating old ReplicaSet pods, constrained by maxSurge (maximum extra pods allowed during rollout) and maxUnavailable (maximum missing pods allowed). However, if an update introduces incompatible database schema changes (e.g. dropping a column), old and new versions cannot run concurrently. In that scenario, the Recreate strategy is mandatory: it terminates ALL old pods before creating new pods, accepting brief downtime to prevent database corruption.",
    hintsJson: JSON.stringify([
      "Hint 1: Detail the twin ReplicaSet dance: new ReplicaSet scales up while old ReplicaSet scales down.",
      "Hint 2: Define maxSurge (ceiling on temporary resource usage) and maxUnavailable (floor on active capacity).",
      "Hint 3: Think about database migrations: what happens if v1 and v2 run simultaneously against the same DB?",
      "Hint 4: Explain why Recreate terminates all existing pods first."
    ]),
    recommendedSolution: `### Deep Dive: RollingUpdate vs Recreate Deployment Strategies

#### 1. Internal Mechanics of a RollingUpdate:
When you update a Deployment's pod template (e.g. \`spec.template.spec.containers[0].image\`):
1. **ReplicaSet Creation:** The DeploymentController creates a brand-new ReplicaSet tagged with a pod-template-hash.
2. **Concurrent Pod Transition:**
   - It increments the new ReplicaSet's replica count.
   - Once a new Pod passes its **Readiness Probe**, it is added to the Service endpoints.
   - The controller decrements the old ReplicaSet, sending \`SIGTERM\` to an old Pod.
3. **Governing Parameters:**
   - **maxSurge:** The maximum number (or percentage) of Pods that can be created **above** the desired replica count during an update.
     - *Example:* If \`replicas: 4\` and \`maxSurge: 1\`, up to 5 pods can exist simultaneously.
   - **maxUnavailable:** The maximum number (or percentage) of Pods that can be offline **below** the desired replica count during an update.
     - *Example:* If \`replicas: 4\` and \`maxUnavailable: 0\`, 4 healthy pods must be available at all times.
4. **Completion:** When all new Pods are healthy, the old ReplicaSet is scaled to 0 (retained for instant rollback via \`kubectl rollout undo\`).

#### 2. The Danger of RollingUpdate with Database Schema Migrations:
- **The Dual-Version Conflict:**
  During a RollingUpdate, both **Version 1.0 (old)** and **Version 2.0 (new)** Pods are actively running and serving traffic concurrently for several minutes.
- **The Breaking Schema Crash:**
  - If Version 2.0 applies a database migration that deletes or renames a column (\`ALTER TABLE users DROP COLUMN phone\`), Version 1.0 Pods will immediately throw fatal SQL exceptions and 500 errors on incoming customer requests.
  - If Version 1.0 writes old schema data, it may corrupt records expected by Version 2.0.

#### 3. When to Choose Recreate:**
\`\`\`yaml
spec:
  strategy:
    type: Recreate
\`\`\`
- **How Recreate Works:** It forcefully kills **all** Version 1.0 Pods first, waits for termination, and only then creates Version 2.0 Pods.
- **The Trade-Off:** It incurs deliberate, planned downtime (e.g. 30 seconds), but **guarantees that Version 1 and Version 2 never run simultaneously**.
- **Alternative (Expand and Contract Pattern):** To achieve zero-downtime with database migrations, adopt the multi-phase Expand/Contract pattern: Phase 1 adds the new column (backward compatible); Phase 2 updates code; Phase 3 drops the old column in a subsequent release.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "RollingUpdate Twin ReplicaSet Mechanics", weight: 30, description: "Explains new ReplicaSet scaling up while old scales down." },
        { name: "maxSurge & maxUnavailable Definitions", weight: 30, description: "Accurately defines both parameters as bounds on headroom and capacity." },
        { name: "Database Schema Dual-Version Hazard", weight: 25, description: "Details breaking changes when old and new code query the same DB concurrently." },
        { name: "Recreate Justification & Trade-Off", weight: 15, description: "Explains deliberate downtime to guarantee zero version overlap." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Deployments", "RollingUpdate", "Recreate", "maxSurge", "maxUnavailable", "Database Migrations"])
  },
  {
    moduleNumber: 19,
    topicSlug: "k8s-workloads-services-networking-helm",
    topicNumber: 3,
    title: "What Real Problem Does Helm Solve That Plain 'kubectl apply -f' Doesn't?",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Why do organizations adopt Helm when Kubernetes already has `kubectl apply -f`? What are the limitations of raw YAML manifests in multi-environment enterprise deployments, and how does Helm's chart anatomy solve them?'",
    explanation: "Plain 'kubectl apply -f' handles only static, unparameterized YAML manifests. It lacks templating (forcing teams to maintain duplicated YAML files for dev, staging, prod), lacks release versioning (cannot track what set of manifests were deployed together or roll back the entire application atomically), and lacks dependency management. Helm solves this by providing Go-based templating driven by values.yaml, atomic release management with versioned rollbacks ('helm rollback'), and packaged chart distribution via Artifact Hub.",
    hintsJson: JSON.stringify([
      "Hint 1: Think about managing 15 microservices across dev, staging, and prod with raw YAML.",
      "Hint 2: Explain Helm templating using '{{ .Values.x }}' placeholders.",
      "Hint 3: Detail Helm's atomic release tracking and rollback capabilities.",
      "Hint 4: Review Helm chart structure: Chart.yaml, values.yaml, templates/, and charts/."
    ]),
    recommendedSolution: `### Architectural Analysis: Helm vs Raw kubectl YAML

#### 1. Limitations of Plain 'kubectl apply -f':
1. **Static, Duplicated Manifests:**
   Deploying an application across Dev, Staging, and Production requires maintaining 3 separate sets of identical YAML files with only minor differences (CPU limits, replica counts, domain names). This violates DRY (Don't Repeat Yourself) and leads to configuration drift.
2. **No Application-Level Versioning:**
   \`kubectl apply\` manages individual resources independently. It has no concept of an *application release*. If an upgrade applies a Deployment, Service, and ConfigMap, and the ConfigMap fails, there is no single command to roll back the entire coordinated release.
3. **No Dependency Management:**
   If your application requires Redis and PostgreSQL, raw YAML requires manually tracking and applying third-party manifests.

#### 2. The 3 Core Problems Helm Solves:
1. **Dynamic Templating (Driven by values.yaml):**
   - Manifests are written once as templates using Go templating:
     \`\`\`yaml
     replicas: {{ .Values.replicaCount }}
     image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
     \`\`\`
   - Different environments simply provide their own values file:
     \`\`\`bash
     helm install api ./mychart -f values-dev.yaml   # 1 replica, 256Mi RAM
     helm install api ./mychart -f values-prod.yaml  # 5 replicas, 2Gi RAM
     \`\`\`
2. **Atomic Releases & Whole-Application Rollbacks:**
   - Helm tracks every deployment as an incremental release revision stored in cluster Secrets.
   - If an upgrade fails, a single command rolls back the entire application—Deployment, Service, Ingress, and ConfigMaps—to a known-good revision:
     \`\`\`bash
     helm rollback api 2
     \`\`\`
3. **Dependency Bundling:**
   - Helm allows bundling sub-charts in \`charts/\`. Your application chart can declare Bitnami PostgreSQL as a dependency in \`Chart.yaml\`, and Helm installs and wires both automatically.

#### 3. Standard Helm Chart Directory Anatomy:
\`\`\`text
mychart/
├── Chart.yaml          # Metadata: name, version (semver), description
├── values.yaml         # Default configuration values for templates
├── values-prod.yaml    # Production-specific configuration overrides
├── charts/             # Sub-chart dependencies (e.g. redis, postgresql)
└── templates/          # Parameterized Kubernetes manifest templates
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── _helpers.tpl    # Reusable named template snippets
\`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Raw YAML Limitations Identified", weight: 30, description: "Explains static duplication, configuration drift, and lack of release tracking." },
        { name: "Helm Templating & Multi-Environment Strategy", weight: 35, description: "Details templates/ driven by environment-specific values.yaml files." },
        { name: "Atomic Rollback Mechanics", weight: 20, description: "Explains 'helm rollback' across all application resources simultaneously." },
        { name: "Chart Anatomy Knowledge", weight: 15, description: "Correctly outlines Chart.yaml, values.yaml, and templates/." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "Helm", "kubectl", "Package Management", "Templating", "CI/CD", "Release Engineering"])
  },
  {
    moduleNumber: 19,
    topicSlug: "k8s-workloads-services-networking-helm",
    topicNumber: 3,
    title: "Horizontal Pod Autoscaler (HPA) Architecture: Metrics Pipeline, Scaling Algorithm & Flapping Prevention",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How does the Kubernetes Horizontal Pod Autoscaler calculate replica counts? Why does HPA fail if container resource requests are omitted, and how does Kubernetes prevent flapping (rapid scale-up / scale-down thrashing)?'",
    explanation: "Tests deep understanding of the Kubernetes metrics API pipeline (Metrics Server, kubelet cAdvisor), HPA control loop mathematics, dependency on CPU requests, and downscale stabilization windows.",
    hintsJson: JSON.stringify([
      "Explain Metrics Server scraping cAdvisor on each kubelet.",
      "Detail the HPA formula: desiredReplicas = ceil[currentReplicas * (currentMetricValue / desiredMetricValue)].",
      "Explain why targetAverageUtilization requires 'resources.requests.cpu' in the pod template.",
      "Explain stabilizationWindowSeconds (default 300s) preventing flapping."
    ]),
    recommendedSolution: `### Deep Dive: Kubernetes Horizontal Pod Autoscaler (HPA)

#### 1. The Metrics Pipeline Architecture:
HPA does not measure CPU directly. It relies on a multi-stage monitoring pipeline:
1. **cAdvisor:** Embedded inside every worker node's **kubelet**, cAdvisor continuously measures container CPU and memory consumption from Linux cgroups.
2. **Metrics Server:** A cluster-wide aggregator that periodically scrapes resource usage from every kubelet via the kubelet summary API (\`/stats/summary\`) and serves them via the Kubernetes Aggregation Layer (\`metrics.k8s.io\`).
3. **HPA Controller:** Runs inside \`kube-controller-manager\` on the Control Plane. Every 15 seconds (configurable via \`--horizontal-pod-autoscaler-sync-period\`), it queries \`metrics.k8s.io\` and compares current usage against target thresholds.

#### 2. The Core Scaling Algorithm:
Kubernetes uses the following formula to calculate desired replica counts:
$$\\text{desiredReplicas} = \\left\\lceil \\text{currentReplicas} \\times \\left( \\frac{\\text{currentMetricValue}}{\\text{desiredMetricValue}} \\right) \\right\\rceil$$

- **Concrete Example:**
  - Desired CPU target: **50%**
  - Current replicas: **2**
  - Current average CPU across pods: **80%**
  - Calculation: $\\lceil 2 \\times (80 / 50) \\rceil = \\lceil 3.2 \\rceil = \\mathbf{4\\text{ replicas}}$.
  - The HPA patches \`spec.replicas: 4\` on the Deployment!

#### 3. Why HPA Fails Without 'resources.requests':
If your container definition does **NOT** declare \`resources.requests.cpu\`:
- Kubernetes does not know what \"100%\" of the requested capacity means for that Pod!
- The HPA will report:
  \`\`\`text
  TARGETS: <unknown>/50%
  Warning: FailedGetResourceMetric: missing request for cpu
  \`\`\`
- HPA will **completely refuse to scale** because utilization percentages are computed as:
  $$\\text{Utilization \\%} = \\frac{\\text{Actual CPU Usage (millicores)}}{\\text{CPU Request (millicores)}} \\times 100$$
- **Rule:** \`resources.requests\` is mandatory for every auto-scaled workload.

#### 4. Flapping Prevention (Thrashing Protection):
\"Flapping\" occurs when a traffic spike triggers rapid scale-up, followed by traffic falling, causing rapid scale-down, which causes remaining pods to spike again in an oscillating loop.
Kubernetes prevents this via **stabilization windows**:
- **Default Downscale Stabilization Window:** 300 seconds (5 minutes).
- When demand drops, HPA calculates that replicas should decrease from 10 to 2, but it **waits 5 minutes**, monitoring the historical peak across that 5-minute window before actually terminating pods.
- You can fine-tune scaling behavior in HPA v2:
  \`\`\`yaml
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
  \`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Metrics Pipeline Components", weight: 25, description: "Identifies cAdvisor, kubelet summary API, and cluster Metrics Server." },
        { name: "HPA Mathematical Formula", weight: 30, description: "Correctly articulates desiredReplicas = ceil[currentReplicas * (current/desired)]." },
        { name: "Mandatory CPU Requests Explained", weight: 25, description: "Explains why target utilization requires a declared request denominator." },
        { name: "Stabilization Windows & Flapping", weight: 20, description: "Details the 300-second scale-down stabilization window and thrashing mitigation." }
      ]
    }),
    tagsJson: JSON.stringify(["Kubernetes", "HPA", "Autoscaling", "Metrics Server", "cAdvisor", "Performance", "Interview"])
  }
];
