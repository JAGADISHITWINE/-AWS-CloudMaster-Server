module.exports = [
  {
    moduleNumber: 4,
    title: "Scenario: EC2 Instance Running but Web Application Inaccessible",
    difficulty: "Beginner",
    prompt: "You launched an EC2 instance running Nginx in your VPC. The AWS Management Console shows the instance state as 'Running' with 2/2 status checks passed. However, when users navigate to http://<Public-IP> in their web browser, the connection times out after 30 seconds. How would you systematically troubleshoot and resolve this issue?",
    explanation: "A running EC2 instance with 2/2 status checks passed verifies that the underlying AWS physical host and virtual OS are healthy. A connection timeout indicates that network packets are being dropped before reaching the application layer or being discarded by a firewall.",
    hintsJson: JSON.stringify([
      "Hint 1: Check the OSI layers starting from the network perimeter. Does the client request actually reach the instance's network interface?",
      "Hint 2: Inspect the EC2 Security Group inbound rules. What port and protocol does HTTP use, and what is the allowed source CIDR?",
      "Hint 3: Check the Subnet Route Table and Network ACLs. Is there an Internet Gateway attached, and does the subnet route 0.0.0.0/0 to it?",
      "Hint 4: Verify whether the Nginx service inside the OS is actually listening on 0.0.0.0:80 using netstat or ss."
    ]),
    recommendedSolution: `### Step-by-Step Troubleshooting Methodology:

1. **Check Security Group Inbound Rules (Most Common Cause):**
   - Verify that the EC2 Security Group contains an inbound rule allowing **TCP Port 80 (HTTP)** from source \`0.0.0.0/0\` (or your specific client IP).
   - If missing, add an inbound rule: Type: HTTP, Protocol: TCP, Port: 80, Source: \`0.0.0.0/0\`.

2. **Verify Subnet Route Table & Internet Gateway:**
   - Ensure the EC2 instance resides in a **Public Subnet**.
   - Check the subnet's Route Table: It must have a route for destination \`0.0.0.0/0\` with target set to an attached **Internet Gateway (igw-xxxxxx)**.
   - If the route points to a NAT Gateway or has no default route, external internet traffic cannot reach the instance directly.

3. **Inspect Network Access Control Lists (NACLs):**
   - Check the subnet's NACL. Because NACLs are **stateless**, verify:
     - **Inbound Rule:** Port 80 ALLOW from \`0.0.0.0/0\`.
     - **Outbound Rule:** Ephemeral ports (1024-65535) ALLOW to \`0.0.0.0/0\` so return packets can leave the subnet.

4. **Verify Public IPv4 Address & Elastic IP:**
   - Ensure the instance has an assigned Public IPv4 address or an associated Elastic IP. Private IPs (10.x.x.x, 172.16.x.x, 192.168.x.x) are non-routable over the public internet.

5. **Verify Host OS Service & Local Firewall (via EC2 Serial Console or Session Manager):**
   - Connect via AWS Systems Manager Session Manager or SSH.
   - Run: \`sudo systemctl status nginx\` to confirm the web server process is active.
   - Run: \`sudo ss -tulpn | grep :80\` to confirm Nginx is bound to \`0.0.0.0:80\` and not restricted to \`127.0.0.1:80\`.
   - Check OS firewalls (e.g. \`iptables\` or \`ufw status\`) to ensure local host firewalls aren't dropping incoming port 80 traffic.`,
    tagsJson: JSON.stringify(["EC2", "VPC", "Security Groups", "Troubleshooting", "Networking"])
  },
  {
    moduleNumber: 6,
    title: "Scenario: Securing Sensitive Financial Records in Amazon S3",
    difficulty: "Intermediate",
    prompt: "A fintech startup stores sensitive customer PDF bank statements and tax filings in an Amazon S3 bucket. Compliance auditors require that: (1) All data is encrypted at rest using keys rotated annually, (2) No objects can be made public under any circumstance, (3) Files cannot be deleted or overwritten for 7 years even by administrators, and (4) Access must be restricted strictly to a backend microservice running on EC2. How would you architect this solution?",
    explanation: "This scenario tests multi-layered S3 defense: KMS encryption, S3 Object Lock for regulatory compliance, Block Public Access guardrails, and IAM least-privilege bucket policies.",
    hintsJson: JSON.stringify([
      "Hint 1: Which AWS encryption service supports automated annual key rotation?",
      "Hint 2: How do you prevent accidental or malicious deletion even if someone has root or admin credentials?",
      "Hint 3: Which S3 feature provides a centralized safety switch to permanently prevent public exposures?",
      "Hint 4: How can a Bucket Policy restrict access strictly to a specific IAM role ARN?"
    ]),
    recommendedSolution: `### Architectural Solution:

1. **Encryption at Rest with Automated Key Rotation:**
   - Create a **Customer Managed Key (CMK)** in **AWS Key Management Service (KMS)**.
   - Enable **Automatic Key Rotation** on the KMS key (AWS automatically rotates the backing key every year while keeping the same ARN).
   - Configure the S3 bucket's default encryption to use this KMS key (SSE-KMS).

2. **Compliance Retention via S3 Object Lock (WORM):**
   - Enable **S3 Versioning** and **S3 Object Lock** in **Compliance Mode** with a retention period of 7 years.
   - In Compliance Mode, NO user (including the AWS root user or administrator) can delete or overwrite an object version until the 7-year retention period expires.

3. **Prevent Public Access:**
   - Enable **S3 Block Public Access (BPA)** at both the Account level and Bucket level with all 4 checkboxes enabled:
     - BlockPublicAcls
     - IgnorePublicAcls
     - BlockPublicPolicy
     - RestrictPublicBuckets

4. **Strict Least-Privilege Access Restriction:**
   - Attach an **IAM Role** to the backend EC2 instance with an IAM policy granting only \`s3:GetObject\` and \`s3:PutObject\` on \`arn:aws:s3:::fintech-records/*\`.
   - Implement an **S3 Bucket Policy** that explicitly denies any principal EXCEPT the designated backend IAM Role ARN:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonAppAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::fintech-records",
        "arn:aws:s3:::fintech-records/*"
      ],
      "Condition": {
        "StringNotLike": {
          "aws:userId": ["AROAEXAMPLEID:*"]
        }
      }
    }
  ]
}
\`\`\`

5. **Auditing & Monitoring:**
   - Enable S3 Server Access Logging and CloudTrail Data Events to log every single read/write attempt with source IP and identity.`,
    tagsJson: JSON.stringify(["S3", "Security", "KMS", "Compliance", "Object Lock"])
  },
  {
    moduleNumber: 15,
    title: "Scenario: Designing Multi-AZ Resiliency for Availability Zone Outage",
    difficulty: "Advanced",
    prompt: "You are designing the architecture for an online banking portal. The application must experience ZERO service disruption even if an entire AWS Availability Zone completely loses power or network connectivity due to a natural disaster. The database must maintain strict ACID consistency without data loss (RPO = 0, RTO < 60 seconds). How would you design this architecture?",
    explanation: "This scenario validates high-availability production architecture, stateless compute tiering, dynamic auto scaling across zones, and synchronous database failover.",
    hintsJson: JSON.stringify([
      "Hint 1: Where should the application load balancer be deployed, and across how many Availability Zones?",
      "Hint 2: How should EC2/ECS instances be distributed, and what happens when 1 AZ disappears?",
      "Hint 3: Which database architecture guarantees synchronous replication across AZs with zero data loss?",
      "Hint 4: How do you prevent over-utilization when remaining instances suddenly take on 100% of traffic?"
    ]),
    recommendedSolution: `### Production Architecture Design:

1. **DNS & Edge Caching:**
   - Route traffic through **Amazon Route 53** with latency/health-check routing to **Amazon CloudFront** edge locations with **AWS WAF**.

2. **Load Balancing Tier:**
   - Deploy an **Application Load Balancer (ALB)** across **3 Availability Zones** (Public Subnets). The ALB continuously checks the health of downstream targets.

3. **Compute Tier (Stateless Elastic Cluster):**
   - Deploy an **Auto Scaling Group (ASG)** spanning all 3 Availability Zones (Private Subnets).
   - **Capacity Sizing Rule:** Provision baseline capacity so that remaining AZs can handle peak traffic. If total desired capacity is N instances across 3 AZs (e.g. 6 instances, 2 per AZ), losing 1 AZ leaves 4 instances. The ASG Target Tracking policy immediately triggers dynamic scale-out to launch replacement instances in the surviving 2 AZs.
   - Store all user sessions in **Amazon ElastiCache (Redis Multi-AZ with Auto-Failover)** or client-side signed JWTs, ensuring instances are 100% stateless.

4. **Database Tier (Zero Data Loss RPO = 0):**
   - Deploy **Amazon Aurora PostgreSQL/MySQL Multi-AZ Cluster**:
     - Aurora replicates data synchronously across **3 Availability Zones (6 copies of data)** at the storage layer.
     - A write is acknowledged when 4 out of 6 nodes confirm (write quorum), surviving the total loss of an AZ plus one additional node without data loss (RPO = 0).
     - Deploy 1 Primary Writer DB in AZ-1 and 1 Aurora Read Replica with Priority Tier 0 in AZ-2.
     - If AZ-1 fails, Aurora automatically promotes the Replica to Primary Writer in under 30 seconds (RTO < 30s) by flipping the Cluster Endpoint DNS CNAME.

5. **Static Assets & Backups:**
   - Static web assets stored in **Amazon S3** (which replicates across 3+ AZs by default with 11 9s durability).`,
    tagsJson: JSON.stringify(["Architecture", "Multi-AZ", "High Availability", "Aurora", "ALB", "ASG"])
  },
  {
    moduleNumber: 3,
    title: "Scenario: Secure EC2-to-RDS Private Communication",
    difficulty: "Intermediate",
    prompt: "Your backend API runs on EC2 instances inside a custom VPC. It must communicate with an Amazon RDS MySQL database. You must ensure that: (1) The database is NEVER reachable from the public internet, (2) Only the backend EC2 instances can connect to MySQL port 3306, and (3) No hardcoded database IP addresses or CIDR blocks are used in firewall rules. How would you configure the subnets, routing, and security groups?",
    explanation: "This scenario tests the classic cloud security pattern of Security Group Chaining (referencing security groups by ID) and multi-tier subnet isolation.",
    hintsJson: JSON.stringify([
      "Hint 1: In which subnet type should the RDS database be deployed?",
      "Hint 2: Can a Security Group rule accept another Security Group ID instead of an IP CIDR block?",
      "Hint 3: Does the database subnet route table need a default route to an Internet Gateway or NAT Gateway?",
      "Hint 4: What is an RDS DB Subnet Group and why does it require at least 2 Availability Zones?"
    ]),
    recommendedSolution: `### Step-by-Step Security Architecture:

1. **Subnet & DB Subnet Group Design:**
   - Place the backend EC2 instances in a **Private App Subnet**.
   - Place the RDS database in a **Dedicated Private Database Subnet** across at least two Availability Zones (required to create an RDS DB Subnet Group).
   - The Database Subnet Route Table should have **NO route to 0.0.0.0/0** (no IGW, no NAT Gateway). The database is completely isolated.
   - Set RDS parameter **Publicly Accessible: No**.

2. **Security Group Chaining (Zero Hardcoded IPs):**
   - Create **SG-App** for the EC2 backend:
     - Inbound: Port 80/443 from ALB Security Group only.
     - Outbound: Allow outbound TCP port 3306 to destination **SG-DB**.
   - Create **SG-DB** for the RDS Database:
     - Inbound: Type **MySQL/Aurora (Port 3306)** -> Source: **SG-App** (select the security group ID \`sg-app-xxxxxx\`).
     - Outbound: All traffic or none (Security Groups are stateful; return packets flow automatically).

3. **Advantages of SG Chaining:**
   - When the Auto Scaling Group launches new EC2 instances, they automatically receive \`SG-App\` and can immediately talk to the database without updating any IP whitelist.
   - Any other instance or rogue developer machine in the VPC without \`SG-App\` is blocked by the database firewall.

4. **Connection Configuration:**
   - The application connects using the **RDS DNS Endpoint** (e.g. \`mydb.c12345.us-east-1.rds.amazonaws.com:3306\`), resolved privately via VPC DNS.
   - Database credentials are retrieved at startup from **AWS Secrets Manager** using the EC2 instance's IAM Role.`,
    tagsJson: JSON.stringify(["VPC", "RDS", "Security Groups", "Private Subnet", "Security"])
  },
  {
    moduleNumber: 15,
    title: "Scenario: Investigating an Unexpected Surge in AWS Monthly Bill",
    difficulty: "Intermediate",
    prompt: "Your company's AWS monthly bill jumped from an expected $150 to $850. The engineering manager asks you to urgently investigate the root causes, identify the exact offending resources, stop ongoing cost bleed, and implement preventive guardrails so this never happens again. How would you proceed?",
    explanation: "This scenario evaluates real-world FinOps troubleshooting skills using AWS Cost Explorer, Cost Allocation Tags, Budgets, and common cost leak patterns.",
    hintsJson: JSON.stringify([
      "Hint 1: Which AWS tool provides daily cost breakdowns filtered by service, usage type, and region?",
      "Hint 2: What common resources silently accumulate charges (e.g. NAT Gateways, idle Elastic IPs, untruncated CloudWatch logs, unattached EBS)?",
      "Hint 3: How can you find the exact IAM user or pipeline that launched the expensive resources?",
      "Hint 4: What tools automate cost alerts and spending thresholds before the bill arrives?"
    ]),
    recommendedSolution: `### Step-by-Step FinOps Investigation & Remediation:

1. **Identify the Offending Service in AWS Cost Explorer:**
   - Open **AWS Cost Explorer** -> Group by **Service** -> Granularity: **Daily** -> Timeframe: Last 30 Days.
   - Look for the sharp spike and identify the top spending service (e.g., EC2-Other, NAT Gateway, CloudWatch, or RDS).
   - Change Group by to **Usage Type** to find the specific driver (e.g., \`NatGateway-Hours\`, \`PublicIPv4:InUse\`, \`TimedStorage-ByteHrs\`, or \`CW:GigaBytes-Delivered\`).

2. **Locate the Specific Resource IDs:**
   - Filter by **Region** to identify where the resources were provisioned.
   - Common culprits to inspect immediately:
     - **VPC NAT Gateways:** Idle NAT Gateways bill ~$32/month each plus $0.045/GB processed.
     - **EC2-Other:** Unattached EBS volumes left over from terminated instances, unneeded EBS snapshots, or unassociated Elastic IPs.
     - **CloudWatch Logs:** Verbose debug logging with 'Never Expire' retention policy.
     - **RDS:** Multi-AZ or Provisioned IOPS enabled accidentally during testing.

3. **Trace the Originating Principal in AWS CloudTrail:**
   - Open **AWS CloudTrail** -> Event History.
   - Filter by Event Name (e.g., \`CreateNatGateway\` or \`CreateVolume\`) and locate the IAM User, Access Key, or CI/CD role responsible and the exact timestamp.

4. **Stop the Bleed:**
   - Immediately terminate or delete the orphaned/over-provisioned resources.
   - Set retention limits on CloudWatch Log Groups (e.g., 14 or 30 days).

5. **Implement Preventive Guardrails:**
   - **AWS Budgets:** Configure a Monthly Cost Budget with notifications at 50%, 80%, and 100% of the target threshold sent to the DevOps team Slack/Email.
   - **AWS Cost Anomaly Detection:** Turn on ML-powered anomaly detection to receive instant alerts when unusual spend occurs.
   - **AWS Organizations SCPs / Permission Boundaries:** Restrict developers from provisioning expensive instance classes (e.g., deny \`*.32xlarge\`).`,
    tagsJson: JSON.stringify(["Cost Optimization", "FinOps", "Cost Explorer", "CloudTrail", "Budgets"])
  },
  {
    moduleNumber: 16,
    title: "Scenario: Git Merge Conflict & Detached HEAD During Release Hotfix",
    difficulty: "Intermediate",
    prompt: "During an urgent production hotfix, a developer checked out a past commit SHA, made changes, and committed them, entering 'detached HEAD' state. When attempting to merge the hotfix into the 'main' branch, Git reported severe merge conflicts across 14 configuration files and aborted. The team is blocked from deploying the hotfix. How do you recover the unreferenced commits from detached HEAD, resolve conflicts cleanly, and safely update the main branch without losing work?",
    explanation: "Detached HEAD occurs when HEAD points directly to a commit hash instead of a named branch pointer. Commits made in this state are orphaned and will eventually be garbage collected unless anchored to a new branch.",
    hintsJson: JSON.stringify([
      "Hint 1: Do not panic or delete the folder. Git reflog records every movement of HEAD.",
      "Hint 2: Anchor the orphaned commits by creating a temporary branch from the current HEAD pointer.",
      "Hint 3: Instead of a messy merge, consider rebasing the hotfix commits on top of origin/main.",
      "Hint 4: Use 'git status' and 'git diff' to inspect conflict markers (<<<<<<< HEAD, =======, >>>>>>>)."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Anchor the Detached HEAD Commits Immediately:**
   - Run: \`git branch hotfix-recovery\` while still on the detached commit.
   - This creates a named pointer so your hotfix commits are safe from garbage collection.

2. **Verify Commit History with Git Reflog:**
   - If you accidentally switched away already, run: \`git reflog\`
   - Find the commit SHA where your work was done (e.g., \`HEAD@{1}\`) and run: \`git checkout -b hotfix-recovery HEAD@{1}\`.

3. **Rebase or Merge onto Fresh Upstream Main:**
   - Fetch the latest remote changes: \`git fetch origin main\`
   - Rebase cleanly on top of main: \`git rebase origin/main\`
   - Git will pause at conflicting files.

4. **Resolve Conflict Markers:**
   - Run \`git status\` to identify 'both modified' files.
   - Open conflicting files and resolve:
     - \`<<<<<<< HEAD\`: Contains the upstream main code.
     - \`=======\`: Divider line.
     - \`>>>>>>> hotfix-recovery\`: Contains your hotfix code.
   - Edit the code to preserve the necessary fixes and remove conflict markers.
   - Stage resolved files: \`git add <file>\`

5. **Finalize and Verify:**
   - Run: \`git rebase --continue\`
   - Run the test suite: \`npm test\`
   - Push to your feature branch and open a verified PR: \`git push origin hotfix-recovery\`.`,
    tagsJson: JSON.stringify(["Git", "GitHub", "Merge Conflict", "Detached HEAD", "Reflog"])
  },
  {
    moduleNumber: 17,
    title: "Scenario: Jenkins Pipeline Build Failure – Agent Workspace Disk 100% Full",
    difficulty: "Intermediate",
    prompt: "Your Jenkins CI/CD server suddenly stops completing builds. All queued pipeline jobs stay in 'Pending – Waiting for next available executor on docker-agent-01', and active jobs fail with 'java.io.IOException: No space left on device'. Developers cannot deploy code. How do you triage this disk pressure, identify what consumed the disk, recover the build agents, and automate long-term cleanup guardrails?",
    explanation: "CI/CD build nodes execute repeated container builds, downloading node_modules, Docker base images, and compilation caches. Without automated pruning, disk utilization reaches 100%, causing the JVM to halt.",
    hintsJson: JSON.stringify([
      "Hint 1: Check filesystem space using 'df -h' and 'du -sh *' on the agent node.",
      "Hint 2: Check Docker dangling images and stopped containers using 'docker system df'.",
      "Hint 3: Inspect the Jenkins workspace directory (/var/jenkins_home/workspace).",
      "Hint 4: Add a post-build workspace cleanup step in your Jenkinsfile."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **SSH into the Affected Jenkins Agent Node:**
   - Check available disk space: \`df -h\`
   - Confirm which partition is at 100% (typically \`/var/lib/docker\` or \`/var/jenkins_home\`).

2. **Prune Stale Docker Assets:**
   - Inspect Docker storage consumption: \`docker system df\`
   - Safely remove unused containers, networks, dangling images, and build caches:
     \`docker system prune -af --volumes\`
   - This typically frees 30GB to 80GB of orphaned build cache in seconds.

3. **Purge Old Jenkins Workspaces:**
   - Navigate to workspace directory: \`cd /var/jenkins_home/workspace\`
   - Find orphaned workspaces of deleted jobs: \`du -sh * | sort -hr | head -n 10\`
   - Remove stale workspaces safely.

4. **Restart the Jenkins Agent Service:**
   - Verify that disk usage is now below 40%.
   - In Jenkins UI: Nodes -> 'docker-agent-01' -> Click 'Launch Agent' or 'Bring online'.

5. **Implement Permanent Automated Guardrails:**
   - **Pipeline Post Step:** Add \`cleanWs()\` in the \`post { always { cleanWs() } }\` block of every Jenkinsfile so workspaces are deleted immediately upon job completion.
   - **Cron Prune Job:** Configure a recurring Jenkins cron maintenance job running nightly:
     \`docker system prune -af --filter "until=48h"\`
   - **CloudWatch / Prometheus Disk Alert:** Set up an alert when root disk exceeds 80% capacity.`,
    tagsJson: JSON.stringify(["Jenkins", "CI/CD", "Docker Prune", "Disk Space", "Troubleshooting"])
  },
  {
    moduleNumber: 18,
    title: "Scenario: Docker Container Crashes with Exit Code 137 (OOMKilled)",
    difficulty: "Intermediate",
    prompt: "A microservice deployed inside a Docker container runs smoothly during low-traffic hours. However, when user traffic increases during lunch hours, the container suddenly crashes, and 'docker ps -a' displays 'Exited (137) 2 minutes ago'. The application logs end abruptly without a stack trace or exception. What does exit code 137 mean, and how do you diagnose and resolve this issue?",
    explanation: "Exit code 137 = 128 + 9 (SIGKILL). This indicates that the Linux kernel Out-Of-Memory (OOM) Killer terminated the container's main process because it exceeded its allocated cgroup memory limit.",
    hintsJson: JSON.stringify([
      "Hint 1: Calculate exit code 137: 128 + Signal 9 (SIGKILL). The OS sent a non-catchable kill signal.",
      "Hint 2: Inspect container events with 'docker inspect <container>' and look for 'OOMKilled: true'.",
      "Hint 3: Review kernel ring buffer logs with 'dmesg -T' to see the exact kernel OOM invocation.",
      "Hint 4: Review container memory limit configurations (--memory or compose mem_limit) vs application heap limits."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Confirm the Kernel OOM-Killer Trigger:**
   - Run: \`docker inspect <container-name> --format '{{json .State}}'\`
   - Check the JSON output: look for \`"OOMKilled": true\` and \`"ExitCode": 137\`.
   - Run \`dmesg -T | grep -i oom\` on the host machine to see the kernel log: \`Memory cgroup out of memory: Killed process 4182 (node)\`.

2. **Analyze Application Memory Consumption:**
   - Run container with live stats: \`docker stats <container-name>\`
   - Observe whether memory ramps up continuously (memory leak) or spikes during large payload parsing (e.g. processing large JSON arrays or file uploads in memory).

3. **Tune Docker Memory Limits:**
   - If the container had an artificially low limit (e.g., \`--memory="256m"\` for a Node.js or Java service), increase the threshold:
     \`--memory="1024m" --memory-swap="2048m"\`
   - In docker-compose.yml:
     \`\`\`yaml
     deploy:
       resources:
         limits:
           memory: 1G
     \`\`\`

4. **Tune Runtime Heap Configuration:**
   - For Node.js applications, configure V8 maximum old space:
     \`NODE_OPTIONS="--max-old-space-size=768" npm start\`
   - For Java applications, set explicit JVM flags:
     \`-XX:MaxRAMPercentage=75.0 -Xmx768m\`
   - Ensuring the runtime heap is bounded below the container's cgroup memory limit allows the runtime garbage collector to trigger before the Linux kernel kills the container.

5. **Profile and Fix Code Memory Leaks:**
   - Check for unclosed database connection pools, un-evicted global cache maps, or missing stream piping during file uploads.`,
    tagsJson: JSON.stringify(["Docker", "OOMKilled", "Exit Code 137", "Cgroups", "Memory Tuning"])
  },
  {
    moduleNumber: 19,
    title: "Scenario: Kubernetes Pod in CrashLoopBackOff & Missing ConfigMap",
    difficulty: "Advanced",
    prompt: "You applied an updated Kubernetes Deployment for your order-processing service. When checking pod status with 'kubectl get pods', you notice the pods have STATUS 'CrashLoopBackOff' with RESTARTS count rapidly increasing (4, 5, 6...). The application is down in production. How do you systematically inspect the pod, identify the root cause, and restore the service?",
    explanation: "CrashLoopBackOff means the container started, crashed or terminated with a non-zero exit code, and Kubernetes is waiting exponentially longer (10s, 20s, 40s... up to 5m) before attempting to restart it.",
    hintsJson: JSON.stringify([
      "Hint 1: Use 'kubectl describe pod <name>' to inspect the Events table at the bottom.",
      "Hint 2: Use 'kubectl logs <name> --previous' to inspect why the previous crashed container exited.",
      "Hint 3: Check for missing environment variables, missing ConfigMaps, or invalid DB connection strings.",
      "Hint 4: If needed, perform an instant rollback using 'kubectl rollout undo deployment/<name>'."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Immediate Emergency Action (Roll Back First If Production Outage):**
   - If user-facing production is down:
     \`kubectl rollout undo deployment/order-service\`
   - This immediately restores the previous healthy replica set while you debug the failure in staging.

2. **Inspect the Crash Events:**
   - Run: \`kubectl describe pod order-service-7945d8b8-x2qp\`
   - Inspect the 'Events' section: Look for warnings like:
     - \`Warning FailedMount: configmap "order-service-config" not found\`
     - \`Warning BackOff: Back-off restarting failed container\`

3. **Check Container Logs (Including Previous Crashed Instance):**
   - Run: \`kubectl logs order-service-7945d8b8-x2qp --previous\`
   - Notice the fatal error: \`Error: Cannot find module or missing ENV DB_PASSWORD. Exiting with code 1\`.

4. **Verify ConfigMaps and Secrets:**
   - Run: \`kubectl get configmap,secret\`
   - Check if the deployment manifest references a ConfigMap or Secret name that was misspelled (e.g. \`order-config\` instead of \`order-service-config\`) or exists in a different namespace.

5. **Apply the Missing Config and Redeploy:**
   - Create or update the required ConfigMap:
     \`kubectl apply -f order-configmap.yaml\`
   - Reapply the corrected Deployment manifest:
     \`kubectl apply -f order-deployment.yaml\`
   - Monitor rollout until all 3 replicas report 1/1 Running:
     \`kubectl rollout status deployment/order-service\`.`,
    tagsJson: JSON.stringify(["Kubernetes", "CrashLoopBackOff", "Troubleshooting", "ConfigMap", "kubectl"])
  },
  {
    moduleNumber: 20,
    title: "Scenario: CI/CD Pipeline Fails with '403 Forbidden: Denied ECR Push'",
    difficulty: "Advanced",
    prompt: "Your automated Jenkins/GitHub Actions pipeline successfully compiles and tests your application, builds a Docker image, and passes Trivy vulnerability scans. However, on the final push step: 'docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/api:v2.1.0', the command fails with 'denied: Your authorization token has expired or request is forbidden (HTTP 403)'. Deployments are stalled. How do you resolve this authentication and permission issue?",
    explanation: "Amazon ECR authentication tokens generated by 'aws ecr get-login-password' are valid for exactly 12 hours. Furthermore, the calling IAM principal must possess the necessary ECR write and layer upload permissions.",
    hintsJson: JSON.stringify([
      "Hint 1: Check token expiration. AWS ECR STS login tokens expire after 12 hours.",
      "Hint 2: Verify the calling IAM Role/User permissions on the ECR repository.",
      "Hint 3: Required actions: ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:PutImage, ecr:InitiateLayerUpload, ecr:UploadLayerPart, ecr:CompleteLayerUpload.",
      "Hint 4: Verify whether the ECR repository 'api' actually exists in that AWS Region."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Authenticate in the CI Pipeline Script Directly Before Pushing:**
   - ECR tokens expire after 12 hours. Never reuse static docker login sessions across CI builds.
   - Add dynamic re-authentication in the pipeline step:
     \`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com\`

2. **Verify the Target ECR Repository Exists:**
   - Run: \`aws ecr describe-repositories --repository-names api --region us-east-1\`
   - If it does not exist, create it:
     \`aws ecr create-repository --repository-name api --image-scanning-configuration scanOnPush=true\`

3. **Inspect IAM Permissions on the CI Runner Role:**
   - Verify the IAM Role attached to the runner has the AWS-managed policy \`AmazonEC2ContainerRegistryPowerUser\` or custom least-privilege policy:
     \`\`\`json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": "ecr:GetAuthorizationToken",
           "Resource": "*"
         },
         {
           "Effect": "Allow",
           "Action": [
             "ecr:BatchCheckLayerAvailability",
             "ecr:GetDownloadUrlForLayer",
             "ecr:PutImage",
             "ecr:InitiateLayerUpload",
             "ecr:UploadLayerPart",
             "ecr:CompleteLayerUpload"
           ],
           "Resource": "arn:aws:ecr:us-east-1:123456789012:repository/api"
         }
       ]
     }
     \`\`\`

4. **Test and Verify Push:**
   - Rerun the CI/CD pipeline.
   - Confirm image digest sha256 is recorded in Amazon ECR console.`,
    tagsJson: JSON.stringify(["CI/CD", "AWS ECR", "Docker Push", "IAM Permissions", "DevOps"])
  },
  {
    moduleNumber: 16,
    title: "Scenario: Git 'Detached HEAD' & Unreachable Commits During Emergency Hotfix",
    difficulty: "Intermediate",
    prompt: "During a critical production outage, an engineer checked out a specific historical release tag using 'git checkout v2.3.1', applied an emergency security fix, and created two commits. When attempting to push using 'git push origin main', Git outputs 'Everything up-to-date', and the engineer discovers that their commits do not appear on any branch. How do you recover these orphaned commits and merge them safely without losing work?",
    explanation: "Checking out a tag or commit SHA puts Git in a 'Detached HEAD' state where HEAD points directly to a commit object rather than a named branch reference. Any new commits created in this state are orphaned and will eventually be garbage collected.",
    hintsJson: JSON.stringify([
      "Hint 1: Check where HEAD currently points using 'git status' or 'git branch'.",
      "Hint 2: Find the commit hashes of the work using 'git log -n 5' or 'git reflog'.",
      "Hint 3: Create a named branch pointing to the current detached HEAD commit.",
      "Hint 4: Rebase or cherry-pick those commits onto the target release or main branch."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Verify Detached HEAD State:**
   - Run: \`git status\`
   - Notice: \`HEAD detached at v2.3.1\`. Your commits exist in the object database but have no branch pointing to them.

2. **Immediately Create a Recovery Branch from the Current HEAD:**
   - Do NOT switch branches yet, or the commits will become unreferenced!
   - Run: \`git branch emergency-hotfix-recovery\`
   - This binds a permanent named branch reference to the latest commit.

3. **Verify the Commits Exist on the Recovery Branch:**
   - Run: \`git log --oneline -n 5 emergency-hotfix-recovery\`
   - Confirm both hotfix commits appear in the history graph.

4. **Integrate into Target Branch (main or release-v2.3):**
   - Switch to the target branch: \`git switch main\` (or \`git checkout main\`)
   - Fetch latest remote changes: \`git pull origin main --rebase\`
   - Cherry-pick the recovery commits:
     \`git cherry-pick v2.3.1..emergency-hotfix-recovery\`
   - Run tests to confirm zero regressions: \`npm test\`
   - Push to remote: \`git push origin main\`

5. **Clean up Temporary Recovery Branch:**
   - \`git branch -d emergency-hotfix-recovery\``,
    tagsJson: JSON.stringify(["Git", "Detached HEAD", "Disaster Recovery", "Branching", "Troubleshooting"])
  },
  {
    moduleNumber: 16,
    title: "Scenario: Resolving Complex 3-Way Git Merge Conflict During Release Rebase",
    difficulty: "Advanced",
    prompt: "A developer has been working on a long-lived feature branch for 3 weeks. When rebasing onto upstream main ('git rebase origin/main'), Git halts on commit 3 of 12 with: 'CONFLICT (content): Merge conflict in config/database.js. Failed to merge in the changes'. Both teams made incompatible architectural changes to database pooling logic. How should the team systematically resolve this conflict without corrupting history or introducing syntax bugs?",
    explanation: "Interactive rebasing replays commits one-by-one on top of the target branch. A merge conflict pauses execution at the exact commit where changes overlap, requiring resolution of conflict markers before continuing.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect which files are conflicted using 'git status'.",
      "Hint 2: Understand conflict markers: <<<<<<< HEAD (the upstream target) vs >>>>>>> (the incoming feature commit).",
      "Hint 3: Use a 3-way visual merge tool like 'git mergetool' or VS Code diff editor.",
      "Hint 4: After editing, stage the resolved files with 'git add' and run 'git rebase --continue'. Never run git commit during rebase!"
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Inspect Conflict State:**
   - Run: \`git status\`
   - Identify files listed under \`both modified:\` (e.g. \`config/database.js\`).

2. **Understand the Conflict Markers:**
   - Open \`config/database.js\`.
   - \`<<<<<<< HEAD\` represents the state of the branch you are rebasing ONTO (the upstream main code).
   - \`=======\` is the dividing baseline.
   - \`>>>>>>> [commit SHA]\` represents the changes from your feature branch being applied.

3. **Resolve the Conflict Logic:**
   - Coordinate with the upstream author if necessary.
   - Combine the connection pool configuration while preserving the new security parameters.
   - Completely delete the conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`).

4. **Stage the Resolved File:**
   - Run: \`git add config/database.js\`
   - Verify all conflicts are staged: \`git status\`

5. **Continue the Rebase Sequence:**
   - Execute: \`git rebase --continue\`
   - **CRITICAL:** Do NOT run \`git commit\`, as rebase handles committing automatically.
   - If subsequent commits have conflicts, repeat steps 1-4.
   - If the rebase gets completely mangled and you wish to abort safely:
     \`git rebase --abort\`

6. **Validate & Push:**
   - Run full unit and integration test suite: \`npm test\`
   - Push to feature branch with lease protection: \`git push --force-with-lease origin feature-branch\``,
    tagsJson: JSON.stringify(["Git", "Merge Conflicts", "Git Rebase", "DevOps", "Version Control"])
  },
  {
    moduleNumber: 17,
    title: "Scenario: Jenkins Pipeline Build Hanging Indefinitely Waiting for Node Agent",
    difficulty: "Intermediate",
    prompt: "An automated Jenkins build is triggered upon a GitHub PR merge. However, the pipeline console shows: 'Still waiting to schedule task: All nodes of label 'docker-node-aws' are offline or busy'. The build sits queued for 45 minutes, blocking all subsequent pull requests. How would you systematically diagnose and restore the Jenkins worker agent fleet?",
    explanation: "Jenkins controllers schedule pipeline stages onto agents matching node labels. If labeled agents are disconnected, lack available executors, or fail cloud auto-provisioning, tasks stay queued indefinitely in the build queue.",
    hintsJson: JSON.stringify([
      "Hint 1: Check the Jenkins Nodes page (Manage Jenkins -> Nodes) to see agent status.",
      "Hint 2: Verify SSH connectivity or JNLP port 50000 communication between controller and agent.",
      "Hint 3: Check agent disk space. Jenkins automatically takes agents offline if free disk falls below threshold (1GB).",
      "Hint 4: Verify whether the agent process/daemon or Docker container crashed on the worker machine."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Check Node Status in Jenkins Web UI:**
   - Navigate to **Manage Jenkins -> Nodes**.
   - Check the node labeled \`docker-node-aws\`. Look for red 'X' or suspended icons.

2. **Inspect Agent Connection Logs:**
   - Click on the node -> **Log**.
   - Common culprits:
     - **Disk Space Out of Bounds:** \`Disk space is below threshold of 1.0 GiB. Putting node offline.\`
     - **SSH Authentication Failure:** Key pair rotated or expired credentials.
     - **JNLP Port Blocked:** Firewall closed TCP port 50000 between agent and master.

3. **Reclaim Disk Space on Agent Node (via SSH):**
   - Connect to the agent: \`ssh ubuntu@<agent-ip>\`
   - Check disk: \`df -h\`
   - Reclaim Docker build cache:
     \`docker system prune -a --volumes -f\`
   - Clear old Jenkins workspace remnants:
     \`rm -rf /var/lib/jenkins/workspace/*\`

4. **Verify Docker Daemon & Java Version:**
   - Confirm Docker service is active: \`sudo systemctl status docker\`
   - Verify matching OpenJDK version: \`java -version\` (must match Jenkins controller JDK major release).

5. **Bring Node Online & Configure Quota:**
   - In Jenkins UI, click **Bring this node back online**.
   - Verify executors count is set appropriately (e.g. 2-4 executors per 4 vCPUs).
   - The queued pipeline build will immediately be picked up and begin executing.`,
    tagsJson: JSON.stringify(["Jenkins", "CI/CD", "Worker Agents", "Disk Space", "Troubleshooting"])
  },
  {
    moduleNumber: 17,
    title: "Scenario: GitHub Webhook 403 Forbidden with HMAC-SHA256 Secret Mismatch",
    difficulty: "Advanced",
    prompt: "Your team configured a GitHub repository webhook to trigger a Jenkins multibranch pipeline on git push events. However, developers report that pushing commits does not trigger any builds. Inspecting the GitHub Webhook 'Recent Deliveries' tab reveals HTTP 403 Forbidden responses with body: 'Invalid signature'. How do you diagnose and fix this webhook payload authentication error?",
    explanation: "GitHub signs webhook payloads using an HMAC-SHA256 hex digest using a shared secret. The receiving Jenkins GitHub plugin computes the hash on the raw payload body. If the secret differs or reverse proxies alter the payload, verification fails with HTTP 403.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect the X-Hub-Signature-256 header in GitHub delivery payload.",
      "Hint 2: Check Jenkins system configuration for the GitHub Plugin Shared Secret.",
      "Hint 3: Ensure Nginx / reverse proxy does not buffer or strip request headers.",
      "Hint 4: Verify Jenkins CSRF Crumb Issuer settings."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Inspect GitHub Delivery Headers & Response:**
   - In GitHub -> **Settings -> Webhooks -> [Select Webhook] -> Recent Deliveries**.
   - Expand the failed delivery: Look at Request Headers:
     \`X-Hub-Signature-256: sha256=d3b07384d113edec49eaa6238ad5ff00...\`
   - Response status: \`403 Forbidden\`.

2. **Verify Shared Secret Consistency:**
   - In Jenkins, navigate to **Manage Jenkins -> System -> GitHub -> GitHub Servers**.
   - Click **Advanced** under GitHub Hook.
   - Ensure the **Shared Secret** matches the exact secret configured in the GitHub repository Webhook settings character-for-character.
   - If unsure, regenerate a fresh random 32-character secret:
     \`openssl rand -hex 20\`
   - Update both GitHub Webhook Secret and Jenkins GitHub plugin simultaneously.

3. **Inspect Reverse Proxy (Nginx / ALB) Configuration:**
   - If Jenkins sits behind Nginx, verify that Nginx passes raw headers without dropping or modifying:
     \`\`\`nginx
     location /github-webhook/ {
         proxy_pass http://127.0.0.1:8080/github-webhook/;
         proxy_set_header Host $http_host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
         proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
     }
     \`\`\`

4. **Redeliver Test Payload:**
   - In GitHub Webhook console, click **Redeliver**.
   - Confirm status changes to **HTTP 200 OK**, and verify Jenkins triggers the pipeline run.`,
    tagsJson: JSON.stringify(["Jenkins", "GitHub Webhook", "DevOps", "HMAC", "Security"])
  },
  {
    moduleNumber: 18,
    title: "Scenario: Multi-Stage Dockerfile Cache Invalidation Causing 45-Minute CI Builds",
    difficulty: "Intermediate",
    prompt: "A Node.js backend container previously took 2 minutes to build in CI. After adding a new analytics feature, developers notice that every single minor code commit now takes 45 minutes to build Docker images because 'npm install' runs completely from scratch every time. Examining the Dockerfile shows:\n\nCOPY . .\nRUN npm install --production\n\nHow do you restructure this Dockerfile to leverage Docker layer caching and restore sub-minute build speeds?",
    explanation: "Docker invalidates layer cache sequentially. If a COPY directive copies files that change frequently (like source code), all subsequent RUN directives in the Dockerfile will have their cache invalidated and must re-run completely.",
    hintsJson: JSON.stringify([
      "Hint 1: Understand how Docker checks cache: if file checksums in COPY change, all subsequent layers are rebuilt.",
      "Hint 2: Separate dependency manifest files (package.json, package-lock.json) from application source code.",
      "Hint 3: Copy only package*.json first, run npm ci, and THEN copy the rest of the application code.",
      "Hint 4: Use multi-stage builds to discard build dependencies from the production image."
    ]),
    recommendedSolution: `### Step-by-Step Optimization Methodology:

1. **Identify the Layer Invalidation Bug:**
   - Placing \`COPY . .\` before \`RUN npm install\` causes Docker to compute a checksum over all files (including \`src/\`, \`README.md\`, etc.).
   - Whenever any developer touches a single line of JavaScript, the \`COPY . .\` layer changes -> Docker invalidates the cache for \`RUN npm install\` -> All packages re-download from NPM registry!

2. **Rewrite with Optimized Layer Order & Multi-Stage Build:**
   \`\`\`dockerfile
   # Stage 1: Build Dependencies
   FROM node:20-alpine AS builder
   WORKDIR /app

   # Step 1: Copy ONLY dependency manifests first
   COPY package.json package-lock.json ./

   # Step 2: Install dependencies (Cached unless package.json actually changes!)
   RUN npm ci --prefer-offline

   # Step 3: Copy source code AFTER dependencies are cached
   COPY . .
   RUN npm run build

   # Stage 2: Hardened Lean Production Runtime
   FROM node:20-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production

   # Copy only production dependencies and compiled build
   COPY package.json package-lock.json ./
   RUN npm ci --only=production && npm cache clean --force
   COPY --from=builder /app/dist ./dist

   USER node
   EXPOSE 3000
   CMD ["node", "dist/server.js"]
   \`\`\`

3. **Add .dockerignore File:**
   - Create \`.dockerignore\` to prevent local bloat from entering the build context:
     \`\`\`
     node_modules
     npm-debug.log
     .git
     dist
     .env
     \`\`\`

4. **Verify Result:**
   - Subsequent builds with code changes now skip package installation entirely and finish in under 30 seconds!`,
    tagsJson: JSON.stringify(["Docker", "Dockerfile", "Multi-Stage", "Layer Caching", "Performance"])
  },
  {
    moduleNumber: 18,
    title: "Scenario: Container Terminated with Exit Code 137 (OOMKilled) Under Spiky Traffic",
    difficulty: "Advanced",
    prompt: "An API container in production runs fine during low-traffic hours. However, during flash sale peak hours, the container abruptly terminates and restarts every 10 minutes. Running 'docker inspect' shows 'ExitCode: 137, OOMKilled: true'. How do you systematically analyze memory allocation, tune cgroups limits, and prevent the Linux kernel OOM killer from killing your application?",
    explanation: "Linux Exit Code 137 corresponds to 128 + 9 (SIGKILL). When a container exceeds its cgroups memory ceiling, the Linux kernel Out-Of-Memory (OOM) killer immediately terminates the process with SIGKILL to protect host stability.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect container memory limit configuration (--memory or k8s resources.limits.memory).",
      "Hint 2: Check Node.js / Java max old space or heap allocation limits inside the runtime.",
      "Hint 3: Monitor container memory consumption using 'docker stats' during load testing.",
      "Hint 4: Ensure runtime heap size ceiling is configured lower than the cgroups container limit."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Verify OOMKilled Status:**
   - Run: \`docker inspect <container-id> --format='{{.State.OOMKilled}} (Exit: {{.State.ExitCode}})'\`
   - Returns \`true (Exit: 137)\`.
   - Inspect dmesg kernel log: \`dmesg -T | grep -i oom\`
   - Confirm kernel output: \`Task in /docker/... killed as a result of limit of 512M\`.

2. **Analyze Container vs Runtime Memory Mismatch:**
   - If container has \`--memory=512m\`, but the Node.js V8 runtime defaults to 1.4GB on 64-bit systems, Node.js will continue allocating memory until the kernel abruptly kills it from the outside without warning!

3. **Configure Runtime Heap Ceilings:**
   - Restrict V8 heap allocation to 75% of the container cgroups limit (leaving 25% for stack, buffers, and OS overhead):
     \`\`\`dockerfile
     ENV NODE_OPTIONS="--max-old-space-size=384"
     \`\`\`
   - For Java applications, use JVM flags:
     \`\`\`dockerfile
     ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
     \`\`\`

4. **Tune Host Container Limits:**
   - Increase container limit if legitimately required:
     \`docker update --memory=1024m --memory-swap=1024m <container-id>\`
   - In Kubernetes, set balanced requests and limits:
     \`\`\`yaml
     resources:
       requests:
         memory: "512Mi"
       limits:
         memory: "1Gi"
     \`\`\`

5. **Profile for Memory Leaks:**
   - Use Chrome DevTools / Clinic.js to take heap snapshots and confirm no global arrays or open socket handles are leaking memory over time.`,
    tagsJson: JSON.stringify(["Docker", "OOMKilled", "Exit Code 137", "Cgroups", "Memory Tuning"])
  },
  {
    moduleNumber: 18,
    title: "Scenario: 'EACCES Permission Denied' on Mounted Docker Volume with Non-Root User",
    difficulty: "Intermediate",
    prompt: "To comply with security audits, you updated a Dockerfile to run as a non-root user using 'USER 1001'. However, when the container launches with a mounted host directory for persistent uploads ('-v /data/uploads:/app/uploads'), the application crashes on boot with: 'Error: EACCES: permission denied, mkdir /app/uploads/avatars'. Why did this happen and how do you resolve the host-container UID ownership mismatch?",
    explanation: "Linux file permissions on bind mounts are enforced based on numerical User IDs (UIDs). If the host directory is owned by root (UID 0), a container running as non-root (UID 1001) lacks write permissions unless permissions or ownership are explicitly aligned.",
    hintsJson: JSON.stringify([
      "Hint 1: Check permissions of the host directory using 'ls -ld /data/uploads'.",
      "Hint 2: Determine what UID the container process runs under.",
      "Hint 3: Use chown on the host or use Docker named volumes instead of host bind mounts.",
      "Hint 4: Use an entrypoint script or initContainer to fix directory ownership before dropping privileges."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Inspect Host Directory Ownership:**
   - On the host machine, run: \`ls -ld /data/uploads\`
   - Output: \`drwxr-xr-x 2 root root 4096 /data/uploads\`
   - Notice: Only \`root\` (UID 0) has write permissions.

2. **Option A: Adjust Host Directory Ownership (Quick Fix):**
   - Align host folder ownership to match container UID 1001:
     \`sudo chown -R 1001:1001 /data/uploads\`
     \`sudo chmod -R 775 /data/uploads\`
   - Restart container: Container can now create subdirectories without permission errors.

3. **Option B: Use Docker Named Volumes (Recommended for Portability):**
   - Instead of bind mounts, use Docker-managed named volumes:
     \`docker volume create uploads-data\`
     \`docker run -d -v uploads-data:/app/uploads --user 1001:1001 myapp:v1\`
   - Docker automatically initializes named volumes with the container image's target folder permissions.

4. **Option C: Entrypoint Pattern with 'gosu':**
   - In Dockerfile, start as root, fix volume permissions, and drop privileges before launching app:
     \`\`\`bash
     #!/bin/sh
     chown -R appuser:appgroup /app/uploads
     exec gosu appuser "$@"
     \`\`\``,
    tagsJson: JSON.stringify(["Docker", "Linux Permissions", "Volumes", "Non-Root", "Security"])
  },
  {
    moduleNumber: 19,
    title: "Scenario: Nginx Ingress Controller Returning 502 Bad Gateway to End Users",
    difficulty: "Advanced",
    prompt: "Users reporting intermittent '502 Bad Gateway' errors when visiting your production web application https://app.example.com. The Nginx Ingress Controller is running, SSL certificates are valid, and the DNS records resolve correctly. How do you systematically trace the request through the Ingress controller, Kubernetes Service, and backend pods to isolate and eliminate the 502 gateway error?",
    explanation: "HTTP 502 Bad Gateway indicates that the Ingress proxy received an invalid response or connection reset from the upstream backend pod. Common causes include unready endpoints, port mismatches in Service definitions, or pods failing readiness probes.",
    hintsJson: JSON.stringify([
      "Hint 1: Check Nginx Ingress controller logs for upstream response status.",
      "Hint 2: Verify the Kubernetes Service endpoints using 'kubectl get endpoints <service-name>'.",
      "Hint 3: Check targetPort in the Service definition: does it match the containerPort where the app listens?",
      "Hint 4: Verify whether backend pods are failing readiness probes and getting removed from active endpoints."
    ]),
    recommendedSolution: `### Step-by-Step Systematic Diagnostic Methodology:

1. **Check Nginx Ingress Controller Logs:**
   - Run: \`kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=100\`
   - Look for upstream lines:
     \`connect() failed (111: Connection refused) while connecting to upstream, client: 1.2.3.4, server: app.example.com, upstream: "10.244.2.45:8080"\`
   - This proves Nginx reached the pod IP \`10.244.2.45\`, but port \`8080\` refused connection.

2. **Verify Kubernetes Endpoints:**
   - Run: \`kubectl get endpoints order-service -n production\`
   - If endpoints shows \`<none>\`, no healthy pods are matching the Service selector!
   - Verify pod labels match Service \`spec.selector\`:
     \`kubectl get pods -n production --show-labels\`

3. **Verify Port Alignment (Service vs Container):**
   - Inspect Service definition:
     \`\`\`yaml
     spec:
       ports:
         - port: 80
           targetPort: 3000 # Must match application listening port!
     \`\`\`
   - If \`targetPort\` was configured as 8080 but application listens on port 3000, Nginx receives connection refused (502).

4. **Inspect Pod Readiness Probes:**
   - Run: \`kubectl describe pod <pod-name> -n production\`
   - Check Events: \`Readiness probe failed: HTTP probe failed with statuscode: 500\`.
   - If the readiness probe fails, Kubernetes immediately removes the pod IP from the Service endpoints list to stop sending traffic.

5. **Test Backend Pod Directly via Port-Forward:**
   - Run: \`kubectl port-forward pod/<pod-name> 8080:3000 -n production\`
   - Curl locally: \`curl -v http://localhost:8080/health\`
   - Confirm backend returns HTTP 200 OK before routing through Ingress.`,
    tagsJson: JSON.stringify(["Kubernetes", "Ingress", "502 Bad Gateway", "Services", "Networking"])
  },
  {
    moduleNumber: 19,
    title: "Scenario: Kubernetes Pod Stuck in 'Pending' State: 0/3 Nodes Available",
    difficulty: "Intermediate",
    prompt: "You applied a new deployment YAML for a machine learning inference worker. The pod never starts and remains stuck in 'Pending' state indefinitely. Running 'kubectl describe pod' shows: '0/3 nodes are available: 3 Insufficient cpu, 1 node(s) had untolerated taint'. How would you systematically diagnose and resolve this scheduling deadlock?",
    explanation: "The kube-scheduler evaluates all worker nodes against pod resource requests, node selectors, taints/tolerations, and affinity rules. If no node meets all criteria simultaneously, the pod remains in Pending until cluster capacity changes.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect pod resource requests in YAML: are requests set unrealistically high?",
      "Hint 2: Check node allocatable CPU and current utilization with 'kubectl describe nodes'.",
      "Hint 3: Inspect node taints using 'kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints'.",
      "Hint 4: Consider Cluster Autoscaler or Karpenter to spin up additional EC2 worker nodes."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Analyze Scheduler Failure Message:**
   - Run: \`kubectl describe pod <pod-name>\`
   - Scheduler Event: \`0/3 nodes are available: 3 Insufficient cpu, 1 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }\`.
   - Interpretation:
     - 1 node is the Control Plane (master) node, which has a taint preventing general workloads.
     - The remaining 2 worker nodes have all their allocatable CPU already reserved by existing pod requests.

2. **Check Current Node Resource Allocations:**
   - Run: \`kubectl top nodes\`
   - Run: \`kubectl describe nodes | grep -A 8 "Allocated resources"\`
   - Check the **CPU Requests** percentage. If existing pods requested 95% of node CPU, new pods cannot be scheduled, even if actual CPU usage is low!

3. **Right-Size Pod Resource Requests:**
   - Check deployment manifest:
     \`\`\`yaml
     resources:
       requests:
         cpu: "4000m" # Requests 4 entire CPU cores!
     \`\`\`
   - If worker nodes are \`t3.large\` (2 vCPUs), a 4-core request is physically impossible to schedule on any single node!
   - Adjust realistic request:
     \`\`\`yaml
     resources:
       requests:
         cpu: "500m" # 0.5 CPU
         memory: "512Mi"
       limits:
         cpu: "2000m"
         memory: "2Gi"
     \`\`\`

4. **Verify Cluster Autoscaling (AWS EKS):**
   - If high compute is genuinely required, verify that **Karpenter** or **Cluster Autoscaler** is active:
     \`kubectl get pods -n kube-system -l app=cluster-autoscaler\`
   - Autoscaler will detect pending pods and provision a new EC2 worker instance automatically.

5. **Verify Pod Schedules Successfully:**
   - Apply updated manifest: \`kubectl apply -f worker-deployment.yaml\`
   - Check status: \`kubectl get pods -w\` -> Status transitions from \`Pending\` to \`Running\`.`,
    tagsJson: JSON.stringify(["Kubernetes", "Pending Pod", "Scheduling", "Resource Requests", "Tolerations"])
  },
  {
    moduleNumber: 19,
    title: "Scenario: Kubernetes 'ImagePullBackOff' with Private Amazon ECR Repository",
    difficulty: "Intermediate",
    prompt: "You pushed a newly built container image to a private Amazon ECR repository ('123456789012.dkr.ecr.us-east-1.amazonaws.com/api:v1.0.0') and deployed it to your Kubernetes cluster. The pod immediately fails to start with: 'ImagePullBackOff: Failed to pull image ... rpc error: code = Unknown desc = failed to pull and unpack image ... 401 Unauthorized'. How do you resolve this container registry authentication failure?",
    explanation: "Worker nodes (specifically kubelet) must authenticate with Amazon ECR to pull private images. ECR tokens expire after 12 hours. The cluster must use an imagePullSecret or IAM Roles for Service Accounts / EC2 Node Instance Roles with AmazonEC2ContainerRegistryReadOnly policy.",
    hintsJson: JSON.stringify([
      "Hint 1: Inspect the exact error message with 'kubectl describe pod <pod-name>'.",
      "Hint 2: Verify the worker node EC2 IAM Role has AmazonEC2ContainerRegistryReadOnly attached.",
      "Hint 3: On non-EKS clusters, verify a Kubernetes Secret of type 'docker-registry' exists and is referenced under 'imagePullSecrets'.",
      "Hint 4: Verify the image tag actually exists in the target AWS Region and account."
    ]),
    recommendedSolution: `### Step-by-Step Resolution Methodology:

1. **Confirm Exact Image URI and Tag:**
   - Run: \`aws ecr describe-images --repository-name api --region us-east-1\`
   - Verify that tag \`v1.0.0\` actually exists and is not misspelled in the deployment YAML.

2. **If Running on Amazon EKS (AWS Native):**
   - Check the IAM Role attached to the EKS Worker Node Group:
     - The Node IAM Role MUST have the AWS-managed policy:
       \`arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly\`
   - With this policy attached, the Kubelet on each EKS node uses native AWS credential providers to fetch temporary authorization tokens automatically without any imagePullSecrets!

3. **If Running on Self-Managed / On-Prem Kubernetes:**
   - Generate a dynamic Kubernetes docker-registry secret from active AWS credentials:
     \`\`\`bash
     TOKEN=$(aws ecr get-login-password --region us-east-1)
     kubectl create secret docker-registry ecr-secret \\
       --docker-server=123456789012.dkr.ecr.us-east-1.amazonaws.com \\
       --docker-username=AWS \\
       --docker-password=$TOKEN \\
       --namespace=production
     \`\`\`
   - Add the secret to the pod spec in \`deployment.yaml\`:
     \`\`\`yaml
     spec:
       imagePullSecrets:
         - name: ecr-secret
     \`\`\`

4. **Verify Resolution:**
   - Delete the failed pod: \`kubectl delete pod <pod-name> -n production\`
   - Deployment recreates pod: Status transitions to \`ContainerCreating\` -> \`Running\`.`,
    tagsJson: JSON.stringify(["Kubernetes", "ImagePullBackOff", "AWS ECR", "Authentication", "DevOps"])
  },
  {
    moduleNumber: 2,
    title: "Scenario: S3 AccessDenied Error Despite IAM AdministratorAccess Policy",
    difficulty: "Advanced",
    prompt: "A DevOps engineer has the AWS-managed 'AdministratorAccess' policy attached to their IAM user. However, when attempting to download an object from an internal compliance bucket ('aws s3 cp s3://company-audit-vault/2026/report.pdf .'), the command fails with: 'An error occurred (AccessDenied) when calling the GetObject operation'. How can an administrator be denied access, and how do you systematically isolate which security boundary is blocking the request?",
    explanation: "IAM policy evaluation is a multi-layered engine. An identity having AdministratorAccess can still be denied by an S3 Bucket Policy explicit deny, an AWS Organizations Service Control Policy (SCP), an IAM Permission Boundary, or lack of KMS Decrypt permissions on a CMK.",
    hintsJson: JSON.stringify([
      "Hint 1: Check if the S3 bucket is encrypted with an AWS KMS Customer Managed Key (CMK). AdministratorAccess on S3 does not grant kms:Decrypt on CMKs with restrictive key policies!",
      "Hint 2: Inspect the S3 Bucket Policy for an Explicit Deny statement.",
      "Hint 3: Check if the AWS account belongs to an AWS Organization with a Service Control Policy (SCP) blocking S3 access.",
      "Hint 4: Check if the IAM user has a Permissions Boundary attached."
    ]),
    recommendedSolution: `### Step-by-Step Diagnostic & Resolution Methodology:

1. **Check S3 Object Encryption & KMS Key Policy (Most Common Cause):**
   - Run: \`aws s3api head-object --bucket company-audit-vault --key 2026/report.pdf\`
   - Check \`ServerSideEncryption\`: Look for \`aws:kms\` and \`SSEKMSKeyId\`.
   - When an object is encrypted with a **Customer Managed Key (CMK)**, access requires BOTH \`s3:GetObject\` AND \`kms:Decrypt\`.
   - AWS KMS key policies are restrictive by default. Even an IAM Administrator cannot decrypt data unless the **KMS Key Policy** explicitly delegates permissions to the root account (\`arn:aws:iam::123456789012:root\`) or grants access to the engineer's role.
   - **Fix:** Update KMS Key Policy to allow \`kms:Decrypt\` for the authorized role.

2. **Inspect S3 Bucket Policy for Explicit Deny:**
   - Run: \`aws s3api get-bucket-policy --bucket company-audit-vault --query Policy -o text | jq .\`
   - Look for statements with \`"Effect": "Deny"\` (e.g. denying non-VPC requests or requiring HTTPS):
     \`\`\`json
     "Condition": { "Bool": { "aws:SecureTransport": "false" } }
     \`\`\`
   - If sending plain HTTP requests or calling from outside an allowed VPC Endpoint, the Explicit Deny overrides all allows!

3. **Check IAM Permissions Boundary:**
   - In IAM Console -> Inspect the calling user/role -> **Permissions Boundary**.
   - If a boundary is set, actions NOT allowed in the boundary are implicitly denied, even with \`AdministratorAccess\`.

4. **Check AWS Organizations Service Control Policies (SCPs):**
   - Check if an OU-level SCP restricts access to sensitive compliance vaults from specific developer accounts.

5. **Verify Resolution:**
   - Once \`kms:Decrypt\` is granted in KMS key policy and client uses HTTPS:
     \`aws s3 cp s3://company-audit-vault/2026/report.pdf . --sse aws:kms\`
   - Download succeeds with HTTP 200 OK.`,
    tagsJson: JSON.stringify(["AWS IAM", "Amazon S3", "AWS KMS", "AccessDenied", "Security"])
  }
];

