/**
 * Dedicated Real-World Troubleshooting Scenarios for Module 1: AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure
 * Aligned with the MicroDegree AWS Account Creation Guide
 *
 * Topic 1: aws-account-creation-root-security-iam (2 scenarios)
 * Topic 2: accidental-charges-cost-explorer-support-refunds (2 scenarios)
 * Topic 3: regions-azs-and-edge-infrastructure (2 scenarios)
 */

module.exports = [
  // ==========================================
  // TOPIC 1: AWS Free Tier Account Creation, Root Security & IAM Best Practices
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    title: "Scenario: Unexpected Monthly Billing Despite All EC2 Instances Being Stopped",
    difficulty: "Beginner",
    prompt: "A student developer creates an AWS Free Tier account, launches an EC2 instance with an attached 80 GB EBS volume and an Elastic IP for testing, and 'stops' the instance at the end of the day. At the end of the month, their credit card is charged $18.50. The student is shocked: 'My instance was stopped 95% of the month! Why did AWS charge me, and how do I prevent this?'",
    explanation: "This scenario exposes the two most common beginner billing traps: (1) Stopping an EC2 instance halts hourly compute ($0/hr), but the underlying Elastic Block Store (EBS) volume continues to incur monthly storage fees ($0.08-$0.10/GB/month beyond the 30 GB free tier), and (2) AWS charges an hourly penalty fee for unattached Elastic IPs (~$0.005/hr).",
    hintsJson: JSON.stringify([
      "Does stopping an EC2 virtual machine delete its attached hard drive (EBS volume)?",
      "What is the maximum EBS storage capacity included in the AWS Free Tier (30 GB)?",
      "Does AWS charge for Elastic IP addresses when they are NOT associated with a running instance?",
      "What command releases an unassociated Elastic IP back to AWS?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Resolution:

#### 1. The Two Underlying Root Causes:
1. **The Stopped Instance Storage Trap:**
   - Stopping an EC2 instance halts virtual CPU and RAM billing.
   - However, the **EBS Volume (80 GB)** remains provisioned on AWS SAN hardware holding the operating system and data.
   - The AWS Free Tier provides **30 GB** of free EBS storage.
   - Billed EBS Storage: $80\\text{ GB} - 30\\text{ GB} = \\mathbf{50\\text{ GB billable storage}}$ at ~\\$0.10/GB = **\\$5.00/month**.
2. **The Unattached Elastic IP Address Penalty:**
   - IPv4 public addresses are scarce. AWS allows 1 free Elastic IP **only while attached to a running instance**.
   - When the instance is stopped, the Elastic IP becomes **unattached**.
   - AWS bills unattached Elastic IPs at **\\$0.005 per hour**:
     $$720\\text{ hours} \\times \\$0.005 = \\mathbf{\\$3.60/month}$$

#### 2. Diagnostic CLI Commands:
\`\`\`bash
# 1. Identify all unattached Elastic IPs incurring hourly penalties:
aws ec2 describe-addresses --query 'Addresses[?InstanceId==null].{IP:PublicIp,AllocId:AllocationId}' --output table

# 2. Identify all provisioned EBS volumes exceeding Free Tier:
aws ec2 describe-volumes --query 'Volumes[*].{ID:VolumeId,Size:Size,State:State,Type:VolumeType}' --output table
\`\`\`

#### 3. Step-by-Step Resolution:
1. **Release the Unattached Elastic IP:**
   \`\`\`bash
   aws ec2 release-address --allocation-id <AllocationId>
   \`\`\`
2. **Terminate the Instance or Downsize EBS Volume:**
   - If the instance is no longer needed, terminate it:
     \`\`\`bash
     aws ec2 terminate-instances --instance-ids <InstanceId>
     \`\`\`
   - Delete any remaining unattached volumes:
     \`\`\`bash
     aws ec2 delete-volume --volume-id <VolumeId>
     \`\`\`
3. **Deploy a $1.00 Budget Guardrail:**
   - Navigate to **AWS Billing -> Budgets** and configure a monthly $1.00 spending threshold to catch unexpected fees immediately.`,
    tagsJson: JSON.stringify(["AWS Account", "Free Tier", "Billing", "EC2", "EBS", "Elastic IP", "Cost Optimization"])
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    title: "Scenario: New Account Creation Blocked with 'Free Tier Ineligible' Status",
    difficulty: "Intermediate",
    prompt: "An engineer in Bengaluru creates a brand-new AWS account using a fresh personal email (newdeveloper2026@gmail.com). Upon entering the console and navigating to the Billing Dashboard, the Free Tier section reports: 'Status: Free Tier Ineligible — standard On-Demand pricing applies'. The engineer insists: 'This is a brand new email address that has never touched AWS before! Why is my account flagged as ineligible, and how do I fix it?'",
    explanation: "AWS uses an advanced multi-factor identity and fraud detection engine. A new email address alone does NOT qualify for a new Free Tier. AWS correlates phone numbers, credit card BINs (last 4 digits + billing address), device fingerprints, and geographical data to enforce a strict limit of one Free Tier per unique global individual.",
    hintsJson: JSON.stringify([
      "Can a user create 10 different email addresses to get 10 consecutive Free Tier years with the same debit card?",
      "What primary factors does AWS use to verify a customer's global identity (phone number, card PAN/address, IP patterns)?",
      "What is the recommended solution according to the AWS Account Creation Guide (recover original account vs support ticket)?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Resolution:

#### 1. The Myth vs The Reality:
- **The Myth:** "New Email Address = New AWS Free Tier."
- **The Reality:** Free Tier costs AWS ~$100 Million annually. To prevent commercial abuse and bot farming for free compute/GPUs, AWS uses a multi-factor identity graph:
  - **Primary Identity Anchors:** Mobile phone number (+91...), credit/debit card last 4 digits + cardholder billing address, and bank BIN.
  - **Secondary Anchors:** Browser device fingerprint, IP subnets, and linked developer accounts (e.g. GitHub SSO).
- Because the engineer entered the same phone number, physical address, and payment card as an older account created years ago, the fraud prevention engine flagged the account as a duplicate identity and revoked Free Tier promotional trial credits.

#### 2. Recommended Action Plan (3 Pathways):

##### Pathway 1: Recover Original Account (90%+ Success Rate - Best Option)
1. Navigate to **https://signin.aws.amazon.com/**.
2. Select **Root user** and click **Forgot password?**.
3. Input the original email address used previously.
4. Complete mobile SMS/email OTP verification and reset the master password.
5. Immediately activate Virtual MFA and resume using the original account.

##### Pathway 2: Open an AWS Support Account Merge Ticket
1. In the new account, navigate to **Support -> Support Center -> Create case**.
2. Case Type: **Account and billing support** -> **Account** -> **Activation/Ineligibility**.
3. Submit the following explanation:
   \`\`\`text
   Hello AWS Support Team,
   I previously created an account under [Old Email] and lost credentials. I created this new account [Account ID] under the same identity and received a 'Free Tier Ineligible' flag. Could you please assist in recovering access to my primary account or linking my billing identity?
   \`\`\`

##### Pathway 3: Operate as a Budgeted Paid Account
- If the original account cannot be recovered, keep the new account on pay-as-you-go, but:
  1. Stick strictly to Always-Free services (AWS Lambda: 1M invocations/mo, Amazon DynamoDB: 25 GB storage).
  2. Use Amazon Lightsail ($3.50/month predictable VPS).
  3. Configure an AWS Budget alert with a strict $5.00 ceiling.`,
    tagsJson: JSON.stringify(["AWS Account", "Free Tier Ineligible", "Fraud Detection", "Identity Verification", "Account Recovery"])
  },

  // ==========================================
  // TOPIC 2: Accidental Charges Incident Triage, Cost Explorer & AWS Support Refund Resolution
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Scenario: Accidental High-Spec GPU Instance (p3.2xlarge) in a Forgotten Region",
    difficulty: "Intermediate",
    prompt: "A cloud student clones an open-source machine learning tutorial from GitHub. The deployment script launches an Amazon EC2 `p3.2xlarge` GPU instance ($3.06/hour) in `eu-west-1` (Ireland). The student only works in `us-east-1` (N. Virginia) and closes their laptop. Seven days later, their bank alerts them of a $514.08 credit card charge. Walk through the exact forensic diagnosis in Cost Explorer, the immediate containment protocol, and how to file a successful one-time refund appeal with AWS Support.",
    explanation: "Tests incident triage for runaway cloud costs: using Cost Explorer to uncover multi-region usage, executing clean resource termination across all regions, and leveraging AWS Support Center's free billing support to request a courtesy one-time exception refund.",
    hintsJson: JSON.stringify([
      "How do you configure Cost Explorer (Time Period, Granularity, Group By) to isolate the exact service and region causing charges?",
      "Why must resources be stopped or terminated BEFORE opening a billing support ticket?",
      "Is AWS Account and Billing support free for Basic Support plan accounts?",
      "What 4 key elements must be included in a professional refund appeal letter?"
    ]),
    recommendedSolution: `### Emergency Incident Triage & Resolution:

#### Step 1: Forensic Root Cause Analysis in Cost Explorer:
1. Open **AWS Billing & Cost Management** -> **Cost Explorer**.
2. Set Time Range to the last 14 days.
3. Set **Granularity** to **Daily**.
4. Set **Group By** to **Service** -> Immediately highlights Amazon EC2 as the source of the $514 charge.
5. Change **Group By** to **Region** -> Highlights \`eu-west-1\` (Europe Ireland) as the active datacenter.
6. Change **Group By** to **Usage Type** -> Identifies \`BoxUsage:p3.2xlarge\` (GPU Compute).

#### Step 2: Immediate Containment Protocol (Stop the Bleeding!):
Charges accumulate every second until instances and disks are destroyed:
\`\`\`bash
# 1. Switch region to eu-west-1 and terminate the GPU instance immediately:
aws ec2 terminate-instances --region eu-west-1 --instance-ids $(aws ec2 describe-instances --region eu-west-1 --filters Name=instance-state-name,Values=running --query 'Reservations[*].Instances[*].InstanceId' --output text)

# 2. Delete attached EBS volumes:
aws ec2 describe-volumes --region eu-west-1 --filters Name=status,Values=available --query 'Volumes[*].VolumeId' --output text | xargs -n 1 -I {} aws ec2 delete-volume --region eu-west-1 --volume-id {}

# 3. Sweep all 30+ regions to confirm zero running workloads:
for r in $(aws ec2 describe-regions --query 'Regions[*].RegionName' --output text); do
  c=$(aws ec2 describe-instances --region $r --filters Name=instance-state-name,Values=running --query 'length(Reservations[*].Instances[*])')
  [ "$c" -gt 0 ] && echo "WARNING: Running instance found in $r!"
done
\`\`\`

#### Step 3: File an AWS Support Case for One-Time Courtesy Refund:
1. In the console, go to **Support -> Support Center -> Create case**.
2. Select **Account and billing support** (100% free for all accounts).
3. Contact Method: **Live Chat** (fastest response) or **Web Ticket** (< 24 hr SLA).
4. **Professional Refund Appeal Template:**
   \`\`\`text
   Hello AWS Billing Support Team,

   I am a student and new AWS Free Tier user learning cloud engineering. I cloned an educational tutorial script that inadvertently launched a p3.2xlarge GPU instance in eu-west-1 without my knowledge, resulting in an unexpected charge of $514.08.

   As soon as I received my bank notification, I conducted a full audit across all AWS regions and immediately terminated the instance, deleted all EBS storage volumes, and verified that zero resources are running in any region.

   I have also configured an AWS Budget alert with a $1.00 threshold to prevent this from ever happening again. Since this was an unintentional mistake during learning, I kindly request a one-time courtesy refund or bill credit for this charge.

   Thank you for your understanding and support,
   [Your Name] - AWS Account ID: 123456789012
   \`\`\`

#### Step 4: Outcome:
For first-time users who have demonstrably stopped the runaway resources, AWS billing specialists approve courtesy refunds or credits in over 90% of cases within 24 to 48 hours.`,
    tagsJson: JSON.stringify(["Cost Explorer", "AWS Billing", "Support Case", "Refund Appeal", "EC2", "GPU Instance", "Incident Triage"])
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Scenario: Root Account Compromise Due to Missing MFA & Leaked GitHub Credentials",
    difficulty: "Advanced",
    prompt: "An engineer commits code containing hardcoded root credentials into a public GitHub repository. Within 45 minutes, automated threat actor bots scrape the keys and launch 40 EC2 `c5.24xlarge` cryptocurrency mining instances across Tokyo and São Paulo. The engineer cannot log in because the root password was changed by the attacker. How does the organization respond to regain control, revoke access, and remediate the security incident?",
    explanation: "Advanced incident response question testing credential exposure remediation, AWS Trust & Safety escalation, emergency root account recovery, and forensic eradication.",
    hintsJson: JSON.stringify([
      "Can IAM access keys be issued directly for the Root user?",
      "How do you contact AWS Support when completely locked out of the root console?",
      "What is the role of AWS Trust & Safety in compromised account remediation?",
      "Why is Virtual MFA on the Root user mandatory to prevent credential takeover?"
    ]),
    recommendedSolution: `### Emergency Security Incident Response:

#### 1. Immediate Root Account Reclamation:
1. Navigate to **https://support.aws.amazon.com/support/v1#/case/create?issueType=customer-service**.
2. Select **Account and billing support** -> **Account** -> **Compromised account / Account recovery**.
3. Provide the account ID, registration email, and verified phone number. AWS Trust & Safety initiates high-priority identity verification via phone callback.
4. Once identity is verified, AWS Support forcefully terminates active attacker sessions, resets the root credentials, and transmits a temporary recovery link.

#### 2. Containment & Eradication Protocol:
Once logged back into the root account:
1. **Enable Virtual Multi-Factor Authentication (MFA)** immediately on the Root user.
2. **Delete All Root Access Keys:**
   - Go to **Security Credentials** -> **Access Keys** -> **Delete** all active \`AKIA...\` keys. Root should NEVER possess access keys.
3. **Audit and Purge Compromised IAM Principals:**
   - Check IAM Users and Roles for unauthorized backdoor accounts created by attackers (e.g. \`aws-support-admin\`, \`backup-service\`).
   - Run:
     \`\`\`bash
     aws iam list-users --query 'Users[*].[UserName,CreateDate]' --output table
     \`\`\`
4. **Global Workload Termination:**
   - Execute an automated script across all regions to terminate rogue instances and unauthorized CloudFormation/Terraform stacks.

#### 3. Post-Incident Hardening:
- Implement GitHub Secret Scanning and pre-commit hooks (\`git-secrets\` or \`trufflehog\`) to block API keys before commits are created.
- File an Account & Billing support dispute detailing the compromise, attaching the Git commit audit log to request credit cancellation for fraudulent mining fees.`,
    tagsJson: JSON.stringify(["Root Security", "MFA", "Credential Leak", "Compromised Account", "Incident Response", "AWS Support"])
  },

  // ==========================================
  // TOPIC 3: AWS Global Infrastructure: Regions, Availability Zones & Edge Infrastructure
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    title: "Scenario: Single-AZ Datacenter Flood Causes Complete Enterprise Outage",
    difficulty: "Intermediate",
    prompt: "An e-commerce company deploys its web servers and PostgreSQL database inside a single Availability Zone (`ap-south-1a` in Mumbai) to avoid inter-AZ data transfer fees ($0.01/GB). A freak monsoon storm causes electrical grid failure and localized flooding, taking the `ap-south-1a` data center offline for 6 hours. The website is completely dark. How should the infrastructure be redesigned to survive a catastrophic AZ loss with zero manual intervention?",
    explanation: "Tests foundational high-availability architectural design: multi-AZ load balancing, stateless compute auto-scaling across AZs, and Amazon RDS Multi-AZ synchronous standby replication with automatic DNS failover.",
    hintsJson: JSON.stringify([
      "What is the difference between a Region failure and an Availability Zone failure?",
      "How does an Application Load Balancer distribute traffic across multiple subnets in different AZs?",
      "How does Amazon RDS Multi-AZ achieve zero data loss and automated failover (< 60s)?",
      "What is the network latency penalty between AZs in the same Region (< 2ms)?"
    ]),
    recommendedSolution: `### Resilient Multi-AZ Redesign:

#### 1. Architectural Weakness in the Original Design:
- Deploying into a single AZ represents a **Single Point of Failure (SPOF)**.
- While AWS data centers are engineered with diesel generators and redundant uninterruptible power supplies (UPS), extreme physical events (fires, flooding, civic power grid collapse) can take an entire physical AZ facility offline.
- Saving $0.01/GB in cross-AZ network fees is completely negated by 6 hours of enterprise e-commerce downtime ($50,000+ in lost revenue).

#### 2. The Multi-AZ Production Architecture:
1. **Stateless Compute Layer (EC2 Auto Scaling):**
   - Deploy an **Application Load Balancer (ALB)** spanning **3 Public Subnets** across \`ap-south-1a\`, \`ap-south-1b\`, and \`ap-south-1c\`.
   - Configure an **Auto Scaling Group (ASG)** with a minimum of 3 instances distributed evenly across the 3 Availability Zones.
   - If \`ap-south-1a\` goes completely dark, the ALB automatically marks those instances unhealthy and routes 100% of traffic to surviving healthy instances in AZ-b and AZ-c.
2. **Stateful Database Layer (Amazon RDS Multi-AZ):**
   - Enable **Multi-AZ Deployment** on the RDS PostgreSQL instance.
   - AWS automatically provisions a synchronous Standby replica in a second physical AZ (\`ap-south-1b\`).
   - All database writes are synchronously replicated over the low-latency (< 2ms) dedicated private AWS optical fiber backbone.
   - **Automated Failover:** When \`ap-south-1a\` fails, the RDS service flips the database CNAME record to the standby replica in \`ap-south-1b\` within 60 seconds without requiring database IP changes or application downtime.`,
    tagsJson: JSON.stringify(["Global Infrastructure", "High Availability", "Multi-AZ", "Disaster Recovery", "RDS Multi-AZ", "ALB", "Resilience"])
  },
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    title: "Scenario: Global Latency Penalty: Direct Origin S3 Downloads vs CloudFront Edge Caching",
    difficulty: "Beginner",
    prompt: "A digital media agency hosts product images and video files in an Amazon S3 bucket located in `us-east-1` (N. Virginia). Users in Sydney, Australia and Tokyo, Japan report that image thumbnails take 1.8 seconds to load, resulting in a high bounce rate. The agency asks: 'Must we duplicate our S3 buckets into Australia and Tokyo to fix this, or is there an edge networking solution that delivers fast global access without managing multiple regional buckets?'",
    explanation: "Tests understanding of AWS Edge Infrastructure: using Amazon CloudFront's 450+ Points of Presence (PoPs) to cache origin S3 content near end users globally, avoiding multi-region S3 replication overhead and public internet transit latency.",
    hintsJson: JSON.stringify([
      "What AWS service leverages global Edge Locations for content delivery?",
      "How do requests reach edge caches (Anycast DNS routing to closest Point of Presence)?",
      "What is the difference between an Edge Location and an AWS Region?",
      "How does CloudFront Origin Access Control (OAC) keep the central S3 bucket private?"
    ]),
    recommendedSolution: `### Global Latency Optimization Architecture:

#### 1. Root Cause of Global Latency:
- Sydney, Australia is ~9,500 miles away from \`us-east-1\` (N. Virginia).
- Every TCP and TLS handshake must traverse 15 to 20 intermediate public internet router hops under the Pacific Ocean, introducing 220ms+ of physical speed-of-light network latency per round-trip.
- With HTTP/1.1 or unoptimized TLS, multiple round trips delay asset delivery by 1.8+ seconds.

#### 2. The Solution: Amazon CloudFront Content Delivery Network (CDN):
- Instead of provisioning and synchronizing duplicate S3 buckets in Sydney and Tokyo, deploy an **Amazon CloudFront Distribution**:
  1. **450+ Points of Presence (PoPs):** CloudFront automatically routes Sydney users to the Sydney Edge Location and Tokyo users to the Tokyo Edge Location using Anycast DNS.
  2. **Cache Hit Performance:** When a user requests an asset that has already been cached at the edge, response time drops from 1,800ms to **under 15 milliseconds**.
  3. **AWS Private Backbone for Cache Misses:** When an asset is requested for the first time, the Edge Location fetches the file from the \`us-east-1\` S3 origin over the dedicated, optimized **AWS Private Transoceanic Fiber Backbone**, completely bypassing the congested public internet.
  4. **Security Hardening (Origin Access Control - OAC):** Configure S3 bucket policies so the bucket rejects direct public internet access and only accepts signed requests from the CloudFront distribution service principal.`,
    tagsJson: JSON.stringify(["Global Infrastructure", "Edge Locations", "CloudFront", "CDN", "S3", "Latency Optimization"])
  }
];

