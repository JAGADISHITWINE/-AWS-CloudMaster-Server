/**
 * Dedicated Real-World Troubleshooting Scenarios for Module 3: Amazon VPC – Advanced Cloud Networking & Traffic Engineering
 * Aligned with the MicroDegree Amazon VPC (Virtual Private Cloud) Guide
 *
 * Topic 1: vpc-subnetting-gateways-packet-flow (2 scenarios)
 * Topic 2: vpc-security-groups-nacls-firewall-flow-logs (2 scenarios)
 * Topic 3: vpc-peering-transit-gateway-endpoints-vpn (2 scenarios)
 */

module.exports = [
  // ==========================================
  // TOPIC 1: VPC Architecture, Subnetting (CIDR), Gateways & Route Tables
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    title: "Scenario: Private Subnet EC2 Instances Cannot Download Security Patches (Missing NAT Gateway)",
    difficulty: "Intermediate",
    prompt: "An engineer launches a fleet of backend microservice instances in a private subnet (10.0.2.0/24). The instances have no public IP addresses. When attempting to run 'yum update -y' or 'apt-get update', the command hangs for 120 seconds and terminates with 'Connection timed out'. The engineer verifies the Security Group allows all outbound traffic. What is the networking root cause, and how do you establish outbound-only internet connectivity?",
    explanation: "Tests foundational VPC routing: private subnets have no route to an Internet Gateway (and instances lack public IPs). Outbound internet connectivity for software patches and package updates requires deploying a NAT Gateway into a public subnet and updating the private route table.",
    hintsJson: JSON.stringify([
      "Can an Internet Gateway communicate directly with an instance that does not possess a Public or Elastic IP address?",
      "In which subnet type (Public or Private) must an AWS NAT Gateway be placed?",
      "What target route must be added to the private subnet route table?",
      "Why must the NAT Gateway have an attached Elastic IP?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Step-by-Step Resolution:

#### 1. The Networking Root Cause:
1. **No Public IP & No 1:1 NAT:**
   - The private instances only possess private IPv4 addresses (\`10.0.2.x\`).
   - Even if you add an Internet Gateway (IGW) route to the private route table, the IGW cannot perform 1:1 NAT translation without an allocated public or Elastic IP.
   - Private RFC 1918 IP packets cannot be routed over the public internet, so all outbound package manager requests hang and time out.

#### 2. Architecture for Outbound-Only Internet Egress:
A **Network Address Translation (NAT) Gateway** allows instances in private subnets to initiate outbound connections to the internet (e.g. for OS patches) while completely blocking any inbound connections initiated from the outside internet.

#### 3. Step-by-Step Resolution Protocol:
1. **Allocate an Elastic IP for the NAT Gateway:**
   \`\`\`bash
   EIP_ALLOC=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
   \`\`\`
2. **Deploy the NAT Gateway into the PUBLIC Subnet:**
   \`\`\`bash
   # NAT Gateway MUST reside in a public subnet with a route to an IGW!
   NAT_ID=$(aws ec2 create-nat-gateway \\
     --subnet-id <PublicSubnetId> \\
     --allocation-id $EIP_ALLOC \\
     --query 'NatGateway.NatGatewayId' --output text)
   
   # Wait for state to transition from 'pending' to 'available':
   aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_ID
   \`\`\`
3. **Update the Private Route Table:**
   \`\`\`bash
   # Add default route 0.0.0.0/0 targeting the NAT Gateway:
   aws ec2 create-route \\
     --route-table-id <PrivateRouteTableId> \\
     --destination-cidr-block 0.0.0.0/0 \\
     --gateway-id $NAT_ID
   \`\`\`
4. **Verification:**
   - SSH into the private instance via a Bastion Host in the public subnet and run \`curl -I https://amazonlinux.com\`.
   - The command returns \`HTTP/2 200\` instantaneously.`,
    tagsJson: JSON.stringify(["VPC", "Networking", "NAT Gateway", "Subnets", "Route Tables", "Troubleshooting"])
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    title: "Scenario: Subnet IP Exhaustion Causing Auto Scaling Launch Failures (/28 Subnet)",
    difficulty: "Advanced",
    prompt: "During a flash-sale event, traffic spikes by 500%. The Auto Scaling Group triggers a scale-up event from 4 to 20 EC2 instances. However, scaling abruptly halts after launching 7 instances, and CloudWatch emits error: 'InsufficientFreeAddressesInSubnet: There are no free IP addresses in subnet-01a2b3c4d5e'. The engineer discovers the subnet CIDR was created as a /28 block. Explain the exact mathematical IP accounting and how to resolve the capacity bottleneck.",
    explanation: "Deep dive into AWS VPC subnetting mathematics: in any subnet, AWS reserves 5 IP addresses. A /28 block has 16 total IPs minus 5 reserved = only 11 usable IPs. When instances, load balancer interfaces, and Lambda ENIs consume those 11 IPs, scaling fails.",
    hintsJson: JSON.stringify([
      "How many total addresses exist in a /28 IPv4 subnet (2^(32-28) = 16)?",
      "Which 5 specific IP addresses are strictly reserved by AWS in every subnet (.0, .1, .2, .3, .255)?",
      "Can you change the CIDR block size of an existing subnet once created?",
      "How do you add a new secondary subnet to an existing VPC and associate it with the Auto Scaling Group?"
    ]),
    recommendedSolution: `### Architectural Analysis & Resolution:

#### 1. The Subnet IP Math & Root Cause:
- Total theoretical IPs in a \`/28\` block: $2^{(32 - 28)} = 2^4 = \\mathbf{16\\text{ IP addresses}}$.
- **The 5 AWS Reserved IPs:**
  1. \`10.0.1.0\`: Network address.
  2. \`10.0.1.1\`: VPC internal router.
  3. \`10.0.1.2\`: Route 53 DNS Resolver (base + 2).
  4. \`10.0.1.3\`: Reserved by AWS for future internal capability.
  5. \`10.0.1.15\`: Broadcast address.
- **Usable Host Addresses:** $16 - 5 = \\mathbf{11\\text{ usable IPs}}$.
- When the 4 baseline instances and 7 scale-up instances were launched, all 11 available IPs were consumed ($4 + 7 = 11$). The 12th instance encountered zero free IPs and crashed.

#### 2. The Solution (Subnets Cannot Be Resized!):
In AWS VPC, an existing subnet's CIDR block **cannot be expanded or resized**. You must carve a larger secondary subnet:

1. **Provision a Generous Subnet (/24 or /22):**
   \`\`\`bash
   # Carve a /22 subnet providing 1,019 usable host addresses (1024 - 5):
   NEW_SUBNET=$(aws ec2 create-subnet \\
     --vpc-id <VpcId> \\
     --cidr-block 10.0.4.0/22 \\
     --availability-zone <AZ> \\
     --query 'Subnet.SubnetId' --output text)
   \`\`\`
2. **Associate with Existing Route Table:**
   \`\`\`bash
   aws ec2 associate-route-table --subnet-id $NEW_SUBNET --route-table-id <PrivateRouteTableId>
   \`\`\`
3. **Update the Auto Scaling Group Configuration:**
   \`\`\`bash
   # Update ASG to utilize the new large subnet alongside existing subnets:
   aws autoscaling update-auto-scaling-group \\
     --auto-scaling-group-name prod-web-asg \\
     --vpc-zone-identifier "$NEW_SUBNET,<OtherAZSubnets>"
   \`\`\`
4. **Best Practice:** Subnets for elastic container/server workloads should always be sized at minimum \`/24\` (251 usable IPs) or \`/22\` (1,019 usable IPs).`,
    tagsJson: JSON.stringify(["VPC", "CIDR", "Subnetting", "Auto Scaling", "IP Exhaustion", "Reserved IPs"])
  },

  // ==========================================
  // TOPIC 2: VPC Security Architecture: Stateful Security Groups, Stateless NACLs, DNS Firewall & Flow Logs
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    title: "Scenario: Stateless NACL Silent Drop: Web Requests Hang on Port 80 Return Traffic",
    difficulty: "Intermediate",
    prompt: "An administrator hardens a public web subnet by creating a custom Network ACL. Inbound Rule 100 is configured: 'ALLOW TCP Port 80 from 0.0.0.0/0'. Outbound Rule 100 is configured: 'ALLOW TCP Port 80 to 0.0.0.0/0'. The EC2 Security Group allows all inbound HTTP on port 80. However, when users try to visit the website, their browsers spin indefinitely and time out after 60 seconds. What fundamental flaw in the stateless NACL configuration is causing all return packets to be dropped?",
    explanation: "Classic networking pitfall highlighting the stateless nature of Network Access Control Lists: while the inbound request arrives on port 80, the server's HTTP response is destined for the client's temporary ephemeral return port (1024-65535). A stateless NACL outbound rule restricted to port 80 drops all outgoing web responses.",
    hintsJson: JSON.stringify([
      "Is a Network ACL stateful or stateless?",
      "When a client browser sends an HTTP request from port 51432 to port 80, what port does the web server send the response BACK to?",
      "What is the standard ephemeral port range for modern operating systems (1024-65535)?",
      "Why did the Security Group not prevent this failure?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Packet Flow Breakdown:

#### 1. The Stateless Packet Journey:
1. **Inbound Path (Success):**
   - Client sends packet: \`Src: 198.51.100.10:52410\` -> \`Dst: 10.0.1.5:80\`.
   - Subnet Inbound NACL Rule 100 allows TCP port 80 from \`0.0.0.0/0\`.
   - Security Group allows inbound port 80.
   - **Result:** Packet reaches Apache/Nginx web server.
2. **Outbound Return Path (Silent Drop!):**
   - The web server generates the HTTP 200 response:
     \`Src: 10.0.1.5:80\` -> \`Dst: 198.51.100.10:52410\` (the client's ephemeral port).
   - The **Security Group** is stateful, so it automatically permits the outbound response without an outbound rule.
   - **However, the packet hits the Subnet NACL Outbound Rules:**
     - Outbound Rule 100 only permits destination port **80**.
     - The response packet is destined for port **52410**!
     - The packet falls through and hits the default \`Rule * (DENY ALL OUTBOUND)\`!
   - **Result:** The web server response is dropped at the subnet boundary. The client browser hangs until connection timeout.

#### 2. Step-by-Step Resolution:
1. **Add Outbound Ephemeral Return Port Rule:**
   \`\`\`bash
   aws ec2 create-network-acl-entry \\
     --network-acl-id <NaclId> \\
     --egress \\
     --rule-number 110 \\
     --protocol tcp \\
     --port-range From=1024,To=65535 \\
     --cidr-block 0.0.0.0/0 \\
     --rule-action allow
   \`\`\`
2. **Verification in VPC Flow Logs:**
   - Before fix: VPC Flow Logs show \`REJECT OK\` on outbound packets with \`dstport=52410\`.
   - After fix: VPC Flow Logs show \`ACCEPT OK\` and the web page loads in 25 milliseconds.`,
    tagsJson: JSON.stringify(["VPC", "NACL", "Security Groups", "Stateless", "Ephemeral Ports", "Troubleshooting"])
  },
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    title: "Scenario: Data Exfiltration via DNS Tunneling Bypassed by Fail-Open DNS Firewall",
    difficulty: "Advanced",
    prompt: "A financial organization deploys Route 53 DNS Firewall to prevent data exfiltration to known malicious command-and-control (C2) domains. During an internal red-team penetration test, an attacker compromises an internal server and initiates high-volume base64 DNS tunneling exfiltration. During the attack, a regional AWS network spike causes transient latency in the Route 53 Resolver inspection pipeline. The DNS firewall allows the exfiltration queries to pass through unimpeded. How was the DNS Firewall configured to cause this breach, and what parameter guarantees strict security enforcement?",
    explanation: "Tests Route 53 DNS Firewall fail-open vs fail-closed security posture: by default or when misconfigured in Fail-Open mode, Route 53 Resolver allows queries through when DNS Firewall rules cannot be evaluated, favoring availability over security. Mission-critical environments mandate Fail-Closed mode.",
    hintsJson: JSON.stringify([
      "What are the two failure modes available in Route 53 DNS Firewall (Fail-Open vs Fail-Closed)?",
      "Which failure mode prioritizes availability by permitting uninspected queries during firewall service delays?",
      "Which failure mode prioritizes security by blocking all queries during inspection timeouts?",
      "What AWS CLI command updates the DNS Firewall configuration for a VPC?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Security Hardening:

#### 1. The Root Cause (Fail-Open Vulnerability):
- When a VPC is associated with Route 53 DNS Firewall, you configure how Route 53 Resolver behaves if it cannot communicate with the firewall engine:
  - **Fail-Open (Default in some templates):** If the DNS Firewall engine is slow or unresponsive, Resolver permits all queries to pass through. This guarantees high application availability, but creates a catastrophic security hole during network degradation.
  - **Fail-Closed:** Resolver drops and blocks any DNS query for which it does not receive a definitive allow verdict from the DNS Firewall.
- The red-team simulated resolver load, triggering the fail-open condition and allowing encoded DNS exfiltration to reach external nameservers.

#### 2. Remediation Protocol:
\`\`\`bash
# 1. Update the VPC DNS Firewall configuration to FAIL-CLOSED:
aws route53resolver update-firewall-config \\
  --resource-id <VpcId> \\
  --firewall-fail-open DISABLED

# 2. Verify configuration status:
aws route53resolver get-firewall-config --resource-id <VpcId>
\`\`\`
- Output: \`FirewallFailOpen: DISABLED\` (enforces Fail-Closed mode).

#### 3. Defense-in-Depth Enhancements:
- Deploy **AWS Network Firewall** with stateful Suricata rules to inspect raw UDP/TCP port 53 payloads for non-standard DNS tunneling anomalies.
- Enable **Amazon GuardDuty**, which features automated machine-learning detectors for DNS data exfiltration (\`Trojan:EC2/DNSDataExfiltration\`).`,
    tagsJson: JSON.stringify(["VPC", "DNS Firewall", "Route 53", "Security", "Fail-Closed", "Data Exfiltration"])
  },

  // ==========================================
  // TOPIC 3: Hybrid Connectivity & Advanced Routing: NAT Gateways, Endpoints, Peering, VPN & Transit Gateway
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    title: "Scenario: Non-Transitive VPC Peering Routing Failure (VPC A to VPC C via VPC B)",
    difficulty: "Intermediate",
    prompt: "A multi-account organization connects three VPCs: VPC A (Production, 10.1.0.0/16), VPC B (Shared Services / Bastion, 10.2.0.0/16), and VPC C (Analytics, 10.3.0.0/16). VPC A is peered to VPC B. VPC B is peered to VPC C. The network engineer adds a route in VPC A's route table: '10.3.0.0/16 -> pcx-ab' expecting VPC B to forward the packets to VPC C. Connectivity completely fails. Why does this packet flow fail, and what are the two production solutions?",
    explanation: "Tests foundational knowledge of the non-transitive property of AWS VPC Peering: VPC peering does not support edge-to-edge routing or transit routing across intermediate VPCs. Traffic can only flow directly between the two paired VPCs. Solutions are direct full-mesh peering or AWS Transit Gateway.",
    hintsJson: JSON.stringify([
      "Is VPC Peering transitive or non-transitive?",
      "Can a packet entering VPC B from a peering connection be routed out another peering connection in VPC B?",
      "What happens to total peering connection complexity when scaling to 20 or 50 VPCs (N*(N-1)/2)?",
      "Which AWS service acts as a centralized regional star-router for multi-VPC transit routing?"
    ]),
    recommendedSolution: `### Architectural Analysis & Two Production Solutions:

#### 1. Why the Routing Fails (The Non-Transitive Rule):
- **AWS VPC Peering is strictly non-transitive:**
  - A peering connection is a direct, point-to-point Layer-3 virtual interconnect between **exactly two VPCs**.
  - AWS SDN explicitly drops any packet whose destination IP belongs to a network beyond the direct peer.
  - VPC B cannot act as an intermediate transit router or relay host.

#### 2. Solution A: Direct Point-to-Point VPC Peering (Small Scale: 2-3 VPCs)
- Create a direct peering connection between **VPC A** and **VPC C**:
  \`\`\`bash
  # 1. Create peering connection between VPC A and VPC C:
  PEER_AC=$(aws ec2 create-vpc-peering-connection \\
    --vpc-id <VpcA_Id> --peer-vpc-id <VpcC_Id> \\
    --query 'VpcPeeringConnection.VpcPeeringConnectionId' --output text)
  aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $PEER_AC

  # 2. Add route in VPC A:
  aws ec2 create-route --route-table-id <VpcA_RouteTable> --destination-cidr-block 10.3.0.0/16 --vpc-peering-connection-id $PEER_AC

  # 3. Add reverse route in VPC C:
  aws ec2 create-route --route-table-id <VpcC_RouteTable> --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id $PEER_AC
  \`\`\`

#### 3. Solution B: AWS Transit Gateway (TGW) (Enterprise Standard: 4+ VPCs)
- Direct peering creates an unmaintainable full-mesh: for 20 VPCs, you need $\\frac{20 \\times 19}{2} = \\mathbf{190\\text{ peering connections}}$.
- **Transit Gateway replaces mesh with a Star Hub:**
  1. Provision an **AWS Transit Gateway (TGW)**.
  2. Attach VPC A, VPC B, and VPC C to the Transit Gateway (each makes 1 attachment).
  3. Route tables in all three VPCs simply declare: \`10.0.0.0/8 -> tgw-id\`.
  4. The Transit Gateway centrally routes packets between all VPCs and on-premises datacenters with centralized audit logs and routing domains.`,
    tagsJson: JSON.stringify(["VPC", "VPC Peering", "Transit Gateway", "Non-Transitive", "Routing", "Architecture"])
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    title: "Scenario: Astronomical NAT Gateway Charges from Nightly S3 Database Backups",
    difficulty: "Advanced",
    prompt: "An enterprise runs an automated nightly backup job where 40 TB of database snapshots are uploaded from private EC2 instances in a VPC to an Amazon S3 bucket. The cloud finance team issues an alert: the AWS bill has spiked by $1,800/month specifically under the line item 'NatGateway-Bytes' ($0.045/GB data processing). The infrastructure lead asks: 'Why are we paying NAT Gateway fees to upload data to an internal AWS service like S3, and how do we eliminate 100% of these processing charges?'",
    explanation: "Tests cost optimization and private cloud networking: by default, traffic from private subnets to Amazon S3 routes through the NAT Gateway to public S3 endpoints, incurring both NAT hourly fees and $0.045/GB processing charges. Deploying a free VPC Gateway Endpoint for S3 injects private routes that keep all S3 traffic on the internal AWS network at $0.00 cost.",
    hintsJson: JSON.stringify([
      "Is Amazon S3 an internal VPC service or an AWS public zone service?",
      "What is the data processing fee for an AWS NAT Gateway ($0.045 per GB)?",
      "Which VPC Endpoint type supports Amazon S3 and DynamoDB without any hourly or per-GB charges (Gateway Endpoint)?",
      "How is a Gateway Endpoint configured in a subnet route table?"
    ]),
    recommendedSolution: `### Cost Optimization & Architectural Resolution:

#### 1. Financial Root Cause:
- Amazon S3 is an AWS public-zone service with public IP endpoints.
- When instances in a private subnet upload data to \`s3.us-east-1.amazonaws.com\`, the traffic must exit the private subnet via the **NAT Gateway**.
- **NAT Gateway Data Processing Fee:** **\\$0.045 per GB**.
- **Monthly Cost Calculation:**
  $$40\\text{ TB} = 40,000\\text{ GB} \\times \\$0.045 = \\mathbf{\\$1,800.00\\text{ per month in wasted NAT processing fees!}}$$

#### 2. The Zero-Cost Solution: VPC Gateway Endpoint for Amazon S3:
AWS provides **Gateway Endpoints** for Amazon S3 and DynamoDB at **100% zero cost** ($0/hr and $0/GB):
1. **Provision the Gateway Endpoint:**
   \`\`\`bash
   S3_ENDPOINT=$(aws ec2 create-vpc-endpoint \\
     --vpc-id <VpcId> \\
     --vpc-endpoint-type Gateway \\
     --service-name com.amazonaws.us-east-1.s3 \\
     --route-table-ids <PrivateRouteTableId> \\
     --query 'VpcEndpoint.VpcEndpointId' --output text)
   \`\`\`
2. **What Actually Happens to Routing:**
   - AWS automatically injects the regional S3 prefix list into your route table:
     \`\`\`text
     Destination: pl-63a5400a (com.amazonaws.us-east-1.s3)
     Target: vpce-0123456789abcdef0
     \`\`\`
   - By the rule of **longest prefix match**, S3 traffic is intercepted and routed directly across the high-speed AWS private software-defined network, completely bypassing the NAT Gateway!
3. **Financial Outcome:**
   - \`NatGateway-Bytes\` for S3 backup drops from 40,000 GB to **0 GB**.
   - **Total Annual Savings: $21,600.00/year.**`,
    tagsJson: JSON.stringify(["VPC", "NAT Gateway", "VPC Endpoint", "Gateway Endpoint", "S3", "Cost Optimization"])
  }
];

