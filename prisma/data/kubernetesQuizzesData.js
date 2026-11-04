/**
 * Dedicated Kubernetes Quizzes & Assessments (Module 19)
 * Aligned with the MicroDegree Kubernetes Concept Guide & Interview Q&A
 *
 * Topic 1: kubernetes-architecture-control-plane-nodes (Control Plane, Worker Nodes, Cluster Setup)
 * Topic 2: kubernetes-objects-workloads-networking-storage (Pods, Deployments, Services, ConfigMaps, Secrets, PV/PVC)
 * Topic 3: k8s-workloads-services-networking-helm (RollingUpdate, Autoscaling HPA, Helm Charts, Production Ops)
 */

const kubernetesQuizzes = [
  // ==========================================
  // TOPIC 1: Kubernetes Architecture, Control Plane & Cluster Bootstrapping
  // ==========================================
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Advanced",
    title: "etcd Distributed Consensus & Quorum Requirements",
    prompt: "In a production high-availability Kubernetes cluster, an administrator plans to configure the etcd cluster. Why must an etcd cluster strictly use an odd number of nodes (3, 5, or 7), and how many node failures can a 5-node etcd cluster tolerate before losing write quorum?",
    explanation: "etcd uses the Raft consensus algorithm which requires a strict majority quorum: (N / 2) + 1. For a 5-node cluster, quorum is (5 / 2) + 1 = 3 nodes. Therefore, it can tolerate at most 2 node failures (5 - 3 = 2). An even number of nodes (e.g. 6) requires 4 nodes for quorum, tolerating only 2 failures—providing no extra fault tolerance while increasing network latency and split-brain risk.",
    hintsJson: JSON.stringify([
      "Recall the Raft quorum formula: floor(N / 2) + 1.",
      "Calculate 5 - quorum to find the maximum allowed node failures.",
      "Even numbers add overhead without increasing failure tolerance."
    ]),
    options: [
      { optionKey: "A", optionText: "Odd nodes prevent split-brain; a 5-node cluster requires 3 nodes for quorum and can tolerate 2 node failures.", isCorrect: true },
      { optionKey: "B", optionText: "Odd nodes are required by Linux kernel licensing; a 5-node cluster can tolerate up to 4 node failures.", isCorrect: false },
      { optionKey: "C", optionText: "Even nodes cause CPU deadlock; a 5-node cluster tolerates 3 node failures.", isCorrect: false },
      { optionKey: "D", optionText: "Odd nodes enable asynchronous replication; a 5-node cluster tolerates only 1 node failure.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Worker Node Execution: Kubelet vs Container Runtime Interface (CRI)",
    prompt: "What is the primary responsibility of the `kubelet` agent on a Kubernetes worker node, and how does it interface with container runtimes such as containerd or CRI-O?",
    explanation: "The kubelet is the primary node agent that registers the worker node with the API server, receives PodSpecs from kube-apiserver, and invokes the Container Runtime Interface (CRI) via gRPC to pull images and start/stop containers. It also monitors container health via probes and reports node resource utilization.",
    hintsJson: JSON.stringify([
      "The kubelet is the worker node's 'local captain'.",
      "It doesn't start containers directly; it issues gRPC calls to the CRI (containerd).",
      "It also executes Liveness and Readiness probes."
    ]),
    options: [
      { optionKey: "A", optionText: "It writes state directly to the etcd cluster and schedules pods across other nodes.", isCorrect: false },
      { optionKey: "B", optionText: "It watches PodSpecs from kube-apiserver and communicates with containerd/CRI-O via the CRI gRPC specification to run containers and monitor health.", isCorrect: true },
      { optionKey: "C", optionText: "It routes Layer 7 HTTP ingress traffic from public domain names into ClusterIP services.", isCorrect: false },
      { optionKey: "D", optionText: "It generates Helm package charts and packages Dockerfiles into multi-stage images.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Kubernetes Cluster Provisioning: kind vs kubeadm vs Managed EKS",
    prompt: "A developer wants to test multi-node Kubernetes networking and Helm deployments locally on their laptop in lightweight Docker containers without spinning up multiple heavy virtual machines. Which tool is purpose-built for this exact workflow?",
    explanation: "kind (Kubernetes IN Docker) runs local Kubernetes clusters by treating Docker containers as individual cluster nodes. It supports multi-node topologies (1 control-plane, 2 workers) with near-instant spin-up and teardown, making it ideal for local testing and CI/CD pipelines.",
    hintsJson: JSON.stringify([
      "Think about 'Kubernetes IN Docker'.",
      "It boots worker and control plane nodes as standard Docker containers.",
      "The CLI command is 'kind create cluster'."
    ]),
    options: [
      { optionKey: "A", optionText: "kubeadm on bare metal servers", isCorrect: false },
      { optionKey: "B", optionText: "AWS Elastic Kubernetes Service (EKS)", isCorrect: false },
      { optionKey: "C", optionText: "kind (Kubernetes in Docker)", isCorrect: true },
      { optionKey: "D", optionText: "VirtualBox with manual Linux kernel recompilation", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "kube-apiserver: Central Communication Hub & Data Access Rules",
    prompt: "In Kubernetes Control Plane architecture, which component is permitted to directly read from and write to the `etcd` distributed key-value store?",
    explanation: "kube-apiserver is the ONLY component in the entire Kubernetes cluster that directly accesses etcd. All other components (kube-scheduler, controller-manager, kubelet, kubectl) communicate exclusively via REST calls to the kube-apiserver, which enforces authentication, authorization (RBAC), and admission control.",
    hintsJson: JSON.stringify([
      "No worker node or controller communicates with etcd directly.",
      "The API Server is the sole gatekeeper and single source of truth validator."
    ]),
    options: [
      { optionKey: "A", optionText: "kube-scheduler and kube-controller-manager read directly from etcd disk files.", isCorrect: false },
      { optionKey: "B", optionText: "kubelet communicates directly with etcd over port 2379 for fast heartbeat reporting.", isCorrect: false },
      { optionKey: "C", optionText: "Only kube-apiserver directly accesses etcd; all other cluster components must query the API Server via REST.", isCorrect: true },
      { optionKey: "D", optionText: "Any component running in the kube-system namespace has direct read/write disk access to etcd.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Container Network Interface (CNI) Plugin Architecture",
    prompt: "A newly initialized Kubernetes cluster has nodes showing `STATUS: NotReady`. The administrator checks events and sees `runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady`. What is the root cause and required fix?",
    explanation: "Kubernetes core does not ship with an active Pod networking implementation. Nodes remain in NotReady status until a Container Network Interface (CNI) plugin (such as Calico, Flannel, or Cilium) is deployed to configure the virtual network interfaces, IP address management (IPAM), and pod routing.",
    hintsJson: JSON.stringify([
      "Kubernetes relies on the CNI specification for pod-to-pod networking.",
      "Examples include Calico, Flannel, Cilium, or AWS VPC CNI.",
      "Without a CNI, CoreDNS also remains in Pending status."
    ]),
    options: [
      { optionKey: "A", optionText: "The cluster needs a reboot because the Linux kernel hostname changed.", isCorrect: false },
      { optionKey: "B", optionText: "No CNI plugin has been installed; deploying a CNI plugin (e.g. Calico or Flannel) configures pod networking and switches nodes to Ready.", isCorrect: true },
      { optionKey: "C", optionText: "The Docker daemon does not support TLS certificates.", isCorrect: false },
      { optionKey: "D", optionText: "The cluster administrator forgot to purchase an AWS Network Load Balancer license.", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 2: Kubernetes Workloads, Core Objects, Networking & Storage Abstractions
  // ==========================================
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Pod vs Deployment: Production Self-Healing Capabilities",
    prompt: "Why is deploying standalone 'bare Pods' (using `kind: Pod`) strongly discouraged in production environments compared to using a `Deployment`?",
    explanation: "A standalone Pod is bound directly to a single worker node. If that worker node crashes, reboots, or suffers hardware failure, the standalone Pod is permanently lost and will NEVER be rescheduled elsewhere. Deployments manage ReplicaSets, ensuring declarative desired state reconciliation and automatic replacement of failed pods on healthy nodes.",
    hintsJson: JSON.stringify([
      "What happens to a standalone Pod if its hosting EC2 instance is terminated?",
      "Which object has a controller that reconciles actual replicas to desired replicas?"
    ]),
    options: [
      { optionKey: "A", optionText: "Standalone Pods cannot run Linux containers, only Windows containers.", isCorrect: false },
      { optionKey: "B", optionText: "Standalone Pods are not self-healing; if their hosting node dies, they are never rescheduled. Deployments maintain desired replica counts via ReplicaSets across node failures.", isCorrect: true },
      { optionKey: "C", optionText: "Deployments allow containers to run without Docker, while Pods require root Docker daemon access.", isCorrect: false },
      { optionKey: "D", optionText: "Pods consume twice as much RAM as Deployments due to duplicate kernel namespaces.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Kubernetes Service Types & Default Port Allocations",
    prompt: "Which Kubernetes Service type opens a static high-numbered port across every worker node's physical IP address, and what is the standard default port range allocated by Kubernetes?",
    explanation: "NodePort exposes the Service on each Node's IP at a static port in the default range 30000-32767. External clients can connect to `<NodeIP>:<NodePort>`, and kube-proxy routes traffic to backend pods.",
    hintsJson: JSON.stringify([
      "ClusterIP is internal-only.",
      "NodePort allocates high ports between 30000 and 32767.",
      "LoadBalancer provisions a cloud provider L4 balancer."
    ]),
    options: [
      { optionKey: "A", optionText: "ClusterIP on port 80 or 443", isCorrect: false },
      { optionKey: "B", optionText: "NodePort in the range 30000–32767", isCorrect: true },
      { optionKey: "C", optionText: "LoadBalancer in the range 1024–2048", isCorrect: false },
      { optionKey: "D", optionText: "ExternalName on port 8080", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "ConfigMaps vs Secrets: Encoding & Usage Patterns",
    prompt: "An engineer needs to pass application configurations into a Pod. How should non-confidential environment flags (like `LOG_LEVEL=info`) and confidential database credentials (like `DB_PASSWORD`) be stored and decoupled in Kubernetes?",
    explanation: "ConfigMaps store non-sensitive configuration data in plaintext key-value pairs. Secrets store sensitive credentials (passwords, tokens, TLS keys) encoded in base64 (or encrypted at rest via KMS). Both can be consumed by Pods as environment variables or mounted files.",
    hintsJson: JSON.stringify([
      "ConfigMaps are for plaintext configuration settings.",
      "Secrets are for sensitive credentials and tokens.",
      "Both decouple configuration from immutable container images."
    ]),
    options: [
      { optionKey: "A", optionText: "Both should be hardcoded directly into the Dockerfile `ENV` instructions.", isCorrect: false },
      { optionKey: "B", optionText: "Store non-sensitive flags in a ConfigMap and sensitive database credentials in a Secret, mounted as environment variables or volume files.", isCorrect: true },
      { optionKey: "C", optionText: "ConfigMaps are encrypted with AES-256 while Secrets are stored in plaintext.", isCorrect: false },
      { optionKey: "D", optionText: "Secrets must only be created inside the default namespace and cannot be mounted into pods.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Storage Lifecycle: PersistentVolume Reclaim Policies",
    prompt: "A database administrator deletes a PersistentVolumeClaim (`kubectl delete pvc postgres-data`). The underlying PersistentVolume has its `persistentVolumeReclaimPolicy` set to `Retain`. What happens to the cloud storage volume and the PV object?",
    explanation: "With the Retain policy, deleting the PVC does NOT delete the PV or the underlying cloud storage volume (e.g. AWS EBS). The PV enters the 'Released' status and retains all historical data, preventing any other claim from overwriting it until an administrator manually recovers or reclaims the data.",
    hintsJson: JSON.stringify([
      "Recall the difference between 'Delete' and 'Retain'.",
      "Delete purges the cloud volume immediately.",
      "Retain preserves data for safety and enters 'Released' state."
    ]),
    options: [
      { optionKey: "A", optionText: "The cloud storage volume and all its database files are immediately purged and permanently deleted.", isCorrect: false },
      { optionKey: "B", optionText: "The PV is automatically bound to the nearest available Pod in any namespace.", isCorrect: false },
      { optionKey: "C", optionText: "The PV enters the 'Released' status and the physical cloud storage remains completely intact with all data preserved for manual recovery.", isCorrect: true },
      { optionKey: "D", optionText: "The cluster API Server crashes because dangling PVs are rejected by Kubernetes.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "DaemonSet vs StatefulSet Use Cases",
    prompt: "You need to deploy two workloads: (1) a log collector agent (Fluentd) that must run exactly one instance on every worker node in the cluster, and (2) a clustered Kafka broker where each instance requires a stable hostname (kafka-0, kafka-1) and dedicated persistent storage. Which controllers should you use?",
    explanation: "DaemonSets guarantee that all (or some) nodes run exactly one copy of a Pod, making them standard for node-level agents (logs, monitoring, CNI). StatefulSets manage stateful applications requiring unique network identities (ordinal indexing like kafka-0) and dedicated persistent volumes per pod.",
    hintsJson: JSON.stringify([
      "One pod per node = DaemonSet.",
      "Stable network identities (pod-0, pod-1) and stateful disks = StatefulSet."
    ]),
    options: [
      { optionKey: "A", optionText: "Deploy Fluentd with a Deployment and Kafka with a CronJob.", isCorrect: false },
      { optionKey: "B", optionText: "Deploy Fluentd with a DaemonSet and Kafka with a StatefulSet.", isCorrect: true },
      { optionKey: "C", optionText: "Deploy Fluentd with a ReplicaSet and Kafka with a DaemonSet.", isCorrect: false },
      { optionKey: "D", optionText: "Deploy Fluentd as an Ingress Controller and Kafka as a ConfigMap.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 2,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Health Probes: Liveness vs Readiness vs Startup Probes",
    prompt: "A microservice experiences sudden traffic saturation, causing its response time to degrade from 50ms to 4 seconds. If a Readiness probe fails, what action does the kubelet take compared to a failed Liveness probe?",
    explanation: "When a Readiness probe fails, the kubelet stops routing traffic to the Pod by removing its IP from the Service endpoints; it does NOT terminate or restart the container. In contrast, when a Liveness probe fails, the kubelet immediately kills and restarts the container.",
    hintsJson: JSON.stringify([
      "Readiness controls traffic routing (Endpoints).",
      "Liveness controls container restart/lifecycle.",
      "Failing a readiness probe isolates the pod from customer requests."
    ]),
    options: [
      { optionKey: "A", optionText: "Readiness probe kills the pod immediately; Liveness probe sends an email alert to the cluster administrator.", isCorrect: false },
      { optionKey: "B", optionText: "Readiness probe isolates the pod by removing its IP from Service Endpoints without restarting it; Liveness probe forcefully kills and restarts the container.", isCorrect: true },
      { optionKey: "C", optionText: "Both probes trigger immediate container deletion and node reboot.", isCorrect: false },
      { optionKey: "D", optionText: "Readiness probe scales up the Deployment replica count by 2.", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 3: Zero-Downtime Rollouts, Autoscaling (HPA), Helm Packaging & Production Operations
  // ==========================================
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Advanced",
    title: "RollingUpdate Strategy: maxSurge and maxUnavailable Calculations",
    prompt: "A Deployment has `replicas: 4`, `maxSurge: 1`, and `maxUnavailable: 0` configured under its `RollingUpdate` strategy. During an image upgrade, what are the maximum number of total pods that can exist concurrently, and what is the minimum number of healthy pods that must be available to serve user traffic?",
    explanation: "maxSurge: 1 allows at most desired replicas + 1 = 4 + 1 = 5 pods concurrently. maxUnavailable: 0 mandates that no pods may be unavailable below desired, meaning at least 4 healthy pods must be serving traffic at all times throughout the rollout.",
    hintsJson: JSON.stringify([
      "Max concurrent pods = desired + maxSurge.",
      "Min available pods = desired - maxUnavailable.",
      "With maxUnavailable: 0, capacity never drops below 100%."
    ]),
    options: [
      { optionKey: "A", optionText: "Maximum 5 total pods concurrently; minimum 4 available healthy pods serving traffic at all times.", isCorrect: true },
      { optionKey: "B", optionText: "Maximum 4 total pods concurrently; minimum 0 available pods (complete shutdown).", isCorrect: false },
      { optionKey: "C", optionText: "Maximum 8 total pods concurrently; minimum 2 available pods.", isCorrect: false },
      { optionKey: "D", optionText: "Maximum 1 total pod concurrently; minimum 4 available pods.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Deployment Rollback Mechanics with kubectl",
    prompt: "After updating a production Deployment, the new version encounters runtime errors. Which `kubectl` command immediately rolls back the Deployment to the previous working ReplicaSet revision?",
    explanation: "The command 'kubectl rollout undo deployment/<name>' rolls back the Deployment to its previous revision by scaling up the previous ReplicaSet and scaling down the broken ReplicaSet. Adding '--to-revision=<N>' rolls back to a specific historical revision.",
    hintsJson: JSON.stringify([
      "The command uses the 'rollout' subcommand.",
      "Think of 'undoing' the changes.",
      "You can also check history with 'kubectl rollout history'."
    ]),
    options: [
      { optionKey: "A", optionText: "kubectl delete deployment <name> --force", isCorrect: false },
      { optionKey: "B", optionText: "kubectl rollback deployment <name> --hard", isCorrect: false },
      { optionKey: "C", optionText: "kubectl rollout undo deployment/<name>", isCorrect: true },
      { optionKey: "D", optionText: "kubectl reset deployment <name>", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Horizontal Pod Autoscaler (HPA) Prerequisites & Behavior",
    prompt: "An engineer creates an HPA targeting 50% CPU utilization. However, `kubectl get hpa` shows `TARGETS: <unknown>/50%` and the Deployment never scales up during load testing. What is the most likely root cause?",
    explanation: "HPA calculates CPU utilization as (Actual CPU Usage / CPU Request) * 100. If the container template does not declare 'resources.requests.cpu', HPA has no baseline denominator and cannot compute utilization, resulting in '<unknown>' targets and scaling failure.",
    hintsJson: JSON.stringify([
      "HPA requires a baseline denominator to calculate percentage utilization.",
      "Look at the 'resources' block in the pod specification.",
      "Without 'requests.cpu', target utilization cannot be evaluated."
    ]),
    options: [
      { optionKey: "A", optionText: "The Docker daemon does not support multi-threading.", isCorrect: false },
      { optionKey: "B", optionText: "The container specification is missing `resources.requests.cpu`, preventing HPA from calculating percentage utilization against a declared baseline.", isCorrect: true },
      { optionKey: "C", optionText: "The HPA only scales Pods if memory utilization exceeds 95%.", isCorrect: false },
      { optionKey: "D", optionText: "The Service must be converted from ClusterIP to NodePort for HPA to activate.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Helm Chart Directory Structure & Component Roles",
    prompt: "In a standard Helm 3 chart directory, which file defines the chart metadata (such as chart name, version, and apiVersion), and which file provides default configurable values for templates?",
    explanation: "`Chart.yaml` contains package metadata (name, version, description, dependencies). `values.yaml` provides default parameter values that are interpolated into YAML templates located inside the `templates/` directory.",
    hintsJson: JSON.stringify([
      "Chart.yaml contains metadata.",
      "values.yaml contains configurable default parameters.",
      "templates/ contains the Go-templated manifests."
    ]),
    options: [
      { optionKey: "A", optionText: "Dockerfile defines chart metadata; package.json provides default values.", isCorrect: false },
      { optionKey: "B", optionText: "Chart.yaml defines chart metadata and semver; values.yaml provides default configurable values for templates.", isCorrect: true },
      { optionKey: "C", optionText: "kustomization.yaml defines metadata; helm.config defines values.", isCorrect: false },
      { optionKey: "D", optionText: "metadata.json defines chart versions; index.html renders the parameters.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Helm Release Management Commands",
    prompt: "Which Helm command is used to upgrade an existing release named `web-app` using a local chart `./charts/web-app` while overriding the replica count to 5?",
    explanation: "The command 'helm upgrade web-app ./charts/web-app --set replicaCount=5' upgrades the release and overrides the replicaCount parameter without modifying the underlying chart files.",
    hintsJson: JSON.stringify([
      "Use the 'upgrade' subcommand.",
      "Use '--set' for ad-hoc parameter overrides.",
      "Pass the release name and chart path."
    ]),
    options: [
      { optionKey: "A", optionText: "helm deploy web-app --replicas 5", isCorrect: false },
      { optionKey: "B", optionText: "helm patch web-app -p 'replicas: 5'", isCorrect: false },
      { optionKey: "C", optionText: "helm upgrade web-app ./charts/web-app --set replicaCount=5", isCorrect: true },
      { optionKey: "D", optionText: "helm scale web-app --count=5", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 3,
    topicSlug: "k8s-workloads-services-networking-helm",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Batch Workloads: Kubernetes Job vs CronJob",
    prompt: "An engineering team needs to execute a database migration script that runs once to completion and then exits, and also a nightly database backup script that runs at 02:00 AM every day. Which Kubernetes workload objects should be used?",
    explanation: "A Kubernetes Job creates Pods that run until a specified number of them successfully terminate (exit code 0). A CronJob runs Jobs on a recurring schedule defined by standard crontab syntax (e.g. `0 2 * * *`).",
    hintsJson: JSON.stringify([
      "A one-off run-to-completion task is a Job.",
      "A scheduled recurring task based on cron syntax is a CronJob.",
      "Deployments and DaemonSets are for long-running services, not batch completions."
    ]),
    options: [
      { optionKey: "A", optionText: "Use a Deployment for the migration and a StatefulSet for the nightly backup.", isCorrect: false },
      { optionKey: "B", optionText: "Use a Job for the one-time database migration and a CronJob for the nightly backup.", isCorrect: true },
      { optionKey: "C", optionText: "Use a DaemonSet for the migration and an Ingress for the nightly backup.", isCorrect: false },
      { optionKey: "D", optionText: "Use a ReplicaSet for both with restartPolicy: Always.", isCorrect: false }
    ]
  }
];

module.exports = kubernetesQuizzes;

