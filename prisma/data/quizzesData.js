module.exports = [
  {
    moduleNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "AWS Region vs Availability Zone Mapping",
    prompt: "Which statement accurately describes how Availability Zone identifiers work across different AWS accounts?",
    explanation: "To prevent all AWS customers from overloading the first AZ in a region (e.g. us-east-1a), AWS coordinates physical data centers with immutable AZ IDs (e.g., use1-az1) and randomly maps letter identifiers (us-east-1a, us-east-1b) per account.",
    hintsJson: JSON.stringify(["Think about why AWS wouldn't want everyone's default 'us-east-1a' pointing to the exact same physical building."]),
    options: [
      { optionKey: "A", optionText: "us-east-1a is physically identical in every single AWS account worldwide.", isCorrect: false },
      { optionKey: "B", optionText: "AWS randomly maps Availability Zone letter names (e.g. us-east-1a) to physical data center AZ IDs (e.g. use1-az1) across accounts to distribute load.", isCorrect: true },
      { optionKey: "C", optionText: "An Availability Zone always consists of exactly one single physical server rack.", isCorrect: false },
      { optionKey: "D", optionText: "Regions are connected via the public internet rather than private fiber.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 2,
    type: "MCQ",
    difficulty: "Beginner",
    title: "IAM Role Credentials Mechanism",
    prompt: "How does an EC2 instance securely obtain temporary credentials when an IAM Role is attached via an Instance Profile?",
    explanation: "The EC2 instance queries the local link-local Instance Metadata Service (IMDS at 169.254.169.254), which uses AWS Security Token Service (STS) to automatically deliver and rotate short-lived security credentials.",
    hintsJson: JSON.stringify(["Look into the Instance Metadata Service IP address (169.254.169.254)."]),
    options: [
      { optionKey: "A", optionText: "The IAM root password is saved in a plaintext configuration file on the instance boot disk.", isCorrect: false },
      { optionKey: "B", optionText: "The instance calls the local Instance Metadata Service (IMDS) at 169.254.169.254, which returns short-lived rotated STS tokens.", isCorrect: true },
      { optionKey: "C", optionText: "AWS sends credentials to the instance via an unencrypted inbound public SSH port.", isCorrect: false },
      { optionKey: "D", optionText: "An administrator must manually SSH into the instance every hour to enter new API keys.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    type: "TRUE_FALSE",
    difficulty: "Intermediate",
    title: "Security Group Return Traffic Statefulness",
    prompt: "True or False: If an inbound rule in an AWS Security Group permits TCP port 443 from 0.0.0.0/0, you MUST also add an explicit outbound rule to allow the response packets to return to the client.",
    explanation: "FALSE. AWS Security Groups are STATEFUL. Return traffic is automatically allowed out regardless of outbound rules. Network ACLs (NACLs), by contrast, are stateless and would require explicit outbound return rules.",
    hintsJson: JSON.stringify(["Remember: Security Groups are STATEFUL, whereas NACLs are STATELESS."]),
    options: [
      { optionKey: "A", optionText: "True", isCorrect: false },
      { optionKey: "B", optionText: "False", isCorrect: true }
    ]
  },
  {
    moduleNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Free Tier VPC Cost Safety",
    prompt: "You are setting up an isolated two-tier web application VPC on an AWS Free Tier account. Which of the following networking components incurs an unavoidable hourly fee of ~$0.045/hour (~$32/month) even if your account is within its first 12 months?",
    explanation: "NAT Gateways are NOT included in the AWS Free Tier and bill ~$0.045/hour plus data processing fees. Internet Gateways, Route Tables, and Security Groups are free.",
    hintsJson: JSON.stringify(["Which component provides outbound internet translation for private subnets?"]),
    options: [
      { optionKey: "A", optionText: "Internet Gateway (IGW)", isCorrect: false },
      { optionKey: "B", optionText: "NAT Gateway", isCorrect: true },
      { optionKey: "C", optionText: "VPC Route Table", isCorrect: false },
      { optionKey: "D", optionText: "Security Group", isCorrect: false }
    ]
  },
  {
    moduleNumber: 4,
    type: "CLI_OUTPUT",
    difficulty: "Beginner",
    title: "EC2 User Data Bootstrapping",
    prompt: "When does the bash script provided in the EC2 'User Data' field execute by default?",
    explanation: "By default in cloud-init on Amazon Linux and Ubuntu, User Data scripts execute once only during the very first boot cycle of the instance launch.",
    hintsJson: JSON.stringify(["Does it run every time you reboot the server or only at initial provisioning?"]),
    options: [
      { optionKey: "A", optionText: "Every single time the instance is stopped and started.", isCorrect: false },
      { optionKey: "B", optionText: "Only once, on the very first boot cycle when the instance is launched.", isCorrect: true },
      { optionKey: "C", optionText: "Every 24 hours as a scheduled cron job.", isCorrect: false },
      { optionKey: "D", optionText: "Only when an administrator connects via SSH.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 5,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "ELB Listener Routing Capability",
    prompt: "You need to route HTTP requests destined for 'example.com/api/*' to a microservices fleet and 'example.com/images/*' to an image-processing cluster. Which AWS Load Balancer type should you deploy?",
    explanation: "Application Load Balancer (ALB) operates at Layer 7 (Application Layer) and natively supports path-based and host-based routing rules.",
    hintsJson: JSON.stringify(["Layer 7 operates on HTTP paths like /api and /images."]),
    options: [
      { optionKey: "A", optionText: "Network Load Balancer (NLB)", isCorrect: false },
      { optionKey: "B", optionText: "Application Load Balancer (ALB)", isCorrect: true },
      { optionKey: "C", optionText: "Gateway Load Balancer (GWLB)", isCorrect: false },
      { optionKey: "D", optionText: "Classic Load Balancer (CLB)", isCorrect: false }
    ]
  },
  {
    moduleNumber: 6,
    type: "MCQ",
    difficulty: "Beginner",
    title: "S3 Lowest Cost Storage Tier",
    prompt: "Which Amazon S3 storage class offers the lowest per-gigabyte monthly storage cost for compliance data that is accessed rarely (once a year or less) and can tolerate retrieval times of 12 hours?",
    explanation: "S3 Glacier Deep Archive is the lowest-cost storage class in the entire cloud (~$0.00099 per GB/month) with standard retrieval times of 12 hours.",
    hintsJson: JSON.stringify(["Look for the storage class with 'Deep Archive' in its name."]),
    options: [
      { optionKey: "A", optionText: "S3 Standard", isCorrect: false },
      { optionKey: "B", optionText: "S3 One Zone-IA", isCorrect: false },
      { optionKey: "C", optionText: "S3 Glacier Instant Retrieval", isCorrect: false },
      { optionKey: "D", optionText: "S3 Glacier Deep Archive", isCorrect: true }
    ]
  },
  {
    moduleNumber: 7,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "EBS vs EFS Architectural Difference",
    prompt: "You have a cluster of 15 web application servers running on EC2 that all require read and write access to a shared POSIX file directory containing user-uploaded profile pictures. Which storage service should you select?",
    explanation: "Amazon Elastic File System (EFS) provides a fully managed shared file system (NFS) that can be mounted simultaneously across hundreds of EC2 instances and containers across multiple Availability Zones. Standard EBS volumes can only attach to one instance in a single AZ at a time.",
    hintsJson: JSON.stringify(["Think about which service supports multi-instance concurrent file sharing over NFS."]),
    options: [
      { optionKey: "A", optionText: "Amazon EBS gp3 Volume", isCorrect: false },
      { optionKey: "B", optionText: "Amazon EFS (Elastic File System)", isCorrect: true },
      { optionKey: "C", optionText: "EC2 Instance Store", isCorrect: false },
      { optionKey: "D", optionText: "AWS Snowball", isCorrect: false }
    ]
  },
  {
    moduleNumber: 8,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Amazon DynamoDB Perpetual Free Tier",
    prompt: "What is the perpetual (always free) monthly allowance included for Amazon DynamoDB on every AWS account?",
    explanation: "Amazon DynamoDB provides a perpetual Free Tier of 25 GB of storage along with 25 Provisioned Write Capacity Units (WCU) and 25 Provisioned Read Capacity Units (RCU) that never expire after 12 months.",
    hintsJson: JSON.stringify(["It includes 25 GB of storage and 25 capacity units."]),
    options: [
      { optionKey: "A", optionText: "1 GB storage for 1 month only", isCorrect: false },
      { optionKey: "B", optionText: "25 GB storage and 25 WCU / 25 RCU perpetually every month", isCorrect: true },
      { optionKey: "C", optionText: "DynamoDB is never free; it charges per second from day 1", isCorrect: false },
      { optionKey: "D", optionText: "100 TB storage for 12 months", isCorrect: false }
    ]
  },
  {
    moduleNumber: 9,
    type: "TRUE_FALSE",
    difficulty: "Intermediate",
    title: "Querying RDS Multi-AZ Standby DB",
    prompt: "True or False: In an Amazon RDS Multi-AZ deployment, you can configure your analytical reporting tool to query the standby database directly to offload read traffic from the primary instance.",
    explanation: "FALSE. The Multi-AZ standby replica is PASSIVE and completely inaccessible for user queries. To offload read traffic, you must create an asynchronous Read Replica, which provides a dedicated read endpoint.",
    hintsJson: JSON.stringify(["Remember: Standby is passive; Read Replicas are for queries."]),
    options: [
      { optionKey: "A", optionText: "True", isCorrect: false },
      { optionKey: "B", optionText: "False", isCorrect: true }
    ]
  },
  {
    moduleNumber: 10,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "AWS Lambda Maximum Execution Ceiling",
    prompt: "What is the maximum hard timeout limit for a single execution of an AWS Lambda function?",
    explanation: "AWS Lambda functions can execute for a maximum of 15 minutes (900 seconds). For tasks exceeding 15 minutes, architectures should use AWS Step Functions, ECS tasks, or AWS Batch.",
    hintsJson: JSON.stringify(["It is exactly 15 minutes (900 seconds)."]),
    options: [
      { optionKey: "A", optionText: "60 seconds", isCorrect: false },
      { optionKey: "B", optionText: "5 minutes", isCorrect: false },
      { optionKey: "C", optionText: "15 minutes", isCorrect: true },
      { optionKey: "D", optionText: "Unlimited", isCorrect: false }
    ]
  },
  {
    moduleNumber: 11,
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Fargate Serverless Compute",
    prompt: "What is the main operational benefit of using AWS Fargate with Amazon ECS or Amazon EKS?",
    explanation: "AWS Fargate is a serverless compute engine for containers. It eliminates the need to provision, configure, patch, scale, or manage the underlying EC2 virtual machine cluster.",
    hintsJson: JSON.stringify(["Focus on what you no longer have to manage (EC2 instances)."]),
    options: [
      { optionKey: "A", optionText: "It provides free unlimited GPU instances.", isCorrect: false },
      { optionKey: "B", optionText: "It runs containers without requiring you to provision, configure, or manage underlying EC2 worker instances.", isCorrect: true },
      { optionKey: "C", optionText: "It automatically rewrites monolithic PHP code into Go microservices.", isCorrect: false },
      { optionKey: "D", optionText: "It bypasses all AWS IAM permission requirements.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 12,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "CloudTrail vs CloudWatch Responsibility",
    prompt: "An engineer wants to find out which IAM user deleted an EC2 instance yesterday at 3:15 PM. Which AWS service contains this specific audit record?",
    explanation: "AWS CloudTrail records account-level management and API activity, capturing the identity of the caller, the API action (e.g. TerminateInstances), and timestamp. CloudWatch monitors resource performance metrics.",
    hintsJson: JSON.stringify(["Which service audits API calls and who did what?"]),
    options: [
      { optionKey: "A", optionText: "AWS CloudWatch Metrics", isCorrect: false },
      { optionKey: "B", optionText: "AWS CloudTrail", isCorrect: true },
      { optionKey: "C", optionText: "AWS Trusted Advisor", isCorrect: false },
      { optionKey: "D", optionText: "Amazon Inspector", isCorrect: false }
    ]
  },
  {
    moduleNumber: 13,
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS WAF Protection Layer",
    prompt: "At which layer of the OSI model does AWS WAF inspect traffic, and against which common attacks does it defend?",
    explanation: "AWS WAF operates at Layer 7 (Application Layer) and protects against HTTP/HTTPS exploits like SQL Injection (SQLi) and Cross-Site Scripting (XSS).",
    hintsJson: JSON.stringify(["WAF protects HTTP/HTTPS traffic at Layer 7."]),
    options: [
      { optionKey: "A", optionText: "Layer 3/4 network packet attacks like SYN floods only.", isCorrect: false },
      { optionKey: "B", optionText: "Layer 7 web application attacks like SQL Injection and Cross-Site Scripting (XSS).", isCorrect: true },
      { optionKey: "C", optionText: "Physical server room intrusions.", isCorrect: false },
      { optionKey: "D", optionText: "BGP route poisoning.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 14,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Blue/Green Deployment Strategy Benefits",
    prompt: "What is the primary architectural advantage of a Blue/Green deployment over a Rolling In-Place deployment?",
    explanation: "Blue/Green maintains two separate, identical environments. Deploying to the inactive environment allows thorough testing, near-instant cutover via DNS/load balancer, and immediate zero-downtime rollback if a bug is discovered.",
    hintsJson: JSON.stringify(["Think about instant traffic cutover and instant rollback capability."]),
    options: [
      { optionKey: "A", optionText: "It uses half as much memory as other deployment types.", isCorrect: false },
      { optionKey: "B", optionText: "It allows testing on the new green environment and enables instant traffic switch with zero-downtime rollback.", isCorrect: true },
      { optionKey: "C", optionText: "It requires no automated testing.", isCorrect: false },
      { optionKey: "D", optionText: "It eliminates the need for any load balancer.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 15,
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Well-Architected Reliability Principle",
    prompt: "According to the AWS Well-Architected Framework Reliability Pillar, what is the core architectural tenet regarding failure?",
    explanation: "The core tenet is 'Design for failure': assume hardware components, network lines, and data centers WILL fail, and build automated self-healing mechanisms (Multi-AZ, ASG, health checks) to maintain availability.",
    hintsJson: JSON.stringify(["Assume everything will fail, and design for it."]),
    options: [
      { optionKey: "A", optionText: "Assume hardware never fails if you choose premium instance types.", isCorrect: false },
      { optionKey: "B", optionText: "Design for failure: assume components will fail and build automated recovery into the architecture.", isCorrect: true },
      { optionKey: "C", optionText: "Deploy all servers in a single data center to eliminate inter-facility latency.", isCorrect: false },
      { optionKey: "D", optionText: "Avoid using backups to optimize disk space.", isCorrect: false }
    ]
  }
];
