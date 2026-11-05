module.exports = {
  1: {
    simpleExplanation: "Think of AWS Global Infrastructure as a worldwide network of secure, ultra-fast data center complexes. Just like a bank has branches across different countries to serve local customers with low latency and comply with local data protection laws, AWS deploys data centers globally. A Region is a distinct geographical area (like us-east-1 in Virginia or ap-south-1 in Mumbai). Within each Region, AWS builds multiple isolated Availability Zones (AZs) connected by ultra-low latency fiber optic cables. Even if a lightning strike or flood takes down an entire facility, other AZs in that Region keep your application running.",
    coreConceptsJson: JSON.stringify([
      { term: "Region", definition: "A physical geographical location in the world with multiple isolated Availability Zones (typically 3 or more)." },
      { term: "Availability Zone (AZ)", definition: "One or more discrete physical data centers with redundant power, networking, and connectivity in an AWS Region." },
      { term: "Edge Location", definition: "CloudFront content delivery endpoints placed close to end users worldwide to cache content with minimal latency." },
      { term: "Local Zone", definition: "An extension of an AWS Region that places compute and storage services closer to large population or industrial centers." },
      { term: "AWS Global Network", definition: "A redundant, private, 100GbE+ fiber-optic backbone connecting all AWS Regions and Edge Locations, bypassing the public internet." }
    ]),
    internalsExplanation: "AWS interconnects AZs within a Region using custom private fiber paths with round-trip latency under 1-2 milliseconds. They are separated by meaningful physical distances (typically tens of miles) to ensure distinct flood plains, power grids, and risk profiles, while remaining close enough for synchronous replication. Edge Locations connect directly into the AWS Global Backbone, so traffic originating from user browsers hits CloudFront/Route 53 at the nearest city edge and travels over AWS's private high-speed network rather than hopping across uncertain public ISP routes.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#1D4ED8"/>
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
      <g transform="translate(40, 70)">
        <rect x="0" y="0" width="100" height="90" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="50" y="40" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Users</text>
        <text x="50" y="60" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Worldwide</text>
      </g>
      <path d="M 150 115 L 180 115" stroke="#38BDF8" stroke-width="2" marker-end="url(#arrow)"/>
      <g transform="translate(190, 70)">
        <rect x="0" y="0" width="100" height="90" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="50" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Route 53</text>
        <text x="50" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Global DNS</text>
      </g>
      <path d="M 300 115 L 330 115" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(340, 70)">
        <rect x="0" y="0" width="100" height="90" rx="8" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5"/>
        <text x="50" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CloudFront</text>
        <text x="50" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">CDN Edge</text>
      </g>
      <path d="M 450 115 L 480 115" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(490, 70)">
        <rect x="0" y="0" width="100" height="90" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="50" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">ALB</text>
        <text x="50" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Load Balancer</text>
      </g>
      <path d="M 600 115 L 630 115" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(640, 70)">
        <rect x="0" y="0" width="110" height="90" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="55" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">EC2 / DB</text>
        <text x="55" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Multi-AZ Core</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 describe-regions --output table", explanation: "Lists all active AWS Regions available to your account." },
      { command: "aws ec2 describe-availability-zones --region us-east-1", explanation: "Shows all Availability Zones in the Northern Virginia region." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always design for Multi-AZ resilience to avoid single points of failure.",
      "Select your primary region based on three strict criteria: User Latency, Legal/Compliance requirements (GDPR/HIPAA), and Service Availability/Cost.",
      "Use CloudFront Edge Locations to offload static assets and reduce origin server load."
    ]),
    securityNotes: "Data stored in an AWS Region never leaves that region unless you explicitly configure replication or cross-region transfers. AWS complies with national sovereignty laws by keeping data within designated regional borders.",
    costImplications: "AWS Free Tier provides global access, but inter-AZ and inter-region data transfer incurs per-GB costs. Keeping traffic within the same Availability Zone is free or lowest cost, but Multi-AZ is essential for high availability.",
    commonMistakesJson: JSON.stringify([
      "Assuming 'us-east-1a' in your account is the exact same physical facility as 'us-east-1a' in a colleague's account (AWS randomizes AZ letter mappings between accounts for load distribution; use AZ IDs like use1-az1 to verify).",
      "Deploying all EC2 instances inside a single AZ, leaving the application vulnerable to localized hardware failures."
    ]),
    quickRevisionJson: JSON.stringify([
      "Region = Distinct geographic area (e.g., us-east-1).",
      "Availability Zone = 1+ discrete data centers with isolated power/network.",
      "Edge Location = CloudFront/Route 53 caching site.",
      "Global Backbone = AWS's private high-speed fiber connecting all infrastructure."
    ])
  },
  2: {
    simpleExplanation: "AWS Identity and Access Management (IAM) is the digital security guard of your cloud environment. By default in AWS, EVERYTHING IS DENIED (an implicit deny). IAM allows you to specify WHO can access WHAT resources under WHICH specific conditions. Instead of sharing a single administrator account, you create distinct IAM Users or Federate external identities (Google/Okta), organize them into Groups, and grant permissions using JSON Policies. Most importantly, you use IAM Roles to give temporary permissions to EC2 instances, Lambda functions, or cross-account engineers without hardcoding API keys.",
    coreConceptsJson: JSON.stringify([
      { term: "IAM User", definition: "An identity with long-term credentials (password or access keys) representing a human or service." },
      { term: "IAM Group", definition: "A collection of users that simplifies assigning permissions to multiple people at once." },
      { term: "IAM Role", definition: "An identity with temporary security credentials (assumed by services like EC2 or external federated users)." },
      { term: "IAM Policy", definition: "A JSON document defining Effect (Allow/Deny), Actions, Resources, and Conditions." },
      { term: "Permission Boundary", definition: "An advanced guardrail setting the maximum permissions an identity-based policy can grant." }
    ]),
    internalsExplanation: "When an API request reaches AWS, the IAM Evaluation Engine checks the request against all applicable policies. 1. Is there an Explicit Deny anywhere? If yes, access is DENIED immediately. 2. Is there an Explicit Allow from an attached policy? If yes, access is ALLOWED. 3. If neither, the request remains implicitly DENIED. The flow evaluates: Principal -> Action -> Resource -> Condition.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0F172A" stroke="#334155"/>
      <g transform="translate(30, 60)">
        <circle cx="50" cy="40" r="35" fill="#3B82F6"/>
        <text x="50" y="45" fill="#FFF" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Principal</text>
      </g>
      <text x="160" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(190, 60)">
        <rect width="90" height="80" rx="8" fill="#8B5CF6"/>
        <text x="45" y="45" fill="#FFF" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Policy</text>
      </g>
      <text x="310" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(340, 60)">
        <rect width="90" height="80" rx="8" fill="#F59E0B"/>
        <text x="45" y="45" fill="#FFF" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Action</text>
      </g>
      <text x="460" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(490, 60)">
        <rect width="90" height="80" rx="8" fill="#10B981"/>
        <text x="45" y="45" fill="#FFF" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Resource</text>
      </g>
      <text x="610" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(640, 60)">
        <rect width="100" height="80" rx="8" fill="#EF4444"/>
        <text x="50" y="45" fill="#FFF" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Condition</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws iam list-users", explanation: "Lists all IAM users created in the AWS account." },
      { command: "aws sts get-caller-identity", explanation: "Returns the ARN, Account ID, and UserId of the currently authenticated caller." },
      { command: "aws iam get-account-summary", explanation: "Shows account-level limits and usage (number of roles, users, groups)." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Lock down the AWS Root account with hardware MFA and NEVER use root access keys for daily tasks.",
      "Follow the Principle of Least Privilege: grant only the exact actions and resources required.",
      "Prefer IAM Roles over long-term access keys. EC2 instances should use instance profiles with IAM roles."
    ]),
    securityNotes: "Access keys checked into public GitHub repositories are scanned by bots within seconds, leading to immediate compromised accounts. AWS KMS and Secrets Manager should be used to protect secrets, and IAM Access Analyzer should monitor cross-account permissions.",
    costImplications: "IAM is completely FREE of charge. There are no additional fees for creating users, groups, roles, or policies.",
    commonMistakesJson: JSON.stringify([
      "Using the Root account for building applications or deploying servers.",
      "Hardcoding AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY inside code or EC2 instances instead of attaching an IAM Role.",
      "Attaching AdministratorAccess to every new team member."
    ]),
    quickRevisionJson: JSON.stringify([
      "Explicit Deny ALWAYS wins over an Explicit Allow.",
      "IAM Roles generate temporary short-lived credentials via AWS STS.",
      "Never share credentials; enforce MFA across all accounts."
    ])
  },
  3: {
    simpleExplanation: "An Amazon Virtual Private Cloud (VPC) is your own isolated private data center in the AWS cloud. Inside your VPC, you decide the IP address range (CIDR block), create Subnets, configure Route Tables, and control traffic gates. Public Subnets have direct routes to an Internet Gateway (IGW) for web servers and public load balancers. Private Subnets have NO direct route to the outside world; outbound internet access for patching is routed safely through a NAT Gateway.",
    coreConceptsJson: JSON.stringify([
      { term: "VPC", definition: "A logically isolated virtual network dedicated to your AWS account defined by a private IPv4 CIDR (e.g. 10.0.0.0/16)." },
      { term: "Public Subnet", definition: "A subnet whose route table directs 0.0.0.0/0 to an Internet Gateway (IGW)." },
      { term: "Private Subnet", definition: "A subnet whose route table has no route to an IGW (uses NAT Gateway for outbound egress)." },
      { term: "NAT Gateway", definition: "A managed AWS service in a public subnet allowing private subnet instances to initiate outbound connections without exposing them to inbound internet traffic." },
      { term: "Security Group (SG)", definition: "A virtual stateful firewall operating at the instance/ENI level." },
      { term: "Network ACL (NACL)", definition: "A stateless subnet-level firewall evaluating inbound and outbound traffic with numbered rules." }
    ]),
    internalsExplanation: "Security Groups are STATEFUL: if you allow inbound traffic on port 443, the response traffic is automatically permitted out regardless of outbound rules. Network ACLs are STATELESS: inbound and outbound traffic must be explicitly allowed, including ephemeral ports (1024-65535) for return packets. VPC Peering and Transit Gateways route traffic privately across VPCs via AWS's internal network without internet exposure.",
    architectureSvg: `<svg viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="790" height="210" rx="10" fill="#090D16" stroke="#1E293B"/>
      <rect x="25" y="25" width="750" height="170" rx="8" fill="#0F172A" stroke="#3B82F6" stroke-dasharray="4"/>
      <text x="45" y="45" fill="#38BDF8" font-size="12" font-family="system-ui" font-weight="bold">VPC (10.0.0.0/16)</text>
      <!-- Public Subnet -->
      <rect x="50" y="60" width="320" height="120" rx="6" fill="#1E293B" stroke="#10B981"/>
      <text x="65" y="80" fill="#34D399" font-size="11" font-family="system-ui" font-weight="bold">Public Subnet (10.0.1.0/24)</text>
      <rect x="70" y="95" width="120" height="65" rx="4" fill="#334155"/>
      <text x="130" y="125" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle">Internet Gateway</text>
      <rect x="210" y="95" width="140" height="65" rx="4" fill="#334155"/>
      <text x="280" y="125" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle">NAT Gateway / ALB</text>
      <!-- Private Subnet -->
      <rect x="420" y="60" width="330" height="120" rx="6" fill="#1E293B" stroke="#F59E0B"/>
      <text x="435" y="80" fill="#FBBF24" font-size="11" font-family="system-ui" font-weight="bold">Private Subnet (10.0.2.0/24)</text>
      <rect x="440" y="95" width="130" height="65" rx="4" fill="#334155"/>
      <text x="505" y="125" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle">Private EC2 App</text>
      <rect x="590" y="95" width="140" height="65" rx="4" fill="#334155"/>
      <text x="660" y="125" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle">RDS Database</text>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 describe-vpcs", explanation: "Shows your default and custom VPCs with their CIDR blocks." },
      { command: "aws ec2 describe-subnets --filters Name=vpc-id,Values=vpc-xxxxxx", explanation: "Lists subnets within a specific VPC." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Place databases and application backends in Private Subnets with no public IPs.",
      "Use Security Groups as the primary firewall layer and NACLs as a coarse subnet-wide safety net.",
      "Enable VPC Flow Logs to investigate connection drops and network anomalies."
    ]),
    securityNotes: "Security Group rules can reference other Security Groups instead of IP CIDRs. For instance, allow MySQL port 3306 only from `sg-app-servers`.",
    costImplications: "CRITICAL FREE TIER WARNING: Creating a VPC and Internet Gateway is FREE. However, NAT Gateways cost ~$0.045/hour (~$32/month) plus data processing! In Free Tier learning labs, always tear down NAT Gateways or use free alternatives like a bastion host with an Elastic IP or VPC Endpoints for S3.",
    commonMistakesJson: JSON.stringify([
      "Leaving a NAT Gateway running in a personal Free Tier account, incurring unwanted monthly charges.",
      "Placing an RDS database in a public subnet with 0.0.0.0/0 access.",
      "Confusing Security Group (Stateful) and NACL (Stateless) return traffic behavior."
    ]),
    quickRevisionJson: JSON.stringify([
      "Security Group = Stateful, instance level, ALLOW rules only by default.",
      "NACL = Stateless, subnet level, numbered ALLOW and DENY rules.",
      "Public Subnet has route to IGW; Private Subnet routes outbound via NAT Gateway."
    ])
  },
  4: {
    simpleExplanation: "Amazon Elastic Compute Cloud (EC2) provides on-demand virtual servers in the cloud. Instead of purchasing physical servers and waiting weeks for delivery, you can launch a virtual machine in seconds. You choose an Amazon Machine Image (AMI) for your operating system, pick an Instance Type sizing CPU, Memory, and Network, attach persistent Elastic Block Store (EBS) disks, and automate startup scripts with User Data.",
    coreConceptsJson: JSON.stringify([
      { term: "AMI (Amazon Machine Image)", definition: "A pre-configured template containing OS, application server, and software packages to launch instances." },
      { term: "Instance Types", definition: "Categorized sizing families (e.g., General Purpose t3/t4g, Compute Optimized c6g, Memory Optimized r6g)." },
      { term: "User Data", definition: "A bootstrapping shell script executed once as root when the EC2 instance launches for the first time." },
      { term: "Elastic IP (EIP)", definition: "A static, public IPv4 address that you can allocate and reassign to different EC2 instances." },
      { term: "Purchasing Models", definition: "On-Demand (flexible pay-per-second), Reserved/Savings Plans (1-3 yr commitments), Spot (up to 90% discount on spare capacity), Dedicated Hosts." }
    ]),
    internalsExplanation: "AWS EC2 instances run on the AWS Nitro System — lightweight hypervisors and dedicated hardware cards that offload networking, storage, and security from the host CPU. The Instance Metadata Service (IMDSv2) runs at 169.254.169.254, allowing your application to retrieve temporary credentials, instance IDs, and network configurations securely.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1C2541"/>
      <g transform="translate(40, 50)">
        <rect width="180" height="100" rx="8" fill="#1C2541" stroke="#38BDF8"/>
        <text x="90" y="40" fill="#38BDF8" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Amazon EC2 (t4g/t3)</text>
        <text x="90" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">vCPU &amp; RAM Compute</text>
      </g>
      <text x="240" y="105" fill="#38BDF8" font-size="16">⇄</text>
      <g transform="translate(280, 50)">
        <rect width="180" height="100" rx="8" fill="#1C2541" stroke="#F59E0B"/>
        <text x="90" y="40" fill="#FBBF24" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Root EBS Volume</text>
        <text x="90" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">gp3 / gp2 Block Storage</text>
      </g>
      <text x="480" y="105" fill="#38BDF8" font-size="16">⇄</text>
      <g transform="translate(520, 50)">
        <rect width="220" height="100" rx="8" fill="#1C2541" stroke="#10B981"/>
        <text x="110" y="40" fill="#34D399" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">IAM Instance Profile</text>
        <text x="110" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Auto-rotated STS Tokens</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 run-instances --image-id ami-xxxxxx --count 1 --instance-type t3.micro --key-name MyKeyPair", explanation: "Launches a free-tier eligible t3.micro instance." },
      { command: "aws ec2 stop-instances --instance-ids i-xxxxxx", explanation: "Stops an instance to halt compute billing while preserving root EBS storage." },
      { command: "aws ec2 terminate-instances --instance-ids i-xxxxxx", explanation: "Permanently deletes the instance and attached root volume." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always attach an IAM Role to your EC2 instance instead of embedding credentials in your code.",
      "Use AWS Graviton (t4g) processors for up to 40% better price-performance over traditional x86.",
      "Stop or terminate unused instances immediately when practicing to avoid eating into your monthly 750 free hours."
    ]),
    securityNotes: "Enforce IMDSv2 (token-based session) on all EC2 instances to prevent SSRF vulnerabilities from leaking instance IAM credentials.",
    costImplications: "AWS Free Tier provides 750 hours per month of t2.micro or t3.micro (depending on region) for the first 12 months. An unattached Elastic IP address incurs a charge (~$0.005/hour) if not associated with a running instance!",
    commonMistakesJson: JSON.stringify([
      "Allocating an Elastic IP and leaving it disassociated, generating hourly idle charges.",
      "Forgetting to terminate test instances, consuming the 750 free-tier hours before the month ends."
    ]),
    quickRevisionJson: JSON.stringify([
      "Free Tier: 750 hours/month of t2.micro or t3.micro.",
      "Spot Instances offer up to 90% savings for fault-tolerant, interruptible workloads.",
      "Stopping an instance pauses compute charges, but EBS volume storage charges remain."
    ])
  },
  5: {
    simpleExplanation: "Elastic Load Balancing (ELB) and Auto Scaling Groups (ASG) work hand-in-hand to ensure your web application is always highly available and able to handle unexpected traffic surges. The Load Balancer acts as a single point of entry, distributing traffic across healthy EC2 instances in multiple AZs. When traffic surges, the Auto Scaling Group automatically launches additional EC2 instances; when traffic drops, it gracefully terminates excess instances to minimize cost.",
    coreConceptsJson: JSON.stringify([
      { term: "Application Load Balancer (ALB)", definition: "Layer 7 load balancer supporting HTTP/HTTPS, path-based routing (/api vs /app), host-based routing, and WebSockets." },
      { term: "Network Load Balancer (NLB)", definition: "Layer 4 load balancer handling millions of requests/second with ultra-low latency for TCP/UDP/TLS traffic." },
      { term: "Target Group", definition: "A logical collection of registered targets (EC2 instances, IP addresses, Lambda functions) with configured health checks." },
      { term: "Auto Scaling Group (ASG)", definition: "A collection of EC2 instances that scales out or in based on metrics like CPU utilization or request count." },
      { term: "Launch Template", definition: "The blueprint specifying AMI, instance type, IAM role, security groups, and user data for ASG instances." }
    ]),
    internalsExplanation: "The ALB constantly runs periodic Health Checks against targets in the Target Group (e.g. GET /health every 15s). If an instance returns HTTP 500 or times out consecutive times, ALB marks it Unhealthy and stops routing traffic to it. The ASG detects the unhealthy target and automatically terminates the bad instance and launches a brand new one to maintain the desired capacity.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(40, 60)">
        <rect width="110" height="80" rx="8" fill="#1E293B" stroke="#38BDF8"/>
        <text x="55" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">ALB (Layer 7)</text>
      </g>
      <text x="175" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(210, 35)">
        <rect width="530" height="130" rx="8" fill="#0F172A" stroke="#F59E0B" stroke-dasharray="4"/>
        <text x="25" y="25" fill="#FBBF24" font-size="11" font-family="system-ui" font-weight="bold">Auto Scaling Group (Min: 2, Max: 6)</text>
        <rect x="30" y="45" width="130" height="65" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="95" y="75" fill="#34D399" font-size="10" font-family="system-ui" text-anchor="middle">EC2 (AZ-a)</text>
        <rect x="190" y="45" width="130" height="65" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="255" y="75" fill="#34D399" font-size="10" font-family="system-ui" text-anchor="middle">EC2 (AZ-b)</text>
        <rect x="350" y="45" width="150" height="65" rx="6" fill="#334155" stroke="#94A3B8" stroke-dasharray="3"/>
        <text x="425" y="75" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">+ Dynamically Scaled</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws elbv2 describe-load-balancers", explanation: "Lists all ALBs and NLBs in your account." },
      { command: "aws autoscaling describe-auto-scaling-groups", explanation: "Shows ASG min, max, desired capacities and health status." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always deploy ALB across at least TWO public subnets in different Availability Zones.",
      "Use Target Tracking Scaling Policy (e.g., maintain average CPU at 60%) for smoother scaling.",
      "Configure health check path to a lightweight endpoint that verifies database/dependency connectivity."
    ]),
    securityNotes: "Terminate TLS/SSL at the ALB using certificates provisioned for free via AWS Certificate Manager (ACM).",
    costImplications: "ALB has a base cost of ~$0.0225/hour (~$16-18/month) plus LCU (Load Balancer Capacity Units). In Free Tier, you get 750 hours of Classic/Application Load Balancer sharing during your first 12 months, but delete it after labs to stay safe.",
    commonMistakesJson: JSON.stringify([
      "Attempting to deploy an Internet-facing ALB in a single Availability Zone (AWS requires at least two AZs).",
      "Setting health check thresholds too tight, causing healthy instances under temporary load to be prematurely killed."
    ]),
    quickRevisionJson: JSON.stringify([
      "ALB = Layer 7 (HTTP/HTTPS, path/host routing, target groups).",
      "NLB = Layer 4 (ultra-low latency, TCP/UDP, static IP).",
      "ASG = Automatically adjusts EC2 capacity based on load metrics."
    ])
  },
  6: {
    simpleExplanation: "Amazon Simple Storage Service (S3) is an infinitely scalable object store designed for 99.999999999% (11 9s) of data durability. Unlike a hard drive that stores files in blocks or folders, S3 stores objects (files + metadata) inside globally uniquely named containers called Buckets. S3 supports versioning, automated lifecycle transitions, static website hosting, cross-region replication, and granular security policies.",
    coreConceptsJson: JSON.stringify([
      { term: "Bucket", definition: "A globally unique logical container for storing objects in a specific AWS Region." },
      { term: "Object", definition: "A file (up to 5 TB) accompanied by metadata, uniquely identified by a Key." },
      { term: "Versioning", definition: "Preserves every version of every object, protecting against accidental overwrites and deletions." },
      { term: "Lifecycle Policies", definition: "Automated rules that transition objects to cheaper storage tiers or expire them after X days." },
      { term: "S3 Storage Classes", definition: "Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant, Glacier Flexible, Deep Archive." },
      { term: "Block Public Access (BPA)", definition: "An account- and bucket-level centralized safety switch that prevents public bucket leaks." }
    ]),
    internalsExplanation: "S3 automatically stores your objects across at least 3 physically separate Availability Zones by default (except One Zone-IA). When you upload an object, S3 acknowledges success only after synchronously writing to multiple AZs, providing strong read-after-write consistency for PUT and DELETE requests.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(30, 45)">
        <rect width="130" height="110" rx="8" fill="#EF4444"/>
        <text x="65" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">S3 Standard</text>
        <text x="65" y="70" fill="#FEE2E2" font-size="9" font-family="system-ui" text-anchor="middle">Frequent Access</text>
      </g>
      <text x="180" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(210, 45)">
        <rect width="130" height="110" rx="8" fill="#3B82F6"/>
        <text x="65" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Intelligent-Tiering</text>
        <text x="65" y="70" fill="#DBEAFE" font-size="9" font-family="system-ui" text-anchor="middle">Auto-optimizing</text>
      </g>
      <text x="360" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(390, 45)">
        <rect width="130" height="110" rx="8" fill="#10B981"/>
        <text x="65" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Standard-IA</text>
        <text x="65" y="70" fill="#D1FAE5" font-size="9" font-family="system-ui" text-anchor="middle">Infrequent / Rapid</text>
      </g>
      <text x="540" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(570, 45)">
        <rect width="170" height="110" rx="8" fill="#6366F1"/>
        <text x="85" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Glacier Deep Archive</text>
        <text x="85" y="70" fill="#E0E7FF" font-size="9" font-family="system-ui" text-anchor="middle">Lowest Cost ($0.00099/GB)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws s3 mb s3://my-unique-bucket-demo-12345", explanation: "Creates a new S3 bucket in your default region." },
      { command: "aws s3 cp myfile.txt s3://my-unique-bucket-demo-12345/", explanation: "Uploads a local file to the S3 bucket." },
      { command: "aws s3 ls s3://my-unique-bucket-demo-12345/", explanation: "Lists all objects in the bucket." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Keep S3 Block Public Access ENABLED unless explicitly hosting a public static website.",
      "Enable Default Server-Side Encryption (SSE-S3 or SSE-KMS) on all buckets.",
      "Use S3 Intelligent-Tiering when access patterns are unpredictable to avoid retrieval penalties."
    ]),
    securityNotes: "S3 Object Lock provides WORM (Write Once, Read Many) compliance to prevent records from being deleted even by the root user for regulatory retention.",
    costImplications: "Free Tier includes 5 GB of standard storage, 20,000 GET requests, and 2,000 PUT requests per month for 12 months. Be mindful of PUT/GET request fees when dealing with millions of tiny files.",
    commonMistakesJson: JSON.stringify([
      "Making an entire S3 bucket publicly readable to share a single image.",
      "Transitioning tiny files (<128KB) to Glacier or Standard-IA, where minimum capacity charges apply."
    ]),
    quickRevisionJson: JSON.stringify([
      "11 9s durability across 3+ AZs.",
      "Strong read-after-write consistency.",
      "Security: IAM Policies + Bucket Policies + Block Public Access."
    ])
  },
  7: {
    simpleExplanation: "Storage on AWS comes in three primary flavors: Block (EBS), File (EFS), and Object (S3). EBS is like an external SSD or virtual hard drive plugged into ONE EC2 server; it's ultra-fast and used for operating system boot drives and databases. EFS is a managed network drive (NFS) that can be mounted simultaneously by hundreds of EC2 instances and containers across multiple AZs. S3 is accessed over HTTP REST APIs for global files and backups.",
    coreConceptsJson: JSON.stringify([
      { term: "EBS (Elastic Block Store)", definition: "Network-attached block storage volume bound to an AZ, formatted with a filesystem for OS or database." },
      { term: "EBS Snapshots", definition: "Point-in-time incremental backups of EBS volumes stored durably in Amazon S3." },
      { term: "EFS (Elastic File System)", definition: "Managed, serverless NFS file system automatically scaling to petabytes and mounted by multiple instances simultaneously." },
      { term: "Storage Decision Matrix", definition: "Block (single VM, low latency) vs File (POSIX shared directory) vs Object (HTTP API, infinite scale)." }
    ]),
    internalsExplanation: "EBS communicates with EC2 instances over dedicated network links within a single AZ. Replicas of an EBS volume are maintained inside the same AZ for high durability. EFS, by contrast, automatically spreads data across multiple AZs, making it naturally resilient to AZ failure with no manual replication required.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <!-- EBS block -->
      <g transform="translate(40, 40)">
        <rect width="320" height="120" rx="8" fill="#1E293B" stroke="#EF4444"/>
        <text x="160" y="30" fill="#F87171" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Amazon EBS (Block)</text>
        <text x="160" y="55" fill="#CBD5E1" font-size="10" font-family="system-ui" text-anchor="middle">Attached to: 1 EC2 Instance (Single AZ)</text>
        <text x="160" y="80" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Use for: Boot OS, MySQL, High IOPS</text>
      </g>
      <!-- EFS block -->
      <g transform="translate(420, 40)">
        <rect width="340" height="120" rx="8" fill="#1E293B" stroke="#10B981"/>
        <text x="170" y="30" fill="#34D399" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Amazon EFS (File / NFS)</text>
        <text x="170" y="55" fill="#CBD5E1" font-size="10" font-family="system-ui" text-anchor="middle">Mounted by: 100s of EC2/Containers (Multi-AZ)</text>
        <text x="170" y="80" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Use for: Shared Media, CMS, Web Clusters</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 create-snapshot --volume-id vol-xxxxxx --description 'Weekly backup'", explanation: "Creates a point-in-time incremental backup snapshot of an EBS volume." },
      { command: "aws efs describe-file-systems", explanation: "Shows available EFS shared filesystems." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Use modern gp3 volumes instead of gp2 for EBS to get baseline 3,000 IOPS and 125 MB/s at 20% lower cost.",
      "Take EBS Snapshots before making significant OS upgrades or schema migrations.",
      "Enable EFS Lifecycle Management to automatically transition cold files to EFS Infrequent Access."
    ]),
    securityNotes: "Always check 'Enable Encryption' when creating EBS volumes. AWS encrypts the volume, snapshots, and subsequent restored volumes using KMS seamlessly with zero performance overhead.",
    costImplications: "Free Tier provides 30 GB of EBS storage (gp2/gp3) per month for 12 months. EFS provides 5 GB free storage. Remember that unattached EBS volumes continue to incur charges until deleted!",
    commonMistakesJson: JSON.stringify([
      "Terminating an EC2 instance but forgetting that attached secondary EBS volumes or unneeded snapshots continue to bill monthly.",
      "Trying to attach a standard EBS volume to two EC2 instances in different Availability Zones (EBS is AZ-locked)."
    ]),
    quickRevisionJson: JSON.stringify([
      "EBS = Block storage, single instance, single AZ.",
      "EFS = File storage (NFS), shared multi-instance, multi-AZ.",
      "S3 = Object storage, global HTTP access, infinite scaling."
    ])
  },
  8: {
    simpleExplanation: "Instead of running a one-size-fits-all database on a raw EC2 instance, AWS offers Purpose-Built Databases tailored to specific data models. For structured transactional data (OLTP), use RDS or Aurora. For flexible, ultra-high-throughput key-value and JSON documents with single-digit millisecond latency, use DynamoDB. For sub-millisecond caching, use ElastiCache. For analytics and petabyte-scale queries, use Redshift.",
    coreConceptsJson: JSON.stringify([
      { term: "Amazon RDS", definition: "Managed relational database engine for MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server." },
      { term: "Amazon Aurora", definition: "Cloud-native, MySQL/PostgreSQL-compatible relational database with up to 5x throughput and auto-scaling storage." },
      { term: "Amazon DynamoDB", definition: "Fully managed serverless NoSQL key-value and document store delivering single-digit millisecond latency at any scale." },
      { term: "Amazon ElastiCache", definition: "In-memory caching engine (Redis / Memcached) for extreme read throughput and session management." },
      { term: "Amazon Redshift", definition: "Columnar OLAP cloud data warehouse optimized for complex analytical SQL across petabytes." },
      { term: "Amazon Neptune", definition: "Graph database engine for traversing connected data like social graphs and fraud rings." }
    ]),
    internalsExplanation: "Relational engines organize rows with B-Tree indexes and ACID guarantees across table joins. DynamoDB partitions data by hashing the Partition Key (PK) across solid-state drives, guaranteeing predictable sub-10ms response times regardless of whether your dataset has 10 items or 10 billion items.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(30, 40)">
        <rect width="160" height="120" rx="8" fill="#1E293B" stroke="#3B82F6"/>
        <text x="80" y="30" fill="#60A5FA" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">RDS / Aurora</text>
        <text x="80" y="60" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Relational (OLTP / SQL)</text>
        <text x="80" y="85" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">E-commerce, Financials</text>
      </g>
      <g transform="translate(220, 40)">
        <rect width="160" height="120" rx="8" fill="#1E293B" stroke="#F59E0B"/>
        <text x="80" y="30" fill="#FBBF24" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">DynamoDB</text>
        <text x="80" y="60" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">NoSQL (Key-Value/Doc)</text>
        <text x="80" y="85" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Gaming, IoT, Mobile</text>
      </g>
      <g transform="translate(410, 40)">
        <rect width="160" height="120" rx="8" fill="#1E293B" stroke="#EF4444"/>
        <text x="80" y="30" fill="#F87171" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Redshift</text>
        <text x="80" y="60" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Columnar (OLAP/Analytics)</text>
        <text x="80" y="85" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Business Intelligence, ETL</text>
      </g>
      <g transform="translate(600, 40)">
        <rect width="160" height="120" rx="8" fill="#1E293B" stroke="#10B981"/>
        <text x="80" y="30" fill="#34D399" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">ElastiCache</text>
        <text x="80" y="60" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">In-Memory (Redis)</text>
        <text x="80" y="85" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Sub-ms cache, Leaderboards</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws rds describe-db-instances", explanation: "Lists all managed RDS database instances." },
      { command: "aws dynamodb list-tables", explanation: "Lists all NoSQL DynamoDB tables in the current region." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never pick a relational database when query patterns are pure key-value lookups; DynamoDB will be cheaper and scale infinitely.",
      "Front relational databases with Amazon ElastiCache to absorb heavy read spikes.",
      "Never run heavy analytical aggregate queries directly against a production OLTP database; replicate data into Amazon Redshift."
    ]),
    securityNotes: "Isolate databases in Private Subnets. Security groups should allow database ports (e.g. 3306 or 5432) ONLY from designated Application Server security groups.",
    costImplications: "DynamoDB includes a perpetual Free Tier of 25 GB storage and 25 write/read capacity units (always free!). RDS offers 750 hours/month of db.t3.micro or db.t4g.micro for 12 months. Redshift is NOT covered in standard Free Tier and incurs substantial hourly costs.",
    commonMistakesJson: JSON.stringify([
      "Launching an Amazon Redshift cluster for learning and leaving it running overnight.",
      "Exposing RDS database port directly to 0.0.0.0/0 on the public internet."
    ]),
    quickRevisionJson: JSON.stringify([
      "OLTP Relational: RDS & Aurora.",
      "NoSQL Key-Value: DynamoDB (perpetual free tier 25GB).",
      "In-Memory Cache: ElastiCache (Redis).",
      "Data Warehouse OLAP: Redshift."
    ])
  },
  9: {
    simpleExplanation: "Running enterprise databases requires balancing two distinct needs: High Availability (Disaster Recovery) and Read Scalability (Performance). AWS RDS provides Multi-AZ deployments for high availability: a synchronous standby replica is maintained in a second AZ. If the primary fails, RDS automatically points traffic to the standby with zero code changes. For performance, RDS lets you add asynchronous Read Replicas to offload read-heavy reporting queries. Amazon Aurora takes this further with a cloud-native shared storage architecture across 3 AZs.",
    coreConceptsJson: JSON.stringify([
      { term: "Multi-AZ Deployment", definition: "Synchronous replication to a passive Standby DB in another AZ; automated failover in 60-120s for High Availability." },
      { term: "Read Replica", definition: "Asynchronous replication to active read-only DB copies used to scale read throughput." },
      { term: "Amazon Aurora", definition: "AWS database engine maintaining 6 copies of data across 3 AZs on distributed SSD storage." },
      { term: "Aurora Serverless", definition: "On-demand, auto-scaling configuration that scales database capacity (ACUs) up and down based on application load." }
    ]),
    internalsExplanation: "In standard RDS Multi-AZ, replication is SYNCHRONOUS: writes are committed to the primary instance and the standby EBS volume before acknowledging the client. Read replicas use ASYNCHRONOUS replication, so there is slight replica lag. Aurora decouples compute from storage: compute nodes communicate over a 10Gbps mesh directly to a distributed storage fleet of 6 storage chunks across 3 AZs, writing only database redo logs (log is the database).",
    architectureSvg: `<svg viewBox="0 0 800 210" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="190" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <!-- Multi-AZ box -->
      <g transform="translate(30, 40)">
        <rect width="340" height="130" rx="8" fill="#1E293B" stroke="#F59E0B"/>
        <text x="170" y="25" fill="#FBBF24" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Multi-AZ (High Availability / Failover)</text>
        <rect x="20" y="45" width="130" height="60" rx="6" fill="#334155" stroke="#10B981"/>
        <text x="85" y="75" fill="#34D399" font-size="10" font-family="system-ui" text-anchor="middle">Primary (Active)</text>
        <text x="170" y="80" fill="#FBBF24" font-size="14" text-anchor="middle">⇄</text>
        <rect x="190" y="45" width="130" height="60" rx="6" fill="#334155" stroke="#94A3B8"/>
        <text x="255" y="75" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Standby (Passive)</text>
      </g>
      <!-- Read Replica box -->
      <g transform="translate(420, 40)">
        <rect width="340" height="130" rx="8" fill="#1E293B" stroke="#3B82F6"/>
        <text x="170" y="25" fill="#60A5FA" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Read Replicas (Read Scaling / Performance)</text>
        <rect x="20" y="45" width="130" height="60" rx="6" fill="#334155" stroke="#10B981"/>
        <text x="85" y="75" fill="#34D399" font-size="10" font-family="system-ui" text-anchor="middle">Primary (Read/Write)</text>
        <text x="170" y="80" fill="#60A5FA" font-size="14" text-anchor="middle">→</text>
        <rect x="190" y="45" width="130" height="60" rx="6" fill="#334155" stroke="#38BDF8"/>
        <text x="255" y="75" fill="#38BDF8" font-size="10" font-family="system-ui" text-anchor="middle">Replica (Read Only)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws rds reboot-db-instance --db-instance-identifier my-db --force-failover", explanation: "Simulates an Availability Zone disaster by forcing Multi-AZ failover to the standby." },
      { command: "aws rds create-db-instance-read-replica --db-instance-identifier my-replica --source-db-instance-identifier my-db", explanation: "Creates a new read replica to offload read traffic." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never direct read traffic to a Multi-AZ standby (it is passive and inaccessible to queries).",
      "Point your reporting dashboards and analytical queries to Read Replica endpoints.",
      "Use Aurora if you need sub-second replica lag and up to 15 read replicas with auto-scaling."
    ]),
    securityNotes: "Enable encryption at rest with KMS when creating the DB instance (cannot be turned on retroactively on an existing unencrypted database without snapshot migration).",
    costImplications: "Multi-AZ doubles your instance and storage cost (running 2 instances). Multi-AZ is NOT covered under the AWS Free Tier! For learning, practice with Single-AZ RDS instances to stay within the 750 free monthly hours.",
    commonMistakesJson: JSON.stringify([
      "Enabling Multi-AZ on a free-tier test RDS database and receiving a bill at month's end.",
      "Attempting to query the Multi-AZ standby instance directly for read traffic."
    ]),
    quickRevisionJson: JSON.stringify([
      "Multi-AZ = Synchronous, for High Availability / Disaster Recovery.",
      "Read Replica = Asynchronous, for Read Scaling & Performance.",
      "Aurora stores 6 copies of data across 3 AZs."
    ])
  },
  10: {
    simpleExplanation: "Serverless computing lets you build and run applications without thinking about servers. With AWS Lambda, you upload your code and pay only for the compute time you consume down to the millisecond — when no code is running, your cost is literally zero. Paired with Amazon API Gateway (for HTTP endpoints), DynamoDB (serverless database), and EventBridge (event routing), you can build entire web applications that scale automatically from zero to millions of users.",
    coreConceptsJson: JSON.stringify([
      { term: "AWS Lambda", definition: "Event-driven compute service that executes code in response to events and automatically manages underlying resources." },
      { term: "Amazon API Gateway", definition: "Fully managed service to create, publish, maintain, and secure REST, HTTP, and WebSocket APIs." },
      { term: "Cold Start", definition: "The initial latency experienced when Lambda downloads code and initializes a new container execution environment." },
      { term: "Amazon EventBridge", definition: "A serverless event bus that connects application data, third-party SaaS apps, and AWS services." },
      { term: "AWS Step Functions", definition: "Visual workflow state machine orchestrating multiple Lambda functions, retries, and error handling." }
    ]),
    internalsExplanation: "When an event triggers a Lambda function, AWS allocates an ephemeral MicroVM (using Firecracker technology). The container downloads your deployment package, initializes the runtime (Python, Node.js, Java), executes the handler function, and freezes the container for potential warm reuse. If no further requests arrive within several minutes, the container is destroyed.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(40, 60)">
        <rect width="120" height="80" rx="8" fill="#1E293B" stroke="#38BDF8"/>
        <text x="60" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Client App</text>
      </g>
      <text x="180" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(210, 60)">
        <rect width="140" height="80" rx="8" fill="#8B5CF6"/>
        <text x="70" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">API Gateway</text>
        <text x="70" y="55" fill="#DDD6FE" font-size="9" font-family="system-ui" text-anchor="middle">HTTP / REST</text>
      </g>
      <text x="370" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(400, 60)">
        <rect width="140" height="80" rx="8" fill="#F59E0B"/>
        <text x="70" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">AWS Lambda</text>
        <text x="70" y="55" fill="#FEF3C7" font-size="9" font-family="system-ui" text-anchor="middle">Event Compute</text>
      </g>
      <text x="560" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(590, 60)">
        <rect width="140" height="80" rx="8" fill="#10B981"/>
        <text x="70" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">DynamoDB</text>
        <text x="70" y="55" fill="#D1FAE5" font-size="9" font-family="system-ui" text-anchor="middle">Serverless NoSQL</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws lambda list-functions", explanation: "Lists all deployed Lambda functions." },
      { command: "aws lambda invoke --function-name HelloWorld response.json", explanation: "Manually triggers a Lambda function and saves the return payload." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Keep Lambda function code lean and minimize external package dependencies to reduce cold start duration.",
      "Initialize database connections and heavy SDK clients OUTSIDE the function handler to reuse them across warm invocations.",
      "Set an explicit maximum timeout (e.g. 10s) rather than letting rogue requests run up to the 15-minute ceiling."
    ]),
    securityNotes: "Every Lambda function executes with an assigned IAM Execution Role. Never grant permissions beyond the exact S3 bucket or DynamoDB table the function touches.",
    costImplications: "AWS Lambda includes a PERPETUAL Free Tier of 1,000,000 free requests and 400,000 GB-seconds of compute time every month for all accounts (new and old). This makes Lambda one of the safest services to learn without paying a cent.",
    commonMistakesJson: JSON.stringify([
      "Designing long-running batch jobs (>15 minutes) inside Lambda; use AWS Batch or ECS tasks instead.",
      "Putting Lambda inside a VPC without needing private VPC resources, which used to cause significant cold start penalties."
    ]),
    quickRevisionJson: JSON.stringify([
      "Lambda max execution timeout is 15 minutes.",
      "Pay only for execution duration and memory allocated.",
      "Perpetual Free Tier: 1M requests/month + 400k GB-sec."
    ])
  },
  11: {
    simpleExplanation: "Containers package your application code with all its dependencies into an isolated container image that runs identically on your laptop, test server, and AWS cloud. On AWS, you store images in Amazon Elastic Container Registry (ECR). For orchestration, you can choose Amazon Elastic Container Service (ECS) for AWS-native simplicity or Amazon Elastic Kubernetes Service (EKS) for open-source Kubernetes compatibility. With AWS Fargate, you can run containers without managing any EC2 virtual machines.",
    coreConceptsJson: JSON.stringify([
      { term: "Amazon ECR", definition: "A fully managed, secure Docker and OCI container image registry." },
      { term: "Amazon ECS", definition: "AWS-native container orchestration service optimized for deep AWS integration and simplicity." },
      { term: "Amazon EKS", definition: "Certified Kubernetes-conformant managed service to run Kubernetes clusters without managing the master control plane." },
      { term: "AWS Fargate", definition: "Serverless compute engine for containers; runs ECS tasks or EKS pods without provisioning EC2 instances." }
    ]),
    internalsExplanation: "In traditional EC2 launch type, you manage the EC2 instances, OS patching, and Docker daemon. In Fargate launch type, AWS handles the virtualization slice, security isolation, and hardware provisioning per container task. Each Fargate task receives its own Elastic Network Interface (ENI) with a private IP in your VPC.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(40, 50)">
        <rect width="180" height="100" rx="8" fill="#1E293B" stroke="#F59E0B"/>
        <text x="90" y="40" fill="#FBBF24" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Amazon ECS</text>
        <text x="90" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">AWS-Native Simplicity</text>
      </g>
      <g transform="translate(260, 50)">
        <rect width="180" height="100" rx="8" fill="#1E293B" stroke="#8B5CF6"/>
        <text x="90" y="40" fill="#A78BFA" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Amazon EKS</text>
        <text x="90" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Kubernetes Standard</text>
      </g>
      <text x="465" y="105" fill="#38BDF8" font-size="16">→</text>
      <g transform="translate(500, 50)">
        <rect width="240" height="100" rx="8" fill="#1E293B" stroke="#38BDF8"/>
        <text x="120" y="40" fill="#38BDF8" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">AWS Fargate</text>
        <text x="120" y="65" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Serverless: Zero VMs to Manage</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin xxxxx.dkr.ecr.us-east-1.amazonaws.com", explanation: "Authenticates your local Docker CLI to your private ECR registry." },
      { command: "aws ecs list-clusters", explanation: "Shows active ECS clusters." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Choose ECS unless you have an existing multi-cloud Kubernetes deployment or specialized Helm charts.",
      "Use AWS Fargate to eliminate EC2 patching, cluster capacity planning, and AMI management.",
      "Assign IAM Task Roles so that containers have distinct fine-grained permissions rather than inheriting the broad EC2 host role."
    ]),
    securityNotes: "Enable ECR Image Scanning on Push to automatically discover known CVE vulnerabilities in your container images.",
    costImplications: "EKS charges $0.10/hour (~$73/month) just for the Kubernetes control plane cluster! In Free Tier, NEVER leave an EKS cluster running. Prefer ECS with Fargate for practice, or practice with local Minikube.",
    commonMistakesJson: JSON.stringify([
      "Creating an Amazon EKS cluster for a 20-minute tutorial and forgetting to delete it, incurring a $70+ surprise bill.",
      "Running multi-tenant containers with hardcoded secrets inside Dockerfiles."
    ]),
    quickRevisionJson: JSON.stringify([
      "ECS = AWS-native container orchestration.",
      "EKS = Managed Kubernetes (costs $0.10/hr for control plane).",
      "Fargate = Serverless compute for containers (no EC2 nodes)."
    ])
  },
  12: {
    simpleExplanation: "Observability is your window into the health, performance, and security of your cloud infrastructure. AWS provides four core pillars: Amazon CloudWatch for collecting metrics, storing logs, and triggering alarms; AWS CloudTrail for auditing who made what API call; AWS Config for tracking whether resource configurations comply with organizational rules; and AWS X-Ray for tracing distributed requests end-to-end across microservices.",
    coreConceptsJson: JSON.stringify([
      { term: "CloudWatch Metrics", definition: "Time-series numerical data points representing CPU, memory, disk, network, and custom application stats." },
      { term: "CloudWatch Logs", definition: "Centralized log ingestion, filtering, and live query system (CloudWatch Logs Insights)." },
      { term: "CloudWatch Alarms", definition: "Automated thresholds that send SNS email alerts or trigger Auto Scaling actions." },
      { term: "AWS CloudTrail", definition: "Governance log recording all AWS Management Console, CLI, and SDK API calls made in your account." },
      { term: "AWS Config", definition: "Continuous compliance service that records resource configuration changes and audits them against rules." },
      { term: "AWS X-Ray", definition: "Distributed tracing service visualizing service maps and latency bottlenecks across microservices." }
    ]),
    internalsExplanation: "CloudTrail writes log files into an encrypted S3 bucket every ~5 minutes. CloudWatch Alarms evaluate metric data points over specified evaluation periods (e.g. 3 consecutive data points above 80% CPU) before changing state from OK to ALARM, preventing false alarms from brief transient spikes.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(30, 60)">
        <rect width="130" height="80" rx="8" fill="#1E293B" stroke="#38BDF8"/>
        <text x="65" y="45" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">App / Resources</text>
      </g>
      <text x="180" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(210, 60)">
        <rect width="150" height="80" rx="8" fill="#F59E0B"/>
        <text x="75" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CloudWatch</text>
        <text x="75" y="55" fill="#FEF3C7" font-size="9" font-family="system-ui" text-anchor="middle">Metrics &amp; Logs</text>
      </g>
      <text x="380" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(410, 60)">
        <rect width="150" height="80" rx="8" fill="#8B5CF6"/>
        <text x="75" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CloudTrail &amp; Config</text>
        <text x="75" y="55" fill="#DDD6FE" font-size="9" font-family="system-ui" text-anchor="middle">Audit &amp; Governance</text>
      </g>
      <text x="580" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(610, 60)">
        <rect width="140" height="80" rx="8" fill="#EF4444"/>
        <text x="70" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Alarm / Alert</text>
        <text x="70" y="55" fill="#FEE2E2" font-size="9" font-family="system-ui" text-anchor="middle">SNS Email / PagerDuty</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws cloudwatch describe-alarms", explanation: "Shows status of all configured metric alarms." },
      { command: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=RunInstances", explanation: "Searches CloudTrail audit logs to see who launched EC2 instances." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Enable CloudTrail across ALL regions and deliver logs to an encrypted, locked S3 bucket with MFA delete.",
      "Install the unified CloudWatch Agent on EC2 instances to collect Memory and Disk utilization (not captured by hypervisor default metrics).",
      "Set retention policies on CloudWatch Log Groups (e.g. 30 or 90 days) so logs don't accumulate forever."
    ]),
    securityNotes: "CloudTrail logs are vital for forensics. Use CloudTrail log file validation to ensure audit logs have not been tampered with or deleted by an attacker.",
    costImplications: "Free Tier includes 10 custom metrics, 5 GB log ingestion, and 10 alarm metrics. CloudTrail management events are free for the first copy. Be cautious with high-frequency custom metrics and verbose debug logging.",
    commonMistakesJson: JSON.stringify([
      "Assuming CloudWatch tracks EC2 memory utilization out of the box (standard metrics only see CPU, disk I/O, network).",
      "Leaving CloudWatch Logs with 'Never Expire', leading to huge accumulated storage charges."
    ]),
    quickRevisionJson: JSON.stringify([
      "CloudWatch = Performance, Metrics, Logs, Alarms.",
      "CloudTrail = Auditing, API history (who did what).",
      "AWS Config = Resource configuration compliance.",
      "X-Ray = Distributed tracing & service maps."
    ])
  },
  13: {
    simpleExplanation: "Security in the cloud follows a Defense-in-Depth model: protecting your application across every single layer rather than relying on a single perimeter. At the internet edge, AWS WAF and AWS Shield defend against DDoS and web application exploits. In the network layer, private subnets and security groups isolate compute. For data protection, AWS KMS manages encryption keys, and AWS Secrets Manager securely stores and automatically rotates database passwords. Amazon GuardDuty uses intelligent machine learning to detect compromised accounts.",
    coreConceptsJson: JSON.stringify([
      { term: "AWS KMS (Key Management Service)", definition: "Managed service to create and control encryption keys (Customer Managed Keys - CMKs)." },
      { term: "AWS Secrets Manager", definition: "Secure storage with automated rotation for database credentials, API keys, and OAuth tokens." },
      { term: "AWS WAF", definition: "Web Application Firewall monitoring HTTP/S requests to ALB, CloudFront, or API Gateway to block SQL injection and XSS." },
      { term: "AWS Shield", definition: "Managed DDoS protection (Standard is free and automatic; Advanced offers specialized 24/7 response)." },
      { term: "Amazon GuardDuty", definition: "Intelligent threat detection analyzing VPC Flow Logs, DNS logs, and CloudTrail events." },
      { term: "AWS Security Hub", definition: "Centralized compliance posture dashboard evaluating standards like CIS AWS Foundations." }
    ]),
    internalsExplanation: "KMS uses envelope encryption: a Master Key (KMS Key) encrypts a Data Key, and the plaintext Data Key encrypts the actual file. Plaintext data keys are immediately purged from memory, ensuring that even if storage media is stolen, data cannot be decrypted without contacting the KMS hardware security modules (HSMs).",
    architectureSvg: `<svg viewBox="0 0 800 210" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="190" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(30, 40)">
        <rect width="130" height="130" rx="8" fill="#1E293B" stroke="#EF4444"/>
        <text x="65" y="35" fill="#F87171" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Perimeter</text>
        <text x="65" y="65" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">AWS WAF</text>
        <text x="65" y="85" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">AWS Shield</text>
        <text x="65" y="105" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">CloudFront</text>
      </g>
      <text x="180" y="110" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(210, 40)">
        <rect width="140" height="130" rx="8" fill="#1E293B" stroke="#F59E0B"/>
        <text x="70" y="35" fill="#FBBF24" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Network</text>
        <text x="70" y="65" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Private Subnets</text>
        <text x="70" y="85" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Security Groups</text>
        <text x="70" y="105" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">NACLs</text>
      </g>
      <text x="370" y="110" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(400, 40)">
        <rect width="150" height="130" rx="8" fill="#1E293B" stroke="#3B82F6"/>
        <text x="75" y="35" fill="#60A5FA" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Compute &amp; App</text>
        <text x="75" y="65" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">IAM Least Privilege</text>
        <text x="75" y="85" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Secrets Manager</text>
        <text x="75" y="105" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">Inspector Scan</text>
      </g>
      <text x="570" y="110" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(600, 40)">
        <rect width="150" height="130" rx="8" fill="#1E293B" stroke="#10B981"/>
        <text x="75" y="35" fill="#34D399" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Data Layer</text>
        <text x="75" y="65" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">KMS at Rest</text>
        <text x="75" y="85" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">TLS/HTTPS in Transit</text>
        <text x="75" y="105" fill="#CBD5E1" font-size="9" font-family="system-ui" text-anchor="middle">S3 Block Public</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws kms list-keys", explanation: "Shows available customer and AWS-managed KMS encryption keys." },
      { command: "aws secretsmanager list-secrets", explanation: "Lists secrets managed in Secrets Manager." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never store credentials in code or environment variables; fetch dynamically from AWS Secrets Manager.",
      "Enforce TLS 1.2+ for all network traffic in transit.",
      "Rotate passwords and access keys every 90 days."
    ]),
    securityNotes: "The 5 Golden Rules: 1. Least privilege 2. Encrypt sensitive data 3. Rotate secrets 4. Enable logging 5. Enforce MFA.",
    costImplications: "AWS Shield Standard is free. KMS charges $1/month per Customer Managed Key (AWS-managed keys are free). Secrets Manager costs $0.40/secret/month. GuardDuty has a 30-day free trial, after which it charges based on analyzed log volume.",
    commonMistakesJson: JSON.stringify([
      "Creating dozens of Customer Managed KMS keys for testing without deleting them ($1/key/month).",
      "Committing unencrypted database passwords in application configuration files."
    ]),
    quickRevisionJson: JSON.stringify([
      "KMS = Encryption at rest with envelope keys.",
      "Secrets Manager = Automatic rotation of database credentials.",
      "WAF = Protects HTTP/S against SQLi and XSS.",
      "GuardDuty = AI-based anomaly and threat detection."
    ])
  },
  14: {
    simpleExplanation: "DevOps and Infrastructure as Code (IaC) replace error-prone manual console clicking with automated, version-controlled scripts and pipelines. In AWS, you use AWS CodePipeline to automate the release workflow from Git commit to production. CodeBuild compiles code and runs automated tests. CodeDeploy handles zero-downtime deployment strategies. With AWS CloudFormation, AWS CDK, or Terraform, your entire infrastructure (VPCs, databases, load balancers) is expressed as code.",
    coreConceptsJson: JSON.stringify([
      { term: "AWS CodePipeline", definition: "Continuous integration and delivery orchestration service coordinating build, test, and deploy stages." },
      { term: "AWS CodeBuild", definition: "Fully managed build service that compiles source code, runs unit tests, and produces deployable artifacts." },
      { term: "AWS CodeDeploy", definition: "Automates application deployments to EC2, ECS, Lambda, or on-premises servers." },
      { term: "CloudFormation", definition: "AWS's native declarative JSON/YAML Infrastructure as Code service." },
      { term: "AWS CDK", definition: "Cloud Development Kit allowing you to define cloud resources using familiar programming languages (TypeScript, Python)." },
      { term: "Deployment Strategies", definition: "Rolling (gradual replacement), Blue/Green (instant switch with rollback), Canary (small percentage canary test)." }
    ]),
    internalsExplanation: "In a Blue/Green deployment, two identical production environments exist. Blue is live. The deployment pipeline provisions the Green environment with the new code. Once Green passes all health checks, the Route 53 DNS or ALB target group flips 100% of traffic from Blue to Green. If an unexpected error is detected, traffic is immediately flipped back to Blue with zero downtime.",
    architectureSvg: `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="180" rx="10" fill="#0B132B" stroke="#1E293B"/>
      <g transform="translate(30, 60)">
        <rect width="110" height="80" rx="8" fill="#1E293B" stroke="#38BDF8"/>
        <text x="55" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Source</text>
        <text x="55" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Git / GitHub</text>
      </g>
      <text x="160" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(190, 60)">
        <rect width="120" height="80" rx="8" fill="#F59E0B"/>
        <text x="60" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CodeBuild</text>
        <text x="60" y="55" fill="#FEF3C7" font-size="9" font-family="system-ui" text-anchor="middle">Build &amp; Test</text>
      </g>
      <text x="330" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(360, 60)">
        <rect width="130" height="80" rx="8" fill="#8B5CF6"/>
        <text x="65" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CodeDeploy</text>
        <text x="65" y="55" fill="#DDD6FE" font-size="9" font-family="system-ui" text-anchor="middle">Blue/Green Deploy</text>
      </g>
      <text x="510" y="105" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(540, 60)">
        <rect width="210" height="80" rx="8" fill="#10B981"/>
        <text x="105" y="35" fill="#FFF" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">CloudWatch Monitor</text>
        <text x="105" y="55" fill="#D1FAE5" font-size="9" font-family="system-ui" text-anchor="middle">Automated Rollback on Alert</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws cloudformation deploy --template-file template.yaml --stack-name MyDemoStack", explanation: "Deploys an infrastructure stack using CloudFormation." },
      { command: "aws codepipeline list-pipelines", explanation: "Lists all configured release pipelines." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never make manual configuration changes in production; make all changes via IaC code commits.",
      "Use Canary or Blue/Green deployments for mission-critical applications to avoid downtime.",
      "Store Terraform state files in an Amazon S3 bucket with versioning and DynamoDB state locking."
    ]),
    securityNotes: "Scan CloudFormation/Terraform templates using automated security linters (e.g., checkov or cfn-nag) in the CI/CD pipeline before provisioning infrastructure.",
    costImplications: "CloudFormation is free; you pay only for the AWS resources it provisions. CodePipeline provides 1 free active pipeline per month under Free Tier ($1/month per additional active pipeline). CodeBuild includes 100 build minutes/month on general1.small.",
    commonMistakesJson: JSON.stringify([
      "Modifying resources manually in the AWS console, causing 'drift' in CloudFormation or Terraform.",
      "Not setting up automated rollback triggers in CodeDeploy."
    ]),
    quickRevisionJson: JSON.stringify([
      "IaC = CloudFormation, CDK, Terraform.",
      "CI/CD = CodePipeline (flow), CodeBuild (compile/test), CodeDeploy (deployment).",
      "Blue/Green = Two identical environments with instant DNS/ALB switch."
    ])
  },
  15: {
    simpleExplanation: "Putting it all together: Modern AWS cloud architecture combines all individual services into a resilient, highly available, secure, and cost-optimized system. High-traffic requests enter through Amazon Route 53 (DNS), pass through CloudFront CDN with AWS WAF security at the edge, hit an Application Load Balancer, and route to containerized or EC2 compute running inside an Auto Scaling Group across multiple Availability Zones. Application state lives in an Aurora database paired with ElastiCache for speed, while static assets and backups reside in S3.",
    coreConceptsJson: JSON.stringify([
      { term: "Well-Architected Framework", definition: "AWS's 6 operational pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability." },
      { term: "Design for Failure", definition: "Assume hardware, networks, and AZs will fail; design systems that heal and reroute automatically." },
      { term: "Loose Coupling", definition: "Decouple services using SQS message queues and EventBridge buses so that failure of one component doesn't bring down others." },
      { term: "Right-Sizing", definition: "Continuously analyze compute and storage utilization to ensure you aren't paying for over-provisioned capacity." }
    ]),
    internalsExplanation: "End-to-end production flow: 1. DNS query to Route 53 resolves to nearest CloudFront Edge. 2. Edge executes WAF inspection and serves cached assets; dynamic requests pass through AWS Global Network to the public ALB. 3. ALB performs TLS offloading and balances requests across private EC2/ECS tasks. 4. Application checks ElastiCache Redis (sub-ms); on cache miss, queries Aurora DB cluster. 5. Nightly automated snapshots and logs stream into S3.",
    architectureSvg: `<svg viewBox="0 0 800 230" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="790" height="220" rx="12" fill="#0A0F1D" stroke="#1E293B"/>
      <g transform="translate(20, 95)">
        <circle cx="25" cy="20" r="20" fill="#38BDF8"/>
        <text x="25" y="24" fill="#FFF" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Users</text>
      </g>
      <text x="80" y="118" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(105, 75)">
        <rect width="90" height="80" rx="6" fill="#1E293B" stroke="#A855F7"/>
        <text x="45" y="35" fill="#C084FC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Route 53</text>
        <text x="45" y="55" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Global DNS</text>
      </g>
      <text x="205" y="118" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(225, 75)">
        <rect width="115" height="80" rx="6" fill="#1E293B" stroke="#EF4444"/>
        <text x="57" y="35" fill="#F87171" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">CloudFront+WAF</text>
        <text x="57" y="55" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Edge Security</text>
      </g>
      <text x="350" y="118" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(370, 75)">
        <rect width="90" height="80" rx="6" fill="#1E293B" stroke="#F59E0B"/>
        <text x="45" y="35" fill="#FBBF24" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">ALB</text>
        <text x="45" y="55" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Load Balancer</text>
      </g>
      <text x="470" y="118" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(490, 75)">
        <rect width="120" height="80" rx="6" fill="#1E293B" stroke="#10B981"/>
        <text x="60" y="35" fill="#34D399" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">ECS / ASG</text>
        <text x="60" y="55" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Multi-AZ Compute</text>
      </g>
      <text x="620" y="118" fill="#38BDF8" font-size="14">→</text>
      <g transform="translate(640, 75)">
        <rect width="130" height="80" rx="6" fill="#1E293B" stroke="#6366F1"/>
        <text x="65" y="35" fill="#818CF8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Aurora + Cache</text>
        <text x="65" y="55" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">DB &amp; S3 Backup</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws wellarchitected list-workloads", explanation: "Shows Well-Architected Tool reviews conducted for your cloud architecture." },
      { command: "aws ce get-cost-and-usage --time-period Start=2026-10-01,End=2026-10-15 --granularity MONTHLY --metrics UnblendedCost", explanation: "Analyzes actual spend and cost trends across all AWS services." }
    ]),
    bestPracticesJson: JSON.stringify([
      "10 Advanced Principles: 1. Design for failure 2. Multi-AZ by default 3. Decouple services 4. Automate infrastructure 5. Use managed services 6. Monitor everything 7. Encrypt sensitive data 8. Implement backups 9. Optimize cost continuously 10. Test disaster recovery.",
      "Conduct regular GameDays to simulate outage scenarios like an Availability Zone outage or database failover."
    ]),
    securityNotes: "Apply Defense-in-Depth at every layer and use AWS Organizations with Service Control Policies (SCPs) to set unbreakable guardrails across all AWS accounts.",
    costImplications: "Implement AWS Cost Anomaly Detection to receive real-time alerts if any service starts spending unexpectedly. Always configure an AWS Budget with 80% and 100% threshold notifications.",
    commonMistakesJson: JSON.stringify([
      "Building a complex multi-region setup when a well-architected Multi-AZ deployment in a single region provides 99.99% availability at 1/3 the cost.",
      "Never testing database restore from backup until a real disaster strikes."
    ]),
    quickRevisionJson: JSON.stringify([
      "Multi-AZ = High Availability (RTO/RPO in minutes).",
      "Multi-Region = Disaster Recovery & global latency (RTO/RPO in seconds, higher cost).",
      "Always decouple state with queues and caches."
    ])
  },
  16: {
    simpleExplanation: "Git is a free, open-source Distributed Version Control System (DVCS) designed to handle projects from small to very large with lightning-fast speed, a tiny footprint, and unparalleled flexibility. Version control is the practice of preserving older and latest versions of code, enabling engineering teams to inspect differences, track changes, and roll back mistakes. In VCS terminology, uploading code is called 'check-in' and downloading code is called 'checkout'. Unlike older Centralized Version Control Systems (CVCS) like SVN, CVS, or ClearCase—where all history lives on a single remote server that creates a single point of failure and requires constant internet access—Git gives every developer a complete local clone of the entire repository history. Developers can commit, branch, diff, and inspect history completely offline. Think of Git like the 'track changes' and 'version history' features in Google Docs, but purpose-built for code and multi-developer teams: everyone works locally without network lag, and later merges their changes back into a shared remote like GitHub.",
    coreConceptsJson: JSON.stringify([
      { term: "Version Control System (VCS)", definition: "Software that preserves older and latest versions of code, tracks exact author modifications over time, and enables seamless team collaboration and rollbacks." },
      { term: "Distributed VCS (DVCS) vs Centralized (CVCS)", definition: "CVCS (e.g. SVN) relies on a single central server (single point of failure, no offline commits); DVCS (Git) installs a full repository clone on every developer's machine with offline commits and zero single point of failure." },
      { term: "Check-in vs Checkout", definition: "Check-in refers to uploading/committing code to the version control system; Checkout refers to downloading code from the VCS or switching between different branches and historical snapshots." },
      { term: "The Three Sections (Local Architecture)", definition: "The three-stage lifecycle every local file moves through: Working Directory (untracked/modified), Staging Area (index/staged), and Local Repository (.git/committed DAG)." },
      { term: "Working Directory (Workspace)", definition: "The local folder on your filesystem where you edit files. New files here are initially 'untracked' until registered with 'git add'." },
      { term: "Staging Area (Index)", definition: "An intermediate memory holding zone where files marked 'ready to be permanently recorded' are staged before commit, allowing atomic, intentional commit grouping." },
      { term: "Local Repository (.git)", definition: "Hidden folder created by 'git init' containing configuration, refs, and the immutable cryptographic Directed Acyclic Graph (DAG) of committed snapshots." },
      { term: "Unstaging (git rm --cached / git reset)", definition: "Moving a file out of the Staging Area back into the Working Directory without deleting the file from disk, safely undoing an accidental 'git add'." },
      { term: "Commit Snapshot", definition: "An immutable cryptographic record of the staged state, stamped with a 40-character SHA hash, author metadata, timestamp, message, and parent commit pointer." },
      { term: "HEAD Pointer", definition: "A symbolic reference pointer indicating the current branch tip or specific commit currently checked out in your working tree." },
      { term: "Rebase vs Merge", definition: "Merge creates a 3-way merge commit preserving exact chronological branch convergence; Rebase replays feature commits on top of the base branch for a clean linear log." },
      { term: "Reflog (git reflog)", definition: "A local tamper-evident safety ledger recording every movement of HEAD, enabling recovery of deleted branches, hard resets, and orphaned commits." }
    ]),
    internalsExplanation: "Under the hood, running 'git init' creates a hidden '.git' folder containing 'HEAD', 'config', 'objects/', and 'refs/'. Git manages data as a content-addressable key-value object database stored in '.git/objects/'. There are four fundamental object types: 1. Blobs (raw file contents compressed with zlib, without filename metadata); 2. Trees (directory listings mapping file names, permissions, and subtrees to blob SHA hashes); 3. Commits (snapshots referencing a top-level Tree object, author/committer identities, ISO timestamps, commit messages, and parent commit hashes); 4. Tags (named immutable pointers to specific commit objects). Every object is keyed by a 160-bit SHA-1 or SHA-256 hash derived strictly from header metadata and file payload. Because each commit references its parent's hash, altering any historical byte cascades new hashes downstream, making Git an immutable cryptographic ledger. In Linux Ubuntu, install with 'sudo apt-get update && sudo apt-get install -y git' and verify with 'git --version'. Configure identity globally via 'git config --global user.name' and 'git config --global user.email'.",
    architectureSvg: `<svg viewBox="0 0 860 380" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#070D1E"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8"/>
        </marker>
        <marker id="revArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 10 1 L 0 5 L 10 9 z" fill="#F43F5E"/>
        </marker>
      </defs>
      <rect width="860" height="380" rx="16" fill="url(#bgGrad)" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Top Banner: CVCS vs DVCS -->
      <g transform="translate(30, 20)">
        <rect width="800" height="60" rx="10" fill="#111C38" stroke="#38BDF8" stroke-width="1.2"/>
        <text x="20" y="24" fill="#38BDF8" font-size="12" font-weight="bold" font-family="system-ui">CENTRALIZED (SVN) VS DISTRIBUTED (GIT) ARCHITECTURE</text>
        <text x="20" y="44" fill="#94A3B8" font-size="10.5" font-family="system-ui">Centralized VCS = Single server single-point-of-failure • Requires internet to commit. | Distributed VCS (Git) = Every clone is a complete repository backup • 100% offline commits.</text>
      </g>
      
      <!-- Section 1: Working Directory -->
      <g transform="translate(30, 110)">
        <rect width="175" height="185" rx="12" fill="#16223D" stroke="#38BDF8" stroke-width="1.8"/>
        <rect x="15" y="15" width="145" height="26" rx="6" fill="#0C4A6E"/>
        <text x="87" y="32" fill="#BAE6FD" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">1. WORKING DIRECTORY</text>
        <text x="87" y="60" fill="#F8FAFC" font-size="10" font-weight="600" text-anchor="middle" font-family="system-ui">Untracked / Modified</text>
        <text x="87" y="78" fill="#94A3B8" font-size="9.5" text-anchor="middle" font-family="system-ui">Files on local disk</text>
        <rect x="15" y="95" width="145" height="42" rx="6" fill="#0B132B" stroke="#38BDF8" stroke-width="0.8"/>
        <text x="87" y="112" fill="#F1F5F9" font-size="9" text-anchor="middle" font-family="monospace">git status (Red)</text>
        <text x="87" y="127" fill="#64748B" font-size="8.5" text-anchor="middle" font-family="monospace">echo "code" &gt; app.js</text>
        <text x="87" y="155" fill="#38BDF8" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="monospace">git init</text>
        <text x="87" y="170" fill="#64748B" font-size="8.5" text-anchor="middle" font-family="system-ui">Creates hidden .git folder</text>
      </g>
      
      <!-- Arrow 1: git add (Forward) -->
      <path d="M 215 170 L 255 170" stroke="#38BDF8" stroke-width="2.5" marker-end="url(#arrow)"/>
      <text x="235" y="160" fill="#38BDF8" font-size="9.5" font-weight="bold" font-family="monospace" text-anchor="middle">git add</text>
      
      <!-- Arrow 1 Rev: git rm --cached / git reset (Backward Unstaging) -->
      <path d="M 255 220 L 215 220" stroke="#F43F5E" stroke-width="2" stroke-dasharray="4" marker-end="url(#revArrow)"/>
      <text x="235" y="240" fill="#FB7185" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle">git rm --cached</text>
      <text x="235" y="252" fill="#FB7185" font-size="8" font-family="monospace" text-anchor="middle">or git reset</text>
      
      <!-- Section 2: Staging Area -->
      <g transform="translate(265, 110)">
        <rect width="175" height="185" rx="12" fill="#16223D" stroke="#10B981" stroke-width="1.8"/>
        <rect x="15" y="15" width="145" height="26" rx="6" fill="#064E3B"/>
        <text x="87" y="32" fill="#A7F3D0" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">2. STAGING AREA (INDEX)</text>
        <text x="87" y="60" fill="#F8FAFC" font-size="10" font-weight="600" text-anchor="middle" font-family="system-ui">Staged for Commit</text>
        <text x="87" y="78" fill="#94A3B8" font-size="9.5" text-anchor="middle" font-family="system-ui">Snapshot Preparation</text>
        <rect x="15" y="95" width="145" height="42" rx="6" fill="#0B132B" stroke="#10B981" stroke-width="0.8"/>
        <text x="87" y="112" fill="#34D399" font-size="9" text-anchor="middle" font-family="monospace">git status (Green)</text>
        <text x="87" y="127" fill="#6EE7B7" font-size="8.5" text-anchor="middle" font-family="monospace">git diff --cached</text>
        <text x="87" y="155" fill="#10B981" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="system-ui">Selective Staging</text>
        <text x="87" y="170" fill="#64748B" font-size="8.5" text-anchor="middle" font-family="system-ui">Group atomic changes</text>
      </g>
      
      <!-- Arrow 2: git commit (Forward) -->
      <path d="M 450 170 L 490 170" stroke="#10B981" stroke-width="2.5" marker-end="url(#arrow)"/>
      <text x="470" y="160" fill="#10B981" font-size="9.5" font-weight="bold" font-family="monospace" text-anchor="middle">git commit</text>
      
      <!-- Arrow 2 Rev: git reset HEAD~1 (Backward) -->
      <path d="M 490 220 L 450 220" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4" marker-end="url(#revArrow)"/>
      <text x="470" y="240" fill="#FBBF24" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle">git reset --soft</text>
      
      <!-- Section 3: Local Repository -->
      <g transform="translate(500, 110)">
        <rect width="175" height="185" rx="12" fill="#16223D" stroke="#A855F7" stroke-width="1.8"/>
        <rect x="15" y="15" width="145" height="26" rx="6" fill="#581C87"/>
        <text x="87" y="32" fill="#E9D5FF" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">3. LOCAL REPO (.git DAG)</text>
        <text x="87" y="60" fill="#F8FAFC" font-size="10" font-weight="600" text-anchor="middle" font-family="system-ui">Committed Snapshots</text>
        <text x="87" y="78" fill="#94A3B8" font-size="9.5" text-anchor="middle" font-family="system-ui">Immutable History Ledger</text>
        <rect x="15" y="95" width="145" height="42" rx="6" fill="#0B132B" stroke="#A855F7" stroke-width="0.8"/>
        <text x="87" y="112" fill="#C084FC" font-size="9" text-anchor="middle" font-family="monospace">git log --oneline</text>
        <text x="87" y="127" fill="#E9D5FF" font-size="8.5" text-anchor="middle" font-family="monospace">git log --graph</text>
        <text x="87" y="155" fill="#A855F7" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="system-ui">Branching &amp; HEAD</text>
        <text x="87" y="170" fill="#64748B" font-size="8.5" text-anchor="middle" font-family="system-ui">Offline commits &amp; rebase</text>
      </g>
      
      <!-- Arrow 3: git push (Forward to Remote) -->
      <path d="M 685 170 L 725 170" stroke="#A855F7" stroke-width="2.5" marker-end="url(#arrow)"/>
      <text x="705" y="160" fill="#C084FC" font-size="9.5" font-weight="bold" font-family="monospace" text-anchor="middle">git push</text>
      
      <!-- Arrow 3 Rev: git fetch / pull (Backward from Remote) -->
      <path d="M 725 220 L 685 220" stroke="#38BDF8" stroke-width="2" stroke-dasharray="4" marker-end="url(#revArrow)"/>
      <text x="705" y="240" fill="#38BDF8" font-size="8.5" font-weight="bold" font-family="monospace" text-anchor="middle">git pull</text>
      <text x="705" y="252" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">--rebase</text>
      
      <!-- Section 4: Remote Repository -->
      <g transform="translate(735, 110)">
        <rect width="95" height="185" rx="12" fill="#16223D" stroke="#EC4899" stroke-width="1.8"/>
        <rect x="10" y="15" width="75" height="26" rx="6" fill="#831843"/>
        <text x="47" y="32" fill="#FBCFE8" font-size="10" font-weight="bold" text-anchor="middle" font-family="system-ui">REMOTE</text>
        <text x="47" y="60" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle" font-family="system-ui">GitHub</text>
        <text x="47" y="75" fill="#94A3B8" font-size="8" text-anchor="middle" font-family="system-ui">Team Sync</text>
        <rect x="8" y="95" width="79" height="42" rx="6" fill="#0B132B" stroke="#EC4899" stroke-width="0.8"/>
        <text x="47" y="112" fill="#F472B6" font-size="8.5" text-anchor="middle" font-family="system-ui">Pull Request</text>
        <text x="47" y="127" fill="#F9A8D4" font-size="7.5" text-anchor="middle" font-family="system-ui">CI/CD Actions</text>
        <text x="47" y="155" fill="#EC4899" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="system-ui">Protected</text>
        <text x="47" y="170" fill="#64748B" font-size="7.5" text-anchor="middle" font-family="system-ui">Main branch</text>
      </g>
      
      <!-- Bottom Bar: Command Flow Cheat Sheet -->
      <g transform="translate(30, 312)">
        <rect width="800" height="52" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
        <text x="20" y="22" fill="#FBBF24" font-size="10" font-weight="bold" font-family="monospace">KEY UNSTAGING RULE:</text>
        <text x="180" y="22" fill="#E2E8F0" font-size="9.5" font-family="monospace">git rm --cached &lt;file&gt; / git reset &lt;file&gt; unstages back to Working Dir (keeps file on disk).</text>
        <text x="20" y="40" fill="#38BDF8" font-size="10" font-weight="bold" font-family="monospace">HISTORY REVISION:</text>
        <text x="180" y="40" fill="#E2E8F0" font-size="9.5" font-family="monospace">git clean -n (dry run) • git commit --amend • git rebase -i • git reflog (disaster recovery)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "git config --global user.name 'Your Name'", explanation: "Sets commit author username globally for all repos on machine." },
      { command: "git config --global user.email 'you@example.com'", explanation: "Sets commit author email globally (must match GitHub account)." },
      { command: "git config --global alias.glog 'log --graph --oneline'", explanation: "Creates custom shortcut alias: 'git glog' runs graph oneline log." },
      { command: "git config --system core.editor vi", explanation: "Sets default text editor for commit messages for all system users." },
      { command: "git config --global --list", explanation: "Lists all configured global Git properties and identities." },
      { command: "git init [directory]", explanation: "Initializes a new empty Git repository and creates hidden .git directory." },
      { command: "git clone <repo>", explanation: "Clones remote repository onto local machine over HTTP or SSH." },
      { command: "git status", explanation: "Shows current state: untracked, staged, and committed files across 3 sections." },
      { command: "git add <file> | git add .", explanation: "Stages specific file or all modified/new files into intermediate staging area." },
      { command: "git rm --cached <file>", explanation: "Unstages file back to working directory; leaves file completely untouched on disk." },
      { command: "git reset <file>", explanation: "Equivalent safe way to unstage a file back to working tree without data loss." },
      { command: "git commit -m 'feat: descriptive message'", explanation: "Permanently records staged snapshot into local repository with message." },
      { command: "git commit --amend", explanation: "Replaces last commit with staged changes combined, or edits last commit message." },
      { command: "git log --oneline", explanation: "Displays commit history condensed into single lines with abbreviated SHA." },
      { command: "git log -<limit>", explanation: "Limits number of commits displayed (e.g. 'git log -5' limits to 5 commits)." },
      { command: "git log -p", explanation: "Displays full line-by-line patch diff of each commit in repository history." },
      { command: "git log --stat", explanation: "Includes files altered and relative number of lines added/deleted per commit." },
      { command: "git log --author='<pattern>'", explanation: "Searches commit history for commits created by a particular author." },
      { command: "git log --grep='<pattern>'", explanation: "Searches commit history for commits with message matching text pattern." },
      { command: "git log <since>..<until>", explanation: "Shows commits occurring between two revisions (commit IDs, branches, HEAD)." },
      { command: "git log --graph --decorate", explanation: "Draws text ASCII branch graph on left and decorates with branch/tag names." },
      { command: "git diff", explanation: "Shows unstaged changes between working directory and staging index." },
      { command: "git diff HEAD", explanation: "Shows difference between working directory and the most recent commit." },
      { command: "git diff --cached", explanation: "Shows difference between staged changes (index) and the last commit." },
      { command: "git clean -n", explanation: "Dry-run preview: shows which untracked files would be removed without deleting." },
      { command: "git clean -f", explanation: "Force executes deletion of untracked files from working directory." },
      { command: "git revert <commit>", explanation: "Safely undoes changes of <commit> by creating a new inverse forward commit." },
      { command: "git reset", explanation: "Resets staging area to match latest commit, leaving working directory unchanged." },
      { command: "git reset --hard", explanation: "Resets staging area AND working directory, overwriting all uncommitted work." },
      { command: "git reset <commit>", explanation: "Moves branch tip backward to <commit>, resets staging, leaves working dir alone." },
      { command: "git reset --hard <commit>", explanation: "Resets staging and working dir to <commit>; deletes all commits after <commit>." },
      { command: "git branch [name]", explanation: "Lists all local branches; creates new branch with [name] if specified." },
      { command: "git checkout -b <branch>", explanation: "Creates and checks out new branch (drop '-b' to checkout existing branch)." },
      { command: "git merge <branch>", explanation: "Merges specified <branch> into the currently active branch." },
      { command: "git rebase <base>", explanation: "Rebases current branch onto <base> (commit ID, branch, or tag)." },
      { command: "git rebase -i <base>", explanation: "Interactively rebases commits: opens editor to squash, reword, or drop commits." },
      { command: "git reflog [--relative-date] [--all]", explanation: "Shows ledger of HEAD position changes; disaster recovery for lost commits." },
      { command: "git remote add <name> <url>", explanation: "Creates shortcut connection (e.g. 'origin') to remote repository URL." },
      { command: "git fetch <remote> [branch]", explanation: "Fetches objects and refs from remote repository without merging into files." },
      { command: "git pull <remote>", explanation: "Fetches remote copy of current branch and immediately merges into local copy." },
      { command: "git pull --rebase <remote>", explanation: "Fetches remote copy and rebases local commits on top, avoiding merge commits." },
      { command: "git push <remote> <branch>", explanation: "Pushes branch commits and objects to remote repo (creates branch if absent)." },
      { command: "git push <remote> --force", explanation: "Forces push even if non-fast-forward (use only on private feature branches)." },
      { command: "git push <remote> --all", explanation: "Pushes all local branches to the specified remote repository at once." },
      { command: "git push <remote> --tags", explanation: "Sends all local tags to remote repository (tags are not sent by default push)." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Commit locally often (cheap, fast, and offline), and push to shared remote repository at natural milestones.",
      "Set your global 'user.name' and 'user.email' immediately after installation so commit attribution is never broken.",
      "Prefer staging specific, related files ('git add file1 file2') over blind 'git add .' to create atomic, cohesive commits.",
      "Check 'git status' constantly: before staging, after staging, and before committing to eliminate guesswork.",
      "Always run 'git clean -n' (dry run) before executing destructive 'git clean -f' to avoid accidental code loss.",
      "Never run 'git push --force' on shared public branches like 'main' or 'develop'; use '--force-with-lease' on personal branches.",
      "Write clear, imperative commit messages ('feat: add token validation') so teammates easily understand project history.",
      "Remember that every developer's local repository is effectively a complete backup of the project's entire history."
    ]),
    securityNotes: "Never commit API keys, database passwords, or .env files into Git history. Even if deleted in a later commit, secrets remain accessible in Git commit history and git reflog. Always populate .gitignore before git add. Enable GitHub Secret Scanning, Dependabot alerts, and pre-commit hooks.",
    costImplications: "Git is free open-source software with zero licensing cost. Local commits, branches, and logs consume zero network or cloud infrastructure cost. GitHub provides free unlimited public/private repositories and 2,000 monthly Actions CI/CD minutes.",
    commonMistakesJson: JSON.stringify([
      "Assuming 'git add' saves your work permanently — staging is only a preparation step; files are not saved into project history until 'git commit' runs.",
      "Confusing 'untracked' with 'deleted' — an untracked file still exists on disk in the working directory; Git is merely not yet recording its versions.",
      "Confusing 'git rm --cached' (unstages file while preserving it on disk) with plain 'git rm' (permanently removes file from disk entirely).",
      "Running 'git init' inside an already-initialized repository's subfolder by accident, creating a broken nested repository.",
      "Deleting the '.git' folder thinking it is clutter — doing so permanently destroys all local commit history, branches, and configuration for that project.",
      "Skipping 'sudo apt-get update' before installing Git on Ubuntu, resulting in failed installations or outdated package versions.",
      "Forgetting to verify with 'git --version' after install, leading to troubleshooting problems caused by ancient Git builds.",
      "Confusing 'distributed' with 'no central server at all' — teams still use a shared remote (like GitHub) to sync everyone's local repos together.",
      "Treating version control as just a backup — its core value is tracking who changed what and enabling teams to collaborate concurrently without overwriting code.",
      "Not checking in code regularly, defeating the purpose of having a shared, up-to-date project history.",
      "Using destructive 'git reset --hard' without reviewing 'git status' or stashing, permanently discarding uncommitted local work."
    ]),
    quickRevisionJson: JSON.stringify([
      "Git is a free, open-source distributed version control system (DVCS) — fast, lightweight, and flexible.",
      "Version control preserves every version of code and tracks who changed what — via check-in (upload) and checkout (download).",
      "Centralized VCS (SVN) uses one central server (single point of failure); Distributed VCS (Git) gives every developer a full local repository clone.",
      "Every file moves through three sections locally: Working Directory (untracked) -> git add -> Staging Area (staged) -> git commit -> Local Repository (committed).",
      "Unstage safely without deleting disk files using: 'git rm --cached <file>' or 'git reset <file>'.",
      "Inspect state constantly with 'git status', diffs with 'git diff HEAD' / 'git diff --cached', and history with 'git log --oneline --graph'.",
      "Cheat sheet core commands: git init, git add, git commit -m, git status, git log, git clean -n, git reset, git rebase -i, git reflog, git pull --rebase, git push."
    ])
  },
  17: {
    simpleExplanation: "Jenkins is the industry-standard, open-source automation server used by millions of engineering teams to build, test, and deploy software continuously. Think of Jenkins as the automated factory conductor: the moment code is pushed to GitHub, a webhook triggers Jenkins. The Jenkins Controller assigns tasks to build worker nodes (Agents), runs automated unit tests, inspects code quality with SonarQube, packages Docker containers, and deploys artifacts to staging and production servers.",
    coreConceptsJson: JSON.stringify([
      { term: "Jenkins Controller (Master)", definition: "The brain that manages configuration, schedules jobs, authenticates users, monitors agent health, and parses Jenkinsfiles." },
      { term: "Jenkins Agent (Node)", definition: "Worker machines (VMs, Docker containers, or Kubernetes pods) where build and test commands actually run." },
      { term: "Declarative Pipeline", definition: "A structured, readable Pipeline-as-Code DSL defined in a 'Jenkinsfile' committed directly into the source code repository." },
      { term: "GitHub Webhooks", definition: "HTTP POST callbacks from GitHub to Jenkins URL notifying Jenkins instantly when code is pushed or a PR is opened." },
      { term: "Credentials Store", definition: "Secure encrypted credential management for SSH keys, Docker registry tokens, AWS IAM secret keys, and API tokens." }
    ]),
    internalsExplanation: "Jenkins operates on a Java Virtual Machine runtime. The Controller orchestrates job queues and dispatches build tasks to agents over SSH or the Remoting protocol (inbound JNLP agent connections). In modern cloud architectures, static agent VMs are replaced by dynamic ephemeral agents: when a build starts, the Jenkins Kubernetes or Docker plugin spins up a container agent, executes the build stages inside the container, stashes artifacts, and terminates the container, ensuring 100% clean, non-contaminated build environments.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 65)">
        <rect x="0" y="0" width="110" height="90" rx="8" fill="#1C2541" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="55" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">GitHub</text>
        <text x="55" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Push Event</text>
        <text x="55" y="75" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">Webhook POST</text>
      </g>
      <path d="M 150 110 L 190 110" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(200, 50)">
        <rect x="0" y="0" width="160" height="120" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="80" y="30" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Jenkins Controller</text>
        <text x="80" y="50" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Orchestrator &amp; Queue</text>
        <rect x="15" y="65" width="130" height="40" rx="4" fill="#0F172A"/>
        <text x="80" y="85" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">Declarative Jenkinsfile</text>
        <text x="80" y="98" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Parse stages &amp; steps</text>
      </g>
      <path d="M 370 110 L 410 110" stroke="#F59E0B" stroke-width="2"/>
      <g transform="translate(420, 50)">
        <rect x="0" y="0" width="160" height="120" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="80" y="30" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Ephemeral Agent</text>
        <text x="80" y="50" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Docker / K8s Pod</text>
        <text x="80" y="75" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">1. Run Unit Tests</text>
        <text x="80" y="90" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">2. SonarQube Scan</text>
        <text x="80" y="105" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">3. Docker Build</text>
      </g>
      <path d="M 590 110 L 630 110" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(640, 65)">
        <rect x="0" y="0" width="120" height="90" rx="8" fill="#1C2541" stroke="#A855F7" stroke-width="1.5"/>
        <text x="60" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Deployment</text>
        <text x="60" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Docker Hub / ECR</text>
        <text x="60" y="75" fill="#C084FC" font-size="8" font-family="monospace" text-anchor="middle">K8s Deployment</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts-jdk17", explanation: "Launches the official Jenkins Long Term Support (LTS) container with persistent storage volume." },
      { command: "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword", explanation: "Retrieves the initial cryptographic administrator password to unlock the Jenkins setup wizard." },
      { command: "java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:pass who-am-i", explanation: "Authenticates and verifies CLI communication with the Jenkins Controller." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never execute builds on the Jenkins Controller (set Controller Executors to 0). Use ephemeral container agents.",
      "Store all pipelines as version-controlled 'Jenkinsfile' in Git (Pipeline-as-Code) rather than configuring freestyle jobs in the UI.",
      "Use Declarative Pipelines with strict 'post' blocks (always, success, failure) to send Slack notifications or trigger rollbacks.",
      "Bind credentials using withCredentials([string(...), usernamePassword(...)]) to prevent secrets from being exposed in console build logs."
    ]),
    securityNotes: "Disable Script Security bypass. Regularly update Jenkins plugins using the Plugin Manager to patch known CVEs. Restrict the Agent-to-Controller TCP port 50000 behind private subnets.",
    costImplications: "Jenkins is 100% free and open-source under the MIT license. You pay zero licensing fees; you only cover the underlying compute (e.g. an AWS EC2 t3.small or free local Docker engine).",
    commonMistakesJson: JSON.stringify([
      "Hardcoding passwords or AWS access keys directly inside the Jenkinsfile.",
      "Running heavy build scripts directly on the Controller, causing the web UI to crash due to out-of-memory errors.",
      "Not cleaning up Docker container images on static worker nodes, causing root disks to fill up (100% disk usage)."
    ]),
    quickRevisionJson: JSON.stringify([
      "Controller = Schedules & web UI (no build execution).",
      "Agent = Executes commands in isolated workspace.",
      "Jenkinsfile structure: pipeline { agent any; stages { stage('Build') { steps { sh 'npm test' } } }; post { always { cleanWs() } } }.",
      "Webhook = GitHub calls Jenkins instantly on code push."
    ])
  },
  "jenkins-architecture-master-agents": {
    simpleExplanation: "Jenkins is an open-source automation server that orchestrates Continuous Integration and Continuous Delivery (CI/CD). Jenkins does not compile, build, or test code itself—it orchestrates tools that do (Maven, npm, Docker, JUnit) in repeatable automated sequences. Setup on Red Hat/CentOS Linux requires OpenJDK 17, configuring the official Jenkins YUM repository, importing the RPM key, and enabling the systemd service. Upon first launch on port 8080, Jenkins protects itself with an auto-generated initial administrator password stored in '/var/lib/jenkins/secrets/initialAdminPassword'. User access is secured via Configure Global Security, contrasting the Security Realm (Authentication via Jenkins database or LDAP) with Authorization Strategies (Matrix-based and the Role Strategy plugin for least-privilege). In production, Jenkins uses a distributed Controller-Agent architecture: the Controller manages scheduling and UI with 0 executors, while dedicated Agents execute builds based on labels ('agent { label 'slave2' }').",
    coreConceptsJson: JSON.stringify([
      { term: "Jenkins Orchestrator", definition: "Jenkins does not compile code directly; it orchestrates external tools (Maven, npm, Docker, test runners) in automated sequences." },
      { term: "Job vs Build", definition: "A Job is the reusable task definition (what to run, how, and when); a Build is one specific execution run of that job." },
      { term: "Jenkins Plugin", definition: "Extends Jenkins core functionality to integrate external tools like Git, Maven, Slack, Docker, and the Role Strategy plugin." },
      { term: "Initial Admin Password", definition: "Auto-generated cryptographic password located at /var/lib/jenkins/secrets/initialAdminPassword required to unlock first-run setup." },
      { term: "Security Realm vs Authorization", definition: "Security Realm proves WHO the user is (Authentication); Authorization Strategy defines WHAT they are allowed to do (Permissions)." },
      { term: "Role Strategy Plugin", definition: "Replaces dangerous 'logged-in users can do anything' by defining reusable roles (e.g. Developer, QA) with strict least-privilege permissions." },
      { term: "Controller-Agent (Master-Slave)", definition: "Controller manages scheduling and UI; Agents execute build work. Using 'agent { label 'slave2' }' pins stages to specific labeled environments." }
    ]),
    internalsExplanation: "Jenkins runs on the Java Virtual Machine (JVM). The Controller exposes an HTTP web interface (default port 8080) and an Agent remoting port (TCP 50000). When a build triggers, the Controller scheduler evaluates executor queues, selects a matching online Agent via label matching or load balancing, creates a remote workspace, transfers credentials securely, and streams build console output back to the Controller in real-time. Setting Controller executors to 0 isolates master JVM memory from build spikes.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 40)">
        <rect x="0" y="0" width="180" height="150" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="90" y="25" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">RHEL/CentOS Host</text>
        <rect x="15" y="40" width="150" height="28" rx="4" fill="#0F172A"/>
        <text x="90" y="58" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">Java 17 OpenJDK</text>
        <rect x="15" y="75" width="150" height="28" rx="4" fill="#0F172A"/>
        <text x="90" y="93" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">systemctl enable jenkins</text>
        <rect x="15" y="110" width="150" height="28" rx="4" fill="#0F172A"/>
        <text x="90" y="128" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">initialAdminPassword</text>
      </g>
      <path d="M 220 115 L 260 115" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(270, 30)">
        <rect x="0" y="0" width="220" height="170" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="110" y="25" fill="#F8FAFC" font-size="13" font-family="system-ui" text-anchor="middle" font-weight="bold">Jenkins Controller (Master)</text>
        <rect x="15" y="40" width="190" height="30" rx="4" fill="#0F172A"/>
        <text x="110" y="60" fill="#EF4444" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Executors: 0 (No build execution)</text>
        <rect x="15" y="78" width="190" height="40" rx="4" fill="#0F172A"/>
        <text x="110" y="95" fill="#FBBF24" font-size="9" font-family="system-ui" text-anchor="middle">Global Security: Role Strategy</text>
        <text x="110" y="110" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Dev / QA Least Privilege</text>
        <rect x="15" y="125" width="190" height="30" rx="4" fill="#0F172A"/>
        <text x="110" y="145" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">Port 8080 (UI) &amp; 50000 (JNLP)</text>
      </g>
      <path d="M 500 85 L 540 65" stroke="#10B981" stroke-width="2"/>
      <path d="M 500 145 L 540 165" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(550, 25)">
        <rect x="0" y="0" width="200" height="85" rx="8" fill="#1C2541" stroke="#10B981" stroke-width="1.5"/>
        <text x="100" y="24" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Agent 1: Linux Build Node</text>
        <text x="100" y="42" fill="#34D399" font-size="9" font-family="monospace" text-anchor="middle">label: 'linux-builder'</text>
        <text x="100" y="60" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Executes: Maven, Docker, npm</text>
        <text x="100" y="75" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">agent { label 'linux-builder' }</text>
      </g>
      <g transform="translate(550, 125)">
        <rect x="0" y="0" width="200" height="85" rx="8" fill="#1C2541" stroke="#A855F7" stroke-width="1.5"/>
        <text x="100" y="24" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Agent 2: Selenium QA Node</text>
        <text x="100" y="42" fill="#C084FC" font-size="9" font-family="monospace" text-anchor="middle">label: 'selenium-qa'</text>
        <text x="100" y="60" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Executes: Headless Chrome / Xvfb</text>
        <text x="100" y="75" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">agent { label 'selenium-qa' }</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "sudo yum install fontconfig java-17-openjdk jenkins -y", explanation: "Installs OpenJDK 17 and Jenkins package from official Red Hat YUM repository." },
      { command: "sudo systemctl daemon-reload && sudo systemctl enable --now jenkins", explanation: "Registers the newly installed service with systemd and enables auto-start on boot." },
      { command: "sudo cat /var/lib/jenkins/secrets/initialAdminPassword", explanation: "Prints the one-time auto-generated setup password required to unlock Jenkins in the browser." },
      { command: "ps -ef | grep jenkins", explanation: "Verifies the Jenkins Java process is running and confirms bound port parameters." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Set executors on the Jenkins Controller to 0; reserve Controller exclusively for orchestration, web UI, and job scheduling.",
      "Always execute 'sudo systemctl enable jenkins' so the service automatically restarts after unexpected server reboots.",
      "Replace 'logged-in users can do anything' with the Role Strategy plugin, scoping QA and developers to least-privilege roles.",
      "Assign meaningful labels to build agents (e.g. 'linux-builder', 'selenium-qa') and pin jobs using 'agent { label }'."
    ]),
    securityNotes: "Never disable CSRF protection. Restrict the Agent-to-Controller port 50000 to internal VPC subnets. Audit admin-level users periodically and avoid using the default admin account for daily tasks.",
    costImplications: "Jenkins software is free and open-source. Infrastructure costs correspond to the VM/EC2 instance running the Controller and worker Agent nodes.",
    commonMistakesJson: JSON.stringify([
      "Treating Jenkins as a build tool instead of an orchestrator that invokes compilers and test runners.",
      "Running resource-intensive builds directly on the Controller, causing UI hangs and memory exhaustion.",
      "Leaving Global Security disabled or granting full administrator access to all authenticated users.",
      "Skipping Java 17 installation before installing Jenkins, causing the systemd service to fail immediately."
    ]),
    quickRevisionJson: JSON.stringify([
      "Jenkins orchestrates build tools; it does not compile code directly.",
      "Job = Reusable task definition; Build = One specific execution run.",
      "Java 17 must be installed first because Jenkins runs on the JVM.",
      "Unlock password location: /var/lib/jenkins/secrets/initialAdminPassword.",
      "Role Strategy plugin defines named roles (Developer, QA) with least-privilege access."
    ])
  },
  "declarative-jenkinsfile-production-pipelines": {
    simpleExplanation: "Pipelines are how modern enterprise Jenkins workflows are built: expressing the entire CI/CD process as version-controlled code (Pipeline-as-Code) inside a 'Jenkinsfile'. While traditional Freestyle jobs are configured via the web UI and stored inside Jenkins itself, Pipeline jobs live in Git alongside application source code. Declarative Pipelines provide a structured, readable DSL (pipeline { agent { } stages { } post { } }) that guarantees clear execution flow. Automatic build triggers turn Jenkins into a reactive continuous delivery engine: GitHub webhooks (http://<jenkins-url>/github-webhook/ with 'GitHub hook trigger for GITScm polling') trigger builds instantly upon push. Scheduled triggers use standard 5-field cron syntax (minute, hour, day-of-month, month, day-of-week). Notifications are handled via the Email-ext plugin inside 'post { failure { mail ... } }' to prevent alert fatigue, and production releases are gated using interactive 'input' human approvals.",
    coreConceptsJson: JSON.stringify([
      { term: "Freestyle vs Pipeline", definition: "Freestyle configurations live inside Jenkins UI; Pipelines live as version-controlled code (Jenkinsfile) in Git." },
      { term: "Declarative vs Scripted", definition: "Declarative uses strict structured blocks (agent, stages, steps, post); Scripted allows arbitrary imperative Groovy code." },
      { term: "GitHub Webhook Trigger", definition: "Instant event-driven execution via /github-webhook/ payload and 'GitHub hook trigger for GITScm polling' checkbox." },
      { term: "Build Periodically vs Poll SCM", definition: "Build Periodically runs on a fixed clock regardless of changes; Poll SCM checks repository on schedule and builds ONLY if new commits exist." },
      { term: "Cron 5-Field Syntax", definition: "minute (0-59), hour (0-23), day-of-month (1-31), month (1-12), day-of-week (0-6 Sun-Sat). Example: '*/5 * * * *' runs every 5 minutes." },
      { term: "Post-Build Failure Mail", definition: "Sending emails only on failure via 'post { failure { mail to: ... } }' eliminates noisy alert fatigue from successful builds." },
      { term: "Interactive Input Step", definition: "Pauses pipeline execution at deployment stage (e.g. input message: 'Deploy to Prod?') waiting for human approval." }
    ]),
    internalsExplanation: "Declarative Jenkinsfiles are parsed by the Jenkins Pipeline engine into an Abstract Syntax Tree (AST) before execution starts. This validation ensures syntax errors (like missing stages or unrecognized directives) fail immediately before wasting compute minutes. The post block registers outcome callbacks (always, success, failure, changed) that execute regardless of stage failures, ensuring cleanup (cleanWs()) and alerts always trigger reliably.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="130" height="150" rx="8" fill="#1C2541" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="25" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Triggers</text>
        <rect x="10" y="38" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="54" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">GitHub Webhook</text>
        <rect x="10" y="68" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="84" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">Poll SCM: H/5 * * * *</text>
        <rect x="10" y="98" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="114" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">Cron: 0 2 * * *</text>
        <rect x="10" y="128" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="144" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Upstream Job</text>
      </g>
      <path d="M 170 120 L 205 120" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(215, 30)">
        <rect x="0" y="0" width="370" height="180" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="185" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Declarative Jenkinsfile Execution</text>
        <g transform="translate(15, 40)">
          <rect x="0" y="0" width="75" height="55" rx="6" fill="#0F172A" stroke="#38BDF8"/>
          <text x="37" y="24" fill="#38BDF8" font-size="9" font-family="system-ui" text-anchor="middle" font-weight="bold">Checkout</text>
          <text x="37" y="42" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">git clone</text>
        </g>
        <path d="M 95 67 L 105 67" stroke="#94A3B8" stroke-width="2"/>
        <g transform="translate(110, 40)">
          <rect x="0" y="0" width="75" height="55" rx="6" fill="#0F172A" stroke="#10B981"/>
          <text x="37" y="24" fill="#10B981" font-size="9" font-family="system-ui" text-anchor="middle" font-weight="bold">Build</text>
          <text x="37" y="42" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">mvn compile</text>
        </g>
        <path d="M 190 67 L 200 67" stroke="#94A3B8" stroke-width="2"/>
        <g transform="translate(205, 40)">
          <rect x="0" y="0" width="75" height="55" rx="6" fill="#0F172A" stroke="#A855F7"/>
          <text x="37" y="24" fill="#A855F7" font-size="9" font-family="system-ui" text-anchor="middle" font-weight="bold">Test</text>
          <text x="37" y="42" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">mvn test</text>
        </g>
        <path d="M 285 67 L 295 67" stroke="#94A3B8" stroke-width="2"/>
        <g transform="translate(300, 40)">
          <rect x="0" y="0" width="60" height="55" rx="6" fill="#0F172A" stroke="#EF4444"/>
          <text x="30" y="22" fill="#EF4444" font-size="8" font-family="system-ui" text-anchor="middle" font-weight="bold">Gate</text>
          <text x="30" y="40" fill="#F87171" font-size="8" font-family="monospace" text-anchor="middle">input</text>
        </g>
        <g transform="translate(15, 110)">
          <rect x="0" y="0" width="345" height="55" rx="6" fill="#0F172A" stroke="#34D399"/>
          <text x="172" y="22" fill="#34D399" font-size="9" font-family="system-ui" text-anchor="middle" font-weight="bold">post { always / failure / success }</text>
          <text x="172" y="40" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">always { cleanWs() } | failure { mail to: 'devs@example.com' }</text>
        </g>
      </g>
      <path d="M 595 120 L 630 120" stroke="#F59E0B" stroke-width="2"/>
      <g transform="translate(640, 45)">
        <rect x="0" y="0" width="130" height="150" rx="8" fill="#1C2541" stroke="#10B981" stroke-width="1.5"/>
        <text x="65" y="25" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Notifications</text>
        <rect x="10" y="40" width="110" height="30" rx="4" fill="#0F172A"/>
        <text x="65" y="58" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">SMTP / Email-ext</text>
        <rect x="10" y="80" width="110" height="30" rx="4" fill="#0F172A"/>
        <text x="65" y="98" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">Slack Webhook</text>
        <rect x="10" y="120" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="136" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">JUnit XML Trends</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "*/5 * * * *", explanation: "Cron expression: triggers build every 5 minutes." },
      { command: "10 */5 * * *", explanation: "Cron expression: triggers build at minute 10 of every 5th hour." },
      { command: "* */2 * * 1-5", explanation: "Cron expression: triggers at minute 1 of every 2 hours, Monday through Friday." },
      { command: "input message: 'Deploy to production?', ok: 'Promote'", explanation: "Jenkinsfile pipeline step that pauses execution until an authorized human approves the stage." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Prefer GitHub webhooks over Poll SCM whenever Jenkins is network-reachable for instant builds without polling overhead.",
      "Always define pipelines in a Jenkinsfile committed to source control next to application code (Pipeline-as-Code).",
      "Send alert emails strictly on failure using 'post { failure { mail ... } }' to keep alerts actionable and avoid team alert fatigue.",
      "Use interactive 'input' steps before production deploy stages to guarantee human verification."
    ]),
    securityNotes: "Never hardcode passwords or tokens in a Jenkinsfile. Inject credentials using Jenkins Credentials Store and environment variables. Use App Passwords instead of personal account passwords for SMTP mail servers.",
    costImplications: "Webhooks reduce compute and bandwidth costs compared to Poll SCM by eliminating continuous Git polling requests.",
    commonMistakesJson: JSON.stringify([
      "Pointing GitHub webhook Payload URL to the wrong path instead of ending exactly in '/github-webhook/'.",
      "Forgetting to check 'GitHub hook trigger for GITScm polling' in job Build Triggers, causing webhooks to be ignored.",
      "Confusing Build Periodically (builds on clock regardless of changes) with Poll SCM (builds only if new commits exist).",
      "Mixing Declarative and Scripted pipeline syntax without understanding structural constraints."
    ]),
    quickRevisionJson: JSON.stringify([
      "Freestyle = UI configured; Pipeline = Version-controlled Jenkinsfile in Git.",
      "GitHub Webhook URL: http://<jenkins-url>/github-webhook/.",
      "Build Triggers checkbox: 'GitHub hook trigger for GITScm polling'.",
      "Cron format: Minute, Hour, Day-of-month, Month, Day-of-week.",
      "post { failure { mail to: ... } } alerts only when the build breaks."
    ])
  },
  "jenkins-selenium-maven-headless-testing": {
    simpleExplanation: "Automated browser testing in Continuous Integration validates end-to-end user workflows against real web applications. In enterprise CI/CD, Selenium WebDriver provides browser automation, controlling browsers through driver executables (ChromeDriver, GeckoDriver). Rather than manually downloading JAR files in Eclipse (which leads to 'works on my machine' library version mismatches), production projects declare Selenium and JUnit dependencies in Maven's pom.xml with <scope>test</scope>. Because CI/CD agents run on headless Linux servers without a monitor or physical X11 display, browser tests must execute in Headless mode (--headless=new, --no-sandbox) or under a virtual framebuffer (Xvfb). In Jenkins, a Freestyle job or Declarative Jenkinsfile executes 'mvn test' to launch the browser tests. The test runner outputs standardized JUnit XML reports into 'target/surefire-reports/*.xml', which Jenkins archives and parses via the 'junit' post-build step, visualizing pass/fail trends over time.",
    coreConceptsJson: JSON.stringify([
      { term: "Selenium WebDriver", definition: "A browser automation framework that drives real browsers (Chrome, Firefox) to navigate, interact with elements, and assert web app behavior." },
      { term: "Maven Dependency Management", definition: "Declares selenium-java and junit in pom.xml with <scope>test</scope>, ensuring identical dependency versions on developer laptops and CI agents." },
      { term: "Headless Browser Testing", definition: "Running browser automation without a GUI desktop interface; mandatory for Linux CI/CD agents lacking an X11 physical display." },
      { term: "driver.quit() Lifecycle", definition: "Closes the browser window and terminates the WebDriver background process, preventing memory leaks and zombie browser processes." },
      { term: "JUnit Surefire Reports", definition: "Standardized XML test result files generated at **/target/surefire-reports/*.xml parsed by Jenkins to generate visual trend graphs." },
      { term: "Explicit Waits vs Thread.sleep()", definition: "Using WebDriverWait to poll for DOM conditions dynamically, eliminating test flakiness caused by arbitrary hardcoded sleeps." }
    ]),
    internalsExplanation: "Selenium WebDriver uses the W3C WebDriver specification over HTTP JSON wire protocol to send commands to browser driver executables (chromedriver). On Linux CI agents, Chrome requires flags: '--headless=new', '--no-sandbox' (disables OS user sandbox in containerized environments), and '--disable-dev-shm-usage' (avoids shared memory exhaustion by writing to /tmp). Maven Surefire plugin captures stdout/stderr and test assertions into XML schemas that the Jenkins JUnit plugin indexes into per-build pass/fail charts and duration trends.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="130" height="150" rx="8" fill="#1C2541" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="25" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Maven Project</text>
        <rect x="10" y="40" width="110" height="30" rx="4" fill="#0F172A"/>
        <text x="65" y="58" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">pom.xml: selenium-java</text>
        <rect x="10" y="80" width="110" height="30" rx="4" fill="#0F172A"/>
        <text x="65" y="98" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">pom.xml: junit (test)</text>
        <rect x="10" y="120" width="110" height="24" rx="4" fill="#0F172A"/>
        <text x="65" y="136" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">mvn test</text>
      </g>
      <path d="M 170 120 L 210 120" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(220, 30)">
        <rect x="0" y="0" width="220" height="180" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="110" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Linux CI Agent Execution</text>
        <rect x="15" y="38" width="190" height="30" rx="4" fill="#0F172A"/>
        <text x="110" y="57" fill="#10B981" font-size="9" font-family="monospace" text-anchor="middle">Headless Chrome / Xvfb</text>
        <rect x="15" y="76" width="190" height="42" rx="4" fill="#0F172A"/>
        <text x="110" y="93" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">--headless=new --no-sandbox</text>
        <text x="110" y="108" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">WebDriver driver.get(url)</text>
        <rect x="15" y="126" width="190" height="40" rx="4" fill="#0F172A"/>
        <text x="110" y="143" fill="#EF4444" font-size="8" font-family="monospace" text-anchor="middle">driver.quit() in @After</text>
        <text x="110" y="156" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Closes process &amp; frees RAM</text>
      </g>
      <path d="M 450 120 L 490 120" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(500, 30)">
        <rect x="0" y="0" width="270" height="180" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="135" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Jenkins Test Reporting</text>
        <rect x="15" y="40" width="240" height="35" rx="4" fill="#0F172A"/>
        <text x="135" y="58" fill="#C084FC" font-size="8" font-family="monospace" text-anchor="middle">**/target/surefire-reports/*.xml</text>
        <text x="135" y="69" fill="#94A3B8" font-size="7" font-family="system-ui" text-anchor="middle">Surefire Plugin Output</text>
        <rect x="15" y="85" width="240" height="40" rx="4" fill="#0F172A"/>
        <text x="135" y="102" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">post { always { junit '...' } }</text>
        <text x="135" y="117" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Publishes test trends &amp; duration</text>
        <rect x="15" y="133" width="240" height="35" rx="4" fill="#0F172A"/>
        <text x="135" y="150" fill="#34D399" font-size="8" font-family="system-ui" text-anchor="middle" font-weight="bold">Pass/Fail Trends &amp; Flaky Test Isolation</text>
        <text x="135" y="162" fill="#94A3B8" font-size="7" font-family="system-ui" text-anchor="middle">Detailed per-test stacktrace visualization</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "mvn test", explanation: "Compiles test sources and executes JUnit Selenium test suite via Maven Surefire plugin." },
      { command: "junit '**/target/surefire-reports/*.xml'", explanation: "Declarative Jenkinsfile post step that publishes test result metrics to Jenkins dashboard." },
      { command: "ChromeOptions options = new ChromeOptions(); options.addArguments(\"--headless=new\", \"--no-sandbox\");", explanation: "Java code to configure ChromeDriver for headless Linux CI runner execution." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always call driver.quit() inside a finally block or @After teardown method to terminate browser instances and free system memory.",
      "Configure Selenium in headless mode by default on Linux CI agents, reserving headed mode for local developer debugging.",
      "Always publish the JUnit XML test report in post-build actions so Jenkins tracks test result trends and catches flaky regressions.",
      "Use explicit waits (WebDriverWait) instead of Thread.sleep() to avoid slow build times and intermittent timing failures."
    ]),
    securityNotes: "Avoid bundling test dependencies into production artifacts by strictly specifying <scope>test</scope> in pom.xml. Do not run browsers as root without --no-sandbox constraints.",
    costImplications: "Automated Selenium testing in CI catches regressions before production deployments, eliminating expensive emergency hotfix engineering cycles.",
    commonMistakesJson: JSON.stringify([
      "Running headed browser tests on headless Linux CI agents without Xvfb or headless options, causing tests to crash immediately.",
      "Forgetting driver.quit() at the end of tests, causing background browser processes to accumulate and exhaust server RAM.",
      "Not publishing the JUnit XML report, leaving Jenkins reporting only overall build pass/fail with no insight into failing test names.",
      "Using brittle hardcoded Thread.sleep() calls instead of dynamic WebDriverWait expected conditions."
    ]),
    quickRevisionJson: JSON.stringify([
      "Selenium automates web browsers; Maven manages dependencies via pom.xml.",
      "Headless mode (--headless=new) is mandatory on Linux CI agents without physical displays.",
      "driver.quit() closes browser process and prevents memory leaks.",
      "Publish **/target/surefire-reports/*.xml in post { always { junit ... } } to visualize pass/fail trends over time."
    ])
  },
  18: {
    simpleExplanation: "Docker revolutionized software engineering by allowing developers to package an application together with all of its libraries, system dependencies, configuration files, and runtime into a single, standardized unit called a Container. If an application runs on your laptop, Docker guarantees it will run identically in testing, staging, and AWS production without 'works on my machine' surprises. Unlike virtual machines that bundle an entire guest operating system (gigabytes in size), Docker containers share the host Linux kernel, booting in milliseconds and consuming megabytes of RAM.",
    coreConceptsJson: JSON.stringify([
      { term: "Image vs Container", definition: "An Image is a read-only, immutable blueprint composed of stacked filesystem layers. A Container is a runnable, isolated instance of an image with a thin read-write layer." },
      { term: "Linux Namespaces & Cgroups", definition: "Namespaces provide process isolation (PID, Network, Mount, User); Control Groups (cgroups) meter and limit physical hardware resources (CPU, RAM, I/O)." },
      { term: "Multi-Stage Builds", definition: "A Dockerfile technique where compile-time SDKs and build tools run in stage 1, and only the minimal production binaries are copied into stage 2, shrinking image size by up to 90%." },
      { term: "Docker Compose", definition: "A declarative YAML specification (compose.yaml) used to define and run multi-container applications (e.g., React frontend + Node API + MySQL database) with automated service discovery." },
      { term: "Storage Volumes vs Bind Mounts", definition: "Named volumes are managed by Docker in /var/lib/docker/volumes for persistent data; bind mounts map specific host directories into the container for live code reloading." }
    ]),
    internalsExplanation: "Docker is built on the Open Container Initiative (OCI) runtime spec. The Docker CLI talks via a UNIX socket (/var/run/docker.sock) to dockerd (daemon). dockerd calls containerd (container supervisor), which invokes runc (lightweight low-level OCI CLI). runc issues Linux syscalls: clone() with CLONE_NEWPID, CLONE_NEWNET, CLONE_NEWNS flags to instantiate namespaces, and writes to /sys/fs/cgroup to constrain memory and CPU cores. The filesystem is assembled via OverlayFS, where read-only image layers are stacked, and container file writes occur in an ephemeral Copy-on-Write (CoW) upper layer.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(40, 50)">
        <rect x="0" y="0" width="130" height="120" rx="8" fill="#1C2541" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="30" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Dockerfile</text>
        <text x="65" y="48" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">FROM node:20-alpine</text>
        <text x="65" y="65" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">WORKDIR /app</text>
        <text x="65" y="82" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">COPY . .</text>
        <text x="65" y="99" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">CMD ["npm","start"]</text>
      </g>
      <path d="M 180 110 L 220 110" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(230, 50)">
        <rect x="0" y="0" width="140" height="120" rx="8" fill="#1E293B" stroke="#818CF8" stroke-width="1.5"/>
        <text x="70" y="30" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Image (Layers)</text>
        <rect x="15" y="45" width="110" height="18" rx="3" fill="#312E81"/>
        <text x="70" y="58" fill="#C7D2FE" font-size="8" font-family="monospace" text-anchor="middle">Layer 3: App Code</text>
        <rect x="15" y="68" width="110" height="18" rx="3" fill="#3730A3"/>
        <text x="70" y="81" fill="#C7D2FE" font-size="8" font-family="monospace" text-anchor="middle">Layer 2: Dependencies</text>
        <rect x="15" y="91" width="110" height="18" rx="3" fill="#4338CA"/>
        <text x="70" y="104" fill="#C7D2FE" font-size="8" font-family="monospace" text-anchor="middle">Layer 1: Base Alpine OS</text>
      </g>
      <path d="M 380 110 L 420 110" stroke="#818CF8" stroke-width="2"/>
      <g transform="translate(430, 45)">
        <rect x="0" y="0" width="160" height="130" rx="8" fill="#0F172A" stroke="#06D6A0" stroke-width="1.5"/>
        <text x="80" y="25" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Running Container</text>
        <rect x="15" y="35" width="130" height="20" rx="3" fill="#065F46"/>
        <text x="80" y="48" fill="#A7F3D0" font-size="8" font-family="monospace" text-anchor="middle">R/W Thin Overlay Layer</text>
        <text x="80" y="75" fill="#34D399" font-size="9" font-family="system-ui" text-anchor="middle">Namespaces (PID, NET)</text>
        <text x="80" y="95" fill="#34D399" font-size="9" font-family="system-ui" text-anchor="middle">Cgroups (CPU, RAM Limits)</text>
        <text x="80" y="115" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Port 3000 -> 80</text>
      </g>
      <path d="M 600 110 L 640 110" stroke="#06D6A0" stroke-width="2"/>
      <g transform="translate(650, 60)">
        <rect x="0" y="0" width="110" height="100" rx="8" fill="#1C2541" stroke="#F43F5E" stroke-width="1.5"/>
        <text x="55" y="35" fill="#F8FAFC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">Storage</text>
        <text x="55" y="55" fill="#94A3B8" font-size="9" font-family="system-ui" text-anchor="middle">Named Volumes</text>
        <text x="55" y="75" fill="#FB7185" font-size="8" font-family="monospace" text-anchor="middle">Persist DB Data</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "docker build -t my-web-app:v1.0 .", explanation: "Builds a Docker image using the Dockerfile in the current directory and tags it." },
      { command: "docker run -d -p 8080:80 --name web-prod --restart unless-stopped my-web-app:v1.0", explanation: "Runs container in detached mode, binds host port 8080 to container port 80, and enables auto-restart." },
      { command: "docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", explanation: "Lists all active and stopped containers with status and port mappings." },
      { command: "docker exec -it web-prod sh", explanation: "Opens an interactive shell inside the running container for troubleshooting." },
      { command: "docker compose up -d --build", explanation: "Builds images and starts multi-container services defined in docker-compose.yml in the background." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always use Multi-Stage Builds to separate compilation from runtime, drastically reducing image vulnerability attack surface.",
      "Order Dockerfile commands from least frequently changing to most frequently changing to maximize Docker layer caching (e.g. COPY package.json -> RUN npm install -> COPY src/).",
      "Run as a non-root user using 'USER node' or 'USER 10001' to prevent container breakout privilege escalations.",
      "Always create a .dockerignore file to exclude node_modules, .git, and .env from being baked into image layers."
    ]),
    securityNotes: "Never mount the Docker socket (/var/run/docker.sock) inside untrusted containers, as this grants full root access to the host machine. Scan images with 'docker scout' or 'trivy'.",
    costImplications: "Docker Engine is 100% free and open-source. Docker Hub provides free public image repositories and 1 free private repository with generous rate limits.",
    commonMistakesJson: JSON.stringify([
      "Using massive base images like 'ubuntu:latest' (100MB+) instead of minimal 'alpine' (5MB) or Google Distroless images for production runtime.",
      "Storing database files inside the container's ephemeral writable layer instead of an attached Docker Named Volume (all data lost on container restart).",
      "Running 'npm install' after copying the entire source directory, which invalidates the Docker layer cache on every code change."
    ]),
    quickRevisionJson: JSON.stringify([
      "Container = Process isolated by Namespaces (PID, NET) & Cgroups (CPU, RAM).",
      "Dockerfile: FROM -> WORKDIR -> COPY -> RUN -> USER -> EXPOSE -> CMD.",
      "Multi-Stage: Stage 1 builds binary, Stage 2 copies only binary to minimal OS.",
      "Compose: compose.yaml defines services, networks, and persistent volumes."
    ])
  },
  "docker-internals-container-architecture": {
    simpleExplanation: "Docker solves the classic 'it works on my machine' defect by packaging applications with their entire runtime environment, libraries, system dependencies, and configurations into lightweight, standalone containers. Unlike Virtual Machines which require a Type 1 (ESXi, Hyper-V, KVM) or Type 2 (VMware Workstation, VirtualBox) hypervisor running a heavy guest OS kernel (consuming gigabytes and taking minutes to boot), Docker containers share the host Linux kernel directly. Docker isolates processes using 4 fundamental Linux kernel features: Namespaces (PID, NET, MNT, IPC, UTS, USER) for complete isolation boundaries, Control Groups (cgroups v1/v2) for metering and enforcing hardware limits on CPU, RAM, and I/O, Union File Systems (OverlayFS) for stacking read-only layers with Copy-on-Write, and chroot for directory sandboxing. The Docker engine follows a modular client-server architecture: the Docker CLI communicates via REST API over a Unix socket (/var/run/docker.sock) with the dockerd daemon, which coordinates with containerd (high-level runtime) and runc (OCI low-level runtime) to execute containers.",
    coreConceptsJson: JSON.stringify([
      { term: "Virtualization vs Containerization", definition: "VMs virtualize hardware and run distinct guest OS kernels on top of hypervisors; Containers virtualize the operating system, sharing the host Linux kernel." },
      { term: "Type 1 vs Type 2 Hypervisor", definition: "Type 1 (Bare Metal: ESXi, KVM, Xen) runs directly on hardware; Type 2 (Hosted: VirtualBox, Workstation) runs as an application inside a host OS." },
      { term: "Linux Namespaces", definition: "Provides 6 boundaries: PID (process trees), NET (virtual interfaces, iptables), MNT (filesystem mounts), IPC (shared memory), UTS (hostname), USER (UID/GID rootless mapping)." },
      { term: "Control Groups (cgroups)", definition: "Kernel mechanism limiting physical resources: CPU quotas, memory ceiling (--memory=512m), block I/O bandwidth, and process forks (--pids-limit=100)." },
      { term: "Client-Server Execution Chain", definition: "Docker CLI sends REST commands over /var/run/docker.sock to dockerd; dockerd calls containerd, which spawns runc (OCI reference runtime) to configure cgroups/namespaces and launch PID 1." },
      { term: "Container Lifecycle States", definition: "Created (filesystem initialized) -> Running (PID 1 active) -> Paused (cgroup freezer SIGSTOP) -> Stopped (SIGTERM 10s grace then SIGKILL) -> Deleted." },
      { term: "Docker Group Privilege Escalation", definition: "Adding a user to the 'docker' group without sudo is equivalent to root access; any user who can mount / into a container can modify /etc/shadow or host binaries." },
      { term: "UnionFS & OverlayFS (CoW)", definition: "Stacks read-only image layers into a unified rootfs. Writes are captured in an ephemeral Copy-on-Write upper layer without modifying underlying image layers." }
    ]),
    internalsExplanation: "When you run 'docker run -d --name web -m 512m nginx:alpine', the Docker CLI formats an HTTP POST request to /var/run/docker.sock. The Docker daemon (dockerd) processes the request, pulls the image if missing, and delegates container execution to containerd. containerd unpacks the image layers using OverlayFS (creating lowerdir read-only layers, an upperdir for container writes, a workdir, and a merged mount point) and creates an OCI runtime bundle (config.json + rootfs). containerd invokes runc, which executes the clone() system call with CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS. runc writes memory limits into /sys/fs/cgroup/memory/docker/<id>/memory.limit_in_bytes (or cgroups v2 memory.max), configures virtual Ethernet pair (veth), attaches one end to the container and the other to the host bridge docker0, execs the target binary as PID 1, and terminates. If the container process exceeds its memory limit, the Linux kernel OOM Killer immediately terminates the container process with Exit Code 137 (128 + 9 SIGKILL).",
    architectureSvg: `<svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="800" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="130" height="155" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="25" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Docker CLI</text>
        <rect x="10" y="40" width="110" height="28" rx="4" fill="#0F172A"/>
        <text x="65" y="58" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">docker run</text>
        <rect x="10" y="75" width="110" height="28" rx="4" fill="#0F172A"/>
        <text x="65" y="93" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">docker build</text>
        <rect x="10" y="110" width="110" height="32" rx="4" fill="#0F172A"/>
        <text x="65" y="125" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">REST API Client</text>
        <text x="65" y="137" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">Unix Domain Socket</text>
      </g>
      <path d="M 165 120 L 200 120" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(205, 35)">
        <rect x="0" y="0" width="180" height="175" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="90" y="24" fill="#F8FAFC" font-size="13" font-family="system-ui" text-anchor="middle" font-weight="bold">Docker Engine</text>
        <rect x="10" y="38" width="160" height="34" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="54" fill="#38BDF8" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">dockerd (Daemon)</text>
        <text x="90" y="66" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Images / Networks / API</text>
        <path d="M 90 75 L 90 85" stroke="#F59E0B" stroke-width="1.5"/>
        <rect x="10" y="88" width="160" height="34" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="90" y="104" fill="#10B981" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">containerd</text>
        <text x="90" y="116" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Supervisor &amp; OCI Bundler</text>
        <path d="M 90 125 L 90 135" stroke="#F59E0B" stroke-width="1.5"/>
        <rect x="10" y="136" width="160" height="28" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="90" y="154" fill="#A855F7" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">runc (OCI Runtime)</text>
      </g>
      <path d="M 390 120 L 425 120" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(430, 35)">
        <rect x="0" y="0" width="360" height="175" rx="8" fill="#111827" stroke="#10B981" stroke-width="1.5"/>
        <text x="180" y="24" fill="#F8FAFC" font-size="13" font-family="system-ui" text-anchor="middle" font-weight="bold">Linux Host Kernel Primitives</text>
        <g transform="translate(15, 38)">
          <rect x="0" y="0" width="155" height="60" rx="6" fill="#1F2937" stroke="#38BDF8" stroke-width="1"/>
          <text x="77" y="18" fill="#38BDF8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Namespaces (Isolation)</text>
          <text x="77" y="34" fill="#E2E8F0" font-size="8" font-family="monospace" text-anchor="middle">PID • NET • MNT</text>
          <text x="77" y="48" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">IPC • UTS • USER</text>
        </g>
        <g transform="translate(185, 38)">
          <rect x="0" y="0" width="160" height="60" rx="6" fill="#1F2937" stroke="#F59E0B" stroke-width="1"/>
          <text x="80" y="18" fill="#F59E0B" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Control Groups (Cgroups)</text>
          <text x="80" y="34" fill="#E2E8F0" font-size="8" font-family="monospace" text-anchor="middle">CPU Quotas (--cpus=1.5)</text>
          <text x="80" y="48" fill="#EF4444" font-size="8" font-family="monospace" text-anchor="middle">RAM (--memory=512m OOM)</text>
        </g>
        <g transform="translate(15, 106)">
          <rect x="0" y="0" width="330" height="58" rx="6" fill="#1F2937" stroke="#A855F7" stroke-width="1"/>
          <text x="165" y="18" fill="#C084FC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Storage: OverlayFS (Union Mount)</text>
          <text x="165" y="34" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">Upper Dir (Read/Write Ephemeral Container Layer)</text>
          <text x="165" y="48" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Lower Dirs (Read-Only Immutable Image Layers via CoW)</text>
        </g>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "docker run -d --name web -p 8080:80 --memory='512m' --cpus='1.0' nginx:alpine", description: "Launch container in detached mode with memory ceiling (512MB) and CPU quota (1 core)" },
      { command: "docker ps -a --format 'table {{.ID}}\\t{{.Names}}\\t{{.Status}}\\t{{.Ports}}'", description: "List running and exited containers formatted as a clean terminal table" },
      { command: "docker inspect --format '{{.State.Status}} (PID: {{.State.Pid}})' web", description: "Inspect container state and discover the host OS PID of the container process" },
      { command: "docker stats --no-stream", description: "Sample real-time CPU %, Memory consumption, Network I/O, and Block I/O metrics across containers" },
      { command: "docker top web", description: "Display the active process table inside the container PID namespace from the host perspective" },
      { command: "docker pause web && docker unpause web", description: "Suspend container execution using the kernel cgroup freezer and resume without restarting" },
      { command: "docker stop -t 15 web && docker rm web", description: "Send SIGTERM with a 15-second grace period before falling back to SIGKILL, then remove container" },
      { command: "ls -l /var/run/docker.sock && id", description: "Verify Unix domain socket permissions and check if current user belongs to the privileged docker group" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always apply explicit memory limits (--memory) and CPU limits (--cpus) to prevent runaway processes from causing host-wide OOM panic.",
      "Never add untrusted regular users to the 'docker' group on production servers; use rootless Docker mode or granular sudo rules.",
      "Ensure application containers trap SIGTERM signals to perform clean shutdown and close open database transactions within the 10s grace period.",
      "Monitor host cgroup metrics via cAdvisor or Prometheus node-exporter to identify memory-leaking containers before Exit Code 137 strikes."
    ]),
    securityNotes: "The 'docker' group is root-equivalent: any user in this group can mount the host root filesystem ('-v /:/host') and edit /etc/shadow or host cron jobs. Mitigate container escapes by enabling User Namespaces (userns-remap), dropping Linux capabilities (--cap-drop=ALL --cap-add=NET_BIND_SERVICE), and mounting filesystems as read-only (--read-only).",
    costImplications: "Because containers share the host Linux kernel instead of provisioning full operating systems, a single AWS EC2 instance can host 10x-20x more microservices than traditional virtual machines, reducing EC2 instance counts and compute spend by up to 60%.",
    commonMistakesJson: JSON.stringify([
      "Assuming containers provide hardware-level isolation like VMs; a kernel panic or exploited kernel bug compromises all co-located containers.",
      "Granting users membership in the 'docker' group without realizing it gives them unmonitored root privileges on the entire host OS.",
      "Omitting memory limits, allowing an application memory leak to trigger the host kernel OOM Killer which may terminate critical host services.",
      "Using 'docker kill' instead of 'docker stop', abruptly terminating processes with SIGKILL and corrupting database files."
    ]),
    quickRevisionJson: JSON.stringify([
      "VM = Virtualizes hardware (Hypervisor + Guest OS). Container = Virtualizes OS (Host Kernel + Namespaces/Cgroups).",
      "Namespaces = Isolation boundaries (PID, NET, MNT, IPC, UTS, USER). Cgroups = Hardware resource quotas (CPU, RAM, I/O).",
      "Execution chain: Docker CLI -> REST -> /var/run/docker.sock -> dockerd -> containerd -> runc -> PID 1.",
      "Exit Code 137 = OOMKilled (128 + 9 SIGKILL) when container memory usage exceeds cgroup ceiling.",
      "Container lifecycle: Created -> Running -> Paused -> Stopped -> Deleted."
    ])
  },
  "docker-images-dockerfile-registries": {
    simpleExplanation: "A Docker image is a read-only, immutable template made up of stacked filesystem layers, each identified by a cryptographic SHA256 content digest. Docker images follow the formal naming format '[registry/][namespace/]repository[:tag]' (defaulting to docker.io/library/<image>:latest). Images are authored declaratively using a Dockerfile, where each command (FROM, RUN, COPY, ADD) creates a cached layer. Optimizing Dockerfiles requires understanding layer caching: Docker caches layers sequentially, and any change to an instruction or its source files invalidates all subsequent steps. Multi-stage builds represent the gold standard for production container engineering—separating the build environment (compilers, heavy SDKs, package caches) from the runtime environment (minimal OS like Alpine musl or Distroless), reducing image sizes from 1.5GB to under 30MB while removing security vulnerabilities. Images are published to registries like Docker Hub or private enterprise registries such as Harbor and registry:2, utilizing content-addressable layer deduplication so unchanged layers are never re-uploaded or re-downloaded.",
    coreConceptsJson: JSON.stringify([
      { term: "Immutable Layers & SHA256", definition: "Every RUN, COPY, ADD command creates a read-only filesystem diff identified by a cryptographic hash. Layers are cached and shared across images." },
      { term: "ARG vs ENV", definition: "ARG defines variables available strictly at build time (e.g. VERSION=1.2); ENV defines persistent environment variables baked into the image and exported to the running container." },
      { term: "COPY vs ADD", definition: "COPY strictly transfers local files/directories from the build context; ADD also auto-extracts tar archives and fetches remote URLs (discouraged due to security risks and cache busting)." },
      { term: "CMD vs ENTRYPOINT", definition: "ENTRYPOINT specifies the immutable executable binary (PID 1); CMD provides default arguments that can be easily overridden at runtime via CLI arguments." },
      { term: "Layer Cache Invalidation", definition: "Docker invalidates cache for a step if its command string changes or if copied files differ in SHA256 hash. Once a layer is invalidated, all downstream layers are rebuilt." },
      { term: "Base Image Selection", definition: "Scratch (0B empty image for static Go/Rust), Google Distroless (no shell/package manager), Alpine Linux (5MB, musl libc), Debian/Ubuntu-slim (glibc standard compatibility)." },
      { term: "Alpine musl vs glibc Incompatibility", definition: "Alpine uses musl libc instead of GNU C Library (glibc); pre-compiled Python wheels (numpy, pandas, cryptography) often fail to install or run 2x slower due to missing glibc binaries." },
      { term: "Multi-Stage Build Architecture", definition: "Uses multiple 'FROM' statements in a single Dockerfile. Stage 1 compiles code; Stage 2 uses 'COPY --from=builder' to copy only compiled binaries into a clean, minimal runtime." },
      { term: "Docker Hub & Harbor Registry", definition: "Registries store images. Docker Hub hosts official and verified repositories; Harbor provides CNCF enterprise features (Trivy vulnerability scanning, RBAC, replication)." }
    ]),
    internalsExplanation: "When you invoke 'docker build -t app:1.0 .', the Docker CLI packages the entire directory at '.' into an uncompressed tar stream (excluding files matching .dockerignore) and uploads it to dockerd as the build context. For each Dockerfile instruction, the daemon checks its local layer cache. For COPY and ADD, it compares SHA256 checksums of each file. If unchanged, it prints 'Using cache' and reuses the existing layer ID. When a cache miss occurs, the daemon spawns an intermediate container, executes the instruction, commits the layer diff via OverlayFS, tags it with a new SHA256 hash, and marks all subsequent steps as dirty. When pushing an image with 'docker push', the client negotiates with the registry's OCI Distribution API: it queries each layer's SHA256 digest; layers already stored in the registry return 'Layer already exists' and are skipped entirely, saving bandwidth and storage.",
    architectureSvg: `<svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="800" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 35)">
        <rect x="0" y="0" width="220" height="180" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="110" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Multi-Stage Dockerfile</text>
        <rect x="12" y="38" width="196" height="50" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="110" y="55" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">Stage 1: AS builder (SDK)</text>
        <text x="110" y="70" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">COPY package*.json ./</text>
        <text x="110" y="82" fill="#10B981" font-size="8" font-family="monospace" text-anchor="middle">RUN npm ci &amp;&amp; npm run build</text>
        <path d="M 110 90 L 110 102" stroke="#F59E0B" stroke-width="1.5"/>
        <rect x="12" y="105" width="196" height="60" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="110" y="122" fill="#10B981" font-size="9" font-family="monospace" text-anchor="middle">Stage 2: Runtime (Alpine/Distroless)</text>
        <text x="110" y="137" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">COPY --from=builder /app/dist ./</text>
        <text x="110" y="152" fill="#EF4444" font-size="8" font-family="monospace" text-anchor="middle">USER node &amp;&amp; CMD ["node","app.js"]</text>
      </g>
      <path d="M 260 125 L 300 125" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(310, 35)">
        <rect x="0" y="0" width="220" height="180" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="110" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Layer Cache Evaluation</text>
        <rect x="15" y="38" width="190" height="32" rx="4" fill="#064E3B"/>
        <text x="110" y="58" fill="#34D399" font-size="9" font-family="monospace" text-anchor="middle">Layer 1: Base Image [CACHED]</text>
        <rect x="15" y="76" width="190" height="32" rx="4" fill="#064E3B"/>
        <text x="110" y="96" fill="#34D399" font-size="9" font-family="monospace" text-anchor="middle">Layer 2: Dependencies [CACHED]</text>
        <rect x="15" y="114" width="190" height="32" rx="4" fill="#7F1D1D"/>
        <text x="110" y="134" fill="#FCA5A5" font-size="9" font-family="monospace" text-anchor="middle">Layer 3: Source Code [DIRTY]</text>
        <text x="110" y="165" fill="#F59E0B" font-size="8" font-family="system-ui" text-anchor="middle">Invalidates All Subsequent Layers</text>
      </g>
      <path d="M 540 125 L 575 125" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(585, 35)">
        <rect x="0" y="0" width="205" height="180" rx="8" fill="#111827" stroke="#10B981" stroke-width="1.5"/>
        <text x="102" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Registry Deduplication</text>
        <rect x="12" y="42" width="180" height="30" rx="4" fill="#1F2937"/>
        <text x="102" y="60" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">docker push registry/repo:tag</text>
        <rect x="12" y="80" width="180" height="42" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="102" y="96" fill="#10B981" font-size="8" font-family="monospace" text-anchor="middle">SHA256 Content-Addressable</text>
        <text x="102" y="112" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">"Layer already exists" (Skip)</text>
        <rect x="12" y="130" width="180" height="36" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="102" y="146" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">Size Reduction: 1.2GB -&gt; 28MB</text>
        <text x="102" y="158" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">Zero CVE Vulnerability Attack Surface</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "docker build --build-arg APP_ENV=production -t myorg/backend:v1.2.0 .", description: "Build image with custom build arguments and tag" },
      { command: "docker history --no-trunc myorg/backend:v1.2.0", description: "Inspect image layers, sizes, and corresponding Dockerfile instructions" },
      { command: "docker image inspect myorg/backend:v1.2.0 --format '{{.RootFS.Layers}}'", description: "View underlying SHA256 cryptographic layer hashes" },
      { command: "docker run -d -p 5000:5000 --name local-registry registry:2", description: "Spin up a local private Docker registry container" },
      { command: "docker tag myorg/backend:v1.2.0 localhost:5000/backend:v1.2.0 && docker push localhost:5000/backend:v1.2.0", description: "Tag and push image to local private registry" },
      { command: "docker save -o backend-v1.2.0.tar myorg/backend:v1.2.0 && docker load -i backend-v1.2.0.tar", description: "Export and import image tarball for air-gapped environments" },
      { command: "docker system df && docker system prune -a --volumes", description: "Analyze Docker disk footprint and prune dangling/unused images" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always copy dependency manifests (package.json, pom.xml, requirements.txt) and run dependency install before copying source code to maximize layer cache reuse.",
      "Prefer COPY over ADD unless automatic local tar archive decompression is explicitly required.",
      "Use multi-stage builds to completely omit build tools, compilers, package managers, and development dependencies from final production images.",
      "Always specify explicit non-root USER directives (e.g. 'USER appuser' or UID 10001) rather than running container processes as root.",
      "Maintain a comprehensive .dockerignore file to exclude .git, node_modules, secrets, and local logs from the build context."
    ]),
    securityNotes: "Never store API keys, private SSH keys, or database credentials in Dockerfile instructions (ARG or ENV), as they remain permanently visible in image layer metadata via 'docker history'. Scan images for known CVEs using tools like Trivy, Snyk, or AWS ECR basic/enhanced scanning before deploying.",
    costImplications: "Multi-stage builds that shrink image sizes from 1.2GB to 30MB reduce image registry storage costs, cut network egress transfer charges, and accelerate CI/CD deploy times by up to 80%.",
    commonMistakesJson: JSON.stringify([
      "Copying the entire source directory before running 'npm install' or 'pip install', busting the layer cache on every trivial code edit.",
      "Using ADD with remote URLs instead of RUN curl/wget chained with rm -rf, which bloats image layers with uncompressed artifacts.",
      "Selecting 'alpine' for complex Python applications without verifying glibc compatibility, resulting in broken wheels or compiling from source for 30 minutes.",
      "Executing 'docker system prune -a' on shared production servers without understanding it destroys all stopped containers and cached images."
    ]),
    quickRevisionJson: JSON.stringify([
      "Image = Stack of read-only immutable layers identified by SHA256 digests.",
      "ARG = Build time only. ENV = Persists in container runtime.",
      "COPY = Safe local file copy. ADD = Auto-extracts tar archives and downloads URLs.",
      "ENTRYPOINT = Fixed binary command. CMD = Default arguments overridden by CLI.",
      "Multi-stage build: Compile in heavy stage -> COPY --from=builder to minimal runtime."
    ])
  },
  "dockerfile-multistage-compose-networking": {
    simpleExplanation: "Production containerized systems consist of multiple cooperating microservices—APIs, databases, caches, and frontend applications—that require robust networking, persistent storage, and declarative orchestration. Docker provides 4 core network drivers: the default bridge ('docker0', lacking automatic DNS resolution), user-defined bridge networks (featuring an embedded DNS server at 127.0.0.11 that automatically resolves container names and service aliases), host networks (bypassing network virtualization for raw throughput), and none (total network isolation). For stateful workloads, containers provide ephemeral writable layers that vanish upon destruction; persistent data requires Docker Named Volumes (managed under /var/lib/docker/volumes/) or host Bind Mounts. Docker Compose provides a declarative YAML standard ('compose.yaml') to configure multi-container stacks, define inter-service networks, volume bindings, environment variables, resource limits, and startup dependency orders with healthcheck validation ('condition: service_healthy'), eliminating fragile multi-line docker run shell scripts.",
    coreConceptsJson: JSON.stringify([
      { term: "Default Bridge vs User-Defined Bridge", definition: "Default bridge requires manual --link and only allows IP communication. User-defined bridges provide an internal DNS server (127.0.0.11) enabling containers to resolve each other by container name." },
      { term: "Host & None Network Drivers", definition: "--network host shares the host's networking namespace without port mapping overhead; --network none strips all networking except loopback for isolated secure batch jobs." },
      { term: "Named Volumes vs Bind Mounts vs tmpfs", definition: "Named volumes are managed by Docker in /var/lib/docker/volumes for persistent databases; Bind mounts map arbitrary host directories for local dev; tmpfs writes to host memory only." },
      { term: "Docker Compose Architecture", definition: "Declarative YAML file defining services, networks, volumes, and configs, managed via the unified Docker Compose V2 CLI ('docker compose up -d')." },
      { term: "depends_on & Readiness Race Condition", definition: "depends_on only guarantees container startup order, not application readiness. Databases taking 15 seconds to accept TCP connections will cause dependent APIs to crash unless paired with healthcheck conditions." },
      { term: "HEALTHCHECK Instruction", definition: "Tests application liveliness (e.g. 'curl -f http://localhost:8080/health || exit 1'). Docker updates container status to (healthy) or (unhealthy), enabling self-healing." },
      { term: "Docker Compose Down vs Down -v", definition: "'docker compose down' stops and removes containers and networks while preserving volumes; 'docker compose down -v' deletes all named volumes, wiping all persistent database data." },
      { term: "Volume Permissions with Non-Root Users", definition: "Named volumes created by root inherit root:root ownership on the host; non-root container users (UID 10001) encounter 'EACCES Permission Denied' unless permissions are explicitly chowned in an entrypoint or Dockerfile." }
    ]),
    internalsExplanation: "When you create a user-defined bridge network ('docker network create app-net'), the Docker daemon instantiates a new virtual Linux bridge interface (e.g. br-1a2b3c4d), allocates a unique private subnet (e.g. 172.20.0.0/16), and configures iptables NAT forwarding rules. When containers attach to this network, Docker creates a veth virtual Ethernet pair: one interface sits inside the container's network namespace (renamed to eth0), and its peer connects to the Linux bridge. Docker runs an embedded DNS resolver on 127.0.0.11. Whenever an application executes a DNS lookup (e.g. postgres:5432), the container's /etc/resolv.conf directs queries to 127.0.0.11, which translates the service name to the target container's current dynamic IP address. Named volumes are managed by the storage driver in /var/lib/docker/volumes/<volume_name>/_data and bypass the copy-on-write OverlayFS storage layer entirely, providing native host disk I/O performance.",
    architectureSvg: `<svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="800" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 35)">
        <rect x="0" y="0" width="460" height="185" rx="8" fill="#111827" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="230" y="24" fill="#38BDF8" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">User-Defined Bridge Network (app-net • 172.20.0.0/16)</text>
        <g transform="translate(20, 40)">
          <rect x="0" y="0" width="120" height="120" rx="6" fill="#1F2937" stroke="#10B981" stroke-width="1"/>
          <text x="60" y="22" fill="#10B981" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Frontend (React)</text>
          <text x="60" y="38" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">IP: 172.20.0.2</text>
          <rect x="10" y="50" width="100" height="55" rx="4" fill="#0F172A"/>
          <text x="60" y="68" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">curl http://api:5000</text>
          <text x="60" y="82" fill="#F59E0B" font-size="7" font-family="monospace" text-anchor="middle">DNS Query</text>
          <text x="60" y="96" fill="#34D399" font-size="7" font-family="monospace" text-anchor="middle">127.0.0.11 -&gt; IP</text>
        </g>
        <path d="M 145 100 L 175 100" stroke="#38BDF8" stroke-width="2"/>
        <g transform="translate(180, 40)">
          <rect x="0" y="0" width="120" height="120" rx="6" fill="#1F2937" stroke="#F59E0B" stroke-width="1"/>
          <text x="60" y="22" fill="#F59E0B" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">API Service (Node)</text>
          <text x="60" y="38" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">IP: 172.20.0.3</text>
          <rect x="10" y="50" width="100" height="55" rx="4" fill="#0F172A"/>
          <text x="60" y="68" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">connect db:5432</text>
          <text x="60" y="82" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">depends_on:</text>
          <text x="60" y="96" fill="#10B981" font-size="7" font-family="monospace" text-anchor="middle">condition: healthy</text>
        </g>
        <path d="M 305 100 L 335 100" stroke="#F59E0B" stroke-width="2"/>
        <g transform="translate(340, 40)">
          <rect x="0" y="0" width="105" height="120" rx="6" fill="#1F2937" stroke="#38BDF8" stroke-width="1"/>
          <text x="52" y="22" fill="#38BDF8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Postgres DB</text>
          <text x="52" y="38" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">IP: 172.20.0.4</text>
          <rect x="8" y="50" width="89" height="55" rx="4" fill="#0F172A"/>
          <text x="52" y="68" fill="#10B981" font-size="8" font-family="monospace" text-anchor="middle">pg_isready</text>
          <text x="52" y="82" fill="#38BDF8" font-size="7" font-family="monospace" text-anchor="middle">HEALTHCHECK</text>
          <text x="52" y="96" fill="#34D399" font-size="7" font-family="monospace" text-anchor="middle">STATUS: healthy</text>
        </g>
      </g>
      <g transform="translate(510, 35)">
        <rect x="0" y="0" width="280" height="185" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="140" y="24" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Named Volume Persistence</text>
        <rect x="15" y="40" width="250" height="60" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="140" y="58" fill="#10B981" font-size="9" font-family="monospace" text-anchor="middle">/var/lib/docker/volumes/pgdata/_data</text>
        <text x="140" y="74" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Direct Host Disk I/O (Bypasses CoW Layer)</text>
        <text x="140" y="88" fill="#34D399" font-size="8" font-family="system-ui" text-anchor="middle">Survives 'docker compose down'</text>
        <rect x="15" y="112" width="250" height="55" rx="4" fill="#0F172A" stroke="#EF4444" stroke-width="1"/>
        <text x="140" y="130" fill="#EF4444" font-size="9" font-family="monospace" text-anchor="middle">DANGER: docker compose down -v</text>
        <text x="140" y="146" fill="#FCA5A5" font-size="8" font-family="system-ui" text-anchor="middle">Permanently wipes database volume &amp; data!</text>
        <text x="140" y="158" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">Always back up before using -v flag</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "docker network create --driver bridge my-network", description: "Create an isolated user-defined bridge network with automatic DNS" },
      { command: "docker run -d --name db --network my-network -e POSTGRES_PASSWORD=secret postgres:16-alpine", description: "Launch database on custom network" },
      { command: "docker run -it --rm --network my-network curlimages/curl curl -s http://db:5432", description: "Verify container name DNS resolution across the bridge network" },
      { command: "docker volume create pg_data && docker volume ls", description: "Create and inspect Docker named volumes" },
      { command: "docker compose -f compose.yaml up -d --build", description: "Build images and start multi-container stack in detached mode" },
      { command: "docker compose ps && docker compose logs -f api", description: "List running compose services and follow log output" },
      { command: "docker compose down", description: "Safely terminate compose containers and networks while preserving volume data" },
      { command: "docker compose exec api sh", description: "Open an interactive shell in a running compose service container" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always create user-defined bridge networks for multi-container applications instead of relying on the legacy default bridge network.",
      "Never use 'docker compose down -v' in production or staging environments, as it permanently deletes named persistent storage volumes.",
      "Pair 'depends_on' with 'condition: service_healthy' and a robust database healthcheck to avoid startup race condition crashes.",
      "Use named volumes for database storage rather than bind mounts in production to ensure optimal I/O performance and OS portability.",
      "Explicitly set CPU and memory limits in docker-compose.yml under 'deploy.resources.limits' to avoid resource starvation."
    ]),
    securityNotes: "Avoid using '--network host' in multi-tenant environments as it removes container network isolation and exposes localhost ports to the entire host. Ensure sensitive environment variables (.env) are listed in .gitignore and injected using Docker secrets or external secret managers (AWS Secrets Manager / Vault).",
    costImplications: "Docker Compose allows entire multi-service microservice topologies (API, cache, database, frontend) to be validated on a single low-cost development VM or local laptop before provisioning expensive distributed cloud infrastructure.",
    commonMistakesJson: JSON.stringify([
      "Attempting to communicate between containers on the default bridge using container names, causing DNS resolution failures ('getaddrinfo ENOTFOUND').",
      "Accidentally running 'docker compose down -v' during maintenance, completely destroying production database volumes and customer data.",
      "Using 'depends_on' without healthchecks, expecting the web app to wait for the database schema migrations to complete before accepting traffic.",
      "Running a non-root container against a volume initialized by root, leading to fatal 'EACCES Permission Denied' file write crashes."
    ]),
    quickRevisionJson: JSON.stringify([
      "User-defined bridge has built-in DNS (127.0.0.11); default bridge does NOT support service name DNS.",
      "Named volumes persist in /var/lib/docker/volumes/_data and survive container destruction.",
      "docker compose up -d (starts stack); docker compose down (stops stack, keeps volumes); down -v (deletes volumes!).",
      "depends_on checks container startup; use 'condition: service_healthy' for application readiness."
    ])
  },
  19: {
    simpleExplanation: "Kubernetes (often abbreviated as K8s) is the world's most popular open-source container orchestration platform, originally designed by Google and maintained by the Cloud Native Computing Foundation (CNCF). While Docker runs individual containers on a single host, Kubernetes manages fleets of hundreds or thousands of containers across a cluster of server nodes. Kubernetes automates container scheduling, self-healing (restarting crashed containers), zero-downtime rolling deployments, horizontal autoscaling based on traffic, and service discovery.",
    coreConceptsJson: JSON.stringify([
      { term: "Control Plane Components", definition: "kube-apiserver (central REST gateway), etcd (distributed key-value state store), kube-scheduler (assigns pods to nodes), kube-controller-manager (reconciles desired state)." },
      { term: "Worker Node Components", definition: "kubelet (agent communicating with API server and runtime), kube-proxy (maintains IP packet filtering rules / IPVS), Container Runtime (containerd/CRI-O)." },
      { term: "Pod", definition: "The smallest deployable unit in Kubernetes, consisting of one or more tightly coupled containers sharing storage and network IP." },
      { term: "Deployment & ReplicaSet", definition: "A Deployment provides declarative updates for Pods and ReplicaSets, handling rolling upgrades and automatic rollbacks." },
      { term: "Service & Ingress", definition: "Services provide a stable virtual IP and load-balancing across dynamic pods (ClusterIP, NodePort, LoadBalancer). Ingress routes external HTTP/HTTPS traffic to Services via URL paths and hostnames." }
    ]),
    internalsExplanation: "Kubernetes is built entirely on declarative reconciliation loops. You submit desired state manifests (YAML) to the kube-apiserver. The API server validates and writes the state to etcd. Controllers observe changes via Informers and Delta FIFOs. If a worker node dies, the NodeLifecycleController detects the missing heartbeat, the ReplicaSetController identifies that actual running pods < desired replicas, and the kube-scheduler evaluates healthy nodes based on affinity, taints, tolerations, and resource requests, instructing a healthy node's kubelet to spawn the replacement Pod.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="220" height="140" rx="8" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="110" y="25" fill="#60A5FA" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Control Plane (Master)</text>
        <rect x="15" y="38" width="85" height="35" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="57" y="55" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">API Server</text>
        <rect x="115" y="38" width="90" height="35" rx="4" fill="#0F172A" stroke="#A855F7"/>
        <text x="160" y="55" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">etcd Store</text>
        <rect x="15" y="85" width="85" height="35" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="57" y="102" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">Scheduler</text>
        <rect x="115" y="85" width="90" height="35" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="160" y="102" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">Controllers</text>
      </g>
      <path d="M 260 115 L 300 115" stroke="#3B82F6" stroke-width="2"/>
      <g transform="translate(310, 45)">
        <rect x="0" y="0" width="210" height="140" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="105" y="25" fill="#34D399" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Worker Node 1</text>
        <rect x="15" y="38" width="85" height="28" rx="4" fill="#0F172A"/>
        <text x="57" y="56" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">kubelet</text>
        <rect x="110" y="38" width="85" height="28" rx="4" fill="#0F172A"/>
        <text x="152" y="56" fill="#F8FAFC" font-size="9" font-family="monospace" text-anchor="middle">kube-proxy</text>
        <rect x="15" y="75" width="180" height="50" rx="4" fill="#065F46" stroke="#34D399"/>
        <text x="105" y="95" fill="#A7F3D0" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">Pod: frontend-app</text>
        <text x="105" y="112" fill="#D1FAE5" font-size="8" font-family="monospace" text-anchor="middle">Container (Port 80) + Volume</text>
      </g>
      <g transform="translate(540, 45)">
        <rect x="0" y="0" width="220" height="140" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="110" y="25" fill="#C084FC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Networking &amp; Routing</text>
        <rect x="15" y="40" width="190" height="35" rx="4" fill="#0F172A" stroke="#8B5CF6"/>
        <text x="110" y="58" fill="#E9D5FF" font-size="9" font-family="monospace" text-anchor="middle">Ingress (Host / Path Rules)</text>
        <rect x="15" y="85" width="190" height="35" rx="4" fill="#0F172A" stroke="#06B6D4"/>
        <text x="110" y="103" fill="#CFFAFE" font-size="9" font-family="monospace" text-anchor="middle">Service (ClusterIP LoadBalancing)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "kubectl get nodes -o wide", explanation: "Inspects all worker nodes in the cluster with status, roles, IP addresses, and OS image." },
      { command: "kubectl apply -f deployment.yaml", explanation: "Declaratively applies a Kubernetes resource manifest to create or update Deployments and Services." },
      { command: "kubectl get pods --all-namespaces", explanation: "Lists all running pods across default, kube-system, and custom namespaces." },
      { command: "kubectl describe pod my-app-765d89f89-xk2pq", explanation: "Prints detailed pod events, status conditions, and container state to troubleshoot CrashLoopBackOff." },
      { command: "kubectl rollout status deployment/my-app", explanation: "Monitors real-time progress of a rolling deployment, verifying new replica health." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always define CPU and Memory 'requests' and 'limits' on every container to prevent runaway memory leaks (OOMKilled) from starving the node.",
      "Always implement both Liveness Probes (restarts deadlocked processes) and Readiness Probes (prevents sending traffic until container is initialized).",
      "Store application configurations in ConfigMaps and sensitive credentials in Secrets, injecting them via environment variables or mounted files.",
      "Use Helm charts to package, version, and template Kubernetes YAML manifests for multi-environment deployments (Dev, Staging, Prod)."
    ]),
    securityNotes: "Enable Role-Based Access Control (RBAC) with Least Privilege ServiceAccounts. Never run pods with 'privileged: true' unless building system daemonsets. Use NetworkPolicies to isolate namespace traffic.",
    costImplications: "You can run Kubernetes 100% free locally using Minikube or Kind (Kubernetes in Docker). On AWS, managed EKS clusters cost $0.10/hour ($73/month) for the control plane plus standard EC2 worker instances.",
    commonMistakesJson: JSON.stringify([
      "Forgetting to set Readiness Probes: traffic is routed to pods before the database connection or Node.js server has finished booting, causing 502 Bad Gateway errors.",
      "Using 'latest' image tag in production deployments: Kubernetes image pull policy can cache stale layers, preventing new code from executing.",
      "Editing live pods directly with 'kubectl edit pod' instead of committing manifest changes to Git (breaking GitOps reproducibility)."
    ]),
    quickRevisionJson: JSON.stringify([
      "Control Plane: API Server (gateway), etcd (state database), Scheduler (node placement), Controller Manager (state reconciliation).",
      "Worker Node: kubelet (node agent), kube-proxy (network rules), containerd (runtime).",
      "Pod = 1+ containers; Deployment = manages pod replicas & rolling updates.",
      "Service = stable internal load-balanced IP; Ingress = HTTP layer 7 routing."
    ])
  },
  "kubernetes-architecture-control-plane-nodes": {
    simpleExplanation: "Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, self-healing, and networking of containerized applications across a cluster of server nodes. Think of a Kubernetes cluster like an airport air traffic control system: the Control Plane is the control tower that decides where every flight (Pod) should go, tracking all movements through an authoritative database (etcd) and REST API (kube-apiserver), while Worker Nodes are the runways and ground crews (kubelet, kube-proxy, containerd) where aircraft actually land, take off, and get serviced. Applications interact purely declaratively: you describe desired state in YAML manifests, and internal control loops continuously reconcile actual cluster state to match.",
    coreConceptsJson: JSON.stringify([
      { term: "kube-apiserver", definition: "Stateless REST API gateway; the sole component allowed to read and write directly to etcd; validates authentication, authorization (RBAC), and admission control." },
      { term: "etcd Store", definition: "Distributed, highly-available, consistent key-value store (using Raft consensus) holding the authoritative cluster state; the single source of truth." },
      { term: "kube-scheduler", definition: "Decides WHICH worker node runs newly created Pods based on resource requests, taints, tolerations, and affinity rules; does not start the container itself." },
      { term: "kube-controller-manager", definition: "Bundles core control loops (Node, ReplicaSet, Endpoints, Job controllers) that continuously compare actual state against desired state and drive reconciliation." },
      { term: "kubelet", definition: "Primary node agent on every worker node; watches PodSpecs from the API server, instructs the container runtime to spawn containers, and reports node/pod health." },
      { term: "kube-proxy", definition: "Network agent on every node; programs host iptables or IPVS packet-filtering rules to implement Service virtual IPs and load-balance traffic across pods." },
      { term: "Container Runtime Interface (CRI)", definition: "Standardized plugin interface allowing Kubernetes to use runtimes like containerd and CRI-O; dockershim was removed in K8s 1.24+." },
      { term: "Manifest Anatomy & Requests vs Limits", definition: "Universal YAML structure (apiVersion, kind, metadata, spec, read-only status); requests set the scheduler placement baseline; limits enforce kernel cgroup ceilings." }
    ]),
    internalsExplanation: "When an engineer runs 'kubectl apply -f pod.yaml', the client sends an HTTP POST request to kube-apiserver. The API server authenticates the client via mTLS/bearer token, validates RBAC permissions, runs mutating and validating admission webhooks, and writes the unassigned PodSpec into etcd. kube-scheduler observes the unscheduled Pod via an API watch stream, executes node filtering (predicate checks for CPU/memory capacity and taints) and node scoring (priority weighting for data locality and spread), and writes a binding object back to the API server assigning the Pod to a specific node. The kubelet on that target node detects the binding, downloads secrets/configmaps, delegates network interface provisioning to the CNI plugin (e.g. Flannel/Calico), calls containerd via CRI to pull the image and create the OCI runtime bundle, and starts the container as PID 1.",
    architectureSvg: `<svg viewBox="0 0 850 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="830" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 35)">
        <rect width="250" height="185" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="125" y="24" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">CONTROL PLANE (MASTER)</text>
        <rect x="15" y="38" width="105" height="38" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="67" y="56" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle">kube-apiserver</text>
        <text x="67" y="68" fill="#38BDF8" font-size="7" font-family="monospace" text-anchor="middle">REST Gateway</text>
        <rect x="130" y="38" width="105" height="38" rx="4" fill="#0F172A" stroke="#A855F7"/>
        <text x="182" y="56" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle">etcd Store</text>
        <text x="182" y="68" fill="#A855F7" font-size="7" font-family="monospace" text-anchor="middle">Single Truth (Raft)</text>
        <path d="M 120 57 L 130 57" stroke="#A855F7" stroke-width="1.5"/>
        <rect x="15" y="88" width="105" height="38" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="67" y="106" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle">kube-scheduler</text>
        <text x="67" y="118" fill="#F59E0B" font-size="7" font-family="monospace" text-anchor="middle">Node Placement</text>
        <rect x="130" y="88" width="105" height="38" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="182" y="106" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle">controller-mgr</text>
        <text x="182" y="118" fill="#10B981" font-size="7" font-family="monospace" text-anchor="middle">Reconciliation</text>
        <rect x="15" y="138" width="220" height="28" rx="4" fill="#0F172A"/>
        <text x="125" y="156" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">kubectl apply -f (Declarative YAML)</text>
      </g>
      <path d="M 285 120 L 325 120" stroke="#38BDF8" stroke-width="2"/>
      <polygon points="330,120 320,115 320,125" fill="#38BDF8"/>
      <g transform="translate(335, 35)">
        <rect width="235" height="185" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="117" y="24" fill="#10B981" font-size="12" font-weight="bold" text-anchor="middle">WORKER NODE 1</text>
        <rect x="12" y="38" width="100" height="32" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="62" y="58" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">kubelet</text>
        <rect x="122" y="38" width="100" height="32" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="172" y="58" fill="#F59E0B" font-size="9" font-family="monospace" text-anchor="middle">kube-proxy</text>
        <rect x="12" y="80" width="210" height="32" rx="4" fill="#0F172A" stroke="#A855F7"/>
        <text x="117" y="100" fill="#A855F7" font-size="9" font-family="monospace" text-anchor="middle">CRI: containerd / CRI-O</text>
        <rect x="12" y="122" width="210" height="42" rx="4" fill="#065F46" stroke="#34D399"/>
        <text x="117" y="139" fill="#A7F3D0" font-size="9" font-weight="bold" text-anchor="middle">Pod: web-server (IP: 10.244.1.5)</text>
        <text x="117" y="153" fill="#D1FAE5" font-size="7" font-family="monospace" text-anchor="middle">Requests: 100m CPU, 128Mi RAM</text>
      </g>
      <g transform="translate(585, 35)">
        <rect width="235" height="185" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="117" y="24" fill="#10B981" font-size="12" font-weight="bold" text-anchor="middle">WORKER NODE 2</text>
        <rect x="12" y="38" width="100" height="32" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="62" y="58" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">kubelet</text>
        <rect x="122" y="38" width="100" height="32" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="172" y="58" fill="#F59E0B" font-size="9" font-family="monospace" text-anchor="middle">kube-proxy</text>
        <rect x="12" y="80" width="210" height="32" rx="4" fill="#0F172A" stroke="#A855F7"/>
        <text x="117" y="100" fill="#A855F7" font-size="9" font-family="monospace" text-anchor="middle">CNI Plugin: Flannel/Calico</text>
        <rect x="12" y="122" width="210" height="42" rx="4" fill="#065F46" stroke="#34D399"/>
        <text x="117" y="139" fill="#A7F3D0" font-size="9" font-weight="bold" text-anchor="middle">CoreDNS &amp; Metrics Server</text>
        <text x="117" y="153" fill="#D1FAE5" font-size="7" font-family="monospace" text-anchor="middle">Internal DNS &amp; HPA Telemetry</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "kubectl get nodes -o wide", description: "List all cluster nodes, Ready/NotReady status, IP addresses, OS images, and container runtimes" },
      { command: "kubectl cluster-info", description: "Display endpoint URLs for the Kubernetes control plane and CoreDNS services" },
      { command: "kubectl config get-contexts && kubectl config use-context <name>", description: "Inspect available cluster contexts and switch the active working context in kubeconfig" },
      { command: "kubectl get pods -A -o wide", description: "List all Pods across every namespace with internal IP addresses and assigned worker nodes" },
      { command: "kubectl apply -f manifest.yaml", description: "Declaratively create or update cluster resources; safe and idempotent for CI/CD pipelines" },
      { command: "kubectl diff -f manifest.yaml", description: "Perform a dry-run comparison showing exact differences between local manifest and live cluster state" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never attempt to communicate with etcd directly; always interact through kube-apiserver to maintain RBAC and admission validation.",
      "Always set both resources.requests and resources.limits on containers: requests guide scheduler placement; limits prevent OOM noisy-neighbor crashes.",
      "Use declarative 'kubectl apply -f' checked into version control (GitOps) rather than imperative 'kubectl run' or 'kubectl create'.",
      "Treat etcd as the most critical cluster component; implement automated snapshot backups to encrypted cloud storage."
    ]),
    securityNotes: "Enable RBAC (Role-Based Access Control) with least-privilege service accounts. Block unauthenticated access to the kubelet read-only port 10255 and API server port 6443. Enable etcd encryption at rest to protect sensitive Kubernetes Secrets.",
    costImplications: "By sharing compute hardware and bin-packing microservices onto worker nodes based on resource requests, Kubernetes achieves up to 70% higher infrastructure density than static VM provisioning, dramatically lowering AWS EC2 compute costs.",
    commonMistakesJson: JSON.stringify([
      "Assuming the scheduler starts the Pod; it only selects the node—the kubelet on that node spawns the actual container.",
      "Forgetting to install a CNI network plugin (Flannel/Calico) after kubeadm init, leaving all Pods stuck in Pending/ContainerCreating.",
      "Running 'kubectl create -f' in automated deployment scripts, causing pipelines to fail on subsequent runs because resources already exist.",
      "Omitting container resource requests, causing the scheduler to blindly stack Pods on overloaded nodes until physical RAM is exhausted."
    ]),
    quickRevisionJson: JSON.stringify([
      "Control Plane: kube-apiserver (REST entry), etcd (state store), kube-scheduler (placement), kube-controller-manager (reconciliation).",
      "Worker Node: kubelet (node agent), kube-proxy (iptables/IPVS routing), containerd/CRI-O (CRI runtime).",
      "Manifest anatomy: apiVersion, kind, metadata, spec, read-only status.",
      "kubectl apply -f is declarative and idempotent; kubectl create -f errors if resource exists.",
      "Requests = minimum guaranteed (scheduler baseline); Limits = maximum allowed (kernel cgroup ceiling)."
    ])
  },
  "kubernetes-objects-workloads-networking-storage": {
    simpleExplanation: "Kubernetes objects are persistent entities that represent the desired state of your applications, networking, and storage. The fundamental execution primitive is the Pod—wrapping one or more tightly coupled containers sharing network namespaces and storage. To ensure high availability and self-healing, Pods are managed by higher-level controllers: Deployments manage stateless microservices with rolling updates; StatefulSets manage stateful databases with stable ordered identities and dedicated per-Pod persistent volumes; DaemonSets run node-level agents (logging/monitoring) on every node; and Jobs/CronJobs execute batch workloads to completion. Communication is routed through Services (ClusterIP, NodePort, LoadBalancer) using dynamic label selectors, while Ingress provides layer-7 HTTP host/path routing and TLS termination. Storage is abstracted through PersistentVolumes (PV) and Claims (PVC), decoupling applications from underlying cloud disks.",
    coreConceptsJson: JSON.stringify([
      { term: "Pod vs Deployment", definition: "A Pod is the smallest deployable unit (ephemeral, not self-healing on its own); a Deployment is a higher-level controller that manages Pod replicas via a ReplicaSet with rolling updates." },
      { term: "ReplicaSet & Namespace", definition: "A ReplicaSet maintains a specified pod count, recreating crashed pods; a Namespace divides a single physical cluster into virtual environments (dev, staging, prod)." },
      { term: "Service Types", definition: "ClusterIP (default internal virtual IP), NodePort (static port on every node), LoadBalancer (provisions cloud LB), ExternalName (maps to external CNAME)." },
      { term: "Label Selectors", definition: "Key-value tags matching Services to dynamic Pod endpoints; if a Pod's labels don't match the Service selector, it silently receives no traffic." },
      { term: "ConfigMap vs Secret", definition: "ConfigMaps store non-sensitive key-value configurations; Secrets store sensitive data (passwords, tokens) base64-encoded by default (requires etcd encryption for real security)." },
      { term: "PV & PVC Subsystem", definition: "PersistentVolume is actual cluster storage; PersistentVolumeClaim is an application request for storage; Pods bind to the PVC, decoupling code from storage hardware." },
      { term: "DaemonSet vs StatefulSet", definition: "DaemonSet runs exactly one pod per node (logging, CNI); StatefulSet runs stateful pods with stable ordered names (db-0, db-1) and dedicated per-pod PVCs." },
      { term: "Job & CronJob", definition: "Job runs batch pods to completion and stops without restarting; CronJob triggers Jobs on a repeating cron schedule." },
      { term: "Ingress & Ingress Controller", definition: "Ingress defines HTTP/HTTPS routing rules and SSL termination; requires an active Ingress Controller (NGINX, Traefik) to actually route traffic." }
    ]),
    internalsExplanation: "Kubernetes networking relies on the flat pod network model: every Pod receives its own routable IP address and can communicate with every other Pod without NAT. Services do not exist as physical processes; they are virtual IPs managed by kube-proxy. kube-proxy watches Service and EndpointSlice objects via the API server. When a Service with selector 'app: backend' is created, the EndpointsController populates the EndpointSlice with the active IPs of matching Pods. kube-proxy writes iptables NAT rules (or IPVS hash tables) on every node. When client packets hit the Service ClusterIP, the host kernel randomly redirects traffic to one of the healthy Pod IPs. For storage, the PersistentVolumeController binds a PVC to a matching PV; the kubelet volume manager attaches the cloud disk (e.g. AWS EBS) to the worker node and mounts it into the container rootfs.",
    architectureSvg: `<svg viewBox="0 0 850 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="830" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 40)">
        <rect width="210" height="170" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="105" y="24" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">INGRESS &amp; SERVICES</text>
        <rect x="12" y="38" width="186" height="38" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="105" y="55" fill="#F8FAFC" font-size="9" font-weight="bold" text-anchor="middle">Ingress Controller</text>
        <text x="105" y="68" fill="#38BDF8" font-size="7" font-family="monospace" text-anchor="middle">HTTPS Routing &amp; TLS (Layer 7)</text>
        <path d="M 105 78 L 105 88" stroke="#38BDF8" stroke-width="1.5"/>
        <rect x="12" y="90" width="186" height="42" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="105" y="108" fill="#10B981" font-size="9" font-weight="bold" text-anchor="middle">Service (ClusterIP)</text>
        <text x="105" y="122" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">Virtual IP + Label Selector</text>
        <rect x="12" y="138" width="186" height="24" rx="4" fill="#0F172A"/>
        <text x="105" y="154" fill="#F59E0B" font-size="8" font-family="monospace" text-anchor="middle">kube-proxy iptables / IPVS</text>
      </g>
      <path d="M 245 125 L 280 125" stroke="#10B981" stroke-width="2"/>
      <polygon points="285,125 275,120 275,130" fill="#10B981"/>
      <g transform="translate(290, 35)">
        <rect width="270" height="180" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="135" y="24" fill="#F59E0B" font-size="11" font-weight="bold" text-anchor="middle">WORKLOAD CONTROLLERS</text>
        <g transform="translate(15, 38)">
          <rect width="115" height="58" rx="4" fill="#0F172A" stroke="#38BDF8"/>
          <text x="57" y="18" fill="#38BDF8" font-size="8" font-weight="bold" text-anchor="middle">Deployment</text>
          <text x="57" y="32" fill="#94A3B8" font-size="7" text-anchor="middle">Stateless Replicas</text>
          <text x="57" y="46" fill="#34D399" font-size="7" font-family="monospace" text-anchor="middle">Rolling Updates</text>
        </g>
        <g transform="translate(140, 38)">
          <rect width="115" height="58" rx="4" fill="#0F172A" stroke="#A855F7"/>
          <text x="57" y="18" fill="#A855F7" font-size="8" font-weight="bold" text-anchor="middle">StatefulSet</text>
          <text x="57" y="32" fill="#94A3B8" font-size="7" text-anchor="middle">Databases (db-0, db-1)</text>
          <text x="57" y="46" fill="#FBBF24" font-size="7" font-family="monospace" text-anchor="middle">Per-Pod PVC Binding</text>
        </g>
        <g transform="translate(15, 104)">
          <rect width="115" height="58" rx="4" fill="#0F172A" stroke="#10B981"/>
          <text x="57" y="18" fill="#10B981" font-size="8" font-weight="bold" text-anchor="middle">DaemonSet</text>
          <text x="57" y="32" fill="#94A3B8" font-size="7" text-anchor="middle">1 Pod / Node Agent</text>
          <text x="57" y="46" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">Logging • CNI • Metric</text>
        </g>
        <g transform="translate(140, 104)">
          <rect width="115" height="58" rx="4" fill="#0F172A" stroke="#EF4444"/>
          <text x="57" y="18" fill="#EF4444" font-size="8" font-weight="bold" text-anchor="middle">Job / CronJob</text>
          <text x="57" y="32" fill="#94A3B8" font-size="7" text-anchor="middle">Run to Completion</text>
          <text x="57" y="46" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">DB Migrations • Cron</text>
        </g>
      </g>
      <path d="M 565 125 L 600 125" stroke="#A855F7" stroke-width="2"/>
      <polygon points="605,125 595,120 595,130" fill="#A855F7"/>
      <g transform="translate(610, 35)">
        <rect width="210" height="180" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="105" y="24" fill="#A855F7" font-size="11" font-weight="bold" text-anchor="middle">STORAGE &amp; CONFIG</text>
        <rect x="12" y="38" width="186" height="40" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="105" y="55" fill="#10B981" font-size="9" font-weight="bold" text-anchor="middle">PersistentVolume (PV)</text>
        <text x="105" y="68" fill="#94A3B8" font-size="7" text-anchor="middle">StorageClass (EBS / NFS / CSI)</text>
        <rect x="12" y="84" width="186" height="40" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="105" y="101" fill="#38BDF8" font-size="9" font-weight="bold" text-anchor="middle">PV Claim (PVC)</text>
        <text x="105" y="114" fill="#94A3B8" font-size="7" text-anchor="middle">Decoupled App Storage Request</text>
        <rect x="12" y="130" width="186" height="38" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="105" y="146" fill="#F59E0B" font-size="8" font-weight="bold" text-anchor="middle">ConfigMap &amp; Secret</text>
        <text x="105" y="158" fill="#94A3B8" font-size="7" text-anchor="middle">Decoupled Runtime Environment</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "kubectl describe pod <pod-name>", description: "The #1 troubleshooting command; prints full resource spec, container states, and recent lifecycle Events" },
      { command: "kubectl logs <pod-name> -f --tail=100 -c <container>", description: "Stream live logs from a specific container inside a single or multi-container Pod" },
      { command: "kubectl exec -it <pod-name> -- sh", description: "Open an interactive shell inside a running container for live inspection and network probing" },
      { command: "kubectl port-forward pod/<pod-name> 8080:80", description: "Forward a local workstation port directly to a Pod port, bypassing Services for private debugging" },
      { command: "kubectl get pv,pvc -A", description: "Inspect all persistent volumes, claims, capacity, access modes, and bound status across namespaces" },
      { command: "kubectl get svc,ep -o wide", description: "Verify Service virtual IPs, NodePorts, and backing Pod IP endpoints matched via label selectors" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never create bare Pods directly in production; always manage Pods via Deployments, StatefulSets, or DaemonSets for automated self-healing.",
      "Always verify Service label selectors match Pod labels exactly; selector mismatches silently result in empty endpoints and connection drops.",
      "Use StatefulSets with volumeClaimTemplates for databases (PostgreSQL, Kafka) to guarantee stable network identity and dedicated storage.",
      "Store sensitive credentials in Secrets (not ConfigMaps) and enable KMS encryption at rest in etcd."
    ]),
    securityNotes: "Kubernetes Secrets are only base64-encoded by default, which is easily decoded. Secure secrets by enforcing RBAC access rules, enabling etcd encryption at rest with AWS KMS, and integrating external secret stores like HashiCorp Vault or AWS Secrets Manager via the Secrets Store CSI Driver.",
    costImplications: "Dynamic storage provisioning via StorageClasses automatically allocates AWS EBS volumes only when a PVC is bound, eliminating pre-allocated idle storage costs. Setting correct reclaim policies (Delete vs Retain) prevents orphaned storage volume charges.",
    commonMistakesJson: JSON.stringify([
      "Using a Deployment for stateful databases, resulting in random pod names and shared storage corruption during rescheduling.",
      "Believing a Secret is encrypted because it is base64-encoded; anyone with read permissions can decode it with 'base64 -d'.",
      "Creating an Ingress resource without an Ingress Controller installed in the cluster, leaving routing rules completely inert.",
      "Using a Deployment instead of a Job for a one-off database migration script, causing K8s to repeatedly restart the script on exit."
    ]),
    quickRevisionJson: JSON.stringify([
      "Pod = 1+ containers sharing IP & storage. Deployment = manages stateless pods via ReplicaSet.",
      "Service types: ClusterIP (internal), NodePort (host port), LoadBalancer (cloud external LB), ExternalName (CNAME).",
      "StatefulSet = stable names (web-0, web-1) + dedicated PVCs. DaemonSet = 1 pod on every node.",
      "PV = actual physical storage; PVC = storage claim request; StorageClass = dynamic provisioner.",
      "kubectl describe pod <name> is the #1 command to diagnose scheduling, pulling, and crash events."
    ])
  },
  "k8s-workloads-services-networking-helm": {
    simpleExplanation: "Production Kubernetes operations center around zero-downtime application delivery, dynamic autoscaling, standardized packaging, and incident resolution. Deployments manage zero-downtime upgrades via the RollingUpdate strategy, which creates a new ReplicaSet, scales it up while scaling the old ReplicaSet down (governed by maxUnavailable and maxSurge), and retains old ReplicaSets scaled to zero (revisionHistoryLimit) for instant one-command rollbacks ('kubectl rollout undo'). To handle spiky traffic, the Horizontal Pod Autoscaler (HPA) continuously reads CPU/memory metrics from the Metrics Server and dynamically adjusts replica counts between configured minimum and maximum bounds. For enterprise release engineering, Helm packages complex multi-manifest applications into reusable, version-controlled charts (Chart.yaml, values.yaml, templates/), providing atomic installs, parameter overrides, and full release lifecycle management.",
    coreConceptsJson: JSON.stringify([
      { term: "RollingUpdate Strategy", definition: "Progressively replaces old Pods with new ones, ensuring continuous application availability; controlled by maxUnavailable (down pods) and maxSurge (extra pods)." },
      { term: "Recreate Strategy", definition: "Terminates all existing Pods before creating new ones; causes brief downtime but prevents old and new versions from running concurrently (required for breaking DB migrations)." },
      { term: "Rollout Undo & Revision History", definition: "Rollouts record numbered revisions; 'kubectl rollout undo' instantly rolls back to a previous revision by scaling the previous ReplicaSet back up." },
      { term: "Horizontal Pod Autoscaler (HPA)", definition: "Autoscaling controller that queries Metrics Server for real-time CPU/memory utilization and scales Pod replica counts within min/max bounds." },
      { term: "Metrics Server Prerequisite", definition: "Cluster add-on that collects container resource telemetry; HPA cannot make scaling decisions and displays 'unknown' metrics without it." },
      { term: "Helm Package Manager", definition: "The package manager for Kubernetes; bundles YAML manifests into parameterized templates driven by a values.yaml configuration file." },
      { term: "Helm Release & Rollback", definition: "A specific running instance of a Helm chart; supports atomic upgrades ('helm upgrade --install') and release-level rollbacks ('helm rollback')." },
      { term: "Pending vs CrashLoopBackOff", definition: "Pending means the Pod cannot be scheduled to any node (insufficient CPU/RAM, taints, unbound PVC); CrashLoopBackOff means the container scheduled, but its process crashed repeatedly on startup." }
    ]),
    internalsExplanation: "During a Deployment rolling update, the DeploymentController creates a new ReplicaSet (hash-suffixed). It increments the new ReplicaSet replica count while decrementing the old ReplicaSet, enforcing that total unavailable pods do not exceed 'maxUnavailable' (default 25%) and total running pods do not exceed replicas + 'maxSurge' (default 25%). When new Pods pass their Readiness probes, the old ReplicaSet is scaled to 0. It is NOT deleted; keeping the old ReplicaSet intact allows 'kubectl rollout undo' to execute instantaneously without re-pulling or reconstructing manifests. For HPA, the controller queries the Metrics API ('metrics.k8s.io') every 15 seconds. It computes desired replicas using the formula: desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]. If target CPU is 50% and current average is 80% on 2 pods, HPA calculates ceil[2 * (80/50)] = 4 replicas, updating the Deployment's spec.replicas accordingly.",
    architectureSvg: `<svg viewBox="0 0 850 260" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="830" height="240" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(30, 35)">
        <rect width="250" height="185" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="125" y="24" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">ZERO-DOWNTIME ROLLING UPDATE</text>
        <rect x="12" y="38" width="226" height="56" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="125" y="55" fill="#10B981" font-size="9" font-weight="bold" text-anchor="middle">New ReplicaSet (v2.0)</text>
        <text x="125" y="70" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">Scaling UP: 1 -&gt; 2 -&gt; 3 Replicas</text>
        <text x="125" y="84" fill="#94A3B8" font-size="7" text-anchor="middle">maxSurge: 1 (Temporary headroom)</text>
        <path d="M 125 96 L 125 106" stroke="#F59E0B" stroke-width="1.5"/>
        <rect x="12" y="110" width="226" height="56" rx="4" fill="#0F172A" stroke="#EF4444"/>
        <text x="125" y="128" fill="#EF4444" font-size="9" font-weight="bold" text-anchor="middle">Old ReplicaSet (v1.0)</text>
        <text x="125" y="142" fill="#FCA5A5" font-size="8" font-family="monospace" text-anchor="middle">Scaling DOWN: 3 -&gt; 2 -&gt; 0 Replicas</text>
        <text x="125" y="156" fill="#F59E0B" font-size="7" text-anchor="middle">Retained at 0 for instant rollback</text>
      </g>
      <path d="M 285 125 L 325 125" stroke="#F59E0B" stroke-width="2"/>
      <polygon points="330,125 320,120 320,130" fill="#F59E0B"/>
      <g transform="translate(335, 35)">
        <rect width="250" height="185" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="125" y="24" fill="#F59E0B" font-size="11" font-weight="bold" text-anchor="middle">HORIZONTAL POD AUTOSCALER (HPA)</text>
        <rect x="12" y="38" width="226" height="42" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="125" y="55" fill="#38BDF8" font-size="9" font-weight="bold" text-anchor="middle">Metrics Server Telemetry</text>
        <text x="125" y="70" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">metrics.k8s.io (CPU &amp; Memory)</text>
        <path d="M 125 82 L 125 94" stroke="#F59E0B" stroke-width="1.5"/>
        <rect x="12" y="96" width="226" height="72" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="125" y="114" fill="#F59E0B" font-size="9" font-weight="bold" text-anchor="middle">Autoscaling Feedback Loop</text>
        <text x="125" y="128" fill="#F8FAFC" font-size="8" font-family="monospace" text-anchor="middle">Target CPU: 50% | Actual: 80%</text>
        <text x="125" y="142" fill="#10B981" font-size="8" font-weight="bold" text-anchor="middle">Scales Deployment: 2 -&gt; 4 Pods</text>
        <text x="125" y="156" fill="#94A3B8" font-size="7" text-anchor="middle">minReplicas: 2 | maxReplicas: 10</text>
      </g>
      <path d="M 590 125 L 625 125" stroke="#10B981" stroke-width="2"/>
      <polygon points="630,125 620,120 620,130" fill="#10B981"/>
      <g transform="translate(635, 35)">
        <rect width="210" height="185" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="105" y="24" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">HELM PACKAGE MANAGER</text>
        <rect x="12" y="38" width="186" height="40" rx="4" fill="#0F172A" stroke="#38BDF8"/>
        <text x="105" y="55" fill="#38BDF8" font-size="9" font-weight="bold" text-anchor="middle">Chart Templates</text>
        <text x="105" y="68" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">templates/*.yaml + {{ .Values }}</text>
        <rect x="12" y="84" width="186" height="40" rx="4" fill="#0F172A" stroke="#10B981"/>
        <text x="105" y="101" fill="#10B981" font-size="9" font-weight="bold" text-anchor="middle">Values Overrides</text>
        <text x="105" y="114" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">values-dev.yaml • values-prod.yaml</text>
        <rect x="12" y="130" width="186" height="38" rx="4" fill="#0F172A" stroke="#F59E0B"/>
        <text x="105" y="146" fill="#F59E0B" font-size="8" font-weight="bold" text-anchor="middle">Release Rollbacks</text>
        <text x="105" y="158" fill="#94A3B8" font-size="7" text-anchor="middle">helm rollback &lt;release&gt; &lt;rev&gt;</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "kubectl set image deployment/myapp mycontainer=myapp:v2.0 && kubectl rollout status deployment/myapp", description: "Trigger a rolling update and stream rollout progress until all replicas are healthy" },
      { command: "kubectl rollout history deployment/myapp && kubectl rollout undo deployment/myapp --to-revision=1", description: "Inspect release revision history and roll back to a known-good revision" },
      { command: "kubectl autoscale deployment myapp --cpu-percent=50 --min=2 --max=10", description: "Imperatively configure Horizontal Pod Autoscaler targeting 50% CPU utilization" },
      { command: "helm install myapp ./mychart -f values-prod.yaml", description: "Deploy a parameterized Helm chart release with production configuration values" },
      { command: "helm upgrade --install myapp ./mychart --set replicaCount=5", description: "Idempotent Helm upgrade-or-install command ideal for automated CI/CD pipelines" },
      { command: "helm rollback myapp 1", description: "Instantly revert a Helm release to revision 1 across all templates (Deployments, Services, ConfigMaps)" }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always set maxUnavailable and maxSurge explicitly based on service latency tolerance rather than relying on unexamined defaults.",
      "Never configure HPA on CPU percentage without first specifying container 'resources.requests'; HPA cannot compute utilization without a baseline.",
      "Use 'helm upgrade --install' in automated CI/CD pipelines to ensure deployments are idempotent regardless of initial cluster state.",
      "Keep environment configuration values (values-dev.yaml, values-prod.yaml) checked into Git, and manage changes through GitOps PR approvals."
    ]),
    securityNotes: "Avoid running Helm releases with cluster-admin privileges; provision dedicated ServiceAccounts with fine-grained namespace RBAC roles. Always run 'helm lint' and scan third-party public Helm charts for security vulnerabilities before installing.",
    costImplications: "Horizontal Pod Autoscaling (HPA) dynamically scales pods down to minimum bounds (e.g. 2 replicas) during nighttime and low-traffic hours, allowing cloud autoscalers (Karpenter or Cluster Autoscaler) to terminate unneeded EC2 nodes and save up to 50% on AWS compute bills.",
    commonMistakesJson: JSON.stringify([
      "Choosing RollingUpdate when database schema migrations contain breaking changes; old and new code cannot coexist, requiring Recreate.",
      "Setting up HPA without Metrics Server installed, causing autoscaling to stay stuck in 'unknown' status.",
      "Manually running 'kubectl delete' on Helm-managed resources, corrupting Helm's internal release state metadata.",
      "Forgetting to run 'kubectl rollout resume' after pausing a rollout for canary verification, leaving the rollout frozen indefinitely."
    ]),
    quickRevisionJson: JSON.stringify([
      "RollingUpdate = zero-downtime (maxUnavailable + maxSurge); Recreate = downtime for incompatible versions.",
      "kubectl rollout undo rolls back to previous ReplicaSet; revisionHistoryLimit controls retained history.",
      "HPA requires Metrics Server AND container resource requests to calculate percentage targets.",
      "Helm = K8s package manager: Chart.yaml (metadata), values.yaml (inputs), templates/ (templated manifests).",
      "Pending = cannot schedule to any node; CrashLoopBackOff = container scheduled, but process crashes repeatedly."
    ])
  },
  20: {
    simpleExplanation: "The pinnacle of modern cloud engineering is the automated End-to-End DevOps CI/CD Pipeline. Instead of manually SSHing into servers or clicking through cloud consoles, every code commit pushed by an engineer triggers an unbroken, automated chain of events: GitHub notifies Jenkins via webhook -> Jenkins spins up an isolated build agent -> Automated unit tests run -> Docker builds a hardened multi-stage image -> Trivy scans the image for CVE vulnerabilities -> The image is pushed to Amazon ECR -> Jenkins triggers a zero-downtime rolling update on an Amazon EKS Kubernetes cluster -> AWS CloudWatch tracks live metrics and rollouts. This is how world-class tech companies deploy to production multiple times per day with zero downtime.",
    coreConceptsJson: JSON.stringify([
      { term: "Continuous Integration (CI)", definition: "Automated merging, linting, unit testing, and building of code on every commit to detect bugs within minutes." },
      { term: "Continuous Delivery (CD)", definition: "Automating the software release process so that every passing build is automatically packaged, scanned, and ready for one-click or automated deployment." },
      { term: "Shift-Left Security (DevSecOps)", definition: "Embedding automated security vulnerability scanning (SAST, DAST, Container CVE scans with Trivy) directly into the early pipeline stages." },
      { term: "Container Registry (Amazon ECR)", definition: "A fully managed AWS Docker container registry with built-in encryption, replication, and IAM-based access control." },
      { term: "Zero-Downtime Rolling Deployment", definition: "Kubernetes incrementally replaces old pod replicas with new pod replicas one by one, keeping the application 100% available during upgrades." }
    ]),
    internalsExplanation: "The end-to-end pipeline operates through event-driven webhooks and API orchestration: 1. A developer commits code and pushes to GitHub. 2. GitHub sends an HMAC-SHA256 signed JSON payload to the Jenkins Controller's /github-webhook/ endpoint. 3. Jenkins matches the repository and triggers the multibranch pipeline. 4. The pipeline executes in a containerized agent with docker CLI and kubectl. 5. Docker builds the image using Git commit SHA (e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com/app:v1.2.3-a8f9c1). 6. Trivy scans the image layers; if CRITICAL CVEs exceed threshold, the build fails immediately. 7. Jenkins authenticates to AWS via IAM assume-role with STS, pushes to ECR, and executes 'kubectl set image deployment/prod-app app=...'. 8. Kubernetes initiates a rolling update with maxSurge: 25% and maxUnavailable: 0.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#080E21" stroke="#1E293B" stroke-width="2"/>
      <g transform="translate(25, 60)">
        <rect x="0" y="0" width="95" height="95" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="47" y="30" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">1. GitHub</text>
        <text x="47" y="50" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Git Push</text>
        <text x="47" y="70" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">Webhook</text>
      </g>
      <path d="M 125 107 L 150 107" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(155, 60)">
        <rect x="0" y="0" width="105" height="95" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="52" y="30" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">2. Jenkins CI</text>
        <text x="52" y="50" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Pipelinefile</text>
        <text x="52" y="70" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">Test &amp; Lint</text>
      </g>
      <path d="M 265 107 L 290 107" stroke="#F59E0B" stroke-width="2"/>
      <g transform="translate(295, 60)">
        <rect x="0" y="0" width="115" height="95" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="57" y="30" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">3. Docker Build</text>
        <text x="57" y="50" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Multi-stage</text>
        <text x="57" y="70" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">Trivy CVE Scan</text>
      </g>
      <path d="M 415 107 L 440 107" stroke="#10B981" stroke-width="2"/>
      <g transform="translate(445, 60)">
        <rect x="0" y="0" width="115" height="95" rx="8" fill="#1E293B" stroke="#EC4899" stroke-width="1.5"/>
        <text x="57" y="30" fill="#F8FAFC" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="bold">4. Amazon ECR</text>
        <text x="57" y="50" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Container Store</text>
        <text x="57" y="70" fill="#F472B6" font-size="8" font-family="monospace" text-anchor="middle">Immutable Tag</text>
      </g>
      <path d="M 565 107 L 590 107" stroke="#EC4899" stroke-width="2"/>
      <g transform="translate(595, 50)">
        <rect x="0" y="0" width="180" height="115" rx="8" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
        <text x="90" y="28" fill="#C084FC" font-size="11" font-family="system-ui" text-anchor="middle" font-weight="bold">5. Amazon EKS / K8s</text>
        <text x="90" y="48" fill="#94A3B8" font-size="8" font-family="system-ui" text-anchor="middle">Zero-Downtime Rollout</text>
        <rect x="15" y="60" width="150" height="40" rx="4" fill="#0F172A" stroke="#34D399"/>
        <text x="90" y="78" fill="#A7F3D0" font-size="9" font-family="monospace" text-anchor="middle">Rolling Update (v1 -> v2)</text>
        <text x="90" y="92" fill="#6EE7B7" font-size="8" font-family="system-ui" text-anchor="middle">100% Uptime Maintained</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com", explanation: "Authenticates local Docker client with Amazon Elastic Container Registry using AWS CLI." },
      { command: "docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloud-api:git-$GIT_COMMIT .", explanation: "Builds production image tagged with unique immutable Git commit SHA." },
      { command: "trivy image --severity HIGH,CRITICAL 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloud-api:git-$GIT_COMMIT", explanation: "Runs automated container security vulnerability scan before registry push." },
      { command: "docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloud-api:git-$GIT_COMMIT", explanation: "Pushes the validated Docker image to private AWS ECR repository." },
      { command: "kubectl set image deployment/cloud-api-prod cloud-api=123456789012.dkr.ecr.us-east-1.amazonaws.com/cloud-api:git-$GIT_COMMIT --record", explanation: "Initiates Kubernetes zero-downtime rolling update with recorded rollout history." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never tag production images with ':latest'. Always tag with the unique Git commit SHA or semantic version (e.g. ':v1.4.2-3a8e9f') to ensure deterministic rollbacks.",
      "Incorporate automated rollback triggers: if Kubernetes pods fail Readiness probes during rollout, execute 'kubectl rollout undo' automatically.",
      "Separate CI from CD using GitOps (e.g. ArgoCD or Flux) where Jenkins builds and pushes the image, then commits the new image tag to an infra repository.",
      "Enforce Least Privilege IAM roles using IRSA (IAM Roles for Service Accounts) so pods only access AWS resources they legitimately require."
    ]),
    securityNotes: "Use Cosign to cryptographically sign container images during Jenkins build and verify image signatures in Kubernetes using admission controllers (Kyverno or OPA Gatekeeper).",
    costImplications: "You can simulate the entire end-to-end pipeline locally with zero cost using Git, local Jenkins container, local Docker engine, and Minikube.",
    commonMistakesJson: JSON.stringify([
      "Skipping automated vulnerability scanning, allowing critical CVEs to reach production clusters.",
      "Deploying with 'kubectl apply' without verifying pod readiness, causing outages when misconfigured pods crash.",
      "Storing AWS credentials directly inside the Jenkins VM instead of using IAM Instance Profiles or temporary STS credentials."
    ]),
    quickRevisionJson: JSON.stringify([
      "Pipeline: Git Commit -> GitHub Webhook -> Jenkins CI -> Docker Multi-stage -> Trivy Security -> AWS ECR -> K8s Rolling Update.",
      "Tagging rule: Always tag with immutable Git commit SHA.",
      "Deployment strategy: Kubernetes RollingUpdate ensures zero downtime.",
      "Rollback: 'kubectl rollout undo deployment/<name>' restores previous working replica instantly."
    ])
  },
  'git-command-suite-cheat-sheet-mastery': {
    simpleExplanation: "The Git Command Suite & Cheat Sheet is an indispensable daily toolkit for cloud and DevOps engineers. Derived from industry-standard enterprise cheat sheets, it organizes Git commands across 6 operational domains: 1. Git Basics (init, clone, config, add, commit, status, log, diff); 2. Undoing Changes (revert, reset, clean -n/-f); 3. Rewriting History (commit --amend, rebase, reflog); 4. Branch Operations (branch, checkout -b, merge); 5. Remote Repositories (remote add, fetch, pull, push); and 6. Advanced Power Options (log grep/author/graph, diff HEAD/cached, interactive rebase, pull --rebase, push --force/--tags/--all). Understanding which command to apply in any terminal scenario eliminates mistakes and speeds up delivery.",
    coreConceptsJson: JSON.stringify([
      { term: "Git Basics", definition: "Foundational commands: initializing repositories, configuring identity and aliases, staging files, committing snapshots, and viewing status." },
      { term: "Undoing Changes (Revert vs Reset)", definition: "Revert creates a new inverse commit (safe for shared branches); Reset adjusts HEAD backward (soft keeps staging, hard discards all work)." },
      { term: "Untracked Cleanup (git clean)", definition: "Tool to remove untracked build artifacts and temporary files. The '-n' flag executes a safe dry run preview, while '-f' enforces deletion." },
      { term: "History Rewriting (Amend & Rebase)", definition: "Amend combines new changes into the most recent commit; Rebase replays a series of commits on top of another base for a clean linear log." },
      { term: "Git Reflog", definition: "A local tamper-evident chronological ledger recording every movement of HEAD, enabling recovery of deleted branches, lost commits, and botched hard resets." },
      { term: "Advanced Diffing (HEAD vs Cached)", definition: "git diff HEAD compares the working tree to the latest commit; git diff --cached compares staged changes in the index against the latest commit." },
      { term: "Remote Synchronization & Rebase Pull", definition: "git pull --rebase fetches remote changes and replays local commits on top, preventing cluttered 3-way merge commits in feature branches." }
    ]),
    internalsExplanation: "When running Git commands, Git manipulates three primary internal structures inside the hidden '.git' folder: 1. The Index ('.git/index'): A binary cached ledger tracking file paths, SHA hashes, timestamps, and stat info. Running 'git add' updates this index, while 'git rm --cached' or 'git reset' updates the index without touching working disk files. 2. The Reflog ('.git/logs/HEAD' and '.git/logs/refs/heads/*'): Every commit, checkout, reset, and rebase appends an entry with the previous SHA, target SHA, committer, and action reason. Reflog entries persist for 30–90 days before garbage collection ('git gc'). 3. Interactive Rebase: Git creates an ephemeral rebase directory ('.git/rebase-merge/') containing a 'git-rebase-todo' script listing commands (pick, squash, reword, drop). Git pauses at each step, applies commits sequentially, and reconstructs the commit chain.",
    architectureSvg: `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect width="860" height="300" rx="16" fill="#0A0F1D" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Top Title -->
      <text x="30" y="35" fill="#38BDF8" font-size="14" font-weight="bold" font-family="system-ui">ATLASSIAN GIT CHEAT SHEET COMMAND MATRIX</text>
      <text x="30" y="55" fill="#94A3B8" font-size="10.5" font-family="system-ui">Comprehensive operational suite: Basics • Undoing • History Rewriting • Branches • Remotes • Advanced Options</text>
      
      <!-- Box 1: Basics -->
      <g transform="translate(30, 75)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#38BDF8" stroke-width="1.2"/>
        <text x="15" y="22" fill="#38BDF8" font-size="10.5" font-weight="bold" font-family="system-ui">GIT BASICS &amp; CONFIG</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git init &lt;dir&gt; | git clone &lt;repo&gt;</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git config --global user.name/email</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git add &lt;file&gt; | git commit -m &lt;msg&gt;</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git status | git diff | git log</text>
      </g>
      
      <!-- Box 2: Undoing Changes -->
      <g transform="translate(305, 75)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#F43F5E" stroke-width="1.2"/>
        <text x="15" y="22" fill="#FB7185" font-size="10.5" font-weight="bold" font-family="system-ui">UNDOING CHANGES &amp; CLEANUP</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git rm --cached &lt;file&gt; (unstage)</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git reset &lt;file&gt; (safe unstage)</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git clean -n (dry run) | -f (clean)</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git revert &lt;commit&gt; (safe undo)</text>
      </g>
      
      <!-- Box 3: History Rewriting -->
      <g transform="translate(580, 75)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#A855F7" stroke-width="1.2"/>
        <text x="15" y="22" fill="#C084FC" font-size="10.5" font-weight="bold" font-family="system-ui">REWRITING HISTORY &amp; REFLOG</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git commit --amend</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git rebase &lt;base&gt; | git rebase -i</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git reflog --relative-date</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git reset --hard HEAD@{n}</text>
      </g>
      
      <!-- Box 4: Branches & Merges -->
      <g transform="translate(30, 185)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#10B981" stroke-width="1.2"/>
        <text x="15" y="22" fill="#34D399" font-size="10.5" font-weight="bold" font-family="system-ui">GIT BRANCHES</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git branch (list) | git branch &lt;name&gt;</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git checkout -b &lt;branch&gt; (create+switch)</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git checkout &lt;branch&gt; (switch)</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git merge &lt;branch&gt; (integrate)</text>
      </g>
      
      <!-- Box 5: Remote Repositories -->
      <g transform="translate(305, 185)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#F59E0B" stroke-width="1.2"/>
        <text x="15" y="22" fill="#FBBF24" font-size="10.5" font-weight="bold" font-family="system-ui">REMOTE REPOSITORIES</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git remote add &lt;name&gt; &lt;url&gt;</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git fetch &lt;remote&gt; &lt;branch&gt;</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git pull &lt;remote&gt; | pull --rebase</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git push &lt;remote&gt; &lt;branch&gt;</text>
      </g>
      
      <!-- Box 6: Power Options -->
      <g transform="translate(580, 185)">
        <rect width="250" height="95" rx="8" fill="#111C38" stroke="#06B6D4" stroke-width="1.2"/>
        <text x="15" y="22" fill="#22D3EE" font-size="10.5" font-weight="bold" font-family="system-ui">ADDITIONAL POWER OPTIONS</text>
        <text x="15" y="42" fill="#E2E8F0" font-size="9" font-family="monospace">git log --graph --decorate --oneline</text>
        <text x="15" y="58" fill="#E2E8F0" font-size="9" font-family="monospace">git diff HEAD | git diff --cached</text>
        <text x="15" y="74" fill="#E2E8F0" font-size="9" font-family="monospace">git push &lt;remote&gt; --force | --all</text>
        <text x="15" y="90" fill="#E2E8F0" font-size="9" font-family="monospace">git push &lt;remote&gt; --tags</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "git diff HEAD", explanation: "Shows difference between working directory and the most recent commit (staged + unstaged)." },
      { command: "git diff --cached", explanation: "Shows difference between staged changes (index) and the last commit." },
      { command: "git clean -n", explanation: "Dry run preview: shows which untracked files would be removed from the working directory." },
      { command: "git clean -f", explanation: "Force executes deletion of untracked files from the working directory." },
      { command: "git log --oneline --graph --decorate", explanation: "Draws text-based ASCII branch graph on left and decorates commits with branch/tag names." },
      { command: "git log -5", explanation: "Limits the commit history display to the last 5 commits." },
      { command: "git log -p", explanation: "Displays the full diff patch of each commit in history." },
      { command: "git log --stat", explanation: "Includes which files were altered and relative lines added/deleted per commit." },
      { command: "git log --author='Linus'", explanation: "Filters commit history by author name or email pattern." },
      { command: "git log --grep='fix(auth)'", explanation: "Searches commit history for commit messages matching pattern." },
      { command: "git log main..feature", explanation: "Shows commits that exist on 'feature' branch but not on 'main'." },
      { command: "git log -- src/index.js", explanation: "Displays only the commits that modified the specified file path." },
      { command: "git reset --hard <commit>", explanation: "Resets staging area AND working directory to <commit>, discarding all commits after it." },
      { command: "git rebase -i HEAD~3", explanation: "Launches interactive editor to squash, reorder, reword, or drop the last 3 commits." },
      { command: "git pull --rebase origin main", explanation: "Fetches remote main and replays your local feature commits on top, ensuring linear history." },
      { command: "git push origin --tags", explanation: "Explicitly pushes all local release tags to the remote repository." },
      { command: "git push origin --all", explanation: "Pushes all local branches to the specified remote repository in a single command." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always use 'git clean -n' (dry run) before executing destructive 'git clean -f' to verify no accidental file loss occurs.",
      "Prefer 'git diff --cached' before running 'git commit' to verify exactly what changes will be captured in the snapshot.",
      "Use 'git pull --rebase' when updating your local feature branch from upstream main to prevent cluttered merge bubbles.",
      "Never run 'git push --force' on shared team branches (main, develop). Use '--force-with-lease' on private feature branches.",
      "Remember that tags are not automatically pushed with standard 'git push'; always use 'git push <remote> --tags'."
    ]),
    securityNotes: "Be cautious with 'git clean -f'; if you accidentally create a new untracked file containing private credentials or work that was never staged, 'git clean -f' deletes it with zero possibility of reflog recovery. Always test with 'git clean -n' first.",
    costImplications: "All Git cheat sheet commands run locally on your workstation with zero infrastructure cost, allowing rapid iteration, local rebasing, and testing.",
    commonMistakesJson: JSON.stringify([
      "Running 'git clean -f' without dry run, permanently deleting uncommitted new source files.",
      "Using 'git push --force' and overwriting teammates' commits on shared branches.",
      "Forgetting that tags must be pushed explicitly with '--tags'.",
      "Confusing 'git diff' (unstaged only) with 'git diff HEAD' (all unstaged + staged differences)."
    ]),
    quickRevisionJson: JSON.stringify([
      "Cheat Sheet Sections: Git Basics, Undoing Changes, History Rewriting, Branches, Remotes, Advanced Options.",
      "Dry run rule: Always run 'git clean -n' before 'git clean -f'.",
      "Diff rule: 'git diff' = unstaged; 'git diff --cached' = staged; 'git diff HEAD' = everything vs commit.",
      "Remote rule: 'git pull --rebase' keeps history linear; 'git push --tags' sends release tags."
    ])
  },
  'github-actions-cicd-matrix-secrets': {
    simpleExplanation: "GitHub Actions is an enterprise continuous integration and continuous delivery (CI/CD) platform directly integrated into GitHub. It allows you to automate your build, test, security scan, and deployment pipelines. Every workflow is defined as a YAML file stored in your repository at '.github/workflows/'. Workflows are triggered by events (such as 'push', 'pull_request', or a cron 'schedule'). Jobs run inside ephemeral virtual machine runners (Ubuntu, Windows, or macOS) or container runners, executing sequential steps that test and build code before deployment.",
    coreConceptsJson: JSON.stringify([
      { term: "Workflow (.github/workflows/*.yml)", definition: "A configurable automated process composed of one or more jobs, defined in YAML and triggered by GitHub events." },
      { term: "Events (Triggers)", definition: "Specific repository activities that initiate a workflow run, such as 'push', 'pull_request', 'release', or 'workflow_dispatch' (manual trigger)." },
      { term: "Runners (Hosted vs Self-Hosted)", definition: "Virtual machines (ubuntu-latest, windows-latest, macos-latest) managed by GitHub, or self-hosted servers in your own AWS VPC." },
      { term: "Matrix Builds", definition: "A strategy that runs a single job simultaneously across multiple combinations of OS and language runtime versions (e.g., Node 18, 20, 22 on Ubuntu & Windows)." },
      { term: "Repository Secrets", definition: "Encrypted environment variables (like AWS_ACCESS_KEY_ID or DOCKER_TOKEN) stored in GitHub settings and masked in runner logs." },
      { term: "Branch Protection Rules", definition: "Policies enforcing that pull requests pass all CI status checks and receive approved peer reviews before merging into protected branches like 'main'." }
    ]),
    internalsExplanation: "GitHub Actions operates through an event bus and runner orchestration architecture: When an event occurs (e.g. a Git commit push), GitHub's webhook engine matches the event against triggers in '.github/workflows/*.yml'. A workflow execution plan is queued. GitHub provisions an isolated ephemeral runner VM with pre-installed developer tooling (Git, Docker, Node.js, Python, AWS CLI). The runner connects to GitHub's orchestration server via an outbound HTTPS long-poll channel, checks out the repository code with actions/checkout@v4, substitutes encrypted secrets into step environments, executes commands, and streams encrypted logs back to the GitHub UI in real time.",
    architectureSvg: `<svg viewBox="0 0 860 220" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect width="860" height="220" rx="14" fill="#090E17" stroke="#1E293B" stroke-width="2"/>
      <g transform="translate(30, 45)">
        <rect width="160" height="130" rx="10" fill="#162238" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="80" y="30" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">1. GITHUB EVENT</text>
        <text x="80" y="55" fill="#E2E8F0" font-size="9.5" text-anchor="middle" font-family="monospace">git push origin</text>
        <text x="80" y="75" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="system-ui">or Pull Request opened</text>
        <text x="80" y="105" fill="#64748B" font-size="8.5" text-anchor="middle" font-family="monospace">on: [push, PR]</text>
      </g>
      <path d="M 205 110 L 245 110" stroke="#38BDF8" stroke-width="2.5"/>
      <g transform="translate(255, 45)">
        <rect width="170" height="130" rx="10" fill="#162238" stroke="#A855F7" stroke-width="1.5"/>
        <text x="85" y="30" fill="#C084FC" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">2. WORKFLOW YAML</text>
        <text x="85" y="55" fill="#E2E8F0" font-size="9" text-anchor="middle" font-family="monospace">.github/workflows/</text>
        <text x="85" y="75" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="system-ui">Job definitions &amp; matrix</text>
        <text x="85" y="105" fill="#C084FC" font-size="8.5" text-anchor="middle" font-family="monospace">runs-on: ubuntu-latest</text>
      </g>
      <path d="M 440 110 L 480 110" stroke="#A855F7" stroke-width="2.5"/>
      <g transform="translate(490, 45)">
        <rect width="170" height="130" rx="10" fill="#162238" stroke="#10B981" stroke-width="1.5"/>
        <text x="85" y="30" fill="#34D399" font-size="11" font-weight="bold" text-anchor="middle" font-family="system-ui">3. EPHEMERAL RUNNER</text>
        <text x="85" y="55" fill="#E2E8F0" font-size="9" text-anchor="middle" font-family="monospace">npm ci &amp;&amp; npm test</text>
        <text x="85" y="75" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="system-ui">Docker security scan</text>
        <text x="85" y="105" fill="#10B981" font-size="8.5" text-anchor="middle" font-family="monospace">Exit Code: 0 (PASS)</text>
      </g>
      <path d="M 675 110 L 715 110" stroke="#10B981" stroke-width="2.5"/>
      <g transform="translate(725, 45)">
        <rect width="105" height="130" rx="10" fill="#162238" stroke="#EC4899" stroke-width="1.5"/>
        <text x="52" y="30" fill="#F472B6" font-size="10.5" font-weight="bold" text-anchor="middle" font-family="system-ui">4. DEPLOY</text>
        <text x="52" y="55" fill="#E2E8F0" font-size="9" text-anchor="middle" font-family="system-ui">PR Approved</text>
        <text x="52" y="75" fill="#94A3B8" font-size="8.5" text-anchor="middle" font-family="system-ui">Merged to Main</text>
        <text x="52" y="105" fill="#F472B6" font-size="8.5" text-anchor="middle" font-family="monospace">Deploy AWS</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "gh pr create --title 'feat: user auth' --body 'Closes #12'", explanation: "Creates a pull request directly from terminal using GitHub CLI." },
      { command: "gh workflow run ci.yml", explanation: "Manually triggers a GitHub Actions workflow from terminal." },
      { command: "gh secret set AWS_ACCESS_KEY_ID --body 'AKIAIOSFODNN7EXAMPLE'", explanation: "Sets an encrypted repository secret securely from terminal." },
      { command: "act -l", explanation: "Lists and tests GitHub Actions workflows locally using Docker without pushing." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always pin GitHub Actions to full commit SHAs or verified major versions (e.g. actions/checkout@v4).",
      "Store credentials in GitHub Repository Secrets; never hardcode passwords in workflow YAML.",
      "Enforce Branch Protection on 'main' requiring 1+ PR approvals and passing CI status checks before merge."
    ]),
    securityNotes: "Enable GitHub Dependabot alerts and Secret Scanning. Regularly rotate encrypted secrets.",
    costImplications: "GitHub offers 2,000 free Actions CI/CD runner minutes per month for free tier accounts.",
    commonMistakesJson: JSON.stringify([
      "Printing sensitive secrets in runner terminal logs using echo.",
      "Allowing direct commits to main branch without requiring passing CI status checks."
    ]),
    quickRevisionJson: JSON.stringify([
      "Workflows live in .github/workflows/*.yml.",
      "Triggers: push, pull_request, schedule, workflow_dispatch.",
      "Runners: Ubuntu, Windows, macOS.",
      "Branch Protection guarantees code quality before merging."
    ])
  }
};

const awsAccountNotes = require('./awsAccountNotesData.js');
const awsVpcNotes = require('./awsVpcNotesData.js');
Object.assign(module.exports, awsAccountNotes, awsVpcNotes);

