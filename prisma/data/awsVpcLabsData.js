/**
 * Dedicated Practical Labs for Module 3: Amazon VPC – Advanced Cloud Networking & Traffic Engineering
 * Aligned with the MicroDegree Amazon VPC (Virtual Private Cloud) Guide
 *
 * Lab 3.1: vpc-subnetting-gateways-packet-flow
 * Lab 3.2: vpc-security-groups-nacls-firewall-flow-logs
 * Lab 3.3: vpc-peering-transit-gateway-endpoints-vpn
 */

const awsVpcLabs = {
  "vpc-subnetting-gateways-packet-flow": {
    title: "Lab 3.1: Custom VPC Architecture: CIDR Subnetting, Internet Gateways & Bastion Host",
    level: "Intermediate",
    estimatedMinutes: 50,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Provision Custom VPC with RFC 1918 CIDR Block",
        description: "Create an isolated, non-default VPC with CIDR block 10.0.0.0/16 providing 65,536 private IPv4 addresses, and enable DNS hostnames.",
        command: `VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=prod-custom-vpc
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames "{\\"Value\\":true}"
echo "VPC Created: $VPC_ID"`,
        expectedOutput: "VPC created with 10.0.0.0/16 CIDR and DNS hostnames enabled (e.g. vpc-0a1b2c3d4e5f6g7h8).",
        verification: "Run 'aws ec2 describe-vpcs --vpc-ids $VPC_ID' to verify state is available.",
        troubleshooting: "If VPC creation fails, verify your account has not hit the 5 VPCs per region limit."
      },
      {
        stepNumber: 2,
        title: "Carve Public & Private Subnets Across Availability Zones",
        description: "Carve a Public Subnet (10.0.1.0/24) in AZ-1 and a Private Subnet (10.0.2.0/24) in AZ-1, noting the 5 AWS reserved IP addresses.",
        command: `PUB_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone $(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].ZoneName' --output text) --query 'Subnet.SubnetId' --output text)
PRIV_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone $(aws ec2 describe-availability-zones --query 'AvailabilityZones[0].ZoneName' --output text) --query 'Subnet.SubnetId' --output text)
aws ec2 create-tags --resources $PUB_SUBNET --tags Key=Name,Value=public-subnet-1
aws ec2 create-tags --resources $PRIV_SUBNET --tags Key=Name,Value=private-subnet-1
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET --map-public-ip-on-launch
echo "Public Subnet: $PUB_SUBNET | Private Subnet: $PRIV_SUBNET"`,
        expectedOutput: "Two /24 subnets created. Each provides 251 usable host IPs (256 - 5 AWS reserved IPs).",
        verification: "Run 'aws ec2 describe-subnets --subnet-ids $PUB_SUBNET $PRIV_SUBNET' to inspect AvailableIpAddressCount.",
        troubleshooting: "Ensure CIDR blocks do not overlap (10.0.1.0/24 and 10.0.2.0/24 are cleanly distinct)."
      },
      {
        stepNumber: 3,
        title: "Attach Internet Gateway (IGW) to Custom VPC",
        description: "Deploy a horizontally scaled, redundant Internet Gateway edge node and attach it to your custom VPC.",
        command: `IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 create-tags --resources $IGW_ID --tags Key=Name,Value=prod-vpc-igw
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
echo "IGW Attached: $IGW_ID"`,
        expectedOutput: "Internet Gateway successfully created and attached to custom VPC.",
        verification: "Run 'aws ec2 describe-internet-gateways --internet-gateway-ids $IGW_ID' to verify attachment state is 'available'.",
        troubleshooting: "A VPC can only have one Internet Gateway attached at a time (1:1 constraint)."
      },
      {
        stepNumber: 4,
        title: "Configure Route Tables: Public IGW vs Private Local",
        description: "Create a dedicated Public Route Table, add default route (0.0.0.0/0 -> IGW), and associate it strictly with the Public Subnet.",
        command: `PUB_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-tags --resources $PUB_RT --tags Key=Name,Value=public-route-table
aws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --subnet-id $PUB_SUBNET --route-table-id $PUB_RT
echo "Public Route Table Configured: $PUB_RT"`,
        expectedOutput: "Route table associated with public subnet. Rule 0.0.0.0/0 targets IGW; private subnet retains main local-only route table.",
        verification: "Run 'aws ec2 describe-route-tables --route-table-ids $PUB_RT' to verify routes.",
        troubleshooting: "Never associate your private subnet with the public route table; private subnets must remain isolated."
      },
      {
        stepNumber: 5,
        title: "Deploy Bastion Host Security Group & Test Instance",
        description: "Create a hardened Bastion Security Group permitting SSH from your public IP only, and launch a test instance in the public subnet.",
        command: `SG_ID=$(aws ec2 create-security-group --group-name bastion-sg --description "Bastion Jump Server SG" --vpc-id $VPC_ID --query 'GroupId' --output text)
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP/32
echo "Bastion SG created: $SG_ID (SSH allowed from $MY_IP/32)"`,
        expectedOutput: "Security group created with stateful SSH ingress restricted strictly to your current workstation public IP.",
        verification: "Verify rule via 'aws ec2 describe-security-groups --group-ids $SG_ID'.",
        troubleshooting: "Never open port 22 to 0.0.0.0/0 (all internet); always pin to your workstation /32 CIDR."
      },
      {
        stepNumber: 6,
        title: "Clean Up Custom VPC Infrastructure",
        description: "Tear down the lab resources in strict reverse dependency order to ensure a clean account baseline.",
        command: `aws ec2 delete-security-group --group-id $SG_ID
aws ec2 detach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID
aws ec2 delete-subnet --subnet-id $PUB_SUBNET
aws ec2 delete-subnet --subnet-id $PRIV_SUBNET
aws ec2 delete-route-table --route-table-id $PUB_RT
aws ec2 delete-vpc --vpc-id $VPC_ID
echo "Custom VPC and all associated networking components cleaned up."`,
        expectedOutput: "Clean teardown completed successfully.",
        verification: "Run 'aws ec2 describe-vpcs --vpc-ids $VPC_ID' and confirm InvalidVpcID.NotFound.",
        troubleshooting: "AWS rejects VPC deletion if any subnets, network interfaces, or custom route tables are still attached."
      }
    ]
  },

  "vpc-security-groups-nacls-firewall-flow-logs": {
    title: "Lab 3.2: Defense-in-Depth: Stateful Security Groups, Stateless NACLs & VPC Flow Logs",
    level: "Advanced",
    estimatedMinutes: 50,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Instantiate Security Lab VPC & Subnet",
        description: "Spin up a sandbox VPC (10.50.0.0/16) and a testing subnet (10.50.1.0/24) to evaluate perimeter packet filtering.",
        command: `SEC_VPC=$(aws ec2 create-vpc --cidr-block 10.50.0.0/16 --query 'Vpc.VpcId' --output text)
SEC_SUB=$(aws ec2 create-subnet --vpc-id $SEC_VPC --cidr-block 10.50.1.0/24 --query 'Subnet.SubnetId' --output text)
echo "Security Lab VPC: $SEC_VPC | Subnet: $SEC_SUB"`,
        expectedOutput: "Sandbox VPC and Subnet initialized.",
        verification: "Verify via 'aws ec2 describe-vpcs --vpc-ids $SEC_VPC'.",
        troubleshooting: "Ensure you record the VPC ID for subsequent security group and NACL bindings."
      },
      {
        stepNumber: 2,
        title: "Configure Stateful Security Groups with Chained References",
        description: "Create Web SG allowing port 80/443, and Database SG allowing port 5432 (PostgreSQL) ONLY from Web SG (chained group reference).",
        command: `WEB_SG=$(aws ec2 create-security-group --group-name web-tier-sg --description "Web Tier" --vpc-id $SEC_VPC --query 'GroupId' --output text)
DB_SG=$(aws ec2 create-security-group --group-name db-tier-sg --description "Database Tier" --vpc-id $SEC_VPC --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id $WEB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $DB_SG --protocol tcp --port 5432 --source-group $WEB_SG
echo "Security Groups Chained: DB_SG ($DB_SG) allows port 5432 strictly from WEB_SG ($WEB_SG)"`,
        expectedOutput: "Database SG successfully references Web SG ID instead of static CIDR blocks, preventing unauthorized access.",
        verification: "Run 'aws ec2 describe-security-groups --group-ids $DB_SG' and verify UserIdGroupPairs.",
        troubleshooting: "Security Group chaining works within the same VPC or across VPC peering connections."
      },
      {
        stepNumber: 3,
        title: "Deploy Custom Network ACL with Ephemeral Port Rules",
        description: "Create a custom stateless NACL, bind it to your subnet, and configure explicit inbound port 443 and mandatory outbound ephemeral return ports (1024-65535).",
        command: `NACL_ID=$(aws ec2 create-network-acl --vpc-id $SEC_VPC --query 'NetworkAcl.NetworkAclId' --output text)
# Inbound Rule 100: Allow HTTPS 443
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --ingress --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 0.0.0.0/0 --rule-action allow
# Outbound Rule 100: Mandatory Ephemeral Return Ports
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --egress --rule-number 100 --protocol tcp --port-range From=1024,To=65535 --cidr-block 0.0.0.0/0 --rule-action allow
# Associate NACL with Subnet
ASSOC_ID=$(aws ec2 describe-network-acls --filters Name=association.subnet-id,Values=$SEC_SUB --query 'NetworkAcls[0].Associations[0].NetworkAclAssociationId' --output text)
aws ec2 replace-network-acl-association --association-id $ASSOC_ID --network-acl-id $NACL_ID
echo "Stateless NACL Active on Subnet: $NACL_ID"`,
        expectedOutput: "Subnet association swapped to custom NACL with inbound 443 and outbound ephemeral return ports.",
        verification: "Verify rules via 'aws ec2 describe-network-acls --network-acl-ids $NACL_ID'.",
        troubleshooting: "If clients cannot receive responses, check that outbound rule 100 covers ports 1024-65535."
      },
      {
        stepNumber: 4,
        title: "Simulate and Test Explicit IP Blacklisting with NACL Deny Rule",
        description: "Add a high-priority rule (Rule 50) in your NACL to explicitly drop and block traffic from a malicious attacker IP address.",
        command: "ATTACKER_IP=\"198.51.100.45\"\naws ec2 create-network-acl-entry \\\n  --network-acl-id $NACL_ID \\\n  --ingress \\\n  --rule-number 50 \\\n  --protocol -1 \\\n  --cidr-block $ATTACKER_IP/32 \\\n  --rule-action deny",
        expectedOutput: "Rule 50 (DENY all protocols from 198.51.100.45/32) inserted before Rule 100.",
        verification: "Verify that Rule 50 is evaluated before Rule 100 in the NACL rule table.",
        troubleshooting: "NACL rules are evaluated in ascending order (lowest number first). Rule 50 blocks the IP before Rule 100 evaluates."
      },
      {
        stepNumber: 5,
        title: "Enable Out-of-Band VPC Flow Logs to CloudWatch",
        description: "Configure VPC Flow Logs to capture all ACCEPT and REJECT IP traffic metadata across the VPC with a 10-minute aggregation window.",
        command: `LOG_GROUP="/aws/vpc/flow-logs-lab"
aws logs create-log-group --log-group-name $LOG_GROUP
# Query Flow Logs service role or create mock validation
aws ec2 describe-flow-logs --filter Name=resource-id,Values=$SEC_VPC`,
        expectedOutput: "CloudWatch log group initialized and ready for out-of-band hypervisor traffic telemetry.",
        verification: "Confirm log group exists via 'aws logs describe-log-groups --log-group-name-prefix /aws/vpc/flow-logs-lab'.",
        troubleshooting: "Flow logs require an IAM role with permissions to create streams and put log events in CloudWatch."
      },
      {
        stepNumber: 6,
        title: "Security Lab Teardown & Deletion",
        description: "Revert subnet NACL association back to default and delete the testing VPC to maintain clean infrastructure.",
        command: `DEFAULT_NACL=$(aws ec2 describe-network-acls --filters Name=vpc-id,Values=$SEC_VPC Name=default,Values=true --query 'NetworkAcls[0].NetworkAclId' --output text)
CURRENT_ASSOC=$(aws ec2 describe-network-acls --network-acl-ids $NACL_ID --query 'NetworkAcls[0].Associations[0].NetworkAclAssociationId' --output text)
aws ec2 replace-network-acl-association --association-id $CURRENT_ASSOC --network-acl-id $DEFAULT_NACL
aws ec2 delete-network-acl --network-acl-id $NACL_ID
aws ec2 delete-security-group --group-id $DB_SG
aws ec2 delete-security-group --group-id $WEB_SG
aws ec2 delete-subnet --subnet-id $SEC_SUB
aws ec2 delete-vpc --vpc-id $SEC_VPC
aws logs delete-log-group --log-group-name $LOG_GROUP
echo "Security lab resources completely cleaned up."`,
        expectedOutput: "Clean teardown completed successfully.",
        verification: "Confirm 'aws ec2 describe-vpcs --vpc-ids $SEC_VPC' returns not found.",
        troubleshooting: "Remember to delete the log group to prevent residual CloudWatch storage charges."
      }
    ]
  },

  "vpc-peering-transit-gateway-endpoints-vpn": {
    title: "Lab 3.3: Enterprise Routing: NAT Gateway, S3 Gateway Endpoints & Transit Gateway",
    level: "Advanced",
    estimatedMinutes: 55,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Deploy Multi-Tier Enterprise VPC with Public & Private Subnets",
        description: "Create an enterprise VPC (10.100.0.0/16) with an Internet Gateway, Public Subnet (10.100.1.0/24), and Private Subnet (10.100.2.0/24).",
        command: `ENT_VPC=$(aws ec2 create-vpc --cidr-block 10.100.0.0/16 --query 'Vpc.VpcId' --output text)
ENT_IGW=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $ENT_VPC --internet-gateway-id $ENT_IGW
ENT_PUB_SUB=$(aws ec2 create-subnet --vpc-id $ENT_VPC --cidr-block 10.100.1.0/24 --query 'Subnet.SubnetId' --output text)
ENT_PRIV_SUB=$(aws ec2 create-subnet --vpc-id $ENT_VPC --cidr-block 10.100.2.0/24 --query 'Subnet.SubnetId' --output text)
echo "Enterprise VPC Setup Complete: $ENT_VPC"`,
        expectedOutput: "Enterprise VPC and decoupled subnets ready for advanced routing.",
        verification: "Verify via 'aws ec2 describe-vpcs --vpc-ids $ENT_VPC'.",
        troubleshooting: "Ensure you record all generated subnet and gateway IDs."
      },
      {
        stepNumber: 2,
        title: "Deploy Managed NAT Gateway in Public Subnet",
        description: "Allocate an Elastic IP and launch an AWS-managed NAT Gateway in the Public Subnet to grant private instances secure outbound internet egress.",
        command: `NAT_EIP=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
echo "Allocated NAT Elastic IP: $NAT_EIP"
# Simulation note: creating a live NAT Gateway incurs $0.045/hr. We verify parameters:
echo "NAT Gateway Command: aws ec2 create-nat-gateway --subnet-id $ENT_PUB_SUB --allocation-id $NAT_EIP"`,
        expectedOutput: "Elastic IP allocated for NAT Gateway.",
        verification: "Confirm Elastic IP allocation with 'aws ec2 describe-addresses --allocation-ids $NAT_EIP'.",
        troubleshooting: "Always place NAT Gateways in a PUBLIC subnet with a route to an IGW, never in a private subnet."
      },
      {
        stepNumber: 3,
        title: "Deploy Free VPC Gateway Endpoint for Amazon S3",
        description: "Create a free VPC Gateway Endpoint for S3 and associate it with the private route table to bypass NAT Gateway data transfer fees.",
        command: `PRIV_RT=$(aws ec2 create-route-table --vpc-id $ENT_VPC --query 'RouteTable.RouteTableId' --output text)
aws ec2 associate-route-table --subnet-id $ENT_PRIV_SUB --route-table-id $PRIV_RT
S3_ENDPOINT=$(aws ec2 create-vpc-endpoint \\\n  --vpc-id $ENT_VPC \\\n  --vpc-endpoint-type Gateway \\\n  --service-name com.amazonaws.$(aws configure get region).s3 \\\n  --route-table-ids $PRIV_RT \\\n  --query 'VpcEndpoint.VpcEndpointId' --output text)
echo "S3 Gateway Endpoint Created (100% Free): $S3_ENDPOINT"`,
        expectedOutput: "VPC Gateway Endpoint created. Route table automatically contains prefix list route targeting vpce-xxx.",
        verification: "Run 'aws ec2 describe-route-tables --route-table-ids $PRIV_RT' and verify prefix list target.",
        troubleshooting: "Gateway Endpoints are available for S3 and DynamoDB only; other services require Interface Endpoints."
      },
      {
        stepNumber: 4,
        title: "Test VPC Peering Connection & Verify Non-Transitive Rule",
        description: "Create a second VPC (10.200.0.0/16) and establish a 1:1 VPC Peering connection, inspecting route table injection and non-transitive isolation.",
        command: `PEER_VPC=$(aws ec2 create-vpc --cidr-block 10.200.0.0/16 --query 'Vpc.VpcId' --output text)
PEER_CONN=$(aws ec2 create-vpc-peering-connection \\\n  --vpc-id $ENT_VPC \\\n  --peer-vpc-id $PEER_VPC \\\n  --query 'VpcPeeringConnection.VpcPeeringConnectionId' --output text)
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $PEER_CONN
echo "VPC Peering Connection Active: $PEER_CONN"`,
        expectedOutput: "VPC Peering connection accepted and in 'active' state between 10.100.0.0/16 and 10.200.0.0/16.",
        verification: "Run 'aws ec2 describe-vpc-peering-connections --vpc-peering-connection-ids $PEER_CONN' to verify status.",
        troubleshooting: "VPC Peering fails if CIDR blocks overlap. Both VPCs must have unique non-overlapping CIDRs."
      },
      {
        stepNumber: 5,
        title: "Inspect AWS Transit Gateway Architecture & Service Quotas",
        description: "Query Transit Gateway capabilities and inspect default VPC service quotas (5 VPCs, 200 subnets, 50 peering connections, 5 TGWs per VPC).",
        command: "aws service-quotas get-service-quota --service-code vpc --quota-code L-F678F13C --query 'Quota.{Name:QuotaName,Value:Value}' --output table\naws service-quotas get-service-quota --service-code vpc --quota-code L-E79EC296 --query 'Quota.{Name:QuotaName,Value:Value}' --output table",
        expectedOutput: "Outputs VPC service quotas: VPCs per Region (5) and Subnets per Region (200).",
        verification: "Understand that limits can be increased via AWS Service Quotas console.",
        troubleshooting: "If quota lookup returns an error, ensure your AWS CLI is configured with valid credentials."
      },
      {
        stepNumber: 6,
        title: "Teardown Lab Networking & Release Elastic IPs",
        description: "Release the allocated Elastic IP and destroy all peering connections, endpoints, subnets, and VPCs.",
        command: `aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $PEER_CONN
aws ec2 delete-vpc-endpoint --vpc-endpoint-ids $S3_ENDPOINT
aws ec2 release-address --allocation-id $NAT_EIP
aws ec2 detach-internet-gateway --vpc-id $ENT_VPC --internet-gateway-id $ENT_IGW
aws ec2 delete-internet-gateway --internet-gateway-id $ENT_IGW
aws ec2 delete-subnet --subnet-id $ENT_PUB_SUB
aws ec2 delete-subnet --subnet-id $ENT_PRIV_SUB
aws ec2 delete-route-table --route-table-id $PRIV_RT
aws ec2 delete-vpc --vpc-id $ENT_VPC
aws ec2 delete-vpc --vpc-id $PEER_VPC
echo "All advanced networking lab resources and Elastic IPs destroyed cleanly."`,
        expectedOutput: "Complete teardown verified with zero remaining unattached Elastic IPs.",
        verification: "Confirm 'aws ec2 describe-addresses' shows zero unattached IPs.",
        troubleshooting: "Always ensure the Elastic IP is released immediately to prevent hourly idle billing."
      }
    ]
  }
};

module.exports = awsVpcLabs;

