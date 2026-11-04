/**
 * Module 19: Kubernetes - Dedicated Topic Labs
 * Derived from MicroDegree Complete Kubernetes Concept Guide
 */

module.exports = {
  "kubernetes-architecture-control-plane-nodes": {
    title: "Lab 19.1: Kubernetes Architecture, Control Plane Inspection & Cluster Setup with kind",
    level: "Intermediate",
    estimatedMinutes: 45,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Linux workstation or AWS EC2 Ubuntu instance with Docker Engine installed.",
    requiredPermissions: "Sudo privileges or local Docker daemon permissions.",
    cleanupGuide: "kind delete cluster --name lab191 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 19.1: Kubernetes Architecture & Cluster Setup ==="
echo "[+] Validating kubectl client binary..."
echo "[+] Bootstrapping multi-node cluster via kind (1 control-plane, 2 workers)..."
echo "[+] Inspecting Control Plane: kube-apiserver, etcd, scheduler, controller-manager..."
echo "[+] Verifying Worker Node agents: kubelet, kube-proxy, containerd..."
echo "[+] Applying declarative manifest (apiVersion, kind, metadata, spec, requests vs limits)..."
echo "[+] Cluster healthy! Zero-cost local Kubernetes cluster running."`,
    steps: [
      {
        stepNumber: 1,
        title: "Install kubectl CLI Client & Verify Architecture Skew",
        description: "Download the official Kubernetes kubectl client binary, configure executable permissions, and verify version compatibility.",
        consoleInstruction: "Download the latest stable release of kubectl and place it in system PATH.",
        cliCommand: "curl -LO \"https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl\"\nchmod +x kubectl\nsudo mv kubectl /usr/local/bin/\nkubectl version --client",
        expectedOutput: "Client Version: v1.30.x (or newer) displayed successfully.",
        verificationTip: "Verify that kubectl client is within one minor version of the cluster server version for official support.",
        troubleshooting: "If command not found, verify that /usr/local/bin is included in your $PATH variable."
      },
      {
        stepNumber: 2,
        title: "Bootstrap Multi-Node Local Cluster Using kind (Kubernetes IN Docker)",
        description: "Install kind and provision a multi-node cluster (1 control-plane and 2 worker nodes) using Docker containers as simulated nodes.",
        consoleInstruction: "Install kind binary and apply a multi-node cluster configuration file.",
        cliCommand: "curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64\nchmod +x ./kind\nsudo mv ./kind /usr/local/bin/kind\ncat << 'EOF' > kind-config.yaml\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n- role: worker\n- role: worker\nEOF\nkind create cluster --name lab191 --config kind-config.yaml",
        expectedOutput: "Creating cluster 'lab191' ... Nodes started, control-plane ready, CNI installed.",
        verificationTip: "Run 'docker ps' to verify three Docker containers are running as kind nodes.",
        troubleshooting: "Ensure Docker service is running via 'sudo systemctl status docker' before launching kind."
      },
      {
        stepNumber: 3,
        title: "Inspect Control Plane Components & System Namespace Pods",
        description: "Examine the core control plane components running inside the kube-system namespace and inspect node conditions.",
        consoleInstruction: "Query nodes and inspect system pods to view API server, etcd, scheduler, and controller manager.",
        cliCommand: "kubectl get nodes -o wide\nkubectl cluster-info\nkubectl get pods -n kube-system -o wide",
        expectedOutput: "3 nodes (1 control-plane, 2 workers) in Ready state. kube-system pods: kube-apiserver, etcd, kube-scheduler, kube-controller-manager, coredns, kube-proxy.",
        verificationTip: "Notice that etcd and kube-apiserver run on the control-plane node with host network access.",
        troubleshooting: "If nodes are NotReady, allow 30 seconds for the CNI plugin to assign pod CIDRs."
      },
      {
        stepNumber: 4,
        title: "Author Universal Manifest: Enforce Resource Requests vs Limits",
        description: "Author a standard Pod manifest utilizing the universal 4-field structure, configuring requests for scheduler placement and limits for kernel cgroups.",
        consoleInstruction: "Create pod.yaml and apply it declaratively using kubectl apply.",
        cliCommand: "cat << 'EOF' > pod.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: demo-workload\n  labels:\n    app: demo\nspec:\n  containers:\n  - name: web\n    image: nginx:alpine\n    ports:\n    - containerPort: 80\n    resources:\n      requests:\n        cpu: \"100m\"\n        memory: \"128Mi\"\n      limits:\n        cpu: \"250m\"\n        memory: \"256Mi\"\nEOF\nkubectl apply -f pod.yaml\nkubectl get pod demo-workload -o wide",
        expectedOutput: "pod/demo-workload created and scheduled to one of the worker nodes in Running state.",
        verificationTip: "Run 'kubectl describe pod demo-workload' and verify Requests and Limits in the Container section.",
        troubleshooting: "Ensure valid 2-space indentation; tabs are forbidden in YAML specifications."
      },
      {
        stepNumber: 5,
        title: "Verify Declarative 'apply -f' vs Imperative 'create -f' Idempotency",
        description: "Demonstrate why 'kubectl apply -f' is mandatory for CI/CD pipelines while 'kubectl create -f' causes pipeline failures.",
        consoleInstruction: "Re-apply the manifest with apply to test idempotency, then test create on an existing resource.",
        cliCommand: "kubectl apply -f pod.yaml\nkubectl diff -f pod.yaml\nkubectl create -f pod.yaml || echo \"kubectl create failed as expected on existing resource!\"",
        expectedOutput: "kubectl apply reports 'pod/demo-workload unchanged'. kubectl create throws Error from server (AlreadyExists).",
        verificationTip: "Notice that 'kubectl diff -f' produces zero output when cluster state matches the manifest.",
        troubleshooting: "Always default to 'apply -f' in automated scripts and GitOps repositories."
      },
      {
        stepNumber: 6,
        title: "Security & Architectural Isolation Audit: etcd Access Boundary",
        description: "Prove that only kube-apiserver communicates directly with etcd and that worker node agents communicate exclusively through the API.",
        consoleInstruction: "Inspect etcd startup flags and verify client certificate verification.",
        cliCommand: "kubectl describe pod -n kube-system -l component=etcd | grep -E 'client-cert-auth|listen-client-urls'\necho \"Audit Verified: etcd requires mutual TLS (mTLS); worker nodes and pods cannot query etcd directly.\"",
        expectedOutput: "client-cert-auth=true and trusted-ca-file confirmed, demonstrating zero direct etcd access from outside the API server.",
        verificationTip: "In enterprise clusters, ensure etcd encryption at rest is enabled to protect sensitive Secret data.",
        troubleshooting: "If etcd pod is not found, verify context points to a control-plane enabled cluster."
      }
    ]
  },
  "kubernetes-objects-workloads-networking-storage": {
    title: "Lab 19.2: Workloads, Services, Decoupled Config & Persistent Storage",
    level: "Intermediate",
    estimatedMinutes: 50,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Running Kubernetes cluster (e.g. from Lab 19.1 kind cluster).",
    requiredPermissions: "Cluster namespace read/write permissions.",
    cleanupGuide: "kubectl delete deploy,svc,cm,secret,pod,pvc -l lab=lab192 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 19.2: Kubernetes Objects & Networking ==="
echo "[+] Deploying stateless web application via Deployment (3 replicas)..."
echo "[+] Creating ClusterIP Service and verifying label selector discovery..."
echo "[+] Injecting decoupled ConfigMap and Secret credentials into Pods..."
echo "[+] Mounting PersistentVolumeClaim (PVC) and verifying data persistence..."
echo "[+] Inspecting DaemonSet node agents vs StatefulSet database identities..."
echo "[+] Executing day-to-day pod debugging: describe, logs, exec, port-forward."`,
    steps: [
      {
        stepNumber: 1,
        title: "Deploy Stateless Microservices via Deployment & ReplicaSet",
        description: "Create a Kubernetes Deployment managing 3 identical replicas of an application and observe ReplicaSet creation.",
        consoleInstruction: "Apply a Deployment manifest and inspect the controller hierarchy: Deployment -> ReplicaSet -> Pods.",
        cliCommand: "cat << 'EOF' > deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\n  labels:\n    app: web\n    lab: lab192\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n        lab: lab192\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:alpine\n        ports:\n        - containerPort: 80\nEOF\nkubectl apply -f deployment.yaml\nkubectl get deploy,rs,pods -l app=web",
        expectedOutput: "deployment.apps/web-app created (3/3 ready), replicaset created, 3 distinct Pods running with random suffixes.",
        verificationTip: "Verify that deleting a single Pod causes the ReplicaSet to immediately spawn a replacement to maintain desired replica count (3).",
        troubleshooting: "If Pods remain Pending, verify worker node capacity using 'kubectl describe nodes'."
      },
      {
        stepNumber: 2,
        title: "Expose Workloads with Service Discovery (ClusterIP) & Label Selectors",
        description: "Create a stable virtual IP (Service) that load-balances traffic across dynamic Pods matching the label selector.",
        consoleInstruction: "Create a Service and verify EndpointSlice population and internal DNS resolution.",
        cliCommand: "cat << 'EOF' > service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-service\n  labels:\n    lab: lab192\nspec:\n  type: ClusterIP\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\nEOF\nkubectl apply -f service.yaml\nkubectl get svc,endpoints web-service\nkubectl run test-curl --rm -it --image=curlimages/curl --restart=Never -- curl -s http://web-service",
        expectedOutput: "Service assigns a ClusterIP; endpoints list the 3 Pod private IPs; curl returns default Nginx HTML page.",
        verificationTip: "Inspect Endpoints: 'kubectl get endpoints web-service' to verify matching Pod IPs.",
        troubleshooting: "If curl fails with connection refused, ensure the Service 'selector' matches the Pod template 'labels' exactly."
      },
      {
        stepNumber: 3,
        title: "Decouple Configuration: Inject ConfigMap & Secret Credentials",
        description: "Externalize environment variables and database passwords so container images remain generic across environments.",
        consoleInstruction: "Create a ConfigMap and a Secret, then mount them as environment variables into a Pod.",
        cliCommand: "kubectl create configmap app-config --from-literal=ENVIRONMENT=production --from-literal=MAX_CONNECTIONS=100\nkubectl create secret generic app-secret --from-literal=DB_PASSWORD=SuperSecretKey2026\ncat << 'EOF' > pod-config.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: config-demo\n  labels:\n    lab: lab192\nspec:\n  containers:\n  - name: test\n    image: alpine\n    command: [\"sh\", \"-c\", \"env && sleep 3600\"]\n    env:\n    - name: ENV_MODE\n      valueFrom:\n        configMapKeyRef:\n          name: app-config\n          key: ENVIRONMENT\n    - name: DB_PASS\n      valueFrom:\n        secretKeyRef:\n          name: app-secret\n          key: DB_PASSWORD\nEOF\nkubectl apply -f pod-config.yaml\nsleep 3\nkubectl exec config-demo -- env | grep -E 'ENV_MODE|DB_PASS'",
        expectedOutput: "ENV_MODE=production and DB_PASS=SuperSecretKey2026 printed from inside the container.",
        verificationTip: "Decode the secret: 'kubectl get secret app-secret -o jsonpath=\"{.data.DB_PASSWORD}\" | base64 -d' to view raw value.",
        troubleshooting: "If Pod enters CreateContainerConfigError, check for typos in the referenced ConfigMap or Secret names."
      },
      {
        stepNumber: 4,
        title: "Abstract Storage: Bind PersistentVolumeClaims (PVC) to Pods",
        description: "Provision storage that survives Pod destruction by referencing a PersistentVolumeClaim.",
        consoleInstruction: "Create a PVC requesting storage and mount it into a container directory.",
        cliCommand: "cat << 'EOF' > storage-demo.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: app-pvc\n  labels:\n    lab: lab192\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 100Mi\n---\napiVersion: v1\nkind: Pod\nmetadata:\n  name: storage-pod\n  labels:\n    lab: lab192\nspec:\n  containers:\n  - name: writer\n    image: alpine\n    command: [\"sh\", \"-c\", \"echo 'Persistent Data Saved!' > /data/state.txt && sleep 3600\"]\n    volumeMounts:\n    - name: my-storage\n      mountPath: /data\n  volumes:\n  - name: my-storage\n    persistentVolumeClaim:\n      claimName: app-pvc\nEOF\nkubectl apply -f storage-demo.yaml\nsleep 5\nkubectl exec storage-pod -- cat /data/state.txt",
        expectedOutput: "'Persistent Data Saved!' printed successfully from the persistent volume mount.",
        verificationTip: "Run 'kubectl get pvc app-pvc' to verify STATUS: Bound to an underlying dynamically provisioned PV.",
        troubleshooting: "If PVC stays in Pending status, verify your cluster has a default StorageClass via 'kubectl get sc'."
      },
      {
        stepNumber: 5,
        title: "Contrast DaemonSet (Node Agents) vs StatefulSet (Clustered Databases)",
        description: "Analyze how DaemonSets pin 1 Pod per node while StatefulSets provide stable ordered identities (db-0, db-1) with dedicated PVCs.",
        consoleInstruction: "Inspect the differences between DaemonSets and StatefulSets in the cluster.",
        cliCommand: "kubectl get ds -n kube-system\ncat << 'EOF' > statefulset.yaml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: db-cluster\n  labels:\n    lab: lab192\nspec:\n  serviceName: \"db-headless\"\n  replicas: 2\n  selector:\n    matchLabels:\n      app: db\n  template:\n    metadata:\n      labels:\n        app: db\n        lab: lab192\n    spec:\n      containers:\n      - name: db\n        image: alpine\n        command: [\"sleep\", \"3600\"]\nEOF\nkubectl apply -f statefulset.yaml\nkubectl get pods -l app=db",
        expectedOutput: "Pods created with predictable, ordered names: db-cluster-0 and db-cluster-1 (not random hashes).",
        verificationTip: "StatefulSets always start and update pods sequentially (0 then 1), essential for clustered databases like Kafka and MySQL.",
        troubleshooting: "A StatefulSet requires an explicit 'serviceName' matching a headless Service."
      },
      {
        stepNumber: 6,
        title: "Master Daily Pod Debugging Operations (describe, logs, exec, port-forward)",
        description: "Practice the 4 indispensable day-to-day Kubernetes developer commands for live inspection and troubleshooting.",
        consoleInstruction: "Execute describe, logs, exec, and port-forward commands against running workloads.",
        cliCommand: "kubectl describe pod -l app=web | head -n 25\nkubectl logs -l app=web --tail=20\nkubectl exec -it deployment/web-app -- nginx -v\nkubectl port-forward deployment/web-app 8085:80 &\nPF_PID=$!\nsleep 2\ncurl -s http://localhost:8085 | head -n 5\nkill $PF_PID",
        expectedOutput: "Pod events inspected, logs retrieved, Nginx version printed via exec, and HTTP 200 retrieved over port-forward tunnel.",
        verificationTip: "Make 'kubectl describe pod' your #1 diagnostic command whenever Pods are in CrashLoopBackOff or Pending.",
        troubleshooting: "If port-forward fails with address already in use, select an alternative local port (e.g. 8086:80)."
      }
    ]
  },
  "k8s-workloads-services-networking-helm": {
    title: "Lab 19.3: Zero-Downtime Rolling Updates, HPA Autoscaling & Helm Package Management",
    level: "Advanced",
    estimatedMinutes: 50,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Running Kubernetes cluster with Metrics Server installed.",
    requiredPermissions: "Cluster deployment and autoscaling permissions.",
    cleanupGuide: "helm uninstall myapp 2>/dev/null; kubectl delete deploy,hpa,svc -l lab=lab193 2>/dev/null || true",
    safeSimulationScript: `#!/bin/bash
echo "=== Lab 19.3: Rolling Updates, HPA & Helm Mastery ==="
echo "[+] Deploying v1.0 application with 4 replicas..."
echo "[+] Performing zero-downtime RollingUpdate to v2.0 (maxSurge=1, maxUnavailable=0)..."
echo "[+] Simulating failed deployment and executing instant rollback (rollout undo)..."
echo "[+] Configuring Horizontal Pod Autoscaler (HPA) targeting 50% CPU..."
echo "[+] Packaging application as a parameterized Helm Chart..."
echo "[+] Executing Helm release lifecycle: install -> upgrade -> rollback -> uninstall."`,
    steps: [
      {
        stepNumber: 1,
        title: "Execute Zero-Downtime Rolling Update & Stream Rollout Status",
        description: "Deploy an application and update its container image, observing how Kubernetes transitions traffic seamlessly without downtime.",
        consoleInstruction: "Create a Deployment and update its image using kubectl set image while tracking rollout progress.",
        cliCommand: "cat << 'EOF' > app-deploy.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: rolling-app\n  labels:\n    app: rolling\n    lab: lab193\nspec:\n  replicas: 4\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  selector:\n    matchLabels:\n      app: rolling\n  template:\n    metadata:\n      labels:\n        app: rolling\n        lab: lab193\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.24-alpine\n        ports:\n        - containerPort: 80\nEOF\nkubectl apply -f app-deploy.yaml\nkubectl rollout status deployment/rolling-app\nkubectl set image deployment/rolling-app web=nginx:1.25-alpine\nkubectl rollout status deployment/rolling-app",
        expectedOutput: "Waiting for rollout to finish: 1 out of 4 new replicas have been updated ... deployment 'rolling-app' successfully rolled out.",
        verificationTip: "Notice that 'maxUnavailable: 0' guarantees 100% capacity is maintained throughout the rollout.",
        troubleshooting: "If rollout hangs, check if new Pods are failing Readiness probes using 'kubectl describe pod'."
      },
      {
        stepNumber: 2,
        title: "Emergency Incident Response: Instant Rollback via 'kubectl rollout undo'",
        description: "Simulate a broken production release (bad image tag) and perform an instant 5-second rollback to restore service.",
        consoleInstruction: "Update the Deployment to an invalid image tag, observe the failure, and revert to the previous working revision.",
        cliCommand: "kubectl set image deployment/rolling-app web=nginx:nonexistent-tag-404\nsleep 5\nkubectl get pods -l app=rolling\nkubectl rollout history deployment/rolling-app\nkubectl rollout undo deployment/rolling-app\nkubectl rollout status deployment/rolling-app",
        expectedOutput: "Pods entering ImagePullBackOff detected; rollout undo executed; deployment 'rolling-app' rolled back to working revision.",
        verificationTip: "Verify that 'kubectl rollout history' records past revision numbers driven by underlying ReplicaSets.",
        troubleshooting: "Use '--to-revision=N' to roll back to a specific past release rather than just the previous one."
      },
      {
        stepNumber: 3,
        title: "Contrast RollingUpdate Strategy with the Recreate Strategy",
        description: "Analyze the architectural differences between zero-downtime RollingUpdate and the Recreate strategy.",
        consoleInstruction: "Inspect why database schema migrations with breaking changes require Recreate despite downtime.",
        cliCommand: "kubectl explain deployment.spec.strategy.rollingUpdate\necho \"Recreate Strategy: Terminates ALL old pods before creating new pods.\"\necho \"Use Recreate ONLY when old and new application versions cannot run concurrently (e.g. incompatible DB migrations).\"",
        expectedOutput: "maxSurge and maxUnavailable fields explained.",
        verificationTip: "Default RollingUpdate settings are maxUnavailable: 25% and maxSurge: 25%.",
        troubleshooting: "Never use Recreate on customer-facing web services unless maintenance windows are scheduled."
      },
      {
        stepNumber: 4,
        title: "Configure Horizontal Pod Autoscaler (HPA) with CPU Thresholds",
        description: "Enable automated dynamic scaling based on real-time CPU telemetry collected by the Metrics Server.",
        consoleInstruction: "Ensure container resource requests are configured, then apply an HPA targeting 50% CPU utilization.",
        cliCommand: "cat << 'EOF' > hpa-deploy.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: hpa-demo\n  labels:\n    lab: lab193\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: hpa-app\n  template:\n    metadata:\n      labels:\n        app: hpa-app\n    spec:\n      containers:\n      - name: cpu-burner\n        image: nginx:alpine\n        resources:\n          requests:\n            cpu: \"100m\"\n            memory: \"64Mi\"\n          limits:\n            cpu: \"200m\"\n            memory: \"128Mi\"\n---\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: hpa-demo-scaler\n  labels:\n    lab: lab193\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: hpa-demo\n  minReplicas: 2\n  maxReplicas: 8\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 50\nEOF\nkubectl apply -f hpa-deploy.yaml\nkubectl get hpa hpa-demo-scaler",
        expectedOutput: "hpa-demo-scaler created with MINPODS=2, MAXPODS=8, TARGETS=0%/50%.",
        verificationTip: "Verify that 'kubectl get hpa' displays actual percentage instead of '<unknown>' (which indicates missing Metrics Server).",
        troubleshooting: "If target shows '<unknown>', verify Metrics Server is installed: 'kubectl top pods'."
      },
      {
        stepNumber: 5,
        title: "Author and Deploy Parameterized Helm Chart (Templates & Values)",
        description: "Package a multi-resource application into a standardized, reusable Helm chart driven by values.yaml.",
        consoleInstruction: "Initialize a Helm chart, customize values, and deploy the release.",
        cliCommand: "which helm || (curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash)\nmkdir -p /tmp/mychart/templates\ncat << 'EOF' > /tmp/mychart/Chart.yaml\napiVersion: v2\nname: myapp\ndescription: Microservices Helm Chart\nversion: 0.1.0\nappVersion: \"1.0.0\"\nEOF\ncat << 'EOF' > /tmp/mychart/values.yaml\nreplicaCount: 2\nimage:\n  repository: nginx\n  tag: alpine\nservice:\n  type: ClusterIP\n  port: 80\nEOF\ncat << 'EOF' > /tmp/mychart/templates/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}-deploy\nspec:\n  replicas: {{ .Values.replicaCount }}\n  selector:\n    matchLabels:\n      app: {{ .Release.Name }}\n  template:\n    metadata:\n      labels:\n        app: {{ .Release.Name }}\n    spec:\n      containers:\n      - name: web\n        image: \"{{ .Values.image.repository }}:{{ .Values.image.tag }}\"\nEOF\nhelm install my-app /tmp/mychart/\nhelm list",
        expectedOutput: "NAME: my-app STATUS: deployed REVISION: 1. helm list shows active release.",
        verificationTip: "Inspect rendered manifests without installing: 'helm template my-app /tmp/mychart/'.",
        troubleshooting: "Ensure valid Go template syntax inside '{{ .Values.x }}' placeholders."
      },
      {
        stepNumber: 6,
        title: "Manage Helm Release Lifecycle: Upgrade, Rollback & Clean Uninstall",
        description: "Perform an atomic configuration upgrade on the Helm release, test rollbacks, and cleanly remove all associated resources.",
        consoleInstruction: "Upgrade replica count, verify history, roll back to revision 1, and uninstall the release.",
        cliCommand: "helm upgrade --install my-app /tmp/mychart/ --set replicaCount=4\nkubectl get pods -l app=my-app\nhelm history my-app\nhelm rollback my-app 1\nhelm list\nhelm uninstall my-app",
        expectedOutput: "Release upgraded to 4 replicas -> History shows Rev 1 & 2 -> Rollback reverts to Rev 1 -> Uninstall purges all resources cleanly.",
        verificationTip: "Never use 'kubectl delete' on Helm resources directly, as it causes Helm state drift.",
        troubleshooting: "If helm uninstall hangs, check for finalizers on associated namespace resources."
      }
    ]
  }
};

