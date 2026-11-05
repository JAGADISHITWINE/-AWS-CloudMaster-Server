/**
 * Dedicated Technical Interview Questions for Module 3: Amazon VPC – Advanced Cloud Networking & Traffic Engineering
 * Aligned with the MicroDegree Amazon VPC (Virtual Private Cloud) Guide
 */

module.exports = [
  // ==========================================
  // TOPIC 1: VPC Architecture, Subnetting (CIDR), Gateways & Route Tables
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    title: "Default VPC vs Custom VPC: Architectural Differences & The 5 Reserved IPs per Subnet",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'What is the architectural difference between an AWS Default VPC and a Custom (Non-Default) VPC? Why should production enterprise workloads never run in a Default VPC? Additionally, explain the exact mathematical accounting of the 5 IP addresses AWS strictly reserves in every subnet.'",
    explanation: "Tests foundational cloud networking: understanding the security vulnerabilities of Default VPCs (auto-assigned public IPs, flat public subnets), and the precise RFC 1918 subnet calculations including the 5 AWS reserved addresses.",
    hintsJson: JSON.stringify([
      "Contrast Default VPC (auto-public subnets, IGW attached) vs Custom VPC (no IGW, full control).",
      "Mention the security risks of default VPCs: accidental public exposure of databases.",
      "List the 5 reserved IPs: .0, .1, .2, .3, and .255, explaining their specific network roles."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. Default VPC vs Custom VPC Architectural Comparison:
- **Default VPC:**
  - Automatically created by AWS in every commercial region with a \`172.31.0.0/16\` CIDR block.
  - Automatically provisions one public subnet (size \`/20\`) in each Availability Zone.
  - Pre-attaches an Internet Gateway (IGW) with a default route (\`0.0.0.0/0 -> igw\`).
  - Has \`mapPublicIpOnLaunch\` enabled by default: **every single EC2 instance launched receives a public IPv4 address**.
- **Why Production Workloads Should Never Run in Default VPC:**
  - **Flat Public Exposure:** Because all default subnets are public, any database or backend instance launched without meticulous Security Group lockdown is directly addressable from the public internet.
  - **No Network Segmentation:** Default VPCs lack private subnets with NAT gateways, violating defense-in-depth principles.
- **Custom (Non-Default) VPC:**
  - You define the network boundary (e.g. \`10.0.0.0/16\`).
  - Has **NO Internet Gateway** and **NO default routes** until explicitly provisioned.
  - Allows strict multi-tier segmentation: Public Presentation Subnets, Private Application Subnets, and Isolated Database Subnets.

#### 2. The 5 Reserved IP Addresses per Subnet:
In a standard IPv4 network, 2 addresses are reserved (Network and Broadcast). In an AWS VPC, **AWS strictly reserves 5 IP addresses** in every single subnet:

| Offset | Example (\`10.0.1.0/24\`) | Dedicated Technical Role in AWS SDN |
|---|---|---|
| **Base + 0** | \`10.0.1.0\` | **Network Address:** Traditional IP standard identifier for the subnet. |
| **Base + 1** | \`10.0.1.1\` | **VPC Internal Router:** The default gateway next-hop IP for instances inside the subnet. |
| **Base + 2** | \`10.0.1.2\` | **Amazon DNS Server:** IP of the Route 53 Resolver (AmazonProvidedDNS) providing internal name resolution. |
| **Base + 3** | \`10.0.1.3\` | **Future Internal Use:** Reserved by AWS for future network capabilities. |
| **Broadcast** | \`10.0.1.255\` | **Network Broadcast Address:** Traditional standard (AWS VPC does not support physical broadcast, but reserves it). |

- **Practical Calculation:** In a \`/24\` subnet ($2^8 = 256\\text{ total IPs}$), exactly $256 - 5 = \\mathbf{251\\text{ usable host IP addresses}}$ are available for workloads.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Default vs Custom VPC Contrast", weight: 30, description: "Accurately contrasts auto-public subnets and IGW vs isolated custom control." },
        { name: "Production Security Risks", weight: 25, description: "Explains danger of auto-assigned public IPs and lack of private tiers." },
        { name: "5 Reserved IPs Enumerated", weight: 35, description: "Correctly identifies .0 network, .1 router, .2 DNS, .3 future, and .255 broadcast." },
        { name: "Subnet Math Calculation", weight: 10, description: "Calculates total minus 5 usable host IPs accurately." }
      ]
    }),
    tagsJson: JSON.stringify(["VPC", "CIDR", "Subnetting", "Default VPC", "Reserved IPs", "Interview"])
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    title: "Internet Gateway (IGW) vs Egress-Only Internet Gateway vs NAT Gateway: Packet Routing Mechanics",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'Explain the distinct packet routing mechanics and operational purposes of an Internet Gateway (IGW), an Egress-Only Internet Gateway, and a NAT Gateway. When would you use each, and how does each handle IPv4 vs IPv6 traffic?'",
    explanation: "Tests deep understanding of VPC edge routing primitives, 1:1 NAT vs PAT, IPv4 address scarcity, and stateful outbound IPv6 internet access.",
    hintsJson: JSON.stringify([
      "Explain IGW: horizontally scaled, performs 1:1 NAT for IPv4 and direct routing for globally unique IPv6.",
      "Explain NAT Gateway: managed Port Address Translation (PAT) allowing private IPv4 instances to initiate outbound connections.",
      "Explain Egress-Only IGW: stateful IPv6 gateway preventing inbound internet connections while allowing outbound.",
      "Contrast public vs private subnet placement."
    ]),
    recommendedSolution: `### Model Answer:

#### Architectural Breakdown:

| Gateway Type | Target Subnet | IP Protocol Supported | Statefulness / Directionality | Primary Technical Purpose |
|---|---|---|---|---|
| **Internet Gateway (IGW)** | Bound to VPC (Public Subnet routing) | **IPv4 and IPv6** | **Bidirectional (Stateless 1:1 NAT):** Allows inbound traffic from internet and outbound traffic to internet. | Acts as the VPC's edge router. For IPv4, it translates between an instance's private IP and public/Elastic IP. For IPv6, it routes globally unique IPv6 addresses directly without NAT. |
| **NAT Gateway** | Deployed in **Public Subnet** (with Elastic IP) | **IPv4 Only** | **Outbound-Only (Stateful PAT):** Translates many private IPs to one public Elastic IP; blocks all unsolicited inbound connections. | Allows instances in **Private Subnets** to download OS patches, package updates, and API calls while preventing internet actors from initiating connections to private servers. |
| **Egress-Only Internet Gateway** | Bound to VPC (Private Subnet routing) | **IPv6 Only** | **Outbound-Only (Stateful IPv6):** Tracks connection states; blocks all inbound connections from public internet. | Because all IPv6 addresses are globally routable (no NAT exists in IPv6), an Egress-Only IGW acts as a stateful firewall for private IPv6 instances—allowing them to fetch updates while blocking inbound internet scans. |

#### Summary Architectural Rule:
- Use **IGW** in public subnets for public-facing load balancers and Bastion hosts.
- Use **NAT Gateway** for private IPv4 workloads requiring internet egress.
- Use **Egress-Only IGW** for private IPv6 workloads requiring internet egress without NAT.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Internet Gateway Mechanics", weight: 30, description: "Explains bidirectional 1:1 NAT for IPv4 and direct routing for IPv6." },
        { name: "NAT Gateway Mechanics", weight: 35, description: "Explains managed stateful outbound-only PAT for private IPv4 instances." },
        { name: "Egress-Only IGW Mechanics", weight: 25, description: "Explains stateful outbound-only firewalling for globally routable IPv6." },
        { name: "Clear Architectural Decision Rule", weight: 10, description: "Summarizes proper usage across public vs private subnets." }
      ]
    }),
    tagsJson: JSON.stringify(["VPC", "Internet Gateway", "NAT Gateway", "Egress-Only IGW", "IPv6", "Networking", "Interview"])
  },

  // ==========================================
  // TOPIC 2: VPC Security Architecture: Stateful Security Groups, Stateless NACLs, DNS Firewall & Flow Logs
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    title: "Route 53 DNS Firewall & VPC Flow Logs: Real-Time Threat Inspection & Forensic Telemetry",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do you protect a production VPC against DNS tunneling data exfiltration, and how do you conduct forensic audits of network traffic without installing agents inside your EC2 instances? Compare Route 53 DNS Firewall (including fail-open vs fail-closed) and VPC Flow Logs.'",
    explanation: "Tests advanced security engineering: managing outbound DNS filtering at the resolver layer and capturing non-intrusive hypervisor traffic telemetry via VPC Flow Logs.",
    hintsJson: JSON.stringify([
      "Explain Route 53 DNS Firewall: domain name filtering on outbound queries to Route 53 Resolver.",
      "Detail Fail-Open vs Fail-Closed tradeoffs (availability vs security).",
      "Explain VPC Flow Logs: out-of-band capture at the hypervisor layer with zero latency/throughput impact.",
      "Mention log format fields (Src, Dst, Port, Action: ACCEPT vs REJECT)."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. Outbound DNS Inspection with Route 53 DNS Firewall:
- Traditional firewalls filter on IP addresses. However, modern malware and ransomware use dynamic DNS domain generation algorithms (DGA) and base64 DNS tunneling to exfiltrate database data over UDP port 53.
- **Route 53 DNS Firewall** operates directly inside the Amazon Route 53 Resolver (the VPC \`.2\` base address):
  - Inspects all outbound recursive DNS requests against domain allowlists and denylists (e.g. AWS Managed Threat Intelligence rules).
  - Can return \`BLOCK\`, \`NODATA\`, or redirect queries to a sinkhole server.
- **Fail-Open vs Fail-Closed Posture:**
  - **Fail-Open (Availability Focus):** If the DNS Firewall engine experiences service delays, queries are allowed through uninspected.
  - **Fail-Closed (Security Focus - Mandatory for Banking/Healthcare):** Resolver blocks any DNS query for which it does not receive a response from the firewall, eliminating exfiltration windows during failover.

#### 2. Out-of-Band Network Telemetry with VPC Flow Logs:
- **Zero Performance Impact:** Flow Logs are captured directly from the Nitro/Xen hypervisor layer outside the path of network traffic. They introduce **0% latency overhead** and **0% throughput reduction**.
- **Log Record Architecture:**
  - Captures 5-tuple metadata: \`srcaddr\`, \`dstaddr\`, \`srcport\`, \`dstport\`, \`protocol\`, plus \`action\` (\`ACCEPT\` or \`REJECT\`).
  - Aggregation intervals: 10 minutes (default) or 1 minute (high-frequency threat hunting).
- **Forensic Applications:**
  - Rapidly identify port scanning by querying \`action == REJECT\` across ports 22, 3389, and 445 in CloudWatch Logs Insights.
  - Verify that private instances are not establishing unexpected outbound connections to external public IPs.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "DNS Firewall Mechanism", weight: 30, description: "Explains domain filtering at Route 53 Resolver to stop C2/tunneling." },
        { name: "Fail-Open vs Fail-Closed Posture", weight: 25, description: "Articulates availability vs security trade-offs accurately." },
        { name: "VPC Flow Logs Architecture", weight: 30, description: "Emphasizes out-of-band hypervisor capture with zero latency penalty." },
        { name: "Forensic Analysis Examples", weight: 15, description: "Mentions ACCEPT/REJECT filtering and CloudWatch Insights queries." }
      ]
    }),
    tagsJson: JSON.stringify(["VPC", "DNS Firewall", "VPC Flow Logs", "Security", "CloudWatch", "Threat Detection", "Interview"])
  },

  // ==========================================
  // TOPIC 3: Hybrid Connectivity & Advanced Routing: NAT Gateways, Endpoints, Peering, VPN & Transit Gateway
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    title: "VPC Peering vs AWS Transit Gateway: Scaling Architecture, Non-Transitive Limits & Quotas",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'An enterprise is expanding from 3 VPCs to 60 VPCs across multiple accounts and regions, requiring hybrid connectivity to an on-premises data center. Compare VPC Peering with AWS Transit Gateway (TGW). Why does VPC Peering break at scale (the N*(N-1)/2 formula), what is the non-transitive routing rule, and how does Transit Gateway solve hub-and-spoke connectivity?'",
    explanation: "Tests enterprise cloud networking architecture: calculating peering mesh complexity, understanding non-transitive routing constraints, and implementing hub-and-spoke Transit Gateway topology.",
    hintsJson: JSON.stringify([
      "Explain the N*(N-1)/2 formula for 60 VPCs (1,770 peering connections).",
      "Explain the non-transitive rule: VPC A cannot route through VPC B to reach VPC C.",
      "Explain Transit Gateway as a regional cloud router with route tables and attachments.",
      "Mention VPC service quotas: 50 peering connections limit vs thousands of TGW attachments."
    ]),
    recommendedSolution: `### Model Answer:

#### 1. Why VPC Peering Breaks at Scale:
- **The Combinatorial Mesh Explosion:**
  - VPC Peering is strictly a point-to-point 1:1 interconnect.
  - To connect $N$ VPCs in a full mesh requires:
    $$\\text{Connections} = \\frac{N \\times (N - 1)}{2}$$
  - For **60 VPCs**, full mesh requires:
    $$\\frac{60 \\times 59}{2} = \\mathbf{1,770\\text{ individual peering connections!}}$$
  - **Hard Quota Violation:** AWS VPC has a default limit of **50 active peering connections per VPC** (max 125 with quota increase). Building a 60-VPC full mesh with peering is **mathematically impossible** due to AWS quotas!
- **The Non-Transitive Constraint:**
  - VPC Peering does **NOT** support edge-to-edge or transit routing. If VPC A is peered to VPC B, and VPC B has a Direct Connect or VPN link to the on-premises datacenter, VPC A cannot route packets through VPC B to on-premises.

#### 2. The Solution: AWS Transit Gateway (Hub-and-Spoke):
- **Centralized Regional Cloud Router:**
  - Acts as a high-performance Layer-3 network transit hub.
  - Each VPC makes **exactly ONE attachment** to the Transit Gateway (60 attachments total vs 1,770 peering links).
  - Can connect thousands of VPCs and up to 50 Gbps of bandwidth per VPC attachment.
- **Transitive Routing:**
  - Transit Gateway natively supports transitive routing: VPC A transmits packets to the TGW, which routes them directly to VPC C or over a single VPN / Direct Connect attachment to the on-premise datacenter.
- **Network Segmentation via TGW Route Tables:**
  - You can isolate environments (e.g. Production TGW Route Table vs Non-Production TGW Route Table) so Dev VPCs can never reach Production VPCs while sharing a common egress NAT gateway or inspection firewall.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Combinatorial Mesh Math", weight: 30, description: "Calculates N*(N-1)/2 = 1,770 connections and cites 50 peering quota limit." },
        { name: "Non-Transitive Rule Explained", weight: 25, description: "Explains prohibition of edge-to-edge and intermediate VPC transit." },
        { name: "Transit Gateway Hub-and-Spoke", weight: 30, description: "Details 1 attachment per VPC and native transitive routing." },
        { name: "TGW Route Tables & Segmentation", weight: 15, description: "Explains multi-domain network segmentation (Prod vs Dev)." }
      ]
    }),
    tagsJson: JSON.stringify(["VPC", "Transit Gateway", "VPC Peering", "Hybrid Cloud", "Architecture", "Networking", "Interview"])
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    title: "VPC Gateway Endpoints vs Interface Endpoints (AWS PrivateLink): Architecture, Cost & Traffic Flow",
    difficulty: "Intermediate",
    prompt: "An interviewer asks: 'What is the architectural and financial difference between an AWS VPC Gateway Endpoint and an Interface Endpoint (AWS PrivateLink)? Walk through how DNS and packet routing work for each, and explain when an enterprise should choose one over the other.'",
    explanation: "Deep dive into AWS private network endpoints: comparing route-table prefix lists (Gateway Endpoints) against elastic network interfaces with private IP addresses (Interface Endpoints), along with pricing differences.",
    hintsJson: JSON.stringify([
      "List the two services supported by Gateway Endpoints (Amazon S3 and DynamoDB).",
      "Explain that Gateway Endpoints are 100% free ($0/hr, $0/GB).",
      "Explain Interface Endpoints (PrivateLink): ENI with private IP in subnet, supports 100+ services, costs ~$0.01/hr + $0.01/GB.",
      "Explain Private DNS resolution for Interface Endpoints."
    ]),
    recommendedSolution: `### Model Answer:

#### Architectural & Financial Comparison:

| Dimension | Gateway Endpoint | Interface Endpoint (AWS PrivateLink) |
|---|---|---|
| **Supported Services** | **Amazon S3** and **Amazon DynamoDB** ONLY | **100+ AWS Services** (ECR, Kinesis, Secrets Manager, CloudWatch, SQS, SNS, KMS) and third-party SaaS |
| **Physical Implementation** | Virtual routing target registered in your **VPC Route Table** | **Elastic Network Interface (ENI)** with a private IP placed inside your Subnet |
| **Pricing** | **100% FREE** ($0/hour and $0/GB data transfer) | **Hourly fee** (~$0.01/hr per AZ) + **Data processing fee** ($0.01/GB) |
| **Packet Routing** | **Route Table Prefix List:** The route table injects a specific route: \`pl-63a5400a -> vpce-xxx\`. Packets are intercepted and routed directly across the AWS private SDN. | **Private DNS Resolution:** Route 53 automatically rewrites the service public DNS (e.g. \`ecr.us-east-1.amazonaws.com\`) to resolve to the private ENI IP (\`10.0.1.45\`). |
| **Cross-VPC / On-Premise Access** | **Cannot be accessed** from on-premises over VPN / Direct Connect or from peered VPCs. | **Fully accessible** from on-premises datacenters over Site-to-Site VPN and Direct Connect. |

#### Architectural Decision Rule:
- **Always use Gateway Endpoints for S3 and DynamoDB:** They are free and handle massive multi-terabyte data transfers with zero NAT or PrivateLink data processing fees.
- **Use Interface Endpoints (PrivateLink) for all other AWS services:** When private workloads require secure API access to ECR container registries, Secrets Manager, or CloudWatch without provisioning an Internet Gateway or NAT Gateway.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Supported Services Distinction", weight: 25, description: "Identifies S3/DynamoDB for Gateway vs 100+ services for Interface." },
        { name: "Implementation Mechanism", weight: 25, description: "Contrasts Route Table prefix list vs Subnet ENI with private IP." },
        { name: "Pricing Disparity", weight: 25, description: "Explicitly states Gateway is 100% free vs PrivateLink hourly + per-GB fees." },
        { name: "On-Premises / Hybrid Access", weight: 25, description: "Explains PrivateLink accessibility over VPN/DX vs Gateway VPC-only limitation." }
      ]
    }),
    tagsJson: JSON.stringify(["VPC", "VPC Endpoints", "PrivateLink", "Gateway Endpoints", "S3", "Cost Optimization", "Interview"])
  }
];

