/**
 * Module 19: Kubernetes - Real-time Scenario-Based Troubleshooting Questions
 * Sourced from MicroDegree Kubernetes Guide (Section 10 & Concept Chapters)
 */

module.exports = [
  // --- TOPIC 1: Kubernetes Architecture, Control Plane & Cluster Bootstrapping ---
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    topicNumber: 1,
    title: "Scenario: Kubernetes Cluster Outage Due to etcd Disk I/O Latency Spikes & Leader Election Thrashing",
    difficulty: "Advanced",
    prompt: "During a peak-traffic event on a production Kubernetes cluster bootstrapped via kubeadm, developers report that 'kubectl' commands hang for 30 seconds before failing with: 'Error from server: etcdserver: leader changed' and 'etcdserver: request timed out'. Pods are randomly terminated and rescheduled. What is happening inside the control plane, how do you diagnose etcd latency, and how do you restore cluster stability?",
    explanation: "etcd uses the Raft consensus algorithm, which strictly requires low-latency disk writes for leader heartbeats (fsync < 10ms). If etcd shares a slow disk partition with heavy application logs or I/O-intensive workloads, write latency spikes cause follower nodes to miss heartbeat deadlines, triggering endless leader re-elections and freezing kube-apiserver read/write operations.",
    hintsJson: JSON.stringify([
      "Hint 1: Recall that etcd is the single source of truth; when etcd stalls, kube-apiserver stalls.",
      "Hint 2: Review Raft consensus leader election timeouts and fsync disk latency thresholds.",
      "Hint 3: Check etcd container logs with 'kubectl logs -n kube-system etcd-<control-plane>'.",
      "Hint 4: Dedicate high-performance NVMe / provisioned IOPS SSD storage exclusively to etcd."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Control Plane Recovery:

1. **Inspect Control Plane & etcd Logs:**
   - Check the etcd pod logs in the \`kube-system\` namespace:
     \`\`\`bash
     kubectl logs -n kube-system -l component=etcd --tail=100
     # Logs show:
     # "etcdserver: read-only range request ... took too long (1.2s) to execute"
     # "etcdserver: server is likely overloaded"
     # "raft: leader changed"
     \`\`\`
   - Check API server response:
     \`\`\`bash
     kubectl get nodes
     # Error from server (Timeout): context deadline exceeded
     \`\`\`

2. **Diagnose Host Disk I/O Performance:**
   - On the control-plane host, run:
     \`\`\`bash
     iostat -xz 1 5
     # Check %util and await times on the etcd mount point
     \`\`\`
   - If disk \`await\` exceeds 10ms or disk utilization is near 100%, etcd cannot fsync WAL (Write-Ahead Log) records to disk within the Raft heartbeat interval (100ms).

3. **Remediation & Architectural Hardening:**
   - **Step 1: Dedicate Fast NVMe / SSD Storage to etcd:**
     In production, never run etcd on spinning hard drives or standard cloud storage with low IOPS (e.g., standard AWS gp2). Use dedicated NVMe or AWS EBS \`gp3\`/\`io2\` with at least 3,000 baseline IOPS.
   - **Step 2: Isolate Control Plane Nodes:**
     Ensure control plane nodes have taints preventing application workloads from scheduling alongside etcd:
     \`\`\`bash
     kubectl taint nodes <control-plane-node> node-role.kubernetes.io/control-plane:NoSchedule --overwrite
     \`\`\`
   - **Step 3: Tune etcd Heartbeat & Election Timeouts:**
     If network latency or cloud disk latency cannot be reduced below 10ms, tune etcd parameters in \`/etc/kubernetes/manifests/etcd.yaml\`:
     \`\`\`yaml
     - --heartbeat-interval=250
     - --election-timeout=1250
     \`\`\`
   - **Step 4: Take Immediate Snapshot Backup:**
     \`\`\`bash
     ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \\
       --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
       --cert=/etc/kubernetes/pki/etcd/server.crt \\
       --key=/etc/kubernetes/pki/etcd/server.key \\
       snapshot save /var/backups/etcd-snapshot-$(date +%F).db
     \`\`\``,
    tagsJson: JSON.stringify(["Kubernetes", "etcd", "Control Plane", "Raft Consensus", "Troubleshooting", "Disk I/O"])
  },
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    topicNumber: 1,
    title: "Scenario: Pods Stuck in 'ContainerCreating' After Bootstrapping Cluster via kubeadm (Missing CNI Network Plugin)",
    difficulty: "Beginner",
    prompt: "An engineer bootstraps a new Kubernetes cluster using 'sudo kubeadm init --pod-network-cidr=10.244.0.0/16' and successfully joins two worker nodes. Running 'kubectl get nodes' shows all nodes in 'NotReady' status. When applying a test Pod, the Pod stays indefinitely in 'ContainerCreating' status with events: 'networkPlugin cni failed to set up pod network: network plugin is not ready: cni config uninitialized'. What critical post-installation step was missed, and how do you resolve it?",
    explanation: "kubeadm only initializes the control plane and node registration; it does NOT include a Container Network Interface (CNI) plugin. Without a CNI plugin (like Flannel, Calico, or Cilium) installed, worker nodes cannot configure virtual interfaces (veth pairs), assign Pod IPs, or establish routing. Nodes remain in 'NotReady' and Pods stay stuck in 'ContainerCreating'.",
    hintsJson: JSON.stringify([
      "Hint 1: Check node status via 'kubectl get nodes'; why are they NotReady?",
      "Hint 2: Review kubeadm init documentation: what networking component must be applied immediately after init?",
      "Hint 3: Inspect pod events via 'kubectl describe pod <name>' and look for CNI uninitialized errors.",
      "Hint 4: Apply a CNI plugin manifest matching the pod-network-cidr configured during init."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Verify the Problem Symptoms:**
   - Check node status:
     \`\`\`bash
     kubectl get nodes
     # NAME        STATUS     ROLES           AGE   VERSION
     # master-1    NotReady   control-plane   5m    v1.30.0
     # worker-1    NotReady   <none>          3m    v1.30.0
     \`\`\`
   - Check Pod status and events:
     \`\`\`bash
     kubectl get pods
     # NAME       READY   STATUS              RESTARTS   AGE
     # test-pod   0/1     ContainerCreating   0          2m
     kubectl describe pod test-pod
     # Warning FailedCreatePodSandBox: networkPlugin cni failed to set up pod network: network plugin is not ready: cni config uninitialized
     \`\`\`

2. **Understand the Root Cause:**
   - Kubernetes requires a CNI-compliant network plugin to implement the cluster-wide flat network.
   - kubeadm deliberately delegates CNI selection to the cluster administrator so users can choose Flannel (simple VXLAN), Calico (BGP routing & NetworkPolicies), or Cilium (eBPF).
   - Until a CNI daemonset runs on every node, \`/etc/cni/net.d/\` is empty, and the kubelet refuses to transition nodes to Ready.

3. **Resolution: Apply a CNI Plugin Manifest:**
   - For Flannel (matching \`--pod-network-cidr=10.244.0.0/16\`):
     \`\`\`bash
     kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
     \`\`\`
   - For Calico (alternative enterprise CNI):
     \`\`\`bash
     kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml
     \`\`\`

4. **Verification:**
   - Wait 30 seconds and check nodes again:
     \`\`\`bash
     kubectl get nodes
     # master-1    Ready   control-plane   6m    v1.30.0
     # worker-1    Ready   <none>          4m    v1.30.0
     \`\`\`
   - Verify the test Pod immediately transitions to Running:
     \`\`\`bash
     kubectl get pods -o wide
     # test-pod   1/1     Running   0     30s   10.244.1.2   worker-1
     \`\`\``,
    tagsJson: JSON.stringify(["Kubernetes", "kubeadm", "CNI", "Flannel", "ContainerCreating", "NotReady"])
  },

  // --- TOPIC 2: Kubernetes Workloads, Core Objects, Networking & Storage Abstractions ---
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    topicNumber: 2,
    title: "Scenario: Kubernetes Service Endpoints Empty — Traffic Silently Dropped Due to Label Selector Mismatch",
    difficulty: "Beginner",
    prompt: "A developer deploys a microservice using a Deployment and exposes it with a ClusterIP Service. When another microservice tries to communicate with 'http://payment-service:8080', all requests time out or fail with 'connection refused'. The developer runs 'kubectl get pods' and verifies all 3 payment Pods are in the 'Running' state. Why is the Service dropping traffic, and how do you systematically diagnose and fix it?",
    explanation: "A Kubernetes Service does not track Pods by name or deployment reference; it uses Label Selectors ('spec.selector') to dynamically discover backing Pods. If there is a typo or mismatch between the Service's selector (e.g. 'app: payment-api') and the Pod's labels (e.g. 'app: payment'), the EndpointsController cannot match them, resulting in an empty EndpointSlice and silent traffic drops.",
    hintsJson: JSON.stringify([
      "Hint 1: Check whether the Service has active endpoints: 'kubectl get endpoints <service-name>'.",
      "Hint 2: Compare the Service's 'spec.selector' with the Deployment's 'spec.template.metadata.labels'.",
      "Hint 3: Label matching is case-sensitive and must match keys and values identically.",
      "Hint 4: Use 'kubectl get pods --show-labels' to view all labels attached to running Pods."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Check the Service Endpoints (The Decisive Diagnostic Step):**
   - Run:
     \`\`\`bash
     kubectl get endpoints payment-service
     # NAME              ENDPOINTS   AGE
     # payment-service   <none>      5m
     \`\`\`
   - Notice that \`ENDPOINTS\` is **<none>**.
   - If a Service has no endpoints, kube-proxy has no destination Pod IPs to program into iptables, and all traffic sent to the ClusterIP is discarded.

2. **Inspect the Service Selector vs Pod Labels:**
   - Query the Service selector:
     \`\`\`bash
     kubectl get svc payment-service -o jsonpath='{.spec.selector}'
     # Output: {"app":"payment-api"}
     \`\`\`
   - Query the labels of the running Pods:
     \`\`\`bash
     kubectl get pods --show-labels -l app=payment
     # NAME                           READY   STATUS    LABELS
     # payment-deploy-79f8b78-abcde   1/1     Running   app=payment,version=v1
     \`\`\`
   - **Root Cause Identified:** The Service is looking for \`app: payment-api\`, but the Pods are labeled \`app: payment\`.

3. **Resolution:**
   - Edit the Service manifest to align the selector with the Pod labels:
     \`\`\`yaml
     apiVersion: v1
     kind: Service
     metadata:
       name: payment-service
     spec:
       type: ClusterIP
       selector:
         app: payment # MATCHES POD TEMPLATE LABELS EXACTLY
       ports:
       - port: 8080
         targetPort: 8080
     \`\`\`
   - Re-apply the manifest:
     \`\`\`bash
     kubectl apply -f service.yaml
     \`\`\`

4. **Verification:**
   - Query endpoints again:
     \`\`\`bash
     kubectl get endpoints payment-service
     # NAME              ENDPOINTS                                         AGE
     # payment-service   10.244.1.15:8080,10.244.2.8:8080,10.244.2.9:8080   6m
     \`\`\`
   - Endpoints are populated with the 3 Pod IPs. Re-test network connectivity from another Pod; requests succeed with HTTP 200 OK.`,
    tagsJson: JSON.stringify(["Kubernetes", "Service", "Endpoints", "Label Selector", "Debugging", "ClusterIP"])
  },
  {
    moduleNumber: 19,
    topicSlug: "kubernetes-objects-workloads-networking-storage",
    topicNumber: 2,
    title: "Scenario: Clustered Database Corrupted on Reschedule Because It Was Deployed as a Deployment Instead of a StatefulSet",
    difficulty: "Advanced",
    prompt: "A software team deploys a 3-node MongoDB replica set using a standard Kubernetes Deployment with 'replicas: 3' and a shared PersistentVolume. Following a node failure, Kubernetes recreates the crashed Pod on a new node with a new random name 'mongo-7f9a8b-x7z2q'. The new Pod cannot join the replica set, claims the lock on the shared volume, and corrupts the database catalog. Why did a Deployment fail for this stateful workload, and how does a StatefulSet resolve it?",
    explanation: "Deployments treat Pods as interchangeable, stateless cattle: Pod names are random, IPs are dynamic, and all Pods share the same volume declaration. Stateful databases (MongoDB, PostgreSQL, Kafka) require unique stable network identities (mongo-0, mongo-1), predictable startup/shutdown ordering, and dedicated, separate persistent volumes per instance (via volumeClaimTemplates). Deploying a clustered database via a Deployment leads to split-brain and storage corruption.",
    hintsJson: JSON.stringify([
      "Hint 1: Contrast the lifecycle of stateless applications (interchangeable) with stateful applications (persistent identity).",
      "Hint 2: Review StatefulSet features: predictable pod names (web-0, web-1) and volumeClaimTemplates.",
      "Hint 3: Understand Headless Services (clusterIP: None) and DNS records for individual stateful Pods.",
      "Hint 4: Why does a shared PVC mounted by multiple Deployment pods corrupt database transaction logs?"
    ]),
    recommendedSolution: `### Architectural Analysis & StatefulSet Remediation:

#### 1. Why Deployments are Unsuitable for Clustered Databases:
- **Random Pod Names:** In a Deployment, Pods have names like \`mongo-64f7b8c7-4m8pk\`. When a Pod restarts, it gets a completely new random name, breaking peer discovery in distributed consensus groups.
- **Shared Storage Hazard:** A Deployment attaches the same PVC to all replica pods. Multiple database instances attempting to write to the same data directory will corrupt transaction journals.
- **Uncontrolled Startup:** Deployments create and terminate replicas in parallel, which crashes databases requiring primary-before-secondary initialization.

#### 2. The StatefulSet Architectural Solution:
A \`StatefulSet\` provides 3 strict guarantees required by stateful applications:
1. **Predictable, Stable Hostnames:** Pods are numbered from 0 to N-1 (\`mongo-0\`, \`mongo-1\`, \`mongo-2\`). When \`mongo-1\` crashes, its replacement is guaranteed to be named \`mongo-1\`.
2. **Dedicated Per-Pod Storage (volumeClaimTemplates):** Each Pod receives its own dedicated, unshared PersistentVolumeClaim (e.g. \`data-mongo-0\`, \`data-mongo-1\`). Even if \`mongo-1\` is rescheduled to another node, its dedicated storage volume follows it.
3. **Headless Service DNS Discovery:** Coupled with a headless service (\`clusterIP: None\`), CoreDNS registers individual DNS A-records for each pod (\`mongo-0.mongo-service.default.svc.cluster.local\`).

#### 3. Production StatefulSet Specification:
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: mongo-headless
spec:
  clusterIP: None # HEADLESS SERVICE
  selector:
    app: mongo
  ports:
  - port: 27017
    name: mongo
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongo
spec:
  serviceName: "mongo-headless"
  replicas: 3
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: data
          mountPath: /data/db
  volumeClaimTemplates: # DEDICATED PVC CREATED PER POD!
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 20Gi
\`\`\`

4. **Verification:**
   - Check Pod names: \`kubectl get pods -l app=mongo\` -> \`mongo-0\`, \`mongo-1\`, \`mongo-2\`.
   - Check PVCs: \`kubectl get pvc\` -> \`data-mongo-0\`, \`data-mongo-1\`, \`data-mongo-2\` (independent storage).`,
    tagsJson: JSON.stringify(["Kubernetes", "StatefulSet", "Deployment", "volumeClaimTemplates", "Headless Service", "Database"])
  },

  // --- TOPIC 3: Zero-Downtime Rollouts, Autoscaling (HPA), Helm Packaging & Production Operations ---
  {
    moduleNumber: 19,
    topicSlug: "k8s-workloads-services-networking-helm",
    topicNumber: 3,
    title: "Scenario: Deployment Rollout Stuck with New Pods in CrashLoopBackOff — Rapid Rollback Strategy",
    difficulty: "Intermediate",
    prompt: "A CI/CD pipeline triggers an automated rolling update on a mission-critical e-commerce Deployment using: 'kubectl set image deployment/checkout-api web=checkout-api:v2.4.1'. Immediately, end-users report checkout failures. Running 'kubectl get pods' reveals 2 new Pods in 'CrashLoopBackOff' due to a null-pointer exception, while 2 old v2.4.0 Pods are still struggling under load. What is the fastest command to restore full service, and what prevents future stuck rollouts?",
    explanation: "Executing 'kubectl rollout undo deployment/checkout-api' immediately aborts the rolling update and reverses the rollout by scaling the previous (still-retained) ReplicaSet back up and the broken new ReplicaSet down. To prevent broken releases from serving user traffic, configure Readiness Probes: Kubernetes will not route traffic to new Pods or terminate old Pods until the new Pod passes its readiness check.",
    hintsJson: JSON.stringify([
      "Hint 1: Do not attempt to debug code while customers are experiencing an outage; roll back first.",
      "Hint 2: Run 'kubectl rollout undo' to scale the previous ReplicaSet back up instantly.",
      "Hint 3: Understand how Readiness Probes prevent bad Pods from receiving Service traffic during a rollout.",
      "Hint 4: Review rollout parameters: maxUnavailable and maxSurge."
    ]),
    recommendedSolution: `### Incident Response & Rollback Protocol:

1. **Immediate Action: Abort & Roll Back Service:**
   - Execute the rollback command immediately:
     \`\`\`bash
     kubectl rollout undo deployment/checkout-api
     \`\`\`
   - Monitor the rollback completion:
     \`\`\`bash
     kubectl rollout status deployment/checkout-api
     # Output: deployment "checkout-api" successfully rolled out
     \`\`\`
   - **Why this works instantly:** Kubernetes does not delete the old ReplicaSet during a rolling update; it keeps it scaled to 0. Rolling back simply scales the old ReplicaSet back up to full replica count and terminates the broken pods.

2. **Verify Restored Service:**
   - Check that all pods are running the previous known-good version:
     \`\`\`bash
     kubectl get pods -l app=checkout-api
     # All 4 replicas in Running state
     \`\`\`

3. **Post-Mortem Root Cause Analysis:**
   - Inspect the logs of the failed container from the crashed ReplicaSet:
     \`\`\`bash
     kubectl logs <crashed-pod-name> --previous
     \`\`\`
   - Identify the unhandled exception or missing environment variable in v2.4.1.

4. **Architectural Safeguards to Prevent Future Outages:**
   - **Add a Readiness Probe:**
     Without a readiness probe, Kubernetes assumes a container is healthy the moment its process starts. Configure an HTTP readiness probe:
     \`\`\`yaml
     readinessProbe:
       httpGet:
         path: /healthz
         port: 8080
       initialDelaySeconds: 5
       periodSeconds: 5
     \`\`\`
     *How this protects you:* If v2.4.1 crashes or fails the health check, the Readiness probe fails. Kubernetes **stops the rollout**, never routes traffic to the broken pod, and never terminates the healthy v2.4.0 pods.
   - **Set maxUnavailable: 0:**
     \`\`\`yaml
     strategy:
       rollingUpdate:
         maxSurge: 1
         maxUnavailable: 0
     \`\`\`
     Guarantees 100% of required healthy capacity is maintained at all times.`,
    tagsJson: JSON.stringify(["Kubernetes", "Rollout", "Rollback", "CrashLoopBackOff", "ReadinessProbe", "Zero Downtime"])
  },
  {
    moduleNumber: 19,
    topicSlug: "k8s-workloads-services-networking-helm",
    topicNumber: 3,
    title: "Scenario: Horizontal Pod Autoscaler (HPA) Showing 'TARGETS: <unknown>/50%' and Failing to Scale During Traffic Surge",
    difficulty: "Intermediate",
    prompt: "Anticipating a flash sale, a DevOps engineer creates an HPA targeting 50% CPU for a shopping cart Deployment. During the sale, traffic spikes by 500%, but the Deployment remains fixed at 2 replicas. Response times degrade from 200ms to 12 seconds. Running 'kubectl get hpa' displays: 'TARGETS: <unknown>/50%, MINPODS: 2, MAXPODS: 10, REPLICAS: 2'. Why is HPA unable to calculate CPU metrics, and how do you resolve it?",
    explanation: "HPA calculates percentage utilization by dividing actual CPU consumption by the container's configured CPU 'requests' (e.g. actual 100m / requested 200m = 50%). If the target Deployment's containers lack 'resources.requests.cpu', HPA has no denominator to calculate a percentage. Additionally, HPA requires the Metrics Server cluster add-on to collect live resource telemetry; if Metrics Server is missing or unhealthy, metrics report as '<unknown>'.",
    hintsJson: JSON.stringify([
      "Hint 1: Check if the Metrics Server is functioning by testing 'kubectl top pods'.",
      "Hint 2: Review the HPA formula: utilization % = (current CPU usage / requested CPU) * 100.",
      "Hint 3: Inspect the Deployment manifest: are 'resources.requests' defined for all containers?",
      "Hint 4: Review HPA events via 'kubectl describe hpa <name>'."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Diagnose the HPA Status & Events:**
   - Describe the HPA resource:
     \`\`\`bash
     kubectl describe hpa cart-hpa
     # Conditions:
     # Type           Status  Reason
     # ScalingActive  False   FailedGetResourceMetric
     # Message: missing request for cpu on container cart-service
     \`\`\`
   - The message explicitly identifies the root cause: \`missing request for cpu\`.

2. **Verify Metrics Server Health:**
   - Test if the cluster is collecting metrics:
     \`\`\`bash
     kubectl top pods
     \`\`\`
   - If \`kubectl top\` errors with "Metrics API not available", install or fix the Metrics Server:
     \`\`\`bash
     kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
     \`\`\`

3. **Resolution: Add Container Resource Requests to Deployment:**
   - Edit the Deployment manifest to specify both \`requests\` and \`limits\`:
     \`\`\`yaml
     apiVersion: apps/v1
     kind: Deployment
     metadata:
       name: cart-deployment
     spec:
       template:
         spec:
           containers:
           - name: cart-service
             image: cart:v1
             resources:
               requests:
                 cpu: "200m"      # BASELINE FOR HPA PERCENTAGE CALCULATION!
                 memory: "256Mi"
               limits:
                 cpu: "500m"
                 memory: "512Mi"
     \`\`\`
   - Apply the updated Deployment:
     \`\`\`bash
     kubectl apply -f cart-deployment.yaml
     \`\`\`

4. **Verify HPA Dynamic Autoscaling:**
   - Check HPA status after 30 seconds:
     \`\`\`bash
     kubectl get hpa cart-hpa
     # NAME       REFERENCE                    TARGETS   MINPODS  MAXPODS  REPLICAS
     # cart-hpa   Deployment/cart-deployment   78%/50%   2        10       4
     \`\`\`
   - \`TARGETS\` now reports real metrics (78%/50%), and HPA has automatically scaled replicas from 2 to 4 to handle the traffic load.`,
    tagsJson: JSON.stringify(["Kubernetes", "HPA", "Metrics Server", "Autoscaling", "Resource Requests", "kubectl top"])
  }
];

