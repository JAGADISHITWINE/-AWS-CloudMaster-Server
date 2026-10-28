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
    simpleExplanation: "Git is a distributed version control system that tracks changes in any set of computer files, usually used for coordinating work among programmers. GitHub is the world's leading cloud platform hosting Git repositories, providing Pull Requests, issue tracking, and GitHub Actions CI/CD automation. Think of Git as a distributed time-machine ledger where every save point (commit) has an immutable cryptographic hash. Unlike centralized version control, every developer has a full clone of the entire project history on their laptop, allowing instant commits, branching, and offline work.",
    coreConceptsJson: JSON.stringify([
      { term: "Working Tree vs Index vs HEAD", definition: "The three trees of Git: Working directory (untracked/modified files), Staging Index (changes queued for next commit), and HEAD (the current commit snapshot)." },
      { term: "Branching & Fast-Forward", definition: "A branch in Git is simply a lightweight movable 41-byte pointer to a commit. Fast-Forward occurs when the target branch has no diverging commits." },
      { term: "Rebase vs Merge", definition: "Merge preserves complete historical chronology by creating a 3-way merge commit; Rebase rewrites commit history by replaying feature commits on top of the latest base branch for a linear log." },
      { term: "GitHub Actions Workflows", definition: "YAML-defined automated processes triggered by repository events (push, pull_request, schedule) running on Ubuntu, Windows, or macOS runner VMs." },
      { term: "Branch Protection & Secrets", definition: "Rules preventing direct pushes to main, requiring passing CI checks and PR approvals, while storing encrypted tokens in repository secrets." }
    ]),
    internalsExplanation: "Under the hood in the .git folder, Git stores all data as a Directed Acyclic Graph (DAG) of content-addressed objects: 'blobs' (raw file contents without names), 'trees' (directories mapping file names and permissions to blob hashes), 'commits' (metadata referencing a root tree, author, timestamp, and parent commit hashes), and 'tags'. Everything is keyed by SHA-1 or SHA-256 hashes. Because commits reference parent hashes, modifying any historical byte changes all downstream hashes, making Git an immutable cryptographic ledger.",
    architectureSvg: `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="10" y="10" width="780" height="220" rx="12" fill="#0B132B" stroke="#1C2541" stroke-width="2"/>
      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="120" height="100" rx="8" fill="#1C2541" stroke="#3A86FF" stroke-width="1.5"/>
        <text x="60" y="35" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Working Dir</text>
        <text x="60" y="55" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Local Files</text>
        <text x="60" y="75" fill="#38BDF8" font-size="9" font-family="monospace" text-anchor="middle">git add</text>
      </g>
      <path d="M 170 110 L 200 110" stroke="#38BDF8" stroke-width="2"/>
      <g transform="translate(210, 60)">
        <rect x="0" y="0" width="120" height="100" rx="8" fill="#1C2541" stroke="#8338EC" stroke-width="1.5"/>
        <text x="60" y="35" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Staging Index</text>
        <text x="60" y="55" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Snapshot Prep</text>
        <text x="60" y="75" fill="#C084FC" font-size="9" font-family="monospace" text-anchor="middle">git commit</text>
      </g>
      <path d="M 340 110 L 370 110" stroke="#8338EC" stroke-width="2"/>
      <g transform="translate(380, 60)">
        <rect x="0" y="0" width="120" height="100" rx="8" fill="#1C2541" stroke="#FF006E" stroke-width="1.5"/>
        <text x="60" y="35" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">Local Repo</text>
        <text x="60" y="55" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Commit DAG</text>
        <text x="60" y="75" fill="#FB7185" font-size="9" font-family="monospace" text-anchor="middle">git push</text>
      </g>
      <path d="M 510 110 L 540 110" stroke="#FF006E" stroke-width="2"/>
      <g transform="translate(550, 60)">
        <rect x="0" y="0" width="200" height="100" rx="8" fill="#1C2541" stroke="#06D6A0" stroke-width="1.5"/>
        <text x="100" y="35" fill="#F8FAFC" font-size="12" font-family="system-ui" text-anchor="middle" font-weight="bold">GitHub Remote</text>
        <text x="100" y="55" fill="#94A3B8" font-size="10" font-family="system-ui" text-anchor="middle">Pull Requests &amp; Reviews</text>
        <text x="100" y="75" fill="#34D399" font-size="9" font-family="monospace" text-anchor="middle">GitHub Actions CI/CD</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "git checkout -b feature/user-auth", explanation: "Creates and switches to a new feature branch isolated from main." },
      { command: "git add -p", explanation: "Interactively stages specific hunks of changes rather than blind staging." },
      { command: "git commit -m 'feat: implement JWT token expiration validation'", explanation: "Creates an atomic commit following conventional commit standards." },
      { command: "git rebase -i HEAD~3", explanation: "Interactively squashes, rewinds, and rewrites the last 3 local commits before PR submission." },
      { command: "gh pr create --title 'Add OAuth2 login' --body 'Resolves #42'", explanation: "Creates a GitHub Pull Request directly from your terminal using GitHub CLI." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Adopt Trunk-Based Development or short-lived feature branches (<48 hours) to minimize merge conflicts.",
      "Never run 'git push --force' on shared branches (main/develop); use '--force-with-lease' if rebasing a personal feature branch.",
      "Enforce Branch Protection on main requiring: 1+ PR approval, passing CI status checks, and linear history.",
      "Store all sensitive API keys and cloud credentials in GitHub Repository Secrets (Settings -> Secrets & variables)."
    ]),
    securityNotes: "Enable GitHub Secret Scanning and Dependabot alerts. Ensure your .gitignore contains sensitive files like .env, id_rsa, and node_modules before staging.",
    costImplications: "GitHub offers free unlimited public and private repositories, plus 2,000 Free Actions CI/CD minutes per month on public and private accounts.",
    commonMistakesJson: JSON.stringify([
      "Accidentally committing credentials or .env files into Git history (even if deleted in a later commit, secrets remain in git reflog and commit history).",
      "Rebasing a public shared branch that other team members have already cloned, creating diverging DAG histories.",
      "Making massive 2,000-line pull requests that reviewers cannot effectively audit."
    ]),
    quickRevisionJson: JSON.stringify([
      "Working Dir (untracked) -> git add -> Staging Index -> git commit -> Local Repo -> git push -> GitHub Remote.",
      "Rebase = rewrites commit base for linear history (clean git log).",
      "Merge = keeps historical timeline with a merge commit.",
      "GitHub Actions = Trigger (push/PR) -> Job (runner VM) -> Steps (actions/run commands)."
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
  }
};
