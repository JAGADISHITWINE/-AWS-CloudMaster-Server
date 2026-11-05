module.exports = [
  {
    moduleNumber: 1,
    topicNumber: 3,
    topicSlug: "regions-azs-and-edge-infrastructure",
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
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
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
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
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
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Git Internal Architecture & Rebase Mechanics",
    prompt: "Why should an engineer never run 'git rebase' on a public shared branch such as 'main'?",
    explanation: "Rebasing creates brand-new commit hashes for existing changes (replaying commits). If others have based their work on the original commits, their history diverges, forcing complex and dangerous reconciliations.",
    hintsJson: JSON.stringify(["Remember: rebasing rewrites commit hashes and timestamps."]),
    options: [
      { optionKey: "A", optionText: "Because Git will automatically delete the entire repository from GitHub.", isCorrect: false },
      { optionKey: "B", optionText: "Rebasing rewrites commit SHA hashes, creating diverging histories and merge nightmares for collaborators who already pulled the branch.", isCorrect: true },
      { optionKey: "C", optionText: "Rebasing is only allowed on SVN repositories, not Git.", isCorrect: false },
      { optionKey: "D", optionText: "Rebasing compresses files into zip archives that cannot be read by GitHub.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Why Git Outperforms Older VCS Tools",
    prompt: "According to the Git Concept Guide, what single core trait best describes why Git dramatically outperforms older centralized tools like SVN or CVS for everyday development?",
    explanation: "Flexibility — Git's cheap local branching, staging area, and support for multiple offline workflows let developers work faster and more independently than centralized, network-dependent tools.",
    hintsJson: JSON.stringify(["Think of offline work, local branching, and independent staging."]),
    options: [
      { optionKey: "A", optionText: "Rigidity — Git forces every developer to follow the exact same monolithic release branch.", isCorrect: false },
      { optionKey: "B", optionText: "Flexibility — Git's cheap local branching, staging area, and support for offline workflows allow fast, independent development.", isCorrect: true },
      { optionKey: "C", optionText: "Centralization — Git requires all commits to be approved live by an SVN central server.", isCorrect: false },
      { optionKey: "D", optionText: "Compression — Git only allows committing zip archives.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Two Core Version Control Actions",
    prompt: "In foundational Version Control System (VCS) terminology, what are the two core fundamental actions every software engineer performs against a repository?",
    explanation: "Uploading code into a VCS is called a 'check-in', and downloading code from a VCS is called a 'checkout'.",
    hintsJson: JSON.stringify(["Think of checking in changes and checking out files."]),
    options: [
      { optionKey: "A", optionText: "Check-in (uploading code to the VCS) and Checkout (downloading code from the VCS).", isCorrect: true },
      { optionKey: "B", optionText: "Compile and Link.", isCorrect: false },
      { optionKey: "C", optionText: "Encrypt and Decrypt.", isCorrect: false },
      { optionKey: "D", optionText: "Upload to S3 and Download from CloudFront.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Git Identity Configuration Requirement",
    prompt: "Why does Git strictly require 'user.name' and 'user.email' to be configured before allowing a developer to make commits?",
    explanation: "Every commit permanently records who created it — Git attaches this identity into the commit metadata so the project's history accurately attributes who changed what.",
    hintsJson: JSON.stringify(["Think about historical accountability and team collaboration."]),
    options: [
      { optionKey: "A", optionText: "To bill the developer's credit card per commit made.", isCorrect: false },
      { optionKey: "B", optionText: "Every commit permanently attaches author identity into the snapshot metadata, ensuring clear historical attribution and accountability.", isCorrect: true },
      { optionKey: "C", optionText: "Because Git cannot run without connecting to Google OAuth.", isCorrect: false },
      { optionKey: "D", optionText: "To send an SMS text message to the developer on each commit.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Safe Unstaging Without Disk Deletion",
    prompt: "If you accidentally staged a file using 'git add sensitive.env', how do you undo the staging without deleting the file or any of your work from disk?",
    explanation: "Running 'git rm --cached sensitive.env' or 'git reset sensitive.env' unstages the file (moves it back to untracked/modified) while leaving the actual file on disk untouched. Plain 'git rm' would delete it from disk.",
    hintsJson: JSON.stringify(["Look for the command that targets only the cache/staging area."]),
    options: [
      { optionKey: "A", optionText: "Run 'rm sensitive.env' in bash.", isCorrect: false },
      { optionKey: "B", optionText: "Run 'git rm sensitive.env' (without flags).", isCorrect: false },
      { optionKey: "C", optionText: "Run 'git rm --cached sensitive.env' or 'git reset sensitive.env'.", isCorrect: true },
      { optionKey: "D", optionText: "Run 'git clean -f sensitive.env'.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-fundamentals-branching-merge-strategies",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "The Hidden Directory Created by git init",
    prompt: "When you run 'git init' inside an empty directory, what does Git create to turn it into a version-controlled repository?",
    explanation: "'git init' creates a hidden directory called '.git' where Git stores configuration files, the object database (blobs, trees, commits), refs, and HEAD pointers.",
    hintsJson: JSON.stringify(["It is a hidden folder with a dot prefix."]),
    options: [
      { optionKey: "A", optionText: "A hidden folder called '.git' that maintains the local repository database and configuration.", isCorrect: true },
      { optionKey: "B", optionText: "A file named 'repository.json' in the root directory.", isCorrect: false },
      { optionKey: "C", optionText: "A zip archive called 'git.zip'.", isCorrect: false },
      { optionKey: "D", optionText: "A MySQL database called 'git_master'.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Untracked Cleanup: Dry Run vs Force Execution",
    prompt: "You want to remove untracked build artifacts from your working directory. What command previews which files will be removed without actually deleting them?",
    explanation: "'git clean -n' shows which files would be removed (dry run); you use the '-f' flag in place of '-n' to actually execute the clean.",
    hintsJson: JSON.stringify(["The '-n' flag stands for dry run."]),
    options: [
      { optionKey: "A", optionText: "git clean -f", isCorrect: false },
      { optionKey: "B", optionText: "git clean -n (dry run)", isCorrect: true },
      { optionKey: "C", optionText: "git status --clean", isCorrect: false },
      { optionKey: "D", optionText: "git reset --all", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Diff Inspection: git diff HEAD vs git diff --cached",
    prompt: "What is the difference between running 'git diff HEAD' and running 'git diff --cached'?",
    explanation: "'git diff HEAD' shows differences between your current working directory and the last commit, whereas 'git diff --cached' shows differences between staged changes (the index) and the last commit.",
    hintsJson: JSON.stringify(["Remember: cached/staged refers strictly to what has been 'git add'-ed."]),
    options: [
      { optionKey: "A", optionText: "'git diff HEAD' shows differences between working directory and last commit; 'git diff --cached' shows difference between staged changes and last commit.", isCorrect: true },
      { optionKey: "B", optionText: "'git diff HEAD' deletes files; 'git diff --cached' restores files.", isCorrect: false },
      { optionKey: "C", optionText: "'git diff --cached' only works on Windows; 'git diff HEAD' only works on Linux.", isCorrect: false },
      { optionKey: "D", optionText: "Both commands produce identical output under all circumstances.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Log Visualization and Decoration",
    prompt: "Which flags added to 'git log' draw a text-based branch graph on the left and display the names of branches or tags of commits shown?",
    explanation: "'--graph' flag draws a text based graph of commits on the left side of commit messages, and '--decorate' adds names of branches or tags of commits shown.",
    hintsJson: JSON.stringify(["Look for graph and decorate."]),
    options: [
      { optionKey: "A", optionText: "--graph --decorate", isCorrect: true },
      { optionKey: "B", optionText: "--tree --visualize", isCorrect: false },
      { optionKey: "C", optionText: "--ascii --branches", isCorrect: false },
      { optionKey: "D", optionText: "--color --all", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "git-command-suite-cheat-sheet-mastery",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Linear Remote Sync with git pull --rebase",
    prompt: "What is the primary advantage of executing 'git pull --rebase <remote>' instead of a default 'git pull <remote>'?",
    explanation: "'git pull --rebase' fetches the remote's copy of the current branch and rebases local commits on top of it, creating a clean linear history and avoiding unnecessary merge bubbles.",
    hintsJson: JSON.stringify(["Think of rebase vs 3-way merge commit during sync."]),
    options: [
      { optionKey: "A", optionText: "It avoids creating unnecessary 3-way merge commits by replaying local commits on top of upstream changes for a clean linear history.", isCorrect: true },
      { optionKey: "B", optionText: "It automatically creates a release tag on GitHub.", isCorrect: false },
      { optionKey: "C", optionText: "It deletes the remote repository to save bandwidth.", isCorrect: false },
      { optionKey: "D", optionText: "It compresses git history into a single zip file.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Beginner",
    title: "GitHub Actions Workflow Configuration Directory",
    prompt: "Where must YAML workflow definition files be placed in a Git repository for GitHub Actions to automatically recognize and execute them?",
    explanation: "GitHub Actions requires all workflow definitions to be stored in the root directory path '.github/workflows/' using the '.yml' or '.yaml' extension.",
    hintsJson: JSON.stringify(["It is an exact hidden path starting with .github."]),
    options: [
      { optionKey: "A", optionText: ".github/workflows/*.yml (or .yaml)", isCorrect: true },
      { optionKey: "B", optionText: ".ci/pipelines/*.json", isCorrect: false },
      { optionKey: "C", optionText: "build/workflows/*.xml", isCorrect: false },
      { optionKey: "D", optionText: "root directory in a file called Dockerfile", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Matrix Testing Strategies in GitHub Actions",
    prompt: "In a GitHub Actions workflow, what is the primary purpose of defining a 'strategy.matrix' configuration for a job?",
    explanation: "A matrix strategy automatically generates multiple parallel job runs across combinations of variables (e.g. OS versions, Node.js versions, database engines) without duplicating workflow YAML code.",
    hintsJson: JSON.stringify(["Think about testing combinations in parallel without repetitive code."]),
    options: [
      { optionKey: "A", optionText: "To render an HTML table in the pull request comment.", isCorrect: false },
      { optionKey: "B", optionText: "To spawn parallel isolated runner jobs across combinations of variables (e.g. multiple operating systems and runtime versions) simultaneously.", isCorrect: true },
      { optionKey: "C", optionText: "To convert GitHub Actions YAML into Jenkins pipelines.", isCorrect: false },
      { optionKey: "D", optionText: "To enforce biometric authentication for GitHub commits.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Encrypted Secrets & Runner Log Masking",
    prompt: "How does GitHub Actions protect sensitive credentials stored under Repository Secrets when referenced in a workflow step?",
    explanation: "GitHub encrypts secrets at rest using Libsodium sealed boxes and automatically masks secret values in the runner console logs with asterisks (***).",
    hintsJson: JSON.stringify(["Think of encryption at rest and asterisk masking in console output."]),
    options: [
      { optionKey: "A", optionText: "GitHub sends secrets via unencrypted HTTP to all pull request authors.", isCorrect: false },
      { optionKey: "B", optionText: "GitHub encrypts secrets at rest and automatically redacts/masks matching secret values with '***' in runner console output logs.", isCorrect: true },
      { optionKey: "C", optionText: "Secrets can only be read if the runner is running Windows XP.", isCorrect: false },
      { optionKey: "D", optionText: "Secrets are converted into public environment variables visible to anyone viewing the repository.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Advanced",
    title: "GitHub Branch Protection & Required Status Checks",
    prompt: "In an enterprise GitHub repository, how do you prevent developers from merging broken code into the 'main' branch even if their pull request has been approved by a peer?",
    explanation: "By configuring Branch Protection Rules with 'Require status checks to pass before merging' enabled, binding the GitHub Actions CI workflow job name as a mandatory blocking check.",
    hintsJson: JSON.stringify(["Think about Required Status Checks in branch protection settings."]),
    options: [
      { optionKey: "A", optionText: "Disable Git commit capabilities across all developer laptops.", isCorrect: false },
      { optionKey: "B", optionText: "Enable Branch Protection Rules with 'Require status checks to pass before merging' selected, making the CI workflow a mandatory blocker.", isCorrect: true },
      { optionKey: "C", optionText: "Delete the main branch so merges cannot occur.", isCorrect: false },
      { optionKey: "D", optionText: "Rebase the repository once per hour manually.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Dependency Caching in GitHub Actions Workflows",
    prompt: "A GitHub Actions workflow spends 4 minutes downloading npm dependencies on every pull request. Which standard action and mechanism should be used to cache dependencies between workflow runs based on the lockfile hash?",
    explanation: "The actions/cache action caches dependencies based on a key (e.g. hashFiles('**/package-lock.json')). Subsequent runs restore the cache in seconds if the lockfile hasn't changed, dramatically speeding up CI execution.",
    hintsJson: JSON.stringify(["Look into 'actions/cache' and package-lock hash keys."]),
    options: [
      { optionKey: "A", optionText: "Commit the entire node_modules folder directly into Git version control.", isCorrect: false },
      { optionKey: "B", optionText: "Use the 'actions/cache' action with a key derived from hashFiles('**/package-lock.json') to store and restore dependencies across workflow runs.", isCorrect: true },
      { optionKey: "C", optionText: "Upgrade the GitHub subscription to Enterprise Diamond tier.", isCorrect: false },
      { optionKey: "D", optionText: "Disable npm package verification and run offline mode.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 16,
    topicSlug: "github-actions-cicd-matrix-secrets",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Advanced",
    title: "GitHub Actions Runners: GitHub-Hosted vs Self-Hosted Security",
    prompt: "An organization needs a CI/CD runner that can deploy directly into a private AWS VPC without exposing endpoints to the public internet. What is the recommended runner architecture and security guideline for public repositories?",
    explanation: "Self-hosted runners can be placed directly inside a private AWS VPC subnet with direct access to private resources. However, self-hosted runners should NEVER be used for public open-source repositories because pull requests from untrusted forks can execute arbitrary malicious code on the host machine.",
    hintsJson: JSON.stringify(["Consider private VPC network access vs public fork pull request risks."]),
    options: [
      { optionKey: "A", optionText: "Deploy a self-hosted runner inside the private VPC, but ensure self-hosted runners are never used on public repositories where untrusted fork PRs could compromise internal infrastructure.", isCorrect: true },
      { optionKey: "B", optionText: "Use GitHub-hosted runners and assign public elastic IP addresses to all private database instances.", isCorrect: false },
      { optionKey: "C", optionText: "Store AWS root access credentials in public commit messages.", isCorrect: false },
      { optionKey: "D", optionText: "Self-hosted runners cannot run Docker or communicate with AWS APIs.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Jenkins Enterprise Controller-Agent Architecture",
    prompt: "In a production Jenkins cluster, why is it considered a critical best practice to set the number of executors on the Jenkins Controller (Master) to 0?",
    explanation: "Executing builds on the controller risks exhausting CPU/RAM, crashing the Jenkins web service, and exposes sensitive master credentials to untrusted build scripts.",
    hintsJson: JSON.stringify(["Think about resource exhaustion and credentials stored on the controller disk."]),
    options: [
      { optionKey: "A", optionText: "Because Jenkins can only compile Java code when running on agents.", isCorrect: false },
      { optionKey: "B", optionText: "To isolate the controller from heavy build loads (preventing UI crashes) and protect master credentials from malicious build scripts.", isCorrect: true },
      { optionKey: "C", optionText: "Setting executors to 0 shuts down the Jenkins server permanently.", isCorrect: false },
      { optionKey: "D", optionText: "Jenkins plugins only work on Windows machines.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Core Role of Jenkins in Modern CI/CD",
    prompt: "According to Jenkins fundamentals, what does Jenkins actually do when automating continuous integration?",
    explanation: "Jenkins is an automation orchestrator; it does not build or test code itself. It triggers and orchestrates external build tools (compilers, test runners, deployment scripts) in repeatable automated sequences.",
    hintsJson: JSON.stringify(["Jenkins is an orchestrator, not a compiler."]),
    options: [
      { optionKey: "A", optionText: "It compiles Java and C++ source code into binary files using its internal native compiler.", isCorrect: false },
      { optionKey: "B", optionText: "It orchestrates external build tools, test frameworks, and deployment scripts in repeatable automated sequences.", isCorrect: true },
      { optionKey: "C", optionText: "It replaces Git by acting as a centralized version control repository.", isCorrect: false },
      { optionKey: "D", optionText: "It operates as a database server storing application transaction logs.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Java Runtime Prerequisite for Jenkins",
    prompt: "Why must a compatible Java Development Kit (JDK/JRE) such as OpenJDK 17 be installed on Linux before installing Jenkins?",
    explanation: "Jenkins itself is a Java web application that runs on top of the Java Virtual Machine (JVM). Without a compatible JDK/JRE runtime present, the Jenkins service process cannot start.",
    hintsJson: JSON.stringify(["Jenkins runs on the Java Virtual Machine."]),
    options: [
      { optionKey: "A", optionText: "Because Jenkins is a Java application that executes on the JVM.", isCorrect: true },
      { optionKey: "B", optionText: "Java is only required if building Android mobile applications.", isCorrect: false },
      { optionKey: "C", optionText: "To allow developers to connect via JavaScript in browser consoles.", isCorrect: false },
      { optionKey: "D", optionText: "Java provides the Linux kernel network drivers for port 8080.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Jenkins First-Run Unlock Password Location",
    prompt: "On a fresh Linux installation, where does Jenkins store the auto-generated initial administrator password required to unlock the setup wizard?",
    explanation: "Jenkins writes the one-time unlock password to /var/lib/jenkins/secrets/initialAdminPassword on disk.",
    hintsJson: JSON.stringify(["Look for the secrets folder in /var/lib/jenkins."]),
    options: [
      { optionKey: "A", optionText: "/var/lib/jenkins/secrets/initialAdminPassword", isCorrect: true },
      { optionKey: "B", optionText: "/etc/jenkins/admin.password", isCorrect: false },
      { optionKey: "C", optionText: "/home/jenkins/.ssh/id_rsa", isCorrect: false },
      { optionKey: "D", optionText: "/usr/share/jenkins/password.txt", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Role-Based Access Control in Jenkins",
    prompt: "Which plugin is the enterprise standard for implementing fine-grained, role-based authorization in Jenkins instead of 'logged-in users can do anything'?",
    explanation: "The Role-based Authorization Strategy (Role Strategy) plugin allows administrators to define reusable roles (e.g. Developer, QA) with tailored permissions and assign users to those roles.",
    hintsJson: JSON.stringify(["Look for the plugin that manages roles."]),
    options: [
      { optionKey: "A", optionText: "Role-based Authorization Strategy (Role Strategy plugin)", isCorrect: true },
      { optionKey: "B", optionText: "Ant Plugin", isCorrect: false },
      { optionKey: "C", optionText: "Blue Ocean Plugin", isCorrect: false },
      { optionKey: "D", optionText: "Timestamper Plugin", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-architecture-master-agents",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Systemd Service Startup vs Boot Enablement",
    prompt: "When managing the Jenkins Linux service with systemd, what is the critical difference between 'systemctl start jenkins' and 'systemctl enable jenkins'?",
    explanation: "'systemctl start' runs the service immediately for the current session, while 'systemctl enable' configures the service to start automatically upon every future system reboot.",
    hintsJson: JSON.stringify(["One runs it now, the other configures it to start on server reboot."]),
    options: [
      { optionKey: "A", optionText: "'start' runs Jenkins immediately for current session; 'enable' ensures Jenkins automatically restarts after system reboots.", isCorrect: true },
      { optionKey: "B", optionText: "'enable' compiles Jenkins; 'start' deploys Jenkins to AWS.", isCorrect: false },
      { optionKey: "C", optionText: "'start' is for Ubuntu; 'enable' is for Red Hat only.", isCorrect: false },
      { optionKey: "D", optionText: "Both commands perform the exact identical action.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Freestyle Jobs vs Pipeline-as-Code",
    prompt: "What is the primary architectural advantage of defining a Jenkins pipeline as a 'Jenkinsfile' in source control compared to a UI-configured Freestyle job?",
    explanation: "A Jenkinsfile is version-controlled, reviewable via pull requests, and travels with the application code it builds, making the build process traceable and recoverable from Git history.",
    hintsJson: JSON.stringify(["Think of Pipeline-as-Code and Git version control."]),
    options: [
      { optionKey: "A", optionText: "The build process is version-controlled, reviewable via PRs, and evolves in Git alongside the code it builds.", isCorrect: true },
      { optionKey: "B", optionText: "Freestyle jobs can only compile Python code, while Jenkinsfiles compile Java.", isCorrect: false },
      { optionKey: "C", optionText: "Freestyle jobs do not support plugins.", isCorrect: false },
      { optionKey: "D", optionText: "Jenkinsfiles run 50 times faster because they bypass Java.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "GitHub Webhook Event Trigger Activation",
    prompt: "A GitHub webhook is configured correctly, and GitHub shows green checkmarks (200 OK) on delivery, but Jenkins never triggers the build. What job setting was most likely omitted?",
    explanation: "The job's Build Triggers section must have 'GitHub hook trigger for GITScm polling' checked for Jenkins to match incoming webhook payloads to that specific job.",
    hintsJson: JSON.stringify(["Check Build Triggers in the job configuration."]),
    options: [
      { optionKey: "A", optionText: "The 'GitHub hook trigger for GITScm polling' checkbox under Build Triggers was not enabled.", isCorrect: true },
      { optionKey: "B", optionText: "Jenkins was not restarted after pushing code.", isCorrect: false },
      { optionKey: "C", optionText: "The developer did not sign the commit with a PGP key.", isCorrect: false },
      { optionKey: "D", optionText: "The repository must be renamed to 'jenkins-repo'.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Build Periodically vs Poll SCM Mechanics",
    prompt: "What is the practical behavioral difference between the 'Build periodically' trigger and the 'Poll SCM' trigger in Jenkins?",
    explanation: "'Build periodically' triggers a build on a clock schedule regardless of changes, whereas 'Poll SCM' checks the repository on schedule and only triggers a build if new commits exist.",
    hintsJson: JSON.stringify(["One always builds; the other checks for new commits first."]),
    options: [
      { optionKey: "A", optionText: "Build periodically always builds on schedule even with no code changes; Poll SCM checks the repository and only builds if new commits exist.", isCorrect: true },
      { optionKey: "B", optionText: "Poll SCM deletes files; Build periodically creates files.", isCorrect: false },
      { optionKey: "C", optionText: "Build periodically only works on Linux; Poll SCM only works on Windows.", isCorrect: false },
      { optionKey: "D", optionText: "There is no difference; they are aliases for the same trigger.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Jenkins 5-Field Cron Syntax Sequence",
    prompt: "In Jenkins scheduled triggers, what is the exact chronological sequence of the five fields in a cron expression?",
    explanation: "The 5 fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-7, where 0 and 7 represent Sunday).",
    hintsJson: JSON.stringify(["Starts with minute, then hour, day, month, day of week."]),
    options: [
      { optionKey: "A", optionText: "Minute, Hour, Day of Month, Month, Day of Week", isCorrect: true },
      { optionKey: "B", optionText: "Hour, Minute, Day of Month, Month, Day of Week", isCorrect: false },
      { optionKey: "C", optionText: "Day of Week, Month, Day of Month, Hour, Minute", isCorrect: false },
      { optionKey: "D", optionText: "Second, Minute, Hour, Day, Month", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "High-Signal Alerting with post { failure }",
    prompt: "Why is placing email alerts inside a 'post { failure { mail ... } }' block considered superior to sending notifications on every single build?",
    explanation: "Notifying only on failure keeps alerts meaningful and actionable, preventing teams from developing alert fatigue and ignoring critical broken build notifications.",
    hintsJson: JSON.stringify(["Think about alert fatigue from 100 successful build emails a day."]),
    options: [
      { optionKey: "A", optionText: "Because email servers charge $10 per sent email.", isCorrect: false },
      { optionKey: "B", optionText: "It prevents alert fatigue, ensuring notifications remain high-signal so developers don't ignore alerts when a real failure occurs.", isCorrect: true },
      { optionKey: "C", optionText: "Jenkins does not support sending emails on successful builds.", isCorrect: false },
      { optionKey: "D", optionText: "The failure block is the only block where mail syntax is valid.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "declarative-jenkinsfile-production-pipelines",
    topicNumber: 2,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Gating Production Deployments in Declarative Pipelines",
    prompt: "How do you pause a Declarative Jenkinsfile pipeline before a production deployment stage to wait for explicit human approval?",
    explanation: "By including an 'input' step inside the deployment stage (e.g. input message: 'Deploy to production?'), which pauses execution waiting for an interactive human decision.",
    hintsJson: JSON.stringify(["Look for the step that accepts user input."]),
    options: [
      { optionKey: "A", optionText: "Insert an 'input' step inside the deploy stage.", isCorrect: true },
      { optionKey: "B", optionText: "Add 'sleep 86400' in a shell step.", isCorrect: false },
      { optionKey: "C", optionText: "Shut down the Jenkins agent until someone turns it on.", isCorrect: false },
      { optionKey: "D", optionText: "Set 'agent none' on the deploy stage.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Purpose of Selenium in Continuous Integration",
    prompt: "What is the primary role of Selenium WebDriver when integrated into a continuous integration pipeline?",
    explanation: "Selenium is a browser automation framework used to run automated end-to-end user journey tests against real web applications in browser environments.",
    hintsJson: JSON.stringify(["Automates real web browser interactions."]),
    options: [
      { optionKey: "A", optionText: "To automate real browser interactions and assert web application functionality from an end-user perspective.", isCorrect: true },
      { optionKey: "B", optionText: "To compile Java source code into bytecode.", isCorrect: false },
      { optionKey: "C", optionText: "To manage Docker container registries.", isCorrect: false },
      { optionKey: "D", optionText: "To encrypt passwords stored in GitHub secrets.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Maven Dependency Management for Selenium",
    prompt: "What is the primary advantage of declaring Selenium dependencies in Maven's pom.xml instead of manually adding JAR files in Eclipse?",
    explanation: "Maven automatically downloads and resolves the exact declared library versions and transitive dependencies consistently on any machine (including Jenkins CI servers), eliminating 'works on my machine' drift.",
    hintsJson: JSON.stringify(["Consistency across development laptops and CI servers."]),
    options: [
      { optionKey: "A", optionText: "Maven guarantees identical dependency resolution across all machines, eliminating the 'works on my machine because of manual JARs' problem.", isCorrect: true },
      { optionKey: "B", optionText: "Maven makes Selenium tests run 10 times faster by skipping assertions.", isCorrect: false },
      { optionKey: "C", optionText: "JAR files cannot be executed on Linux operating systems.", isCorrect: false },
      { optionKey: "D", optionText: "Maven allows running Selenium tests without installing a browser.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Mandatory WebDriver Teardown via driver.quit()",
    prompt: "Why is executing 'driver.quit()' in an @After teardown method or finally block mandatory at the end of every Selenium test?",
    explanation: "'driver.quit()' closes the browser window and cleanly terminates the underlying WebDriver process. Without it, orphan browser processes accumulate on the CI agent, exhausting system memory and crashing subsequent builds.",
    hintsJson: JSON.stringify(["Prevents orphan browser processes and memory leaks."]),
    options: [
      { optionKey: "A", optionText: "It terminates the WebDriver process and closes browser instances, preventing orphan processes from exhausting CI server memory.", isCorrect: true },
      { optionKey: "B", optionText: "It commits changes to the Git repository.", isCorrect: false },
      { optionKey: "C", optionText: "It is optional and has no effect on system resources.", isCorrect: false },
      { optionKey: "D", optionText: "It restarts the Jenkins Controller.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Headless Browser Requirement on Linux CI Agents",
    prompt: "Why must Selenium browser tests execute in Headless mode (e.g. '--headless=new') on Linux Jenkins worker agents?",
    explanation: "Linux servers in CI/CD environments operate without physical monitors or an active graphical X11 display server. Standard headed browsers fail to initialize unless headless mode or Xvfb is configured.",
    hintsJson: JSON.stringify(["Linux CI servers lack physical display monitors."]),
    options: [
      { optionKey: "A", optionText: "Linux CI servers lack physical monitors and active X11 display servers; running headed tests causes immediate browser startup crashes.", isCorrect: true },
      { optionKey: "B", optionText: "Headless mode is required because Google Chrome does not support Linux.", isCorrect: false },
      { optionKey: "C", optionText: "Headless mode encrypts the browser traffic using SHA-512.", isCorrect: false },
      { optionKey: "D", optionText: "Headless mode disables JavaScript in web pages.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 17,
    topicSlug: "jenkins-selenium-maven-headless-testing",
    topicNumber: 3,
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Publishing JUnit Surefire XML Reports in Jenkins",
    prompt: "Where does the Maven Surefire plugin output test results, and what Jenkins post-build step parses them to visualize pass/fail trends over time?",
    explanation: "Maven Surefire writes test reports to '**/target/surefire-reports/*.xml', which are published in Declarative Pipelines via 'post { always { junit '**/target/surefire-reports/*.xml' } }'.",
    hintsJson: JSON.stringify(["Look for target/surefire-reports and the junit step."]),
    options: [
      { optionKey: "A", optionText: "Reports are output to 'target/surefire-reports/*.xml' and published via 'post { always { junit '...' } }'.", isCorrect: true },
      { optionKey: "B", optionText: "Reports are stored in /tmp/test.log and published via 'git push'.", isCorrect: false },
      { optionKey: "C", optionText: "Reports are written to pom.xml directly.", isCorrect: false },
      { optionKey: "D", optionText: "Reports are emailed directly to GitHub.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 18,
    topicSlug: "docker-internals-container-architecture",
    topicNumber: 1,
    type: "MCQ",
    difficulty: "Beginner",
    title: "Linux Kernel Primitives Powering Docker",
    prompt: "Which pair of Linux kernel features provides process isolation and hardware resource limits for Docker containers?",
    explanation: "Namespaces provide isolation (processes only see their own network, mounts, and PIDs), while Control Groups (cgroups) enforce limits on hardware resources like CPU and RAM.",
    hintsJson: JSON.stringify(["One isolates what the process sees, the other limits what the process can use."]),
    options: [
      { optionKey: "A", optionText: "Hyper-V and VMware Workstation.", isCorrect: false },
      { optionKey: "B", optionText: "Linux Namespaces (isolation) and Control Groups / cgroups (resource quotas).", isCorrect: true },
      { optionKey: "C", optionText: "Samba file shares and Apache HTTP Server.", isCorrect: false },
      { optionKey: "D", optionText: "SELinux and AppArmor only, without process scheduling.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 19,
    topicNumber: 1,
    topicSlug: "kubernetes-architecture-control-plane-nodes",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Kubernetes Control Plane Component Roles",
    prompt: "Which Kubernetes Control Plane component is responsible for evaluating worker node resource capacity and assigning unscheduled Pods to specific healthy nodes?",
    explanation: "The kube-scheduler detects pods that have no assigned node and runs filtering and scoring algorithms to choose the best available worker node.",
    hintsJson: JSON.stringify(["It 'schedules' the pod to a node."]),
    options: [
      { optionKey: "A", optionText: "kube-proxy", isCorrect: false },
      { optionKey: "B", optionText: "kube-scheduler", isCorrect: true },
      { optionKey: "C", optionText: "kubelet", isCorrect: false },
      { optionKey: "D", optionText: "etcd", isCorrect: false }
    ]
  },
  {
    moduleNumber: 20,
    type: "MCQ",
    difficulty: "Advanced",
    title: "Production Image Tagging & Rollback Strategy",
    prompt: "Why is tagging production Docker images with ':latest' considered a dangerous anti-pattern in automated CI/CD pipelines?",
    explanation: "Using ':latest' is mutable and non-deterministic: you cannot identify which Git commit is running, caching can cause nodes to run different code versions, and rollbacks to previous versions are impossible.",
    hintsJson: JSON.stringify(["How do you roll back if every build is called ':latest'?"]),
    options: [
      { optionKey: "A", optionText: "Because Docker Hub charges extra for images named 'latest'.", isCorrect: false },
      { optionKey: "B", optionText: "Tagging with ':latest' is mutable and non-deterministic, making audits, caching, and instant rollbacks to a previous working version impossible.", isCorrect: true },
      { optionKey: "C", optionText: "Kubernetes does not support strings in image names.", isCorrect: false },
      { optionKey: "D", optionText: "It causes the Docker daemon to format the host drive.", isCorrect: false }
    ]
  }
];

const dockerQuizzes = require('./dockerQuizzesData.js');
module.exports.push(...dockerQuizzes);

const kubernetesQuizzes = require('./kubernetesQuizzesData.js');
module.exports.push(...kubernetesQuizzes);

const awsAccountQuizzes = require('./awsAccountQuizzesData.js');
module.exports.push(...awsAccountQuizzes);

const awsVpcQuizzes = require('./awsVpcQuizzesData.js');
module.exports.push(...awsVpcQuizzes);



