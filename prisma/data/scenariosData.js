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
  }
];
