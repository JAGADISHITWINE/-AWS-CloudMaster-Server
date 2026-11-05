/**
 * Dedicated Quizzes & Assessments for Module 3: Amazon VPC – Advanced Cloud Networking & Traffic Engineering
 * Aligned with the MicroDegree Amazon VPC (Virtual Private Cloud) Guide
 */

const awsVpcQuizzes = [
  // ==========================================
  // TOPIC 1: VPC Architecture, Subnetting (CIDR), Gateways & Route Tables
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Default VPC Initial Preconfiguration",
    prompt: "Which of the following components is automatically preconfigured and attached when AWS creates a Default VPC in your account?",
    explanation: "A Default VPC comes preconfigured with an attached Internet Gateway (IGW), subnets in each AZ, and route tables directing 0.0.0.0/0 to the IGW.",
    hintsJson: JSON.stringify(["It connects directly to the internet out of the box."]),
    options: [
      { optionKey: "A", optionText: "A Site-to-Site IPsec VPN connection", isCorrect: false },
      { optionKey: "B", optionText: "An attached Internet Gateway (IGW) and public subnets with default internet routes", isCorrect: true },
      { optionKey: "C", optionText: "An AWS Transit Gateway hub", isCorrect: false },
      { optionKey: "D", optionText: "A dedicated hardware firewall appliance", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "AWS Reserved IP Addresses in a Subnet",
    prompt: "In an AWS VPC subnet with CIDR block 192.168.10.0/24 (256 total IP addresses), exactly how many usable IP addresses can be assigned to EC2 instances, and why?",
    explanation: "AWS strictly reserves 5 IP addresses in every subnet (.0 network, .1 router, .2 DNS, .3 future, .255 broadcast). Therefore, 256 - 5 = 251 usable host IPs.",
    hintsJson: JSON.stringify(["256 total addresses minus 5 AWS reserved addresses."]),
    options: [
      { optionKey: "A", optionText: "256 usable IPs (all addresses are available)", isCorrect: false },
      { optionKey: "B", optionText: "254 usable IPs (standard 2 IPs reserved for network and broadcast)", isCorrect: false },
      { optionKey: "C", optionText: "251 usable IPs (AWS reserves 5 specific IPs in every subnet)", isCorrect: true },
      { optionKey: "D", optionText: "128 usable IPs (AWS reserves half the subnet for redundancy)", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Subnet Placement within Availability Zones",
    prompt: "Can a single AWS VPC Subnet span across multiple physical Availability Zones?",
    explanation: "No. In AWS architecture, an individual Subnet resides strictly within exactly one single Availability Zone. To achieve multi-AZ redundancy, you must create separate subnets in each AZ.",
    hintsJson: JSON.stringify(["A subnet is bound to a single AZ."]),
    options: [
      { optionKey: "A", optionText: "Yes, a subnet automatically spans all AZs in the Region.", isCorrect: false },
      { optionKey: "B", optionText: "No, a Subnet resides strictly within a single Availability Zone.", isCorrect: true },
      { optionKey: "C", optionText: "Only private subnets can span across multiple AZs.", isCorrect: false },
      { optionKey: "D", optionText: "Only if Transit Gateway is enabled.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Public Subnet Defining Characteristics",
    prompt: "What specific architectural configuration makes a subnet a 'Public Subnet' in an Amazon VPC?",
    explanation: "A subnet is defined as public if its associated Route Table has a default route (0.0.0.0/0) directing outbound traffic to an attached Internet Gateway (IGW).",
    hintsJson: JSON.stringify(["Look at the Route Table target (Internet Gateway)."]),
    options: [
      { optionKey: "A", optionText: "The subnet is tagged with 'Environment=Public'.", isCorrect: false },
      { optionKey: "B", optionText: "Its route table contains a default route (0.0.0.0/0) targeting an attached Internet Gateway (IGW).", isCorrect: true },
      { optionKey: "C", optionText: "The subnet uses 192.168.0.0/16 rather than 10.0.0.0/16.", isCorrect: false },
      { optionKey: "D", optionText: "It has a NAT Gateway deployed inside it.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Egress-Only Internet Gateway Purpose",
    prompt: "What is the primary function of an Egress-Only Internet Gateway in an Amazon VPC?",
    explanation: "An Egress-Only Internet Gateway provides stateful outbound-only internet connectivity for IPv6 traffic from instances in private subnets, while completely blocking incoming connections from the internet.",
    hintsJson: JSON.stringify(["Think of stateful outbound-only connectivity for IPv6."]),
    options: [
      { optionKey: "A", optionText: "It performs 1:1 NAT translation for IPv4 traffic.", isCorrect: false },
      { optionKey: "B", optionText: "It provides stateful egress-only access for IPv6 traffic to the internet while blocking inbound internet traffic.", isCorrect: true },
      { optionKey: "C", optionText: "It connects VPCs to on-premises IPsec VPN routers.", isCorrect: false },
      { optionKey: "D", optionText: "It speeds up S3 uploads by 500%.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 1,
    topicSlug: "vpc-subnetting-gateways-packet-flow",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Bastion Host Operational Role",
    prompt: "What is the purpose of a Bastion Host (jump server) in cloud network architecture?",
    explanation: "A Bastion Host is a hardened EC2 instance situated in a public subnet that administrators connect to via SSH or RDP to bridge into backend instances residing in private subnets.",
    hintsJson: JSON.stringify(["A secure bridge/jump server into private subnets."]),
    options: [
      { optionKey: "A", optionText: "It stores user session cookies for relational databases.", isCorrect: false },
      { optionKey: "B", optionText: "It sits in a public subnet and acts as a secure jump bridge to access private subnet instances via SSH or RDP.", isCorrect: true },
      { optionKey: "C", optionText: "It caches DNS queries for Route 53.", isCorrect: false },
      { optionKey: "D", optionText: "It replaces the need for an Internet Gateway.", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 2: VPC Security Architecture: Stateful Security Groups, Stateless NACLs, DNS Firewall & Flow Logs
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Security Groups vs Network ACLs Evaluation Layer",
    prompt: "At which architectural boundary do Security Groups operate compared to Network ACLs (NACLs)?",
    explanation: "Security Groups operate at the virtual network interface (ENI / instance) level, whereas Network ACLs operate at the subnet boundary.",
    hintsJson: JSON.stringify(["ENI/instance level vs Subnet level."]),
    options: [
      { optionKey: "A", optionText: "Security Groups operate at the subnet level; NACLs operate at the instance level.", isCorrect: false },
      { optionKey: "B", optionText: "Security Groups operate at the virtual network interface (ENI/instance) level; NACLs operate at the subnet boundary.", isCorrect: true },
      { optionKey: "C", optionText: "Both operate exclusively at the Internet Gateway.", isCorrect: false },
      { optionKey: "D", optionText: "Security Groups operate at DNS Layer 7; NACLs operate at physical Layer 1.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Explicit IP Deny Capability in VPC Firewalls",
    prompt: "A security analyst discovers that a malicious IP address (203.0.113.88) is attempting an SSH brute-force attack. Which VPC firewall can explicitly DENY traffic from this single IP address?",
    explanation: "Security Groups only support ALLOW rules (implicit deny all). To explicitly DENY a specific IP address while allowing others, you must use a Network ACL (NACL) with an explicit DENY rule placed at a lower rule number.",
    hintsJson: JSON.stringify(["Security Groups do NOT support explicit DENY rules; NACLs do."]),
    options: [
      { optionKey: "A", optionText: "Security Groups, by adding an inbound DENY rule.", isCorrect: false },
      { optionKey: "B", optionText: "Network ACLs (NACLs), by inserting an explicit DENY rule with a low rule number.", isCorrect: true },
      { optionKey: "C", optionText: "Internet Gateway route tables.", isCorrect: false },
      { optionKey: "D", optionText: "DHCP Options Sets.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Stateless NACL Ephemeral Return Port Requirement",
    prompt: "An engineer creates a custom NACL allowing inbound TCP port 80, but web clients report timeouts. What outbound rule is mandatory in a stateless NACL to allow web responses to return to client browsers?",
    explanation: "Because NACLs are stateless, outbound responses do NOT return on port 80; they return to the client's temporary ephemeral port. An outbound rule allowing TCP ports 1024-65535 to 0.0.0.0/0 is mandatory.",
    hintsJson: JSON.stringify(["Clients use temporary ephemeral ports between 1024 and 65535."]),
    options: [
      { optionKey: "A", optionText: "ALLOW Outbound UDP port 53", isCorrect: false },
      { optionKey: "B", optionText: "ALLOW Outbound TCP ports 1024–65535 (Ephemeral Port Range) to 0.0.0.0/0", isCorrect: true },
      { optionKey: "C", optionText: "ALLOW Outbound ICMP ping to all hosts", isCorrect: false },
      { optionKey: "D", optionText: "No outbound rule is needed because NACLs are stateful.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "VPC Flow Logs Performance Impact",
    prompt: "How does enabling VPC Flow Logs affect the network throughput, packet latency, and CPU utilization of EC2 instances in that VPC?",
    explanation: "Flow log data is collected out-of-band at the hypervisor layer outside the path of network traffic. It has zero impact on network throughput, latency, or instance CPU utilization.",
    hintsJson: JSON.stringify(["Flow logs are captured out-of-band outside the traffic path."]),
    options: [
      { optionKey: "A", optionText: "It reduces network throughput by 25% due to deep packet payload hashing.", isCorrect: false },
      { optionKey: "B", optionText: "It has zero impact on throughput or latency because data is collected out-of-band outside the path of traffic.", isCorrect: true },
      { optionKey: "C", optionText: "It introduces 50ms of latency per TCP packet.", isCorrect: false },
      { optionKey: "D", optionText: "It consumes 2 vCPUs on every running EC2 instance.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 2,
    topicSlug: "vpc-security-groups-nacls-firewall-flow-logs",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Route 53 DNS Firewall Fail-Closed Mode",
    prompt: "What does configuring Route 53 DNS Firewall in 'Fail-Closed' mode ensure during an internal firewall service disruption?",
    explanation: "Fail-Closed mode ensures that if Route 53 Resolver does not receive an allow reply from DNS Firewall, it blocks the query. This approach strictly favors security over availability to prevent data exfiltration.",
    hintsJson: JSON.stringify(["It blocks queries if it does not receive a reply, favoring security."]),
    options: [
      { optionKey: "A", optionText: "It allows all DNS queries through automatically to maintain uptime.", isCorrect: false },
      { optionKey: "B", optionText: "It blocks any DNS query for which it doesn't receive a reply from DNS Firewall, favoring security over availability.", isCorrect: true },
      { optionKey: "C", optionText: "It restarts all EC2 instances in the VPC.", isCorrect: false },
      { optionKey: "D", optionText: "It deletes the VPC's Internet Gateway.", isCorrect: false }
    ]
  },

  // ==========================================
  // TOPIC 3: Hybrid Connectivity & Advanced Routing: NAT Gateways, Endpoints, Peering, VPN & Transit Gateway
  // ==========================================
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "VPC Gateway Endpoint Zero-Cost Advantage",
    prompt: "An organization transfers 50 TB/month of database backups from private EC2 subnets to Amazon S3. Which networking solution routes this traffic entirely within the AWS network at $0.00 cost, completely bypassing NAT Gateway data fees ($0.045/GB)?",
    explanation: "VPC Gateway Endpoints for Amazon S3 and DynamoDB are 100% free of charge. Traffic routes directly over the AWS private SDN without incurring NAT Gateway hourly or data processing fees.",
    hintsJson: JSON.stringify(["Targeted route table endpoint for S3 and DynamoDB.", "It is 100% free."]),
    options: [
      { optionKey: "A", optionText: "An AWS Transit Gateway attachment", isCorrect: false },
      { optionKey: "B", optionText: "A VPC Gateway Endpoint for Amazon S3", isCorrect: true },
      { optionKey: "C", optionText: "A dual-tunnel Site-to-Site IPsec VPN", isCorrect: false },
      { optionKey: "D", optionText: "An Amazon CloudFront distribution with Origin Shield", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Non-Transitive Rule of VPC Peering",
    prompt: "VPC A is peered with VPC B (pcx-12), and VPC B is peered with VPC C (pcx-23). Can an EC2 instance in VPC A directly communicate with an instance in VPC C through VPC B?",
    explanation: "No. AWS VPC Peering is strictly non-transitive. Traffic cannot hop across an intermediate VPC. VPC A must establish a direct peering connection with VPC C or use AWS Transit Gateway.",
    hintsJson: JSON.stringify(["VPC Peering does NOT support transitive routing."]),
    options: [
      { optionKey: "A", optionText: "Yes, as long as BGP dynamic routing is enabled in VPC B.", isCorrect: false },
      { optionKey: "B", optionText: "No, VPC Peering is strictly non-transitive and does not allow intermediate routing through VPC B.", isCorrect: true },
      { optionKey: "C", optionText: "Yes, because all VPCs in the same account share a single routing domain.", isCorrect: false },
      { optionKey: "D", optionText: "Only if both VPCs use IPv6 addresses.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Transit Gateway Hub-and-Spoke Simplification",
    prompt: "An enterprise has 20 VPCs across multiple AWS accounts that all require interconnectivity. How many network connections are required using AWS Transit Gateway compared to full-mesh VPC Peering?",
    explanation: "Full-mesh VPC peering requires N*(N-1)/2 = 20*19/2 = 190 peering connections. AWS Transit Gateway acts as a central hub where each VPC makes exactly 1 attachment (20 total attachments).",
    hintsJson: JSON.stringify(["Compare 1 attachment per VPC (20) with N*(N-1)/2 mesh (190)."]),
    options: [
      { optionKey: "A", optionText: "Transit Gateway requires 190 attachments; VPC Peering requires 20.", isCorrect: false },
      { optionKey: "B", optionText: "Transit Gateway requires 20 attachments (1 per VPC); full-mesh VPC Peering requires 190 connections.", isCorrect: true },
      { optionKey: "C", optionText: "Both require exactly 400 connections.", isCorrect: false },
      { optionKey: "D", optionText: "Transit Gateway is only supported within a single AWS account.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Site-to-Site VPN Dual-Tunnel Architecture",
    prompt: "Why does an AWS Site-to-Site VPN connection provision two separate IPsec VPN tunnels by default?",
    explanation: "A VPN connection consists of two tunnels to provide high availability. If AWS performs routine maintenance on one device, traffic automatically fails over to the second tunnel with zero downtime.",
    hintsJson: JSON.stringify(["Think of automatic failover and maintenance redundancy."]),
    options: [
      { optionKey: "A", optionText: "One tunnel is for IPv4 and the second tunnel is for IPv6.", isCorrect: false },
      { optionKey: "B", optionText: "Two tunnels provide automatic failover and high availability if one tunnel suffers a device failure or maintenance outage.", isCorrect: true },
      { optionKey: "C", optionText: "One tunnel is for downloads and the second tunnel is for uploads.", isCorrect: false },
      { optionKey: "D", optionText: "The second tunnel is reserved for billing metadata.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 3,
    topicNumber: 3,
    topicSlug: "vpc-peering-transit-gateway-endpoints-vpn",
    type: "MCQ",
    difficulty: "Advanced",
    title: "AWS Traffic Mirroring Core Components",
    prompt: "What are the three core configuration entities required to set up an AWS Traffic Mirroring session for out-of-band network packet inspection?",
    explanation: "Traffic Mirroring requires: (1) Target (destination ENI or NLB), (2) Filter (rules defining what traffic is copied), and (3) Session (binds source ENI to target using the filter).",
    hintsJson: JSON.stringify(["From the PDF: Target, Filter, and Session."]),
    options: [
      { optionKey: "A", optionText: "Ingress, Egress, and Route Table", isCorrect: false },
      { optionKey: "B", optionText: "Target (destination), Filter (packet rules), and Session (entity binding source to target)", isCorrect: true },
      { optionKey: "C", optionText: "NAT Gateway, Bastion Host, and Customer Gateway", isCorrect: false },
      { optionKey: "D", optionText: "VPC Peering, Transit Gateway, and Direct Connect", isCorrect: false }
    ]
  }
];

module.exports = awsVpcQuizzes;

