const http = require('http');
const https = require('https');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

/**
 * Helper to make HTTP request with timeout
 */
function requestOllama(urlPath, method = 'GET', body = null, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    try {
      const fullUrl = new URL(urlPath, OLLAMA_HOST);
      const isHttps = fullUrl.protocol === 'https:';
      const transport = isHttps ? https : http;

      const options = {
        hostname: fullUrl.hostname,
        port: fullUrl.port || (isHttps ? 443 : 80),
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        timeout: timeoutMs,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(JSON.stringify(body)) } : {})
        }
      };

      const req = transport.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ statusCode: res.statusCode, data });
            }
          } else {
            reject(new Error(`Ollama responded with HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection to Ollama timed out'));
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Built-in AI Guide / Trainer Engine (Fallback & Instant Knowledge Assistant)
 * Provides comprehensive, expert trainer responses for AWS, GitHub, Jenkins, Docker, and Kubernetes
 */
function generateBuiltInTrainerResponse({ message, mode, topic, history }) {
  const query = (message || '').toLowerCase();

  // Mode 1: Log & Error Debugger
  if (mode === 'debugger' || query.includes('error') || query.includes('crashloopbackoff') || query.includes('137') || query.includes('failed') || query.includes('fatal:')) {
    if (query.includes('crashloopbackoff') || query.includes('k8s') || query.includes('pod')) {
      return `### 🛠️ DevOps SRE Diagnosis: Kubernetes CrashLoopBackOff

**Root Cause Analysis:**
A \`CrashLoopBackOff\` error indicates that Kubernetes successfully scheduled and started your container, but the application process inside the container exited with an error (non-zero exit code). Kubernetes is exponentially delaying restart attempts.

**Systematic 4-Step Resolution:**
\`\`\`bash
# 1. Inspect Pod Events & Failure Reason
kubectl describe pod <pod-name>

# 2. Check the previous crashed container's output logs
kubectl logs <pod-name> --previous --tail=100

# 3. Check for missing environment variables or secrets
kubectl get configmaps,secrets
\`\`\`

**Top 3 Culprits & Fixes:**
1. **Missing ConfigMap/Secret or Invalid DB Connection:** The app crashes immediately upon trying to connect to a missing database or reading an undefined environment variable.
2. **Incorrect Container Command / Entrypoint:** If your Dockerfile has \`CMD ["npm", "start"]\` but \`package.json\` lacks a start script, it terminates with code 1.
3. **Readiness / Liveness Probe Failure:** If \`initialDelaySeconds\` is too short (e.g. 2s) while the app takes 10s to boot, Kubernetes terminates and restarts it before it can respond.

*💡 Pro-Tip:* Run \`kubectl get events --sort-by=.metadata.creationTimestamp\` to inspect cluster-wide error timelines.`;
    }

    if (query.includes('137') || query.includes('oom') || query.includes('memory')) {
      return `### 🛠️ DevOps SRE Diagnosis: Exit Code 137 (OOMKilled)

**Root Cause Analysis:**
Exit Code 137 is calculated as \`128 + 9 (SIGKILL)\`. The Linux host kernel's Out-Of-Memory (OOM) Killer detected that the container exceeded its allocated cgroup memory limit and sent an uncatchable \`SIGKILL\`.

**Diagnosis Commands:**
\`\`\`bash
# Verify OOMKilled flag on Docker
docker inspect <container-name> --format '{{json .State.OOMKilled}}'

# Check host kernel ring buffer
dmesg -T | grep -i oom
\`\`\`

**Immediate Resolutions:**
1. **Increase Container Cgroup Limits:**
   \`\`\`yaml
   # In docker-compose.yml:
   deploy:
     resources:
       limits:
         memory: 1024M
   \`\`\`
2. **Cap Application Heap Below Cgroup Limit:**
   - For Node.js: \`NODE_OPTIONS="--max-old-space-size=768" npm start\`
   - For Java: \`-XX:MaxRAMPercentage=75.0 -Xmx768m\`
   This guarantees the runtime garbage collector cleans memory *before* the Linux kernel kills the container.`;
    }

    if (query.includes('jenkins') || query.includes('disk') || query.includes('workspace')) {
      return `### 🛠️ DevOps SRE Diagnosis: Jenkins Build Failure & Disk Pressure

**Root Cause Analysis:**
Continuous builds download npm packages, Docker base layers, and compilation caches. Without automated retention pruning, Jenkins agent root disks reach 100% capacity, blocking executors with \`java.io.IOException: No space left on device\`.

**Recovery Commands:**
\`\`\`bash
# 1. Clean dangling Docker layers and build caches
docker system prune -af --volumes

# 2. Add workspace cleanup to your Declarative Jenkinsfile
post {
  always {
    cleanWs()
  }
}
\`\`\``;
    }
  }

  // Mode 2: Pipeline & Manifest Architect
  if (mode === 'architect' || query.includes('jenkinsfile') || query.includes('dockerfile') || query.includes('pipeline') || query.includes('yaml') || query.includes('manifest')) {
    if (query.includes('dockerfile') || query.includes('docker')) {
      return `### ⚡ Production Multi-Stage Dockerfile (Node.js & Alpine)

Here is a hardened, production-optimized multi-stage Dockerfile that eliminates build dependencies from the final image, runs as a non-root user, and optimizes layer caching:

\`\`\`dockerfile
# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package manifests for fast layer reuse
COPY package*.json ./
RUN npm ci --quiet

# Copy source code and build
COPY . .
RUN npm run build --if-present

# Prune devDependencies to reduce footprint
RUN npm prune --production

# ==========================================
# Stage 2: Hardened Minimal Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Security: Run as non-root user (built into alpine)
USER node

# Copy only production artifacts from builder stage
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/index.js"]
\`\`\`

**Why this is enterprise grade:**
1. **Multi-Stage:** Compilers and TypeScript devDependencies are discarded; image size is shrunk by ~85%.
2. **Security:** \`USER node\` prevents host container breakouts.
3. **Caching:** \`COPY package*.json\` precedes \`COPY .\`, so modifying code never invalidates the expensive \`npm ci\` layer!`;
    }

    if (query.includes('jenkinsfile') || query.includes('jenkins')) {
      return `### ⚡ Enterprise Declarative Jenkinsfile (CI/CD + Docker + ECR + K8s)

\`\`\`groovy
pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        AWS_REGION     = 'us-east-1'
        ECR_REGISTRY   = '123456789012.dkr.ecr.us-east-1.amazonaws.com'
        IMAGE_NAME     = 'cloud-api'
        IMAGE_TAG      = "\${env.BRANCH_NAME}-\${env.BUILD_NUMBER}-\${GIT_COMMIT.take(7)}"
    }
    
    stages {
        stage('Checkout & Lint') {
            steps {
                echo "Running static analysis and linting..."
                sh 'npm ci'
                sh 'npm run lint --if-present'
            }
        }
        
        stage('Automated Tests') {
            steps {
                echo "Executing unit and integration test suites..."
                sh 'npm test'
            }
        }
        
        stage('Docker Multi-Stage Build & Scan') {
            steps {
                echo "Building container: \${ECR_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                sh "docker build -t \${ECR_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG} ."
                // DevSecOps Vulnerability Scan with Trivy
                sh "trivy image --severity HIGH,CRITICAL \${ECR_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG} || true"
            }
        }
        
        stage('Push to Amazon ECR') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-creds' ]]) {
                    sh 'aws ecr get-login-password --region \${AWS_REGION} | docker login --username AWS --password-stdin \${ECR_REGISTRY}'
                    sh "docker push \${ECR_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                }
            }
        }
        
        stage('Deploy to Kubernetes (EKS)') {
            steps {
                echo "Triggering zero-downtime rolling update on EKS cluster..."
                sh "kubectl set image deployment/cloud-api cloud-api=\${ECR_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG} --record"
                sh "kubectl rollout status deployment/cloud-api --timeout=120s"
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "🎉 Pipeline execution completed successfully! Code deployed to Kubernetes."
        }
        failure {
            echo "❌ Pipeline failed! Initiating rollback..."
            sh "kubectl rollout undo deployment/cloud-api || true"
        }
    }
}
\`\`\``;
    }

    if (query.includes('k8s') || query.includes('kubernetes')) {
      return `### ⚡ Production Kubernetes Deployment & Service Manifest

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-service-api
  labels:
    app: cloud-service
    env: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0  # 100% capacity maintained during updates
  selector:
    matchLabels:
      app: cloud-service
  template:
    metadata:
      labels:
        app: cloud-service
    spec:
      containers:
      - name: api
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloud-service:v1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: cloud-service-svc
spec:
  type: ClusterIP
  selector:
    app: cloud-service
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
\`\`\``;
    }
  }

  // Mode 3: Mock Interviewer
  if (mode === 'interviewer') {
    return `### 🎯 Senior DevOps & Cloud Architect Interview Mode

Great! Let's conduct a live mock technical interview. Here is your scenario question:

**Interview Question:**
> *"Suppose your team has a microservice running on AWS EKS. During a peak traffic event, users report 502 Bad Gateway errors. You run 'kubectl get pods' and see that pods are constantly cycling between 'Running' and 'CrashLoopBackOff', with high restart counts. Meanwhile, your Application Load Balancer reports healthy targets dropping to 0.*
>
> *1. How do you systematically triage this under high pressure?*
> *2. What specific kubectl commands do you run?*
> *3. What configuration changes would prevent this from happening in future releases?"*

**How to respond:**
Type your technical explanation below as if speaking to the interviewer! When you submit, I will score your answer across:
- **Root Cause Identification** (25%)
- **Diagnostic Command Accuracy** (25%)
- **Architectural Mitigation & Health Probes** (25%)
- **Communication & Incident Management** (25%)`;
  }

  // Default: Expert Guide / Concept Tutor
  if (query.includes('kubernetes') || query.includes('k8s')) {
    return `### 🧑‍🏫 Concept Guide: Understanding Kubernetes (K8s) Architecture

**The Real-World Analogy:**
Think of a Kubernetes cluster as a **large modern cargo airport**:
- **Control Plane (Air Traffic Control):**
  - **API Server:** The control tower gateway. Everything and everyone talks only through the API server.
  - **etcd:** The single source of truth database. It holds the flight logs, gate assignments, and passenger manifests.
  - **Scheduler:** Assigns arriving airplanes (Pods) to empty gates/runways (Worker Nodes) based on weight and runway capacity.
  - **Controller Manager:** The operations team. If a flight is delayed or an airplane breaks, it triggers a replacement to match the schedule.
- **Worker Nodes (The Runways & Hangars):**
  - **kubelet:** The crew chief at each hangar who takes orders from the control tower and starts the engine.
  - **kube-proxy:** The ground traffic coordinator routing fuel and baggage to the correct plane.
  - **Pods:** The airplanes carrying passengers (containers).

**Key Takeaways for AWS / DevOps:**
1. **Declarative State:** You don't order commands imperatively; you describe the *desired state* in YAML, and controllers continuously reconcile reality to match it.
2. **Self-Healing:** If a node burns down, Kubernetes automatically recreates its pods on surviving nodes within seconds.
3. **Decoupled Networking:** Services provide persistent internal DNS and load balancing, regardless of how often individual pods are replaced or restarted.`;
  }

  if (query.includes('docker')) {
    return `### 🧑‍🏫 Concept Guide: Docker & Container Fundamentals

**Container vs Virtual Machine:**
- A **Virtual Machine** virtualizes the underlying physical hardware. It bundles an entire Guest Operating System (GBs in size, boots in 60s).
- A **Docker Container** virtualizes the Operating System user-space. Containers share the single **Host Linux Kernel**, isolated via:
  - **Namespaces:** What the process *sees* (isolated process IDs, network interfaces, mount points).
  - **Cgroups (Control Groups):** What the process *can use* (CPU, RAM, disk I/O limits).

**The 3 Golden Rules of Production Dockerfiles:**
1. **Multi-Stage Builds:** Compile with full SDKs in stage 1; copy only the compiled binary to a minimal Alpine/Distroless image in stage 2.
2. **Order for Caching:** Copy \`package.json\` and run \`npm install\` *before* copying application code so layer caches aren't invalidated on every typo fix.
3. **Never Run as Root:** Always add \`USER node\` or create a dedicated non-privileged system user.`;
  }

  if (query.includes('jenkins')) {
    return `### 🧑‍🏫 Concept Guide: Jenkins CI/CD Automation

**Why Jenkins Dominates Enterprise:**
Jenkins is the open-source automation backbone that connects source control (GitHub), automated testing, container packaging (Docker), and cloud deployments (AWS / Kubernetes).

**Key Architecture Rules:**
1. **Zero Executors on Master:** Never run build scripts on the Jenkins Controller. The controller should only schedule and orchestrate.
2. **Pipeline-as-Code:** Always author a version-controlled \`Jenkinsfile\` committed directly to Git, rather than configuring freestyle jobs through the UI.
3. **Declarative vs Scripted:** Modern teams use Declarative (\`pipeline { ... }\`) for structured readability, strict stages, and built-in syntax verification.`;
  }

  if (query.includes('github') || query.includes('git')) {
    return `### 🧑‍🏫 Concept Guide: Git & GitHub Modern Workflow

**The Three Trees of Git:**
1. **Working Directory:** Files currently on your disk that are being edited.
2. **Staging Area (Index):** Changes explicitly selected via \`git add\` to be included in the next snapshot.
3. **Commit History (HEAD):** The cryptographic DAG (Directed Acyclic Graph) of immutable snapshots.

**Merge vs Rebase:**
- **Merge:** Creates a 3-way merge commit. Preserves exact historical timeline. Safe for shared branches.
- **Rebase:** Replays commits on top of the newest base branch. Results in a clean, linear git log.
- **Golden Rule:** Never rebase a public branch that others have pulled!`;
  }

  // General DevOps Guide Response
  return `### 🚀 AWS & DevOps AI Live Guide & Trainer

Welcome! I am your interactive AI Trainer for **AWS Cloud, GitHub, Jenkins, Docker, and Kubernetes**.

Here are key topics you can explore with me:
1. **Docker & Containers:** Multi-stage builds, layer caching, networking, Docker Compose, non-root security.
2. **Kubernetes (K8s):** Architecture, Pods, Deployments, Services, Ingress, Helm, and CrashLoopBackOff debugging.
3. **Jenkins:** Declarative Jenkinsfile, Controller-Agent isolation, GitHub webhooks, automated DevSecOps pipelines.
4. **Git & GitHub:** Advanced branching, rebase vs merge, GitHub Actions CI/CD matrix builds, secrets management.
5. **AWS Cloud:** IAM least privilege, VPC networking, EC2 compute, ECS/EKS container clusters, S3, RDS, and Well-Architected designs.

**Try asking:**
- *"How do I write a production multi-stage Dockerfile for Node.js?"*
- *"Explain Kubernetes Pod scheduling step by step"*
- *"Diagnose an error: CrashLoopBackOff with code 137"*
- *"Create a Declarative Jenkinsfile that pushes to AWS ECR"*
- *"Interview me on Docker vs Virtual Machines"*`;
}

