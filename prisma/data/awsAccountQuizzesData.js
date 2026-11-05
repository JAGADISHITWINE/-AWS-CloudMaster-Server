/**
 * Dedicated Quizzes & Assessments for Module 1: AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure
 * Aligned with the MicroDegree AWS Account Creation Guide
 */

const awsAccountQuizzes = [
  // ==========================================
  // TOPIC 1: AWS Free Tier Account Creation, Root Security & IAM Best Practices
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Beginner",
    title: "AWS Account Registration Payment Card Verification",
    prompt: "During AWS account registration, why does AWS request international payment card details even when selecting the Free Tier plan, and what financial transaction actually takes place?",
    explanation: "AWS requires a valid payment card to verify customer identity and curb automated free-tier abuse. AWS initiates a temporary pre-authorization ping of ~₹2 INR (or $1 USD) which is automatically refunded/voided immediately.",
    hintsJson: JSON.stringify(["It verifies identity, not an immediate subscription fee.", "The small verification charge is refunded automatically."]),
    options: [
      { optionKey: "A", optionText: "AWS charges a non-refundable $100 registration deposit.", isCorrect: false },
      { optionKey: "B", optionText: "AWS charges a small temporary authorization fee (~₹2 or $1) that is automatically refunded, purely to verify identity and curb automated abuse.", isCorrect: true },
      { optionKey: "C", optionText: "Payment cards are required only for enterprise accounts, not individual accounts.", isCorrect: false },
      { optionKey: "D", optionText: "AWS withdraws funds to purchase Amazon stock on your behalf.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Root Account Multi-Factor Authentication (MFA) Priority",
    prompt: "What is the very first and highest-priority security action an engineer must perform immediately after creating a new AWS account?",
    explanation: "Securing the Root user with Multi-Factor Authentication (MFA) is top priority because the root user has unrestricted omnipotence over the entire account, all billing, and all resources.",
    hintsJson: JSON.stringify(["Think about the supreme account credentials.", "What prevents password-only compromises?"]),
    options: [
      { optionKey: "A", optionText: "Launch an EC2 instance in every available region.", isCorrect: false },
      { optionKey: "B", optionText: "Enable Multi-Factor Authentication (MFA) on the Root Account and create an IAM User for daily tasks.", isCorrect: true },
      { optionKey: "C", optionText: "Generate permanent root access keys and commit them to Git.", isCorrect: false },
      { optionKey: "D", optionText: "Upgrade immediately to the $15,000 Enterprise Support plan.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Beginner",
    title: "AWS Support Plan Selection for Learning & Beginners",
    prompt: "During the AWS signup workflow, which Support Plan is cost-free ($0/month) and includes 24/7 customer service and Personal Health Dashboard access?",
    explanation: "The Basic Support plan is 100% free of cost and includes 24/7 access to customer service and billing support, documentation, and the Personal Health Dashboard.",
    hintsJson: JSON.stringify(["The plan is called 'Basic Support - Free'."]),
    options: [
      { optionKey: "A", optionText: "Developer Support ($29/month)", isCorrect: false },
      { optionKey: "B", optionText: "Business Support ($100/month)", isCorrect: false },
      { optionKey: "C", optionText: "Basic Support (Free of cost)", isCorrect: true },
      { optionKey: "D", optionText: "Enterprise On-Ramp Support", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "AWS Budgets Threshold Guardrails",
    prompt: "An engineer wants an immediate automated email notification if total monthly AWS spending crosses $1.00 USD. Which AWS service is purpose-built to configure this exact guardrail?",
    explanation: "AWS Budgets allows setting custom cost and usage limits that trigger automated email notifications or SNS alerts when actual or forecasted charges exceed the defined threshold (e.g. $1.00).",
    hintsJson: JSON.stringify(["It has 'Budgets' in the service name.", "Found under Billing & Cost Management."]),
    options: [
      { optionKey: "A", optionText: "Amazon Inspector", isCorrect: false },
      { optionKey: "B", optionText: "AWS Budgets", isCorrect: true },
      { optionKey: "C", optionText: "AWS Artifact", isCorrect: false },
      { optionKey: "D", optionText: "Amazon Macie", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Amazon EC2 Free Tier Monthly Hour Allocation",
    prompt: "Under the 12-Months AWS Free Tier, how many combined hours per month of eligible t2.micro or t3.micro EC2 compute instances are included for free?",
    explanation: "The AWS Free Tier provides 750 hours/month of eligible micro instances. Because a 31-day month has 744 hours, exactly one instance can run 24/7 without incurring compute charges.",
    hintsJson: JSON.stringify(["750 hours = 24 hours * 31 days + buffer."]),
    options: [
      { optionKey: "A", optionText: "100 hours per month", isCorrect: false },
      { optionKey: "B", optionText: "750 hours per month", isCorrect: true },
      { optionKey: "C", optionText: "Unlimited hours for all instance types", isCorrect: false },
      { optionKey: "D", optionText: "24 hours per month", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 1,
    topicSlug: "aws-account-creation-root-security-iam",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Unattached Elastic IP Address Billing Rules",
    prompt: "Under what specific condition does AWS charge an hourly penalty fee for an Elastic IP address?",
    explanation: "AWS provides one Elastic IP at no charge while it is attached to a running instance. However, if the instance is stopped or terminated and the Elastic IP remains allocated but unattached, AWS charges an hourly penalty (~$0.005/hr) to discourage IPv4 address hoarding.",
    hintsJson: JSON.stringify(["Think about IPv4 scarcity.", "What happens when an Elastic IP is idle/unattached?"]),
    options: [
      { optionKey: "A", optionText: "When the Elastic IP is attached to a running instance.", isCorrect: false },
      { optionKey: "B", optionText: "When the Elastic IP is allocated to your account but is NOT attached to a running instance.", isCorrect: true },
      { optionKey: "C", optionText: "Only when the Elastic IP receives more than 1 TB of traffic.", isCorrect: false },
      { optionKey: "D", optionText: "Elastic IPs are always 100% free under all conditions forever.", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 2: Accidental Charges Incident Triage, Cost Explorer & AWS Support Refund Resolution
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Root Cause Billing Discovery in AWS Cost Explorer",
    prompt: "You notice an unexpected $50 charge on your account. To isolate exactly which AWS service and which geographic region generated the cost, how should you configure Cost Explorer?",
    explanation: "In Cost Explorer, setting the date range and grouping first by 'Service' identifies the culprit service (e.g. EC2 or RDS). Then grouping by 'Region' reveals the exact datacenter where resources were launched.",
    hintsJson: JSON.stringify(["Use 'Group by' on dimensions: Service and Region."]),
    options: [
      { optionKey: "A", optionText: "Set Group By to 'Availability Zone' and delete your IAM account.", isCorrect: false },
      { optionKey: "B", optionText: "Set the date range to the billing period, Group by 'Service' first, then Group by 'Region', and check the 'Usage Type'.", isCorrect: true },
      { optionKey: "C", optionText: "Reboot the local workstation and check bank statements.", isCorrect: false },
      { optionKey: "D", optionText: "Cost Explorer cannot break down costs by service or region.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Stopped EC2 Instance Lingering EBS Storage Charges",
    prompt: "Why does an AWS account continue to incur charges for an EC2 instance that has been 'Stopped' in the AWS Console for an entire week?",
    explanation: "Stopping an instance halts compute CPU/RAM charges. However, the attached Elastic Block Store (EBS) volume retains provisioned disk space on AWS SAN storage hardware and incurs storage charges (~$0.08-$0.10/GB/month) until explicitly deleted.",
    hintsJson: JSON.stringify(["Stopping an instance does not delete its disk drive (EBS volume)."]),
    options: [
      { optionKey: "A", optionText: "Stopped instances continue to consume CPU and RAM cycles.", isCorrect: false },
      { optionKey: "B", optionText: "Stopping an instance stops hourly compute fees, but the attached EBS volume and snapshots still incur monthly storage costs until deleted.", isCorrect: true },
      { optionKey: "C", optionText: "AWS charges a $10 penalty fee every time an instance is stopped.", isCorrect: false },
      { optionKey: "D", optionText: "The Linux kernel continues to ping the internet while powered down.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Mandatory Prerequisite Before Requesting a Billing Refund",
    prompt: "Before submitting an accidental charges refund ticket to AWS Support, what critical action must the account owner perform first?",
    explanation: "AWS billing specialists verify whether the offending resources have been stopped or terminated before evaluating a refund. If resources are still actively running, billing continues and refund requests are typically declined.",
    hintsJson: JSON.stringify(["Billing keeps running until resources are removed.", "You must stop or delete the resources first."]),
    options: [
      { optionKey: "A", optionText: "Transfer all domains to another registrar.", isCorrect: false },
      { optionKey: "B", optionText: "Stop or terminate all running instances, delete unattached EBS volumes/snapshots, and release Elastic IPs across all regions.", isCorrect: true },
      { optionKey: "C", optionText: "Upgrade to Enterprise Support tier immediately.", isCorrect: false },
      { optionKey: "D", optionText: "Dispute the charge with the credit card bank before contacting AWS.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "AWS Support Case Category for Accidental Usage Disputes",
    prompt: "In the AWS Support Center, which Case Type is 100% free of charge for all AWS customers (including those on the $0 Basic Support plan) for disputing charges and requesting refunds?",
    explanation: "The 'Account and billing support' case type is free for all AWS accounts, allowing customers to communicate with billing specialists via chat or ticket.",
    hintsJson: JSON.stringify(["Look for 'Account and billing support'."]),
    options: [
      { optionKey: "A", optionText: "Technical support (System impaired)", isCorrect: false },
      { optionKey: "B", optionText: "Account and billing support", isCorrect: true },
      { optionKey: "C", optionText: "Infrastructure architecture consulting", isCorrect: false },
      { optionKey: "D", optionText: "Premium TAM escalation", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "AWS Global Identity Resolution & Duplicate Free Tier Detection",
    prompt: "A developer attempts to get a second Free Tier year by creating a new account with a different email address, but re-uses the same mobile number and credit card. Why does AWS mark the new account as 'Free Tier Ineligible'?",
    explanation: "AWS's anti-fraud system links accounts via a multi-factor identity graph: phone numbers, card BINs, billing addresses, and device fingerprints enforce a strict one Free Tier per unique global individual policy.",
    hintsJson: JSON.stringify(["Email is a weak identifier; credit card and phone number create a strong link."]),
    options: [
      { optionKey: "A", optionText: "Because Google Chrome shares email passwords with AWS.", isCorrect: false },
      { optionKey: "B", optionText: "AWS uses an advanced multi-factor identity system linking card details, mobile numbers, and billing addresses to enforce one Free Tier per unique individual.", isCorrect: true },
      { optionKey: "C", optionText: "Free Tier is only available in the United States.", isCorrect: false },
      { optionKey: "D", optionText: "The developer's debit card has expired.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 2,
    topicSlug: "accidental-charges-cost-explorer-support-refunds",
    title: "Predictable Cost Alternative to EC2 After Free Tier Expiration",
    prompt: "When an engineer's 12-month EC2 Free Tier expires and they need a low-cost, predictable virtual private server ($3.50/month) with bundled SSD storage and data transfer, which AWS service is purpose-built for this?",
    explanation: "Amazon Lightsail offers simple, predictable bundled VPS hosting starting at $3.50/month, making it the most cost-effective alternative to raw EC2 after the Free Tier ends.",
    hintsJson: JSON.stringify(["Think of AWS's simplified VPS offering.", "Starts at $3.50/month."]),
    options: [
      { optionKey: "A", optionText: "AWS Snowball Edge", isCorrect: false },
      { optionKey: "B", optionText: "Amazon Lightsail", isCorrect: true },
      { optionKey: "C", optionText: "Amazon EKS Anywhere", isCorrect: false },
      { optionKey: "D", optionText: "AWS Outposts Rack", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 3: AWS Global Infrastructure: Regions, Availability Zones & Edge Infrastructure
  // ==========================================
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Physical Definition of an Availability Zone (AZ)",
    prompt: "What is the physical reality of an AWS Availability Zone (AZ) within a Region?",
    explanation: "An Availability Zone consists of one or more discrete, physical data center buildings with independent power, cooling, and security, connected to other AZs via ultra-low latency optical fiber.",
    hintsJson: JSON.stringify(["An AZ is one or more physical data centers, not just a single server rack."]),
    options: [
      { optionKey: "A", optionText: "An Availability Zone is a software container running in a single server rack.", isCorrect: false },
      { optionKey: "B", optionText: "An Availability Zone consists of one or more discrete physical data centers with independent power, cooling, and physical networking.", isCorrect: true },
      { optionKey: "C", optionText: "An Availability Zone is a country border defined by the United Nations.", isCorrect: false },
      { optionKey: "D", optionText: "An Availability Zone is an edge cache server for video streaming.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "High Availability Architecture Across Availability Zones",
    prompt: "Why does deploying application servers across at least two Availability Zones in the same Region provide high availability?",
    explanation: "Because AZs are physically separated by miles with independent power grids and flood plains, a localized disaster affecting one data center does not impact the surviving AZ.",
    hintsJson: JSON.stringify(["Independent failure domains protect against local power/cooling outages."]),
    options: [
      { optionKey: "A", optionText: "Because AWS gives a 50% discount for multi-AZ deployments.", isCorrect: false },
      { optionKey: "B", optionText: "Because AZs are physically isolated with independent power and flood plains, allowing workloads to failover automatically if one AZ suffers an outage.", isCorrect: true },
      { optionKey: "C", optionText: "Because instances in different AZs share the exact same physical CPU socket.", isCorrect: false },
      { optionKey: "D", optionText: "Because multi-AZ eliminates the need for any data backups.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "CloudFront Edge Locations vs AWS Regions",
    prompt: "What is the primary architectural purpose of AWS Edge Locations compared to AWS Regions?",
    explanation: "Edge Locations are hundreds of globally distributed Points of Presence (PoPs) that cache static and dynamic web content (via CloudFront) and route DNS queries (Route 53) near end users to minimize latency.",
    hintsJson: JSON.stringify(["Think of Content Delivery Networks (CDN) and caching."]),
    options: [
      { optionKey: "A", optionText: "Edge Locations are full data centers where you deploy heavy relational databases.", isCorrect: false },
      { optionKey: "B", optionText: "Edge Locations are points of presence worldwide that cache content close to end users (CloudFront) and route DNS (Route 53) with minimal latency.", isCorrect: true },
      { optionKey: "C", optionText: "Edge Locations are used exclusively for bitcoin mining by AWS.", isCorrect: false },
      { optionKey: "D", optionText: "Edge Locations are physical warehouses where AWS stores magnetic tape backups.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Local Zones Target Use Case",
    prompt: "When should an enterprise architect choose an AWS Local Zone rather than a standard AWS Region?",
    explanation: "AWS Local Zones place compute, storage, and databases close to large metropolitan population centers that lack a full AWS Region, delivering single-digit millisecond latency for local real-time applications.",
    hintsJson: JSON.stringify(["Single-digit millisecond latency to major metropolitan centers."]),
    options: [
      { optionKey: "A", optionText: "When the application requires sub-10ms latency for users in a major city that does not have an AWS Region.", isCorrect: true },
      { optionKey: "B", optionText: "When looking for the cheapest possible storage tier for cold archive data.", isCorrect: false },
      { optionKey: "C", optionText: "When deploying global multi-region Active Directory domain controllers.", isCorrect: false },
      { optionKey: "D", optionText: "When the account has exhausted its default EC2 vCPU limits.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Wavelength 5G Edge Integration",
    prompt: "What unique technical capability distinguishes AWS Wavelength from standard AWS Regions?",
    explanation: "AWS Wavelength embeds AWS compute and storage hardware directly inside telecommunications 5G networks, enabling mobile application traffic to reach cloud compute without leaving the cellular network.",
    hintsJson: JSON.stringify(["5G carrier networks and ultra-low mobile device latency."]),
    options: [
      { optionKey: "A", optionText: "It allows running mainframe COBOL applications in the cloud.", isCorrect: false },
      { optionKey: "B", optionText: "It embeds AWS compute directly inside telecommunication provider 5G networks to deliver ultra-low latency (< 5ms) to mobile devices.", isCorrect: true },
      { optionKey: "C", optionText: "It replaces all fiber optic cables with satellite microwave links.", isCorrect: false },
      { optionKey: "D", optionText: "It provides free unlimited data transfer to the public internet.", isCorrect: false }
    ]
  }
];

module.exports = awsAccountQuizzes;

