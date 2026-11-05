/**
 * Dedicated Structured Notes for Module 3: Amazon VPC – Advanced Cloud Networking & Traffic Engineering
 * Aligned with the MicroDegree Amazon VPC (Virtual Private Cloud) Guide
 *
 * Topic 1: vpc-subnetting-gateways-packet-flow
 * Topic 2: vpc-security-groups-nacls-firewall-flow-logs
 * Topic 3: vpc-peering-transit-gateway-endpoints-vpn
 */

module.exports = {
  "vpc-subnetting-gateways-packet-flow": {
    simpleExplanation: "An Amazon Virtual Private Cloud (VPC) is your own private data center inside AWS. You define the network boundaries using CIDR IP ranges (e.g. 10.0.0.0/16), slice it into subnets across Availability Zones, attach an Internet Gateway (IGW) for public connectivity, use Route Tables to direct packet flow, and use Bastion Hosts to jump securely into private instances without exposing them to the internet.",
    coreConceptsJson: JSON.stringify([
      { name: "Default vs Non-Default (Custom) VPC", description: "Default VPC is automatically created with preconfigured subnets, default IGW, and auto-assigned public IPs. Custom VPC requires manual architecture: no default IGW, custom subnets, and explicit route tables." },
      { name: "CIDR & IP Allocation", description: "Classless Inter-Domain Routing defines VPC IP ceilings (e.g. 10.0.0.0/16 has 65,536 IPs). AWS strictly reserves 5 IP addresses in every subnet (.0 Network, .1 VPC Router, .2 Amazon DNS, .3 Future, and .255 Broadcast)." },
      { name: "Subnets (Public vs Private)", description: "A subnet is a segment of a VPC bound to a single AZ. A Public Subnet has a route table directing 0.0.0.0/0 to an Internet Gateway. A Private Subnet lacks an IGW route and routes outbound internet via a NAT Gateway." },
      { name: "Route Tables (Destination & Target)", description: "A set of directional rules evaluated by longest prefix match: 'Destination' is the CIDR block being accessed, and 'Target' is the next-hop gateway (e.g. local, igw-xxx, nat-xxx)." },
      { name: "Internet Gateway (IGW) & Egress-Only IGW", description: "An IGW is a redundant, horizontally scaled edge node that performs 1:1 NAT for IPv4 traffic to the internet. An Egress-Only IGW allows stateful outbound-only IPv6 traffic while preventing inbound connections." },
      { name: "Elastic IPs & Bastion Hosts", description: "Elastic IP is a static IPv4 address; unattached EIPs incur an hourly billing penalty. A Bastion Host is an SSH/RDP jump server placed in a public subnet to bridge connections into private instances." }
    ]),
    internalsExplanation: `### VPC Networking Architecture & Packet Flow Internals

#### 1. Default vs Custom VPC Dissection
- **Default VPC:**
  - Designed for immediate developer onboarding.
  - Automatically provisions a \`/20\` public subnet in each AZ with an attached Internet Gateway and default route: \`0.0.0.0/0 -> igw-id\`.
  - Automatically enables \`mapPublicIpOnLaunch: true\`, assigning public IPv4 addresses to every instance.
- **Custom (Non-Default) VPC:**
  - Maximum 5 VPCs per region by default (soft limit, extendable).
  - You retain total control: specify CIDR (RFC 1918: \`10.0.0.0/16\`, \`172.16.0.0/16\`, \`192.168.0.0/16\`), carve subnets across AZs, attach Carrier Gateways (Wavelength) or DHCP Option Sets, and decouple public presentation from private data tiers.

#### 2. The 5 Reserved IPs per Subnet Formula
For any CIDR block with prefix length $M$, total possible addresses is $2^{(32 - M)}$. Usable addresses is always $2^{(32 - M)} - 5$:
- For a \`/24\` subnet (e.g. \`10.0.1.0/24\` = 256 IPs, **251 usable**):
  1. \`10.0.1.0\`: Network address.
  2. \`10.0.1.1\`: Reserved by AWS for the VPC router.
  3. \`10.0.1.2\`: Reserved by AWS for the Amazon-provided DNS (Route 53 Resolver / Base + 2).
  4. \`10.0.1.3\`: Reserved by AWS for future internal use.
  5. \`10.0.1.255\`: Network broadcast address (AWS VPC does not support broadcast, but reserves it).

#### 3. Route Table Longest Prefix Match Rule
When an EC2 instance transmits an IP packet:
1. The kernel looks up the route table associated with its subnet.
2. If the destination is inside the VPC (\`10.0.0.0/16\`), traffic stays on the high-speed local VPC fabric (\`Target: local\`).
3. If the destination is outside the VPC (\`54.23.10.5\`), the most specific route wins. If no specific route matches, the default route (\`0.0.0.0/0\`) directs the packet to the Internet Gateway (\`igw-xxx\`).
4. The IGW performs stateless 1:1 NAT, translating the private IP (\`10.0.1.25\`) to the instance's public/Elastic IP (\`52.14.88.10\`) and routes it to the global internet.`,
    architectureSvg: `<svg viewBox="0 0 900 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="890" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Internet Gateway -->
      <g transform="translate(25, 65)">
        <rect width="130" height="110" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="65" y="28" fill="#C084FC" font-size="10.5" font-weight="bold" text-anchor="middle">INTERNET GW</text>
        <rect x="10" y="42" width="110" height="26" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="65" y="59" fill="#F8FAFC" font-size="8" text-anchor="middle">1:1 NAT Translation</text>
        <rect x="10" y="74" width="110" height="24" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="65" y="90" fill="#34D399" font-size="7.5" font-family="monospace" text-anchor="middle">0.0.0.0/0 Gateway</text>
      </g>
      
      <path d="M 155 120 L 195 120" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="200,120 190,115 190,125" fill="#38BDF8"/>
      
      <!-- VPC Boundary -->
      <rect x="205" y="25" width="670" height="190" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="225" y="46" fill="#38BDF8" font-size="11" font-weight="bold" font-family="monospace">CUSTOM VPC (10.0.0.0/16)</text>
      
      <!-- Public Subnet -->
      <g transform="translate(225, 60)">
        <rect width="300" height="135" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="150" y="24" fill="#34D399" font-size="10.5" font-weight="bold" text-anchor="middle">PUBLIC SUBNET (10.0.1.0/24 - AZ-1)</text>
        
        <!-- Bastion Host -->
        <rect x="15" y="40" width="125" height="75" rx="4" fill="#0B1120" stroke="#38BDF8" stroke-width="1"/>
        <text x="77" y="58" fill="#38BDF8" font-size="8.5" font-weight="bold" text-anchor="middle">Bastion Host</text>
        <text x="77" y="74" fill="#94A3B8" font-size="7" text-anchor="middle">Public IP / Elastic IP</text>
        <text x="77" y="90" fill="#34D399" font-size="7" font-family="monospace" text-anchor="middle">SSH Port 22 Jump</text>
        <text x="77" y="104" fill="#10B981" font-size="7" text-anchor="middle">Bridge to Private</text>
        
        <!-- Route Table -->
        <rect x="155" y="40" width="130" height="75" rx="4" fill="#0B1120" stroke="#F59E0B" stroke-width="1"/>
        <text x="220" y="58" fill="#FBBF24" font-size="8.5" font-weight="bold" text-anchor="middle">Public Route Table</text>
        <text x="220" y="74" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">10.0.0.0/16 -> local</text>
        <text x="220" y="90" fill="#34D399" font-size="7" font-family="monospace" text-anchor="middle">0.0.0.0/0 -> igw-id</text>
        <text x="220" y="104" fill="#94A3B8" font-size="7" text-anchor="middle">Auto-Assign Public IP</text>
      </g>
      
      <!-- Internal Jump Arrow -->
      <path d="M 525 120 L 565 120" stroke="#34D399" stroke-width="2" stroke-dasharray="3 2"/>
      <polygon points="570,120 560,115 560,125" fill="#34D399"/>
      
      <!-- Private Subnet -->
      <g transform="translate(575, 60)">
        <rect width="285" height="135" rx="6" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="142" y="24" fill="#FBBF24" font-size="10.5" font-weight="bold" text-anchor="middle">PRIVATE SUBNET (10.0.2.0/24 - AZ-1)</text>
        
        <!-- Private EC2 / DB -->
        <rect x="15" y="40" width="120" height="75" rx="4" fill="#0B1120" stroke="#A855F7" stroke-width="1"/>
        <text x="75" y="58" fill="#C084FC" font-size="8.5" font-weight="bold" text-anchor="middle">Backend / DB</text>
        <text x="75" y="74" fill="#F8FAFC" font-size="7.5" font-family="monospace" text-anchor="middle">10.0.2.45 (Private)</text>
        <text x="75" y="90" fill="#EF4444" font-size="7" text-anchor="middle">NO Public IP</text>
        <text x="75" y="104" fill="#94A3B8" font-size="7" text-anchor="middle">Isolated from Internet</text>
        
        <!-- Private Route Table -->
        <rect x="145" y="40" width="125" height="75" rx="4" fill="#0B1120" stroke="#F59E0B" stroke-width="1"/>
        <text x="207" y="58" fill="#FBBF24" font-size="8.5" font-weight="bold" text-anchor="middle">Private Route Table</text>
        <text x="207" y="74" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">10.0.0.0/16 -> local</text>
        <text x="207" y="90" fill="#EF4444" font-size="7" text-anchor="middle">NO IGW Target</text>
        <text x="207" y="104" fill="#38BDF8" font-size="7" text-anchor="middle">NAT Gateway Only</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]'", explanation: "Provisions a custom non-default VPC with a /16 CIDR block allocating 65,536 private IP addresses." },
      { command: "aws ec2 create-subnet --vpc-id vpc-0a1b2c3d4e5f6g7h8 --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a", explanation: "Creates a /24 subnet bounded to Availability Zone ap-south-1a providing 251 usable host IPs." },
      { command: "aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=prod-igw}]'", explanation: "Instantiates a horizontally scalable Internet Gateway edge node." },
      { command: "aws ec2 attach-internet-gateway --vpc-id vpc-0a1b2c3d4e5f6g7h8 --internet-gateway-id igw-0123456789abcdef0", explanation: "Binds the Internet Gateway to your custom VPC." },
      { command: "aws ec2 create-route --route-table-id rtb-0123456789abcdef0 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0123456789abcdef0", explanation: "Inserts the default gateway route (0.0.0.0/0 -> IGW) converting the associated subnet into a Public Subnet." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always design custom VPCs with distinct non-overlapping CIDR blocks across environments to allow future VPC Peering or Direct Connect.",
      "Never deploy production databases or caching layers into public subnets; isolate them in strictly private subnets.",
      "Use Bastion Hosts or AWS Systems Manager Session Manager (SSM) for private instance shell access without opening port 22 to the public internet.",
      "Release unattached Elastic IP addresses immediately to avoid recurring idle address fees ($0.005/hr).",
      "Attach Egress-Only Internet Gateways instead of standard IGWs for IPv6-only workloads requiring outbound internet connectivity."
    ]),
    securityNotes: "In default VPCs, all subnets are public and auto-assign public IPs. If an engineer launches an EC2 instance without strict Security Groups in a default VPC, any open port is directly accessible to port scanners across the entire public internet.",
    costImplications: "Creating a VPC, Subnets, Route Tables, and Internet Gateways is 100% free of charge. Charges only apply to data transfer out to the internet ($0.09/GB) and unattached Elastic IPs (~$3.60/month each).",
    commonMistakesJson: JSON.stringify([
      "Forgetting to attach the Internet Gateway to the VPC or omitting the default 0.0.0.0/0 route in the public subnet route table.",
      "Assuming all 256 IPs in a /24 subnet are usable, forgetting AWS reserves 5 IPs (.0, .1, .2, .3, .255).",
      "Assigning overlapping CIDRs (e.g. 10.0.0.0/16 in both VPC A and VPC B), making VPC Peering technically impossible.",
      "Retaining unattached Elastic IPs on inactive accounts, accumulating silent monthly charges."
    ]),
    quickRevisionJson: JSON.stringify([
      "VPC Default Quota: 5 VPCs per region.",
      "AWS Reserved IPs: 5 IPs per subnet (.0 net, .1 router, .2 DNS, .3 future, .255 bcast).",
      "Public Subnet: Route table targets Internet Gateway (0.0.0.0/0 -> igw).",
      "Private Subnet: No direct IGW route; uses NAT Gateway for outbound egress.",
      "Bastion Host: Hardened jump server in public subnet bridging SSH/RDP into private instances."
    ])
  },

  "vpc-security-groups-nacls-firewall-flow-logs": {
    simpleExplanation: "VPC Security uses a multi-layered defense strategy: Security Groups act as instance-level firewalls that are stateful (if traffic is allowed in, the reply is automatically allowed out), while Network ACLs (NACLs) act as subnet-level firewalls that are stateless (you must explicitly allow inbound and outbound traffic, including ephemeral return ports). For deeper protection, Route 53 DNS Firewall filters malicious domain queries, and VPC Flow Logs capture all network traffic metadata without affecting latency.",
    coreConceptsJson: JSON.stringify([
      { name: "Security Groups (Stateful)", description: "Operates at the virtual network interface (ENI) level. Evaluates allow rules only (implicit deny all). Stateful: return traffic is automatically permitted regardless of outbound rules." },
      { name: "Network ACLs (NACLs - Stateless)", description: "Operates at the subnet boundary. Evaluates numbered rules (1-32766) in strict ascending order, supporting both explicit ALLOW and DENY rules. Stateless: inbound and outbound traffic must be allowed independently." },
      { name: "The Ephemeral Port Range (1024-65535)", description: "When a client communicates with a server, the operating system assigns a temporary ephemeral port for return traffic. Stateless NACLs MUST explicitly allow outbound ephemeral ports, or responses are dropped!" },
      { name: "Route 53 DNS Firewall", description: "Inspects outbound DNS queries against domain allowlists and denylists. Configurable for Fail-Open (prioritizes availability) or Fail-Closed (prioritizes security)." },
      { name: "AWS Network Firewall", description: "Managed, stateful inspection firewall providing intrusion detection (IDS/IPS), deep packet inspection (DPI), and URL filtering across VPCs." },
      { name: "VPC Flow Logs", description: "Captures IP traffic metadata (Src IP, Dst IP, Port, Protocol, Action ACCEPT/REJECT) to CloudWatch Logs or S3. Collected out-of-band with zero throughput or latency penalty." }
    ]),
    internalsExplanation: `### VPC Perimeter Defense & Packet Filtering Mechanics

#### 1. Security Groups vs NACLs Architectural Comparison

| Dimension | Security Groups | Network ACLs (NACLs) |
| :--- | :--- | :--- |
| **Operating Layer** | Virtual Network Interface (ENI / Instance) | Subnet Boundary |
| **State Tracking** | **Stateful:** Tracks TCP connection state; return traffic auto-allowed | **Stateless:** Evaluates every packet independently; return traffic NOT auto-allowed |
| **Rule Capabilities** | **ALLOW rules only** (implicit deny all inbound) | **ALLOW and DENY rules** |
| **Evaluation Order** | All rules evaluated simultaneously | **Numbered order** (lowest number evaluated first; stops at first match) |
| **Default Configuration** | Default SG: Deny all inbound, Allow all outbound | Default NACL: Allow all inbound & outbound. Custom NACL: Deny all |
| **Ephemeral Return Ports** | Automatically handled by state table | **Mandatory explicit outbound rule** for ports 1024-65535 |

#### 2. The Stateless NACL Ephemeral Return Port Trap
1. A web client on the internet initiates an HTTP GET to your web server:
   - Source IP: \`203.0.113.15\` | Source Port: \`51234\` (ephemeral port)
   - Destination IP: \`10.0.1.5\` | Destination Port: \`80\`
2. The packet reaches the Subnet NACL:
   - **Inbound Rule 100:** \`ALLOW TCP 80 from 0.0.0.0/0\` -> **PERMITTED**.
3. The server processes the request and sends the HTTP 200 OK response back:
   - Source IP: \`10.0.1.5\` | Source Port: \`80\`
   - Destination IP: \`203.0.113.15\` | Destination Port: \`51234\`
4. The response packet hits the Subnet NACL Outbound:
   - **If Outbound Rule has only Port 80:** The packet is destined for port \`51234\`, so it hits the default \`* DENY\` rule!
   - **Result:** Connection hangs and times out!
   - **Remedy:** Every NACL for a public subnet must include an outbound rule: \`ALLOW TCP 1024-65535 to 0.0.0.0/0\`.

#### 3. VPC Flow Logs Pipeline
- Captures traffic metadata directly from the hypervisor layer without running agent software inside your EC2 instances.
- **Log Record Format:**
  \`\`\`text
  <version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>
  2 123456789010 eni-01234567 198.51.100.2 10.0.1.5 443 51234 6 12 6420 1620000000 1620000060 ACCEPT OK
  2 123456789010 eni-01234567 198.51.100.99 10.0.1.5 22 41920 6 1 40 1620000000 1620000060 REJECT OK
  \`\`\`
- \`action == REJECT\` identifies port scans, brute-force attempts, or misconfigured security group/NACL rules.`,
    architectureSvg: `<svg viewBox="0 0 850 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="840" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Ingress Packet Flow -->
      <g transform="translate(25, 40)">
        <rect width="130" height="150" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="26" fill="#38BDF8" font-size="10.5" font-weight="bold" text-anchor="middle">CLIENT TRAFFIC</text>
        <rect x="10" y="42" width="110" height="42" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="65" y="58" fill="#F8FAFC" font-size="8" text-anchor="middle">Src: 203.0.113.15</text>
        <text x="65" y="72" fill="#38BDF8" font-size="8" font-family="monospace" text-anchor="middle">Port: 52140</text>
        <rect x="10" y="94" width="110" height="42" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="65" y="110" fill="#34D399" font-size="8" text-anchor="middle">Dst: Web :443</text>
        <text x="65" y="124" fill="#94A3B8" font-size="7" text-anchor="middle">HTTPS Packet</text>
      </g>
      
      <path d="M 155 115 L 195 115" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="200,115 190,110 190,120" fill="#38BDF8"/>
      
      <!-- Tier 1: Subnet Boundary (Stateless NACL) -->
      <g transform="translate(200, 30)">
        <rect width="250" height="175" rx="8" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="125" y="24" fill="#FBBF24" font-size="11" font-weight="bold" text-anchor="middle">TIER 1: STATELESS NACL</text>
        
        <rect x="12" y="38" width="226" height="54" rx="4" fill="#1E293B" stroke="#10B981" stroke-width="1"/>
        <text x="125" y="54" fill="#34D399" font-size="8.5" font-weight="bold" text-anchor="middle">INBOUND RULES (Numbered)</text>
        <text x="125" y="70" fill="#F8FAFC" font-size="7.5" font-family="monospace" text-anchor="middle">Rule 100: ALLOW TCP 443 (0.0.0.0/0)</text>
        <text x="125" y="84" fill="#EF4444" font-size="7.5" font-family="monospace" text-anchor="middle">Rule *  : DENY ALL INBOUND</text>
        
        <rect x="12" y="102" width="226" height="60" rx="4" fill="#1E293B" stroke="#EF4444" stroke-width="1"/>
        <text x="125" y="118" fill="#F87171" font-size="8.5" font-weight="bold" text-anchor="middle">OUTBOUND RULES (Stateless!)</text>
        <text x="125" y="134" fill="#38BDF8" font-size="7.5" font-family="monospace" text-anchor="middle">Rule 100: ALLOW 1024-65535 (Ephemeral!)</text>
        <text x="125" y="148" fill="#FBBF24" font-size="7" text-anchor="middle">Mandatory for client return packets!</text>
      </g>
      
      <path d="M 450 115 L 490 115" stroke="#10B981" stroke-width="2.5"/>
      <polygon points="495,115 485,110 485,120" fill="#10B981"/>
      
      <!-- Tier 2: Instance Boundary (Stateful Security Group) -->
      <g transform="translate(495, 30)">
        <rect width="200" height="175" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
        <text x="100" y="24" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">TIER 2: SECURITY GROUP</text>
        
        <rect x="12" y="38" width="176" height="54" rx="4" fill="#1E293B" stroke="#10B981" stroke-width="1"/>
        <text x="100" y="54" fill="#34D399" font-size="8.5" font-weight="bold" text-anchor="middle">INBOUND (Allow Only)</text>
        <text x="100" y="70" fill="#F8FAFC" font-size="7.5" font-family="monospace" text-anchor="middle">Port 443 (HTTPS)</text>
        <text x="100" y="84" fill="#94A3B8" font-size="7" text-anchor="middle">Implicit Deny All Others</text>
        
        <rect x="12" y="102" width="176" height="60" rx="4" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
        <text x="100" y="118" fill="#38BDF8" font-size="8.5" font-weight="bold" text-anchor="middle">STATEFUL RETURN</text>
        <text x="100" y="134" fill="#34D399" font-size="7.5" font-weight="bold" text-anchor="middle">AUTO-PERMITTED</text>
        <text x="100" y="148" fill="#94A3B8" font-size="7" text-anchor="middle">No outbound rule required!</text>
      </g>
      
      <!-- Observability: Flow Logs -->
      <g transform="translate(710, 40)">
        <rect width="125" height="150" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="62" y="26" fill="#C084FC" font-size="10.5" font-weight="bold" text-anchor="middle">VPC FLOW LOGS</text>
        <rect x="10" y="42" width="105" height="42" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="62" y="58" fill="#C084FC" font-size="8" text-anchor="middle">Out-of-Band</text>
        <text x="62" y="72" fill="#94A3B8" font-size="7" text-anchor="middle">Zero Latency Impact</text>
        <rect x="10" y="94" width="105" height="42" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="62" y="110" fill="#34D399" font-size="8" text-anchor="middle">CloudWatch / S3</text>
        <text x="62" y="124" fill="#94A3B8" font-size="7" text-anchor="middle">ACCEPT / REJECT</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 create-security-group --group-name web-sg --description 'Allow HTTPS' --vpc-id vpc-0123456789abcdef0", explanation: "Creates a stateful Security Group within the target VPC." },
      { command: "aws ec2 authorize-security-group-ingress --group-id sg-0123456789abcdef0 --protocol tcp --port 443 --cidr 0.0.0.0/0", explanation: "Adds an inbound stateful rule allowing HTTPS traffic on port 443 from any IPv4 address." },
      { command: "aws ec2 create-network-acl-entry --network-acl-id acl-0123456789abcdef0 --ingress --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 0.0.0.0/0 --rule-action allow", explanation: "Adds a stateless inbound rule allowing port 443 in the subnet NACL." },
      { command: "aws ec2 create-network-acl-entry --network-acl-id acl-0123456789abcdef0 --egress --rule-number 100 --protocol tcp --port-range From=1024,To=65535 --cidr-block 0.0.0.0/0 --rule-action allow", explanation: "Crucial rule: Allows stateless return traffic destined for client ephemeral ports (1024-65535)." },
      { command: "aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-0123456789abcdef0 --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name /aws/vpc/flow-logs --deliver-logs-permission-arn arn:aws:iam::123456789012:role/flowlogs-role", explanation: "Enables VPC Flow Logs capturing all ACCEPT and REJECT events into CloudWatch Logs." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never open administrative SSH (port 22) or RDP (port 3389) to 0.0.0.0/0 in Security Groups.",
      "Reference other Security Groups as traffic sources (e.g. app-sg allowing MySQL port 3306 ONLY from web-sg) rather than hardcoding IP addresses.",
      "Remember that Network ACLs are stateless: always create outbound rules for ephemeral port ranges (1024-65535) on public subnets.",
      "Configure Route 53 DNS Firewall in Fail-Closed mode for high-security environments to block queries if the inspection engine is unavailable.",
      "Enable VPC Flow Logs on all production VPCs and stream to Amazon S3 with Lifecycle policies for compliance and forensic audits."
    ]),
    securityNotes: "NACLs evaluate rules in numerical order. If rule 50 DENIES an IP address, rule 100 allowing 0.0.0.0/0 will NEVER be reached for that IP. Security Groups cannot explicitly deny; to block a specific malicious IP address, use an explicit DENY rule in the subnet NACL.",
    costImplications: "Security Groups and Network ACLs are free of charge. VPC Flow Logs incur standard CloudWatch Logs ingestion fees ($0.50/GB) or S3 storage fees ($0.023/GB). Route 53 DNS Firewall costs $0.75 per rule group/month plus $0.60 per million queries.",
    commonMistakesJson: JSON.stringify([
      "Modifying a Network ACL without adding an outbound ephemeral port rule (1024-65535), causing all outbound response traffic to drop.",
      "Attempting to add an explicit 'DENY' rule to a Security Group (Security Groups only support ALLOW rules).",
      "Thinking that Security Groups operate at the subnet level (they operate strictly at the virtual network interface ENI level).",
      "Setting Route 53 DNS Firewall to fail-open in high-compliance environments, allowing malicious domain exfiltration during resolver failover."
    ]),
    quickRevisionJson: JSON.stringify([
      "Security Groups: Stateful, instance/ENI level, ALLOW rules only, return traffic auto-allowed.",
      "Network ACLs: Stateless, subnet level, ALLOW and DENY rules, evaluated in numerical order.",
      "NACL Ephemeral Ports: Outbound rule for ports 1024-65535 is mandatory for web traffic return.",
      "DNS Firewall: Filters Route 53 domain queries; configurable fail-open or fail-closed.",
      "VPC Flow Logs: Out-of-band capture of IP traffic metadata to CloudWatch Logs or S3."
    ])
  },

  "vpc-peering-transit-gateway-endpoints-vpn": {
    simpleExplanation: "Modern cloud architectures require interconnecting multiple VPCs and on-premises networks safely. You use NAT Gateways to give private instances internet access without exposing them, VPC Endpoints (Gateway for S3/DynamoDB, Interface for PrivateLink) to keep traffic inside the AWS backbone, Site-to-Site VPN with dual tunnels for encrypted hybrid connectivity, and AWS Transit Gateway to replace messy full-mesh peering with a clean hub-and-spoke star network.",
    coreConceptsJson: JSON.stringify([
      { name: "NAT Gateway vs NAT Instance", description: "NAT Gateway is a fully managed AWS service that scales up to 100 Gbps with built-in AZ redundancy and zero maintenance. NAT Instance is a self-managed EC2 instance running iptables that acts as a single point of failure." },
      { name: "VPC Gateway Endpoints", description: "Free target configured directly in route tables that provides private, high-throughput routing to Amazon S3 and DynamoDB without leaving the AWS private network." },
      { name: "VPC Interface Endpoints (AWS PrivateLink)", description: "Elastic Network Interfaces (ENIs) with private IP addresses placed inside your subnet to connect privately to 100+ AWS services (ECR, SSM, CloudWatch) and SaaS applications." },
      { name: "VPC Peering & Non-Transitive Rule", description: "A 1:1 direct private network connection between two VPCs (same or inter-region). Non-Transitive: If VPC A is peered to VPC B, and B is peered to C, VPC A CANNOT communicate with VPC C through B." },
      { name: "AWS Site-to-Site VPN (Dual Tunnels)", description: "Encrypted IPsec VPN connection connecting an on-premise Customer Gateway (CGW) to an AWS Virtual Private Gateway (VGW) over the internet, utilizing two tunnels for automatic failover." },
      { name: "AWS Transit Gateway (TGW)", description: "A high-performance regional network transit hub that connects thousands of VPCs and on-premises networks in a centralized star topology, completely replacing complex full-mesh peering." },
      { name: "Traffic Mirroring", description: "Copies raw network traffic from EC2 Elastic Network Interfaces (ENIs) to out-of-band security and monitoring appliances for deep packet inspection without installing host agents." }
    ]),
    internalsExplanation: `### Advanced VPC Routing, Hybrid Interconnects & Service Quotas

#### 1. NAT Gateway vs NAT Instance Deep Dive
- **NAT Gateway:**
  - Deployed in a **Public Subnet** and assigned an **Elastic IP**.
  - Internal private subnets route \`0.0.0.0/0 -> nat-gateway-id\`.
  - Automatically scales bandwidth up to 100 Gbps.
  - Redundant within the AZ; for multi-AZ high availability, deploy **one NAT Gateway per Availability Zone**.
- **NAT Instance:** Legacy approach using an EC2 instance with \`Source/Destination Checking\` disabled and Linux \`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\`. Limited by EC2 network throughput and requires manual failover scripting.

#### 2. VPC Endpoints: Gateway vs Interface (PrivateLink)
- **Gateway Endpoints:**
  - Supports **Amazon S3** and **Amazon DynamoDB** only.
  - **Cost:** 100% Free.
  - **Routing:** You add a prefix list route in your subnet Route Table (e.g. \`pl-63a5400a (com.amazonaws.us-east-1.s3) -> vpce-xxx\`). Traffic leaves the instance and hits the endpoint without touching an Internet Gateway or NAT Gateway.
- **Interface Endpoints (AWS PrivateLink):**
  - Supports 100+ services (Kinesis, SNS, SQS, Secrets Manager, ECR).
  - **Cost:** Hourly fee (~$0.01/hr per AZ) + data processing fee ($0.01/GB).
  - **Routing:** Provisions an ENI with a private IP in your subnet. Private DNS automatically rewrites the service URL (e.g. \`ecr.us-east-1.amazonaws.com\`) to resolve to the local ENI's private IP.

#### 3. Transit Gateway vs VPC Peering Mesh Mathematics
- In an enterprise with $N$ VPCs:
  - Full-mesh VPC Peering requires $\\frac{N \\times (N - 1)}{2}$ individual peering connections and route table entries.
  - For 50 VPCs, that equals $\\frac{50 \\times 49}{2} = \\mathbf{1,225\\text{ peering connections}}$!
  - **AWS Transit Gateway (TGW):** Acts as a central cloud router. Each VPC makes **1 attachment** to the Transit Gateway ($N = 50$ attachments total). Route tables inside the TGW control inter-VPC segmentation (e.g. isolating Dev from Prod).

#### 4. AWS VPC Default Quotas & Limits (from PDF Section 12)
- **VPCs per region:** 5 (can be increased upon request).
- **Subnets per region:** 200.
- **Internet Gateways per region:** 5.
- **Elastic IPs per region:** 5.
- **NAT Gateways per AZ:** 5.
- **Route Tables per VPC:** 200.
- **Network ACLs per VPC:** 200 (Rules per NACL: 20).
- **Security Groups per region:** 2,500 (Rules per SG: 60, SGs per ENI: 5).
- **Active VPC Peering connections per VPC:** 50.
- **VPN connections per region:** 50 (Customer Gateways per region: 50).
- **Transit Gateways per VPC:** 5.`,
    architectureSvg: `<svg viewBox="0 0 900 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="890" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- VPC A (Spoke 1) -->
      <g transform="translate(25, 30)">
        <rect width="180" height="180" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="90" y="24" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">VPC A (Production)</text>
        <text x="90" y="38" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">CIDR: 10.1.0.0/16</text>
        <rect x="15" y="50" width="150" height="42" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="90" y="66" fill="#34D399" font-size="8" text-anchor="middle">Private Workload</text>
        <text x="90" y="80" fill="#94A3B8" font-size="7" font-family="monospace" text-anchor="middle">10.1.2.10 (App Tier)</text>
        <rect x="15" y="102" width="150" height="42" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="118" fill="#38BDF8" font-size="8" text-anchor="middle">Gateway Endpoint</text>
        <text x="90" y="132" fill="#94A3B8" font-size="7" text-anchor="middle">Amazon S3 / DynamoDB (Free)</text>
      </g>
      
      <!-- Spokes to Transit Gateway -->
      <path d="M 205 120 L 295 120" stroke="#F59E0B" stroke-width="2.5"/>
      <polygon points="300,120 290,115 290,125" fill="#F59E0B"/>
      
      <!-- Central Hub: AWS Transit Gateway -->
      <g transform="translate(305, 25)">
        <rect width="290" height="190" rx="10" fill="#0F172A" stroke="#F59E0B" stroke-width="2"/>
        <text x="145" y="26" fill="#FBBF24" font-size="11.5" font-weight="bold" text-anchor="middle">AWS TRANSIT GATEWAY (TGW)</text>
        <text x="145" y="40" fill="#94A3B8" font-size="8" text-anchor="middle">Central Regional Hub (Star Topology)</text>
        
        <rect x="15" y="52" width="260" height="42" rx="4" fill="#1E293B" stroke="#F59E0B" stroke-width="1"/>
        <text x="145" y="68" fill="#FBBF24" font-size="8.5" font-weight="bold" text-anchor="middle">Central TGW Route Tables</text>
        <text x="145" y="82" fill="#34D399" font-size="7.5" font-family="monospace" text-anchor="middle">Replaces 1,225 Peering Meshes!</text>
        
        <rect x="15" y="104" width="260" height="68" rx="4" fill="#1E293B" stroke="#06B6D4" stroke-width="1"/>
        <text x="145" y="122" fill="#22D3EE" font-size="8.5" font-weight="bold" text-anchor="middle">NAT Gateway / Egress VPC</text>
        <text x="145" y="138" fill="#94A3B8" font-size="7.5" text-anchor="middle">Managed 100 Gbps Central Outbound</text>
        <text x="145" y="154" fill="#10B981" font-size="7.5" font-family="monospace" text-anchor="middle">Traffic Mirroring (IDS / DPI)</text>
      </g>
      
      <!-- Right Side Connections -->
      <path d="M 595 75 L 685 75" stroke="#F59E0B" stroke-width="2.5"/>
      <polygon points="690,75 680,70 680,80" fill="#F59E0B"/>
      
      <path d="M 595 165 L 685 165" stroke="#A855F7" stroke-width="2.5"/>
      <polygon points="690,165 680,160 680,170" fill="#A855F7"/>
      
      <!-- VPC B (Spoke 2) -->
      <g transform="translate(695, 20)">
        <rect width="180" height="95" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="90" y="22" fill="#38BDF8" font-size="10" font-weight="bold" text-anchor="middle">VPC B (Staging)</text>
        <text x="90" y="36" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">CIDR: 10.2.0.0/16</text>
        <rect x="12" y="44" width="156" height="38" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="60" fill="#38BDF8" font-size="8" text-anchor="middle">Interface Endpoint (PrivateLink)</text>
        <text x="90" y="72" fill="#94A3B8" font-size="7" text-anchor="middle">Private ENI in Subnet</text>
      </g>
      
      <!-- On-Premise Site-to-Site VPN -->
      <g transform="translate(695, 125)">
        <rect width="180" height="95" rx="6" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="90" y="22" fill="#C084FC" font-size="10" font-weight="bold" text-anchor="middle">ON-PREMISES DATACENTER</text>
        <text x="90" y="36" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">Customer Gateway (CGW)</text>
        <rect x="12" y="44" width="156" height="38" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="90" y="60" fill="#C084FC" font-size="8" text-anchor="middle">Site-to-Site IPsec VPN</text>
        <text x="90" y="72" fill="#10B981" font-size="7" font-weight="bold" text-anchor="middle">DUAL TUNNELS (Auto-Failover)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 create-nat-gateway --subnet-id subnet-0123456789abcdef0 --allocation-id eipalloc-0123456789abcdef0", explanation: "Provisions an AWS-managed NAT Gateway inside a public subnet with an allocated Elastic IP." },
      { command: "aws ec2 create-vpc-endpoint --vpc-id vpc-0123456789abcdef0 --vpc-endpoint-type Gateway --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-0123456789abcdef0", explanation: "Creates a free VPC Gateway Endpoint for Amazon S3 and automatically injects prefix routes into the route table." },
      { command: "aws ec2 create-vpc-peering-connection --vpc-id vpc-11111111 --peer-vpc-id vpc-22222222", explanation: "Initiates a 1:1 non-transitive VPC peering request between two virtual private clouds." },
      { command: "aws ec2 create-transit-gateway --description 'Corporate Central Hub' --options AmazonSideAsn=64512", explanation: "Instantiates an AWS Transit Gateway regional router for hub-and-spoke multi-VPC connectivity." },
      { command: "aws ec2 create-vpn-connection --type ipsec.1 --customer-gateway-id cgw-01234567 --vpn-gateway-id vgw-01234567", explanation: "Configures a Site-to-Site IPsec VPN connection provisioning two automatic-failover tunnels." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Deploy one NAT Gateway per Availability Zone in production to ensure high availability across AZ outages.",
      "Always use Gateway Endpoints for Amazon S3 and DynamoDB: they are 100% free and prevent expensive NAT Gateway data processing fees ($0.045/GB).",
      "Adopt AWS Transit Gateway whenever you have 4 or more interconnected VPCs to avoid complex, unmaintainable full-mesh peering topologies.",
      "Ensure both tunnels of a Site-to-Site VPN are configured on your Customer Gateway router to enable seamless automated failover.",
      "Use Traffic Mirroring to stream production network traffic to an out-of-band Zeek or Suricata IDS appliance without modifying application pods."
    ]),
    securityNotes: "VPC Peering does NOT support transitive routing: if VPC A is peered to VPC B, and VPC B is peered to VPC C, traffic from A cannot reach C. Furthermore, VPC Peering cannot transit traffic through an Internet Gateway or Direct Connect connection hosted in the peer VPC (edge-to-edge routing is strictly prohibited).",
    costImplications: "NAT Gateways cost ~$0.045/hour (~$32.40/month per AZ) plus $0.045/GB data processing fees. Gateway Endpoints for S3 and DynamoDB are 100% free. Interface Endpoints (PrivateLink) cost ~$0.01/hr per AZ plus $0.01/GB. Transit Gateway costs $0.05/hr per attachment plus $0.02/GB.",
    commonMistakesJson: JSON.stringify([
      "Placing a NAT Gateway in a private subnet instead of a public subnet with an attached Elastic IP.",
      "Routing high-volume S3 data transfers (such as database backups or machine learning datasets) through a NAT Gateway instead of a free Gateway Endpoint.",
      "Assuming VPC Peering allows transitive routing between three or more VPCs.",
      "Failing to configure the second IPsec tunnel in a Site-to-Site VPN, leaving the hybrid connection vulnerable to AWS maintenance downtime."
    ]),
    quickRevisionJson: JSON.stringify([
      "NAT Gateway: Managed outbound internet for private subnets; deployed in public subnet with EIP.",
      "Gateway Endpoints: Free route-table targets for S3 and DynamoDB.",
      "Interface Endpoints (PrivateLink): ENI with private IP for 100+ AWS services.",
      "VPC Peering: 1:1, non-transitive, no overlapping CIDRs.",
      "Transit Gateway: Central star hub connecting thousands of VPCs and on-premises networks.",
      "Site-to-Site VPN: Dual IPsec tunnels between Customer Gateway and Virtual Private Gateway."
    ])
  }
};