/**
 * GET /api/ai/health
 * Check if Ollama is running locally or remotely
 */
exports.getHealth = async (req, res) => {
  const startTime = Date.now();
  try {
    const result = await requestOllama('/api/tags', 'GET', null, 2500);
    const latencyMs = Date.now() - startTime;
    const models = (result.data && result.data.models) ? result.data.models : [];

    return res.json({
      status: 'healthy',
      ollamaOnline: true,
      host: OLLAMA_HOST,
      latencyMs,
      modelCount: models.length,
      availableModels: models.map(m => m.name),
      message: `Connected to local Ollama service at ${OLLAMA_HOST} (${models.length} models installed)`
    });
  } catch (err) {
    return res.json({
      status: 'standby',
      ollamaOnline: false,
      host: OLLAMA_HOST,
      latencyMs: null,
      modelCount: 0,
      availableModels: [],
      builtInEngineActive: true,
      message: 'Ollama not detected on port 11434. Built-in DevOps AI Knowledge Engine is ACTIVE with zero setup required!'
    });
  }
};

/**
 * GET /api/ai/models
 * List available Ollama models or recommended free models
 */
exports.getModels = async (req, res) => {
  try {
    const result = await requestOllama('/api/tags', 'GET', null, 2500);
    if (result.data && Array.isArray(result.data.models) && result.data.models.length > 0) {
      return res.json({
        success: true,
        source: 'ollama_local',
        models: result.data.models.map(m => ({
          name: m.name,
          sizeGB: (m.size / (1024 * 1024 * 1024)).toFixed(2),
          modifiedAt: m.modified_at,
          details: m.details || {}
        }))
      });
    }
  } catch (err) {
    // Ollama not reachable, return recommended free open-source models
  }

  // Fallback recommended open-source models
  const recommendedModels = [
    { name: 'llama3.2', tag: 'latest', description: 'Meta Llama 3.2 (3B) – Ultra-fast, lightweight, state-of-the-art general reasoning & code.' },
    { name: 'deepseek-r1', tag: 'latest', description: 'DeepSeek R1 – Exceptional open-source reasoning and step-by-step problem solving.' },
    { name: 'mistral', tag: 'latest', description: 'Mistral 7B – High-performance open-source instruction-following model.' },
    { name: 'codellama', tag: 'latest', description: 'CodeLlama 7B – Fine-tuned specifically for code generation and pipeline authoring.' },
    { name: 'qwen2.5-coder', tag: 'latest', description: 'Qwen 2.5 Coder – Top-tier specialized coding and DevOps YAML model.' },
    { name: 'phi3', tag: 'latest', description: 'Microsoft Phi-3 Mini – Highly optimized 3.8B model for edge and CPU laptops.' }
  ];

  return res.json({
    success: true,
    source: 'recommended_catalog',
    models: recommendedModels,
    installGuide: 'curl -fsSL https://ollama.com/install.sh | sh && ollama run llama3.2'
  });
};

