/**
 * Dedicated Technical Interview Questions for Module 1: AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure
 * Aligned with the MicroDegree AWS Account Creation Guide
 */

module.exports = [
  // ==========================================
  // TOPIC 1: AWS Free Tier Account Creation, Root Security & IAM Best Practices
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    title: "Why Must the AWS Root User Never Be Used for Daily Tasks, and How Do You Secure It?",
    difficulty: "Beginner",
    prompt: "An interviewer asks: 'Why is it considered a critical security violation in enterprise cloud engineering to use the AWS Root Account for everyday development or CLI commands? Walk through the specific architectural vulnerabilities and the exact 4-step hardening procedure.'",
    explanation: "Tests foundational cloud governance and identity principles: understanding that Root has unrestricted, unblockable omnipotence across billing and resources, and the mandatory procedure to lock Root with MFA and delegate authority to IAM roles/users.",
    hintsJson: JSON.stringify([
      "Explain the omnipotent nature of the root user: can it be restricted by IAM policies?",
      "Mention Multi-Factor Authentication (MFA) and credential isolation.",
      "Explain the creation of an IAM administrator user.",
      "Explain why root access keys (AKIA...) should NEVER be generated."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. Why Using the Root Account is a Fatal Security Violation:
- **Unrestricted Omnipotence:** The Root user identity is tied to the account registration email. It bypasses **ALL** IAM permission policies, Service Control Policies (SCPs), and permission boundaries. If root credentials leak, the attacker has absolute, unrevocable control over the entire AWS account.
- **No Least Privilege:** Operating as root violates the principle of least privilege. An accidental \`aws s3 rm s3://bucket --recursive\` or \`aws ec2 terminate-instances\` cannot be blocked or denied by policy guardrails.
- **Non-Auditable Operations:** Individual team members using root share a single identity, making CloudTrail audit logs useless for non-repudiation (you cannot tell which engineer executed an action).
- **Billing Destruction Risk:** Only the root user can close the AWS account, change support plans, or transfer ownership.

#### 2. The 4-Step Production Hardening Protocol:
1. **Enable Virtual or Hardware MFA on Root:**
   - Configure a Time-Based One-Time Password (TOTP) authenticator app (Authy, 1Password) or a hardware FIDO security key (YubiKey).
2. **Lock Away Root Master Password:**
   - Use a high-entropy 24+ character generated passphrase stored exclusively in the corporate enterprise password vault (e.g. HashiCorp Vault, Bitwarden).
3. **Zero Root Access Keys:**
   - Verify that **NO access keys** (\`AKIA...\`) are generated for the root user. If any exist, delete them immediately.
4. **Delegate Authority via IAM / AWS IAM Identity Center:**
   - Create IAM users or federated Identity Center roles with \`AdministratorAccess\` for initial setup, and role-based least-privilege policies for daily engineering. Root is only accessed for rare account-level tasks (e.g. changing billing payment methods or updating root email).`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Root Omnipotence & Risk", weight: 30, description: "Explains that Root bypasses IAM policies/SCPs and has irrevocable full control." },
        { name: "Lack of Auditing & Least Privilege", weight: 25, description: "Mentions non-repudiation failure in CloudTrail and lack of guardrails." },
        { name: "MFA Hardening & Zero Access Keys", weight: 25, description: "Details enabling hardware/virtual MFA and prohibiting root programmatic API keys." },
        { name: "Delegation to IAM", weight: 20, description: "Explains creating IAM admin users/roles for daily tasks." }
      ]
    }),
    tagsJson: JSON.stringify(["AWS Account", "Root User", "IAM", "MFA", "Security", "Interview"])
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    title: "Demystifying the AWS Free Tier: Credit Trials, 12-Month Limits & Always-Free Services",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Many engineers get surprised by unexpected AWS bills because they misunderstand how Free Tier works. Explain the 3 distinct categories of AWS Free Tier offerings, give concrete examples of each, and explain the mathematical billing trap of running two t2.micro EC2 instances concurrently.'",
    explanation: "Tests thorough knowledge of AWS pricing models, the three tiers of Free Tier (Trials, 12-Months Free, Always Free), and consumption calculation.",
    hintsJson: JSON.stringify([
      "List the three categories: Short-term Trials / Credit Tier, 12-Months Free, and Always Free.",
      "Give examples for each tier (EC2 750h, S3 5GB, Lambda 1M requests, DynamoDB 25GB).",
      "Calculate 2 instances * 24 hours * 31 days = 1,488 hours vs 750 hour free ceiling."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. The 3 Distinct Categories of AWS Free Tier:

| Free Tier Category | Duration | Description | Concrete Examples |
|---|---|---|---|
| **1. Free Trials & Credit-Based Tier** | Typically 6 months or 30-60 days | Short-term promotional trials or new user credits ($200 credits valid for 6 months) to explore advanced services. | Amazon Redshift (2 months), Amazon SageMaker (2-month free trial), AWS GuardDuty (30-day trial). |
| **2. 12-Months Free Tier** | Exactly 12 months from initial account signup date | Available for the first year of account creation. Reverting to standard On-Demand pricing on day 366. | **Amazon EC2:** 750 hours/month of \`t2.micro\` or \`t3.micro\` compute.<br>**Amazon S3:** 5 GB standard storage.<br>**Amazon RDS:** 750 hours/month of Single-AZ \`db.t2.micro\` / \`db.t3.micro\`.<br>**Amazon EBS:** 30 GB of storage. |
| **3. Always-Free Tier** | Indefinite (Never expires, available to all accounts) | Free monthly recurring quotas that remain free forever as long as monthly usage remains within limits. | **AWS Lambda:** 1 Million free requests + 3.2M seconds of compute per month.<br>**Amazon DynamoDB:** 25 GB of NoSQL storage.<br>**Amazon SNS:** 1 Million mobile push notifications/month.<br>**CloudWatch:** 10 custom metrics and 10 alarms. |

#### 2. The Twin t2.micro Mathematical Billing Trap:
- AWS provides **750 hours per month** of eligible compute.
- A single calendar month has $24\\text{ hours/day} \\times 31\\text{ days} = \\mathbf{744\\text{ hours}}$.
- Therefore, **exactly ONE instance** running 24/7 consumes 744 hours and is 100% free!
- **The Trap:** If a developer launches **two** \`t2.micro\` instances and runs both 24/7:
  $$2 \\times 744\\text{ hours} = \\mathbf{1,488\\text{ hours consumed}}$$
  - Free Tier applies to the first 744 hours.
  - The remaining **744 hours** are billed at standard on-demand rate (~$0.0116/hr = ~$8.63/month).
- **Rule of Thumb:** Free tier hours are shared across all instances in that tier.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "3 Free Tier Categories Articulated", weight: 35, description: "Correctly outlines Trials, 12-Months Free, and Always-Free categories." },
        { name: "Service Quotas & Examples", weight: 25, description: "Cites 750h EC2, 5GB S3, 1M Lambda, 25GB DynamoDB accurately." },
        { name: "Mathematical EC2 Calculation", weight: 25, description: "Calculates 2 instances * 744h = 1,488h vs 750h ceiling accurately." },
        { name: "Cost Governance Insight", weight: 15, description: "Highlights importance of setting budget alerts on day one." }
      ]
    }),
    tagsJson: JSON.stringify(["Free Tier", "Pricing", "EC2", "Lambda", "S3", "Cost Governance", "Interview"])
  },

  // ==========================================
  // TOPIC 2: Accidental Charges Incident Triage, Cost Explorer & AWS Support Refund Resolution
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "How to Conduct Forensic Billing Triage in AWS Cost Explorer & Recover from Accidental Charges",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'You log into an AWS account and discover an unexpected $400 charge on the current month's bill. Walk through the exact forensic process using AWS Cost Explorer to find the root cause, explain why stopping EC2 instances does NOT eliminate all charges, and detail how to communicate with AWS Support to successfully secure a refund.'",
    explanation: "Tests real-world incident management for cloud financial operations (FinOps): diagnostic slicing in Cost Explorer, understanding recurring storage/IP charges, and navigating AWS Support Center.",
    hintsJson: JSON.stringify([
      "Explain the difference between Bills and Cost Explorer (filtering by Service, Region, Usage Type).",
      "Detail EBS storage and unattached Elastic IP charges on stopped instances.",
      "Explain why Basic Support includes free Account & Billing support.",
      "Detail the professional refund letter components."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. Forensic Root Cause Discovery in Cost Explorer:
1. Open **AWS Billing -> Cost Explorer** and set granularity to **Daily**.
2. **Dimension Grouping Flow:**
   - **Group by Service:** Isolates the high-spend culprit (e.g. Amazon EC2 vs Amazon RDS vs VPC NAT Gateway).
   - **Group by Region:** Uncovers unexpected multi-region sprawl (e.g. a rogue instance in Frankfurt \`eu-central-1\`).
   - **Group by Usage Type:** Uncovers the exact billing meter (e.g. \`NatGateway-Bytes\`, \`EBS:VolumeUsage.gp3\`, or \`BoxUsage:c5.4xlarge\`).

#### 2. The 'Stopped Instance' Fallacy:
- Stopping an EC2 instance sets compute fees to $0.
- **However, two charges persist:**
  1. **EBS Volumes:** The provisioned virtual disk retains blocks on physical storage hardware and is billed at ~$0.08-$0.10/GB/month until deleted.
  2. **Unattached Elastic IPs:** Because public IPv4 addresses are limited, AWS penalizes idle Elastic IPs with an hourly charge ($0.005/hr = ~$3.60/month).
- **Mandatory Action:** You must **terminate** the instance, **delete** unattached volumes, and **release** Elastic IPs across all regions.

#### 3. Securing an AWS Courtesy Refund:
1. **Access Support Center:** All AWS accounts (including $0 Basic Support) have full, free access to **Account and Billing Support**.
2. **Open a Ticket (or Live Chat):**
   - Category: **Billing -> Dispute a charge / Refund request**.
3. **The 4 Golden Letter Rules:**
   - **Honesty & Role:** State clearly that you are a student/learner and the usage was an accidental mistake.
   - **Proof of Remediation:** Confirm that you have already inspected all regions and terminated/deleted all offending resources (AWS billing specialists verify this before granting refunds!).
   - **Preventative Guardrail:** State that you have configured an AWS Budget ($1.00 threshold) to prevent recurrence.
   - **Polite Request:** Request a one-time courtesy exception refund.
- **Success Rate:** For first-time honest mistakes where resources have been stopped, AWS grants refunds in over 90% of cases.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Cost Explorer Forensic Workflow", weight: 30, description: "Explains grouping by Service, Region, and Usage Type." },
        { name: "Stopped Instance Charges Identified", weight: 25, description: "Explains lingering EBS volume storage and unattached Elastic IP charges." },
        { name: "Resource Containment Pre-requisite", weight: 20, description: "Emphasizes terminating resources before requesting refund." },
        { name: "Support Case Communication", weight: 25, description: "Details polite tone, student context, and budget alert prevention." }
      ]
    }),
    tagsJson: JSON.stringify(["Cost Explorer", "AWS Support", "Billing", "FinOps", "Refunds", "Interview"])
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "The Multi-Factor Identity Engine: Why New Email Addresses Cannot Reset the AWS Free Tier",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'Why does AWS flag accounts as `Free Tier Ineligible` when a student creates a new AWS account with a different email address? How does AWS's multi-factor identity and fraud detection engine work, and what is the legitimate engineering procedure to recover access?'",
    explanation: "Deep dive into AWS identity verification, anti-fraud systems, global entity resolution, and account recovery protocols.",
    hintsJson: JSON.stringify([
      "Explain the difference between an email address (weak identifier) and payment/phone anchors (strong identifiers).",
      "Mention Card BIN, last 4 digits, cardholder name, and billing address matching.",
      "Explain machine learning behavioral detection (device fingerprinting, IP patterns).",
      "Explain password recovery on the original account."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. The Global Identity Engine vs The New Email Myth:
- **The Core Principle:** The AWS Free Tier is granted to a **unique physical individual/business entity**, NOT to an email address.
- If creating a new Gmail allowed a Free Tier reset, malicious actors could spin up thousands of accounts to farm free compute, abuse GPU trials, or bypass reputation controls.
- **The Multi-Factor Correlation Graph:**
  1. **Primary Financial Link (Strongest):** Credit/debit card Bank Identification Number (BIN) + last 4 digits + cardholder legal name + billing postal code.
  2. **Telephony Verification (Strong):** The mobile phone number (+91...) used for SMS/Voice OTP verification.
  3. **Geographical & Device Fingerprint (Medium):** Physical billing address, browser canvas fingerprint, and IP address subnets.
  4. **Machine Learning Behavior:** Similar provisioning patterns and linked services (e.g. connecting the same GitHub account).
- **The Ineligibility Trigger:** When an account registration matches an existing entity in the global identity database, the account creation succeeds, but the system automatically sets \`Free Tier Status: Ineligible\`.

#### 2. The Legitimate Engineering Resolution:
1. **Account Password Recovery (Primary Standard):**
   - Use the AWS Console **Forgot Password** workflow on the original account email.
   - AWS allows identity verification via the recovery mobile number.
   - Once recovered, rotate the root password and activate MFA immediately.
2. **Account Support Merge Request:**
   - If the original email is truly lost (e.g. expired university domain), file a ticket under **Account and Billing Support -> Account Recovery** stating:
     \`\`\`text
     I lost access to my previous account [old-email@domain.com]. I am the same legal individual as account [new-account-id]. Please assist in merging my identity records or verifying my student credentials.
     \`\`\`
   - In regions like India, providing government ID (Aadhaar/PAN) or updated card verification restores good standing within 24-48 hours.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Entity Resolution Concept", weight: 30, description: "Explains Free Tier applies to a unique physical person, not an email." },
        { name: "Identity Graph Multi-Factor Anchors", weight: 35, description: "Identifies card BIN/address, mobile OTP phone, and device fingerprints." },
        { name: "Fraud & Abuse Prevention Context", weight: 15, description: "Explains preventing botnet compute farming and GPU abuse." },
        { name: "Legitimate Recovery Workflow", weight: 20, description: "Details password recovery and support ticket account merge." }
      ]
    }),
    tagsJson: JSON.stringify(["Free Tier", "Anti-Fraud", "Identity Verification", "Account Recovery", "Compliance", "Interview"])
  },

  // ==========================================
  // TOPIC 3: AWS Global Infrastructure: Regions, Availability Zones & Edge Infrastructure
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    title: "Edge Locations vs Local Zones vs Wavelength: Architectural Decision Matrix",
    difficulty: "Advanced",
    prompt: "An architect asks: 'AWS provides Regions, Availability Zones, Edge Locations, Local Zones, and AWS Wavelength. When would you choose an Edge Location versus an AWS Local Zone versus an AWS Wavelength Zone? Compare their hardware placement, network latency, and primary use cases.'",
    explanation: "Advanced cloud networking question testing physical edge topology, ultra-low latency compute placement, and specialized edge infrastructure.",
    hintsJson: JSON.stringify([
      "Explain Edge Locations: 450+ Points of Presence for CloudFront CDN and Route 53 caching.",
      "Explain Local Zones: placing full compute/storage (EC2, EBS) near metropolitan cities for sub-10ms latency.",
      "Explain AWS Wavelength: embedding AWS compute inside 5G telecom carrier data centers for sub-5ms mobile latency.",
      "Contrast CDN static caching vs running active compute code."
    ]),
    recommendedSolution: `### Model Answer:

#### Architectural Decision Matrix:

| Infrastructure Tier | Physical Location | Primary Services Available | Target Latency | Real-World Use Case |
|---|---|---|---|---|
| **Edge Locations (CloudFront PoPs)** | 450+ Points of Presence in major cities worldwide | Amazon CloudFront (CDN), Route 53 (DNS), AWS Shield (DDoS), CloudFront Functions | Milliseconds (cached content delivery) | **Static & Dynamic Web Caching:** Caching images, videos, HTML, and API responses close to global users; terminating TLS connections at the edge. |
| **AWS Local Zones** | Datacenters placed directly in major metropolitan centers lacking full AWS Regions (e.g. Los Angeles, Chicago, Delhi) | Amazon EC2, Amazon EBS, Amazon VPC, ECS, EKS | **Single-digit milliseconds (< 10ms)** to local city users | **Metropolitan Latency-Sensitive Apps:** Real-time gaming game servers, video rendering, live virtual studios, and local hospital health systems requiring local data residency. |
| **AWS Wavelength** | Embedded directly inside 5G telecommunication provider datacenters (Verizon, Vodafone, KDDI, Airtel) | Amazon EC2, Amazon EBS, Amazon VPC, Carrier Gateways | **Ultra-low latency (< 5ms)** to mobile 5G devices | **Mobile Edge Computing:** Autonomous connected vehicles, real-time drone telemetry, mobile AR/VR gaming, smart factory IoT without leaving the cellular network. |

#### Summary Architectural Rule:
- Use **Edge Locations** for caching data and terminating TLS.
- Use **Local Zones** when you need full EC2/EBS compute instances running in a specific city.
- Use **Wavelength** when your users are on mobile 5G devices and every millisecond of cellular network traversal matters.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Edge Location Role", weight: 25, description: "Details 450+ CloudFront PoPs for CDN caching and DNS resolution." },
        { name: "Local Zone Role & Latency", weight: 30, description: "Explains placing EC2/EBS in major cities for sub-10ms latency." },
        { name: "Wavelength 5G Integration", weight: 30, description: "Explains embedding AWS compute in 5G telco networks for sub-5ms mobile access." },
        { name: "Clear Decision Matrix / Summary", weight: 15, description: "Provides clear selection guidelines based on workload requirements." }
      ]
    }),
    tagsJson: JSON.stringify(["Global Infrastructure", "Edge Locations", "Local Zones", "Wavelength", "CloudFront", "5G", "Interview"])
  }
];