/**
 * POST /api/ai/chat
 * Live interactive chat with Ollama open-source AI or Built-in Engine
 */
exports.chat = async (req, res) => {
  const { message, model = 'llama3.2', mode = 'tutor', topic = '', history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message string is required' });
  }

  const systemPrompt = `You are the lead Cloud & DevOps AI Trainer, Senior Site Reliability Engineer (SRE), and Solutions Architect for this AWS & DevOps Learning Platform.
Your mission is to guide learners to master AWS Cloud, GitHub, Jenkins, Docker, and Kubernetes.
Current Mode: ${mode.toUpperCase()}
Current Topic Context: ${topic || 'General Cloud Native & DevOps'}

Guidelines:
- Explain complex concepts simply with memorable real-world analogies.
- For Docker/Jenkins/K8s/Git/AWS questions, provide exact, copy-pasteable CLI commands, Dockerfiles, Jenkinsfiles, or YAML manifests with clean comments.
- Emphasize Production Best Practices, Zero-Downtime deployments, Least-Privilege IAM, and Zero-Cost Free-Tier safety.
- Format responses beautifully with GitHub-flavored markdown, emojis, bullet points, and code blocks.`;

  // 1. Try forwarding to local Ollama instance if available
  try {
    const ollamaPayload = {
      model: model || 'llama3.2',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
        { role: 'user', content: message }
      ],
      stream: false
    };

    const response = await requestOllama('/api/chat', 'POST', ollamaPayload, 15000);

    if (response.data && response.data.message && response.data.message.content) {
      return res.json({
        success: true,
        source: 'ollama_local',
        model: model,
        mode,
        reply: response.data.message.content,
        totalDurationMs: response.data.total_duration ? Math.round(response.data.total_duration / 1000000) : null
      });
    }
  } catch (err) {
    // Ollama offline, or model not pulled yet. Seamlessly fallback to Built-in AI Trainer Engine
  }

  // 2. Built-in AI Trainer Engine Response
  const builtInReply = generateBuiltInTrainerResponse({ message, mode, topic, history });

  return res.json({
    success: true,
    source: 'builtin_ai_engine',
    model: 'DevOps Cloud-Native Engine (Llama-Ready)',
    mode,
    reply: builtInReply,
    ollamaStatus: 'standby',
    quickLaunchCmd: 'ollama run llama3.2'
  });
};
