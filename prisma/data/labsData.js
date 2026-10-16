module.exports = {
  1: {
    title: "Lab 1: Global Infrastructure Inspection & Latency Probing",
    level: "Beginner",
    estimatedMinutes: 20,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS Free Tier account active, AWS CLI installed locally or using AWS CloudShell.",
    requiredPermissions: "ec2:DescribeRegions, ec2:DescribeAvailabilityZones",
    cleanupGuide: "This lab uses only read-only Describe API calls and local latency probes. No billable cloud resources are provisioned. Zero cleanup required.",
    safeSimulationScript: `#!/bin/bash
# Safe local simulation of AWS Global Infrastructure latency probe
echo "=== AWS Global Infrastructure Latency Simulation ==="
REGIONS=("us-east-1" "eu-west-1" "ap-south-1" "ap-southeast-1")
for reg in "\${REGIONS[@]}"; do
  echo "Probing latency to AWS region $reg endpoint..."
  ping -c 2 dynamodb.$reg.amazonaws.com 2>/dev/null | tail -1 | awk -F '/' '{print "→ Average latency to " "'"$reg"'" ": " $5 " ms"}' || echo "→ Latency to $reg: simulated ~45ms"
done
echo "Inspection complete! All endpoints reachable via AWS Global Network backbone."`,
    steps: [
      {
        stepNumber: 1,
        title: "Discover Active AWS Regions",
        description: "Explore the geographic distribution of AWS by listing all publicly available Regions.",
        consoleInstruction: "Open the AWS Management Console. In the top right navigation bar, click the Region dropdown menu to see all available worldwide regions categorized by North America, Europe, Asia Pacific, etc.",
        cliCommand: "aws ec2 describe-regions --all-regions --query 'Regions[].{Name:RegionName,OptIn:OptInStatus}' --output table",
        expectedOutput: "A formatted ASCII table showing region names like us-east-1, eu-central-1, and their opt-in statuses.",
        verificationTip: "Verify that default regions are marked 'opt-in-not-required' while newer regions may require explicit opt-in.",
        troubleshooting: "If you get 'AuthFailure', verify your AWS CLI configuration by running 'aws configure' or use the in-browser AWS CloudShell."
      },
      {
        stepNumber: 2,
        title: "Query Availability Zones in Your Target Region",
        description: "Inspect the physical Availability Zones available in your default region.",
        consoleInstruction: "Navigate to the EC2 Dashboard -> In the 'Service Health' widget or 'Subnets' page, observe the list of Availability Zones.",
        cliCommand: "aws ec2 describe-availability-zones --region us-east-1 --output json",
        expectedOutput: "JSON response containing ZoneName (us-east-1a, us-east-1b...) and unique ZoneId (use1-az1, use1-az2...).",
        verificationTip: "Note down the ZoneId. ZoneName may differ across accounts, but ZoneId is the true immutable physical data center identifier.",
        troubleshooting: "Ensure you specified a valid region parameter (e.g., --region us-east-1)."
      }
    ]
  },
  2: {
    title: "Lab 2: IAM Least-Privilege Role & Policy Sandbox",
    level: "Beginner",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "IAM permissions to create roles and policies in an AWS account.",
    requiredPermissions: "iam:CreateRole, iam:PutRolePolicy, iam:GetRole, iam:DeleteRole",
    cleanupGuide: "Delete the test IAM role 'LabTestReadOnlyRole' and policy after completing the verification step: aws iam delete-role --role-name LabTestReadOnlyRole.",
    safeSimulationScript: `#!/bin/bash
# Local policy evaluation simulator
echo "=== IAM Policy Evaluation Engine Simulator ==="
PRINCIPAL="arn:aws:iam::123456789012:user/DevUser"
ACTION="s3:GetObject"
RESOURCE="arn:aws:s3:::my-secure-bucket/*"
echo "Evaluating Request: Principal=$PRINCIPAL Action=$ACTION Resource=$RESOURCE"
echo "Step 1: Check Explicit Deny... [None found]"
echo "Step 2: Check Explicit Allow in attached policies... [ALLOW s3:GetObject matches]"
echo "Step 3: Result: ACCESS GRANTED (HTTP 200 OK)"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create a Least-Privilege IAM ReadOnly Role",
        description: "Create an IAM role designed for an EC2 instance that only allows reading S3 buckets.",
        consoleInstruction: "Go to IAM Console -> Roles -> Create Role -> Select AWS Service (EC2) -> Search and attach 'AmazonS3ReadOnlyAccess' -> Name it 'LabTestReadOnlyRole'.",
        cliCommand: `aws iam create-role --role-name LabTestReadOnlyRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'`,
        expectedOutput: "JSON displaying the newly created role ARN and unique RoleId.",
        verificationTip: "Check that the trust relationship specifies 'ec2.amazonaws.com' as the trusted principal.",
        troubleshooting: "If 'EntityAlreadyExists' error occurs, the role already exists from a previous run; proceed to step 2 or pick a unique role name."
      },
      {
        stepNumber: 2,
        title: "Attach S3 Read-Only Managed Policy",
        description: "Grant read-only access to Amazon S3 to the newly created role.",
        consoleInstruction: "Inside the role summary, click 'Add permissions' -> 'Attach policies' -> Select 'AmazonS3ReadOnlyAccess'.",
        cliCommand: "aws iam attach-role-policy --role-name LabTestReadOnlyRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
        expectedOutput: "Command returns 0 exit code with no error output.",
        verificationTip: "Run 'aws iam list-attached-role-policies --role-name LabTestReadOnlyRole' to verify attachment.",
        troubleshooting: "Check that the policy ARN starts with 'arn:aws:iam::aws:policy/'."
      },
      {
        stepNumber: 3,
        title: "Cleanup Test IAM Role",
        description: "Detach policies and remove the test role to keep your account clean.",
        consoleInstruction: "In IAM Console -> Roles -> Select 'LabTestReadOnlyRole' -> Delete.",
        cliCommand: "aws iam detach-role-policy --role-name LabTestReadOnlyRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess && aws iam delete-role --role-name LabTestReadOnlyRole",
        expectedOutput: "Role deleted successfully.",
        verificationTip: "Confirm with 'aws iam get-role --role-name LabTestReadOnlyRole' returning NoSuchEntity.",
        troubleshooting: "Ensure you detach all policies before attempting to delete the role."
      }
    ]
  },
  3: {
    title: "Lab 3: Cost-Safe VPC Subnet & Security Group Architecture",
    level: "Intermediate",
    estimatedMinutes: 30,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: "COST WARNING: Creating a NAT Gateway costs ~$32/month. This lab teaches private/public subnet architecture WITHOUT launching a paid NAT Gateway, using free security groups and internet routing rules instead.",
    prerequisites: "Basic networking knowledge (CIDR blocks, subnets).",
    requiredPermissions: "ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateSecurityGroup, ec2:DeleteVpc",
    cleanupGuide: "Delete the created Security Group, Subnets, and VPC using the cleanup commands provided in Step 4. All resources in this lab are 100% free as long as NAT Gateways are NOT created.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of VPC packet traversal
echo "=== VPC Packet Traversal Simulator ==="
echo "Packet: Inbound HTTP from 203.0.113.5:54321 to Public ALB 10.0.1.10:80"
echo "1. Evaluated at NACL: Inbound Rule 100 ALLOW 0.0.0.0/0 port 80 -> PASS"
echo "2. Evaluated at ALB Security Group: Inbound port 80 ALLOW -> PASS"
echo "3. ALB forwards to Private EC2 10.0.2.25:8080"
echo "4. Return packet from EC2 to client:"
echo "   Security Group is STATEFUL: Outbound automatically ALLOWED without rule!"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create a Custom Learning VPC",
        description: "Create an isolated virtual network with a private IPv4 address block.",
        consoleInstruction: "VPC Dashboard -> Create VPC -> Select 'VPC only' -> Name tag: 'Lab-FreeTier-VPC' -> IPv4 CIDR: '10.0.0.0/16' -> Click Create VPC.",
        cliCommand: "aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=Lab-FreeTier-VPC}]'",
        expectedOutput: "JSON response with VpcId (e.g., vpc-0a1b2c3d4e5f6g7h8).",
        verificationTip: "Copy the VpcId for use in subsequent commands.",
        troubleshooting: "If CIDR overlaps with another VPC, change the block to 10.10.0.0/16."
      },
      {
        stepNumber: 2,
        title: "Create Public and Private Subnets",
        description: "Carve out two /24 subnets for web tier and database tier.",
        consoleInstruction: "VPC Dashboard -> Subnets -> Create Subnet -> Select your VPC -> Create Subnet 1 (10.0.1.0/24 in AZ-a) and Subnet 2 (10.0.2.0/24 in AZ-a).",
        cliCommand: "aws ec2 create-subnet --vpc-id VPC_ID_HERE --cidr-block 10.0.1.0/24 --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Lab-Public-Subnet}]'",
        expectedOutput: "JSON containing SubnetId (e.g., subnet-xxxxxx).",
        verificationTip: "Ensure the subnet CIDR falls strictly within the VPC CIDR 10.0.0.0/16.",
        troubleshooting: "If 'InvalidSubnet.Range' error appears, double-check CIDR calculation."
      },
      {
        stepNumber: 3,
        title: "Build Stateful Security Group with Port Restrictions",
        description: "Configure a security group that allows inbound HTTP port 80 only.",
        consoleInstruction: "EC2 Dashboard -> Security Groups -> Create Security Group -> Name: 'Lab-Web-SG' -> Inbound rules: Add HTTP port 80 from Any (0.0.0.0/0).",
        cliCommand: "aws ec2 create-security-group --group-name Lab-Web-SG --description 'Allow HTTP traffic' --vpc-id VPC_ID_HERE",
        expectedOutput: "Returns GroupId (e.g., sg-xxxxxx).",
        verificationTip: "Authorize inbound rule: aws ec2 authorize-security-group-ingress --group-id SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0.",
        troubleshooting: "Make sure you reference the correct VPC ID created in Step 1."
      },
      {
        stepNumber: 4,
        title: "Clean Up Lab Networking Resources",
        description: "Delete the security group, subnets, and VPC to keep your account clean.",
        consoleInstruction: "Delete Security Group -> Delete Subnets -> Delete VPC from VPC Dashboard.",
        cliCommand: "aws ec2 delete-security-group --group-id SG_ID && aws ec2 delete-subnet --subnet-id SUBNET_ID && aws ec2 delete-vpc --vpc-id VPC_ID",
        expectedOutput: "Resources deleted cleanly with exit code 0.",
        verificationTip: "Confirm 'aws ec2 describe-vpcs' no longer lists Lab-FreeTier-VPC.",
        troubleshooting: "If dependency violation occurs, delete the security group before deleting the VPC."
      }
    ]
  },
  4: {
    title: "Lab 4: Free-Tier EC2 Web Server Bootstrapping with User Data",
    level: "Beginner",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: "Free Tier covers 750 hours/month of t2.micro or t3.micro. Terminate the instance after completing this lab to conserve free-tier hours.",
    prerequisites: "Default VPC available in region, basic shell scripting.",
    requiredPermissions: "ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances",
    cleanupGuide: "Terminate the EC2 instance immediately after viewing the web page to stop compute usage: aws ec2 terminate-instances --instance-ids i-xxxxxx.",
    safeSimulationScript: `#!/bin/bash
# Local EC2 User Data Execution Simulation
echo "=== Simulating EC2 Cloud-Init User Data Bootstrapping ==="
echo "Executing: apt-get update -y && apt-get install -y nginx"
echo "Writing HTML to /var/www/html/index.html..."
echo "<h1>Hello from AWS Free Tier EC2 Simulator!</h1>"
echo "Nginx service started on port 80."
echo "Simulated Curl Test: HTTP/1.1 200 OK (Content-Length: 52)"`,
    steps: [
      {
        stepNumber: 1,
        title: "Launch t2.micro / t3.micro with User Data Script",
        description: "Launch a free-tier eligible instance that automatically installs an Nginx web server on first boot.",
        consoleInstruction: "EC2 Console -> Launch Instances -> Name: 'Lab-WebServer' -> Amazon Linux 2023 or Ubuntu -> Instance type: t2.micro (or t3.micro) -> Under Advanced Details -> User Data, paste the script.",
        cliCommand: `aws ec2 run-instances --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --instance-type t3.micro --user-data '#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from AWS Free Tier EC2!</h1>" > /var/www/html/index.html' --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Lab-WebServer}]'`,
        expectedOutput: "JSON response showing instance ID and State='pending'.",
        verificationTip: "Wait 2 minutes for status checks: aws ec2 describe-instance-status --instance-ids INSTANCE_ID.",
        troubleshooting: "If t3.micro is unavailable in your selected region, switch to t2.micro."
      },
      {
        stepNumber: 2,
        title: "Verify Web Server Response",
        description: "Retrieve public IP address and verify HTTP 200 response.",
        consoleInstruction: "Select the instance -> Copy Public IPv4 address -> Open in browser http://<PUBLIC_IP>.",
        cliCommand: "aws ec2 describe-instances --filters 'Name=tag:Name,Values=Lab-WebServer' 'Name=instance-state-name,Values=running' --query 'Reservations[0].Instances[0].PublicIpAddress' --output text",
        expectedOutput: "Returns a public IPv4 address like 54.210.xx.xx.",
        verificationTip: "Test via curl: curl -m 5 http://<PUBLIC_IP> to view the HTML greeting.",
        troubleshooting: "If connection times out, verify that your Security Group has inbound Port 80 allowed from 0.0.0.0/0."
      },
      {
        stepNumber: 3,
        title: "Terminate Instance to Avoid Charges",
        description: "Shut down and terminate the EC2 instance to ensure zero ongoing billing.",
        consoleInstruction: "EC2 Console -> Select Lab-WebServer -> Instance State -> Terminate Instance.",
        cliCommand: "aws ec2 terminate-instances --instance-ids INSTANCE_ID_HERE",
        expectedOutput: "CurrentState shows 'shutting-down' or 'terminated'.",
        verificationTip: "Check 'aws ec2 describe-instances' to confirm State is terminated.",
        troubleshooting: "Ensure termination protection is disabled if prompt asks."
      }
    ]
  },
  5: {
    title: "Lab 5: Application Load Balancer Target Group Simulation",
    level: "Intermediate",
    estimatedMinutes: 30,
    freeTierEligible: true,
    costRiskLevel: "MEDIUM",
    paidAlternativeWarning: "ALB has a base cost of ~$0.0225/hour (~$16/month). AWS Free Tier gives 750 free hours shared with Classic ELB for 12 months. DELETE the ALB immediately upon completing verification!",
    prerequisites: "At least two public subnets in different Availability Zones.",
    requiredPermissions: "elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:DeleteLoadBalancer",
    cleanupGuide: "Delete the ALB and Target Group right after testing: aws elbv2 delete-load-balancer --load-balancer-arn ALB_ARN.",
    safeSimulationScript: `#!/bin/bash
# Local Load Balancer & Health Check Simulator
echo "=== Round-Robin Load Balancer Simulation ==="
TARGETS=("10.0.1.15:80 (AZ-a)" "10.0.2.20:80 (AZ-b)")
for i in {1..4}; do
  IDX=$(( (i - 1) % 2 ))
  echo "Request #$i routed to target \${TARGETS[$IDX]} -> Health Check 200 OK"
done
echo "All targets healthy. Traffic evenly balanced across Availability Zones."`,
    steps: [
      {
        stepNumber: 1,
        title: "Create an ALB Target Group",
        description: "Define a target group with HTTP health check parameters.",
        consoleInstruction: "EC2 Console -> Target Groups -> Create Target Group -> Target type: Instances -> Protocol: HTTP (Port 80) -> Health check path: / -> Name: 'Lab-Target-Group'.",
        cliCommand: "aws elbv2 create-target-group --name Lab-Target-Group --protocol HTTP --port 80 --vpc-id VPC_ID_HERE --health-check-path / --health-check-interval-seconds 30",
        expectedOutput: "JSON output containing TargetGroupArn.",
        verificationTip: "Note the TargetGroupArn for listener configuration.",
        troubleshooting: "Ensure the VPC ID matches an existing VPC with subnets."
      },
      {
        stepNumber: 2,
        title: "Create Internet-Facing Application Load Balancer",
        description: "Deploy an ALB spanning two Availability Zones.",
        consoleInstruction: "EC2 Console -> Load Balancers -> Create Load Balancer -> ALB -> Select 2 Availability Zones and public subnets.",
        cliCommand: "aws elbv2 create-load-balancer --name Lab-Demo-ALB --subnets SUBNET_1_ID SUBNET_2_ID --security-groups SG_ID --scheme internet-facing --type application",
        expectedOutput: "Returns DNSName (e.g. Lab-Demo-ALB-xxxx.us-east-1.elb.amazonaws.com) and LoadBalancerArn.",
        verificationTip: "ALB state transitions from 'provisioning' to 'active' within 2-3 minutes.",
        troubleshooting: "If 'A load balancer cannot be attached to multiple subnets in the same Availability Zone' appears, choose subnets in different AZs."
      },
      {
        stepNumber: 3,
        title: "Immediate Cleanup of Load Balancer",
        description: "Delete the ALB to prevent ongoing hourly charges.",
        consoleInstruction: "Select Lab-Demo-ALB -> Actions -> Delete. Then delete Lab-Target-Group.",
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn ALB_ARN && aws elbv2 delete-target-group --target-group-arn TG_ARN",
        expectedOutput: "Commands exit with code 0.",
        verificationTip: "Confirm with 'aws elbv2 describe-load-balancers' returning empty.",
        troubleshooting: "Target groups cannot be deleted while registered to an active listener; delete the load balancer first."
      }
    ]
  },
  6: {
    title: "Lab 6: Amazon S3 Lifecycle Rules, Encryption & Bucket Lockdown",
    level: "Beginner",
    estimatedMinutes: 20,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI or Console access.",
    requiredPermissions: "s3:CreateBucket, s3:PutBucketVersioning, s3:PutLifecycleConfiguration, s3:DeleteBucket",
    cleanupGuide: "Empty all objects and delete the bucket: aws s3 rb s3://BUCKET_NAME --force.",
    safeSimulationScript: `#!/bin/bash
# Local S3 Lifecycle Simulation
echo "=== S3 Lifecycle Transition Simulation ==="
echo "Bucket: demo-learning-bucket-2026"
echo "Rule 1: Objects > 30 days old -> Transition to S3 Standard-IA"
echo "Rule 2: Objects > 90 days old -> Transition to S3 Glacier Deep Archive"
echo "Rule 3: Non-current versions > 365 days -> Permanent Expiration"
echo "Result: Automated cost reduction of 92% on cold archived data."`,
    steps: [
      {
        stepNumber: 1,
        title: "Create Globally Unique S3 Bucket with Default KMS Encryption",
        description: "Create an S3 bucket with Block Public Access enabled and AES-256 encryption.",
        consoleInstruction: "S3 Console -> Create Bucket -> Name: 'aws-lab-storage-' + your initials + random number -> Keep 'Block all public access' CHECKED -> Create.",
        cliCommand: "aws s3api create-bucket --bucket aws-lab-storage-$RANDOM --region us-east-1",
        expectedOutput: "Returns Location: /aws-lab-storage-xxxxx.",
        verificationTip: "Verify Block Public Access is active: aws s3api get-public-access-block --bucket BUCKET_NAME.",
        troubleshooting: "If 'BucketAlreadyExists' error occurs, append more random digits to ensure global uniqueness."
      },
      {
        stepNumber: 2,
        title: "Enable S3 Object Versioning",
        description: "Protect against accidental overwrites and deletions.",
        consoleInstruction: "Bucket Properties -> Bucket Versioning -> Edit -> Enable -> Save changes.",
        cliCommand: "aws s3api put-bucket-versioning --bucket BUCKET_NAME --versioning-configuration Status=Enabled",
        expectedOutput: "Status updated to Enabled.",
        verificationTip: "Upload a file twice with different content and run 'aws s3api list-object-versions'.",
        troubleshooting: "Once enabled, versioning cannot be turned off; it can only be suspended."
      },
      {
        stepNumber: 3,
        title: "Clean Up S3 Bucket",
        description: "Delete uploaded objects and remove the bucket.",
        consoleInstruction: "Select bucket -> Empty -> Type 'permanently delete' -> Delete bucket.",
        cliCommand: "aws s3 rb s3://BUCKET_NAME --force",
        expectedOutput: "delete: s3://BUCKET_NAME/object removed, remove_bucket: BUCKET_NAME.",
        verificationTip: "Confirm 'aws s3 ls' no longer displays the bucket.",
        troubleshooting: "Buckets containing versions must be completely emptied before deletion."
      }
    ]
  },
  7: {
    title: "Lab 7: EBS Snapshotting, Encryption & Volume Sizing",
    level: "Intermediate",
    estimatedMinutes: 20,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "EC2 permissions in target region.",
    requiredPermissions: "ec2:CreateVolume, ec2:CreateSnapshot, ec2:DeleteVolume, ec2:DeleteSnapshot",
    cleanupGuide: "Delete the snapshot and volume created in this lab to avoid eating into your 30 GB EBS free-tier allowance.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of EBS snapshot creation and volume resize
echo "=== EBS Snapshot & Resizing Simulator ==="
echo "Creating point-in-time snapshot of 10GB gp3 volume vol-0a1b2c3d..."
echo "Snapshot snap-0123456789 created in S3 (Incremental size: 1.2 GB)"
echo "Restoring snapshot to new 20GB gp3 encrypted volume in us-east-1b..."
echo "Done! Volume resized online with zero filesystem downtime."`,
    steps: [
      {
        stepNumber: 1,
        title: "Create a 1 GB gp3 EBS Volume with Encryption",
        description: "Create an encrypted block storage volume.",
        consoleInstruction: "EC2 Console -> Volumes -> Create Volume -> Type: gp3 -> Size: 1 GiB -> AZ: us-east-1a -> Check 'Encrypt this volume' -> Create.",
        cliCommand: "aws ec2 create-volume --availability-zone us-east-1a --size 1 --volume-type gp3 --encrypted --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=Lab-EBS-Vol}]'",
        expectedOutput: "Returns VolumeId (e.g. vol-xxxxxx) with State='creating'.",
        verificationTip: "Check 'aws ec2 describe-volumes' until State becomes 'available'.",
        troubleshooting: "Free tier allows 30 GB total; keeping test volume at 1 GB is completely safe."
      },
      {
        stepNumber: 2,
        title: "Create a Point-in-Time Snapshot",
        description: "Take an incremental backup snapshot of the volume.",
        consoleInstruction: "Select the volume -> Actions -> Create Snapshot -> Description: 'Lab snapshot test'.",
        cliCommand: "aws ec2 create-snapshot --volume-id VOLUME_ID_HERE --description 'Lab backup test'",
        expectedOutput: "Returns SnapshotId (e.g. snap-xxxxxx) with State='pending'.",
        verificationTip: "Confirm snapshot completion: aws ec2 describe-snapshots --snapshot-ids SNAPSHOT_ID.",
        troubleshooting: "Snapshot of an empty 1GB volume completes in under 15 seconds."
      },
      {
        stepNumber: 3,
        title: "Delete Snapshot and Volume",
        description: "Clean up resources to maintain zero storage footprint.",
        consoleInstruction: "Delete Snapshot first -> then Delete Volume.",
        cliCommand: "aws ec2 delete-snapshot --snapshot-id SNAPSHOT_ID && aws ec2 delete-volume --volume-id VOLUME_ID",
        expectedOutput: "Deleted with exit code 0.",
        verificationTip: "Verify both volume and snapshot are gone.",
        troubleshooting: "You cannot delete a volume while it is attached to an active instance; detach first."
      }
    ]
  },
  8: {
    title: "Lab 8: Amazon DynamoDB Serverless NoSQL Table & Queries",
    level: "Beginner",
    estimatedMinutes: 20,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI or DynamoDB console access.",
    requiredPermissions: "dynamodb:CreateTable, dynamodb:PutItem, dynamodb:GetItem, dynamodb:DeleteTable",
    cleanupGuide: "Delete the table after testing: aws dynamodb delete-table --table-name LabProducts. (Note: DynamoDB has 25GB perpetual free tier).",
    safeSimulationScript: `#!/bin/bash
# Local DynamoDB simulator
echo "=== DynamoDB Sub-10ms Key-Value Simulator ==="
echo "Partition Key: Category='electronics' | Sort Key: ProductId='p-101'"
echo "PutItem: { 'Name': 'Wireless Noise Cancelling Headphones', 'Price': 199.99, 'Stock': 45 }"
echo "Query executed via Hashed Partition Index..."
echo "Latency: 2.8 ms | Consumed Read Units: 0.5 RCU | Result: Found 1 matching item."`,
    steps: [
      {
        stepNumber: 1,
        title: "Create DynamoDB Table in On-Demand / Free-Tier Mode",
        description: "Create a NoSQL table with a Partition Key and Sort Key.",
        consoleInstruction: "DynamoDB Console -> Create table -> Table name: 'LabProducts' -> Partition key: 'Category' (String) -> Sort key: 'ProductId' (String) -> Default settings.",
        cliCommand: "aws dynamodb create-table --table-name LabProducts --attribute-definitions AttributeName=Category,AttributeType=S AttributeName=ProductId,AttributeType=S --key-schema AttributeName=Category,KeyType=HASH AttributeName=ProductId,KeyType=RANGE --billing-mode PAY_PER_REQUEST",
        expectedOutput: "TableStatus shows 'CREATING'.",
        verificationTip: "Wait until TableStatus is 'ACTIVE': aws dynamodb describe-table --table-name LabProducts.",
        troubleshooting: "Ensure key names match exact casing."
      },
      {
        stepNumber: 2,
        title: "Insert and Retrieve NoSQL Items",
        description: "Write a document item and execute a targeted GetItem query.",
        consoleInstruction: "Table -> Explore items -> Create item -> Add Category 'electronics', ProductId 'p-1', Title 'Cloud Laptop'.",
        cliCommand: `aws dynamodb put-item --table-name LabProducts --item '{"Category": {"S": "electronics"}, "ProductId": {"S": "p-1"}, "Price": {"N": "999"}}' && aws dynamodb get-item --table-name LabProducts --key '{"Category": {"S": "electronics"}, "ProductId": {"S": "p-1"}}'`,
        expectedOutput: "Returns Item attributes with Price: 999 and Category: electronics.",
        verificationTip: "Check that the query consumed minimal read units.",
        troubleshooting: "In DynamoDB CLI, attribute types must be explicitly typed (e.g., {'S': 'value'} or {'N': '123'})."
      },
      {
        stepNumber: 3,
        title: "Delete Table",
        description: "Remove the test table.",
        consoleInstruction: "Select LabProducts -> Delete table.",
        cliCommand: "aws dynamodb delete-table --table-name LabProducts",
        expectedOutput: "TableStatus shows 'DELETING'.",
        verificationTip: "Confirm deletion: aws dynamodb list-tables.",
        troubleshooting: "None."
      }
    ]
  },
  9: {
    title: "Lab 9: RDS Single-AZ Free Tier Instance & Failover Simulation",
    level: "Intermediate",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "MEDIUM",
    paidAlternativeWarning: "COST WARNING: Multi-AZ RDS is NOT eligible for AWS Free Tier (it runs 2 DB instances). In this lab, we inspect Single-AZ free tier db.t3.micro/db.t4g.micro and simulate failover logic conceptually.",
    prerequisites: "VPC with database subnet group.",
    requiredPermissions: "rds:CreateDBInstance, rds:DescribeDBInstances, rds:DeleteDBInstance",
    cleanupGuide: "Delete the DB instance with --skip-final-snapshot immediately after verification: aws rds delete-db-instance --db-instance-identifier lab-demo-db --skip-final-snapshot.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of RDS Multi-AZ Failover
echo "=== Simulating RDS Multi-AZ Synchronous Failover ==="
echo "Current Primary DB: db-instance-1 in AZ us-east-1a (Active Read/Write)"
echo "Standby DB: db-instance-1-standby in AZ us-east-1b (Passive)"
echo "[SIMULATION EVENT] Injecting artificial hardware failure in us-east-1a..."
echo "1. RDS Health Monitor detects primary failure (00:15)"
echo "2. Standby DB in us-east-1b promoted to Primary (00:45)"
echo "3. CNAME DNS record for 'mydb.c1234.us-east-1.rds.amazonaws.com' updated to us-east-1b IP (01:10)"
echo "4. Application connection pool reconnects automatically with ZERO data loss!"`,
    steps: [
      {
        stepNumber: 1,
        title: "Understand Free Tier RDS Configuration",
        description: "Identify the exact settings to stay 100% within the 750 monthly free tier hours.",
        consoleInstruction: "RDS Console -> Create database -> Choose 'Free tier' template (this auto-enables Single-AZ, db.t3.micro/db.t4g.micro, 20GB gp2/gp3 storage).",
        cliCommand: "aws rds describe-orderable-db-instance-options --engine mysql --engine-version 8.0 --query 'OrderableDBInstanceOptions[?DBInstanceClass==`db.t3.micro` || DBInstanceClass==`db.t4g.micro`].{Class:DBInstanceClass,MultiAZ:MultiAZ}' --output table | head -n 10",
        expectedOutput: "List of orderable free-tier eligible instance classes.",
        verificationTip: "Confirm MultiAZ=False when selecting the free tier option.",
        troubleshooting: "If db.t3.micro is unavailable, db.t4g.micro is also covered under AWS Free Tier."
      },
      {
        stepNumber: 2,
        title: "Review Failover Architecture vs Read Replicas",
        description: "Compare endpoint architecture: Multi-AZ single DNS CNAME vs Read Replica dedicated reader endpoints.",
        consoleInstruction: "Review RDS documentation on DNS CNAME flipping during failover.",
        cliCommand: "echo 'Multi-AZ: Writes to primary are synchronously mirrored to standby disk. CNAME flips on failover. Read Replicas: Asynchronously replicated for read scaling.'",
        expectedOutput: "Architectural confirmation printed.",
        verificationTip: "Never point write traffic to a read replica.",
        troubleshooting: "None."
      }
    ]
  },
  10: {
    title: "Lab 10: Serverless Lambda Function & API Gateway Trigger",
    level: "Intermediate",
    estimatedMinutes: 20,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI or Lambda console access.",
    requiredPermissions: "lambda:CreateFunction, lambda:Invoke, lambda:DeleteFunction, iam:CreateRole",
    cleanupGuide: "Delete the function and test role: aws lambda delete-function --function-name LabHelloWorld. (Lambda has 1M perpetual free requests/month).",
    safeSimulationScript: `#!/bin/bash
# Local Serverless invocation simulation
echo "=== Local Serverless Function Simulation ==="
cat << 'EOF' > /tmp/lambda_sim.js
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello from Serverless Lambda!", timestamp: new Date().toISOString() })
  };
};
EOF
node -e 'const {handler} = require("/tmp/lambda_sim.js"); handler({}).then(res => console.log("Invocation Output:", res));'
rm -f /tmp/lambda_sim.js`,
    steps: [
      {
        stepNumber: 1,
        title: "Create Serverless Lambda Handler in Node.js",
        description: "Package a lightweight microservice function.",
        consoleInstruction: "Lambda Console -> Create function -> Author from scratch -> Function name: 'LabHelloWorld' -> Runtime: Node.js 20.x -> Create function.",
        cliCommand: `echo 'exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify("Hello from AWS Lambda Free Tier!") }; };' > index.js && zip function.zip index.js`,
        expectedOutput: "function.zip created locally.",
        verificationTip: "Verify zip file contains index.js.",
        troubleshooting: "Ensure zip utility is installed locally."
      },
      {
        stepNumber: 2,
        title: "Test Invocations and Inspect CloudWatch Execution Logs",
        description: "Trigger the Lambda function and view duration and memory usage.",
        consoleInstruction: "In Lambda Console -> Click 'Test' tab -> Configure test event -> Click Test -> View execution summary.",
        cliCommand: "aws lambda invoke --function-name LabHelloWorld output.json && cat output.json",
        expectedOutput: "StatusCode: 200, output.json contains 'Hello from AWS Lambda Free Tier!'.",
        verificationTip: "Inspect REPORT line in CloudWatch: Duration: ~2ms Billed Duration: 2ms Memory Size: 128 MB Max Memory Used: 66 MB.",
        troubleshooting: "If function doesn't exist, create it via console or CLI."
      },
      {
        stepNumber: 3,
        title: "Clean Up Lambda Function",
        description: "Remove the function.",
        consoleInstruction: "Actions -> Delete function.",
        cliCommand: "aws lambda delete-function --function-name LabHelloWorld && rm -f index.js function.zip output.json",
        expectedOutput: "Function deleted.",
        verificationTip: "Confirm with 'aws lambda list-functions'.",
        troubleshooting: "None."
      }
    ]
  },
  11: {
    title: "Lab 11: Container Packaging, Amazon ECR & Fargate Architecture",
    level: "Advanced",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: "COST WARNING: An active EKS cluster costs $0.10/hour (~$73/month). This lab focuses on Amazon ECR and ECS with Fargate, which is free-tier friendly and incurs zero cost for repository creation.",
    prerequisites: "Docker installed locally or simulated.",
    requiredPermissions: "ecr:CreateRepository, ecr:DescribeRepositories, ecr:DeleteRepository",
    cleanupGuide: "Delete the ECR repository: aws ecr delete-repository --repository-name lab-app --force.",
    safeSimulationScript: `#!/bin/bash
# Local Container & ECR Simulator
echo "=== Docker Container & Amazon ECR Registry Simulator ==="
echo "1. Building image: docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/lab-app:v1.0 ."
echo "2. Authenticating Docker client to AWS ECR using temporary token..."
echo "3. Pushing layers to Amazon ECR: sha256:7b2f... PUSHED"
echo "4. Deploying to AWS Fargate: Allocating serverless vCPU=0.25, Memory=0.5GB..."
echo "5. Task ENI allocated in private subnet 10.0.2.14 -> Status: RUNNING"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create an Amazon ECR Private Container Repository",
        description: "Create an image repository with automated vulnerability scanning.",
        consoleInstruction: "ECR Console -> Repositories -> Create repository -> Private -> Name: 'lab-app' -> Enable 'Scan on push' -> Create.",
        cliCommand: "aws ecr create-repository --repository-name lab-app --image-scanning-configuration scanOnPush=true",
        expectedOutput: "Returns repositoryArn and repositoryUri.",
        verificationTip: "Notice the repositoryUri format: <account-id>.dkr.ecr.<region>.amazonaws.com/lab-app.",
        troubleshooting: "Repository names must contain only lowercase letters, numbers, hyphens, and underscores."
      },
      {
        stepNumber: 2,
        title: "Review ECS Task Definition & Fargate Serverless Compute",
        description: "Understand task CPU/memory sizing and IAM task execution roles.",
        consoleInstruction: "Review Task Definition parameters: container image URI, port mappings, and logging.",
        cliCommand: "aws ecr describe-repositories --repository-names lab-app",
        expectedOutput: "Shows repository details and scanOnPush=true.",
        verificationTip: "Scan on push automatically flags CVEs upon image upload.",
        troubleshooting: "None."
      },
      {
        stepNumber: 3,
        title: "Delete ECR Repository",
        description: "Clean up ECR repository.",
        consoleInstruction: "Select lab-app -> Delete.",
        cliCommand: "aws ecr delete-repository --repository-name lab-app --force",
        expectedOutput: "Repository deleted.",
        verificationTip: "Confirm 'aws ecr describe-repositories' returns RepositoryNotFoundException.",
        troubleshooting: "Use --force flag if repository contains pushed images."
      }
    ]
  },
  12: {
    title: "Lab 12: CloudWatch Metric Alarms & CloudTrail Audit Tracking",
    level: "Intermediate",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI or CloudWatch Console access.",
    requiredPermissions: "cloudwatch:PutMetricAlarm, cloudwatch:DescribeAlarms, cloudwatch:DeleteAlarms, cloudtrail:LookupEvents",
    cleanupGuide: "Delete test alarm: aws cloudwatch delete-alarms --alarm-names Lab-High-CPU-Alarm.",
    safeSimulationScript: `#!/bin/bash
# Local CloudWatch Alarm & CloudTrail Audit Simulation
echo "=== CloudWatch Metric & Alarm Simulator ==="
echo "Metric: EC2 CPUUtilization >= 80% for 2 consecutive periods (300 seconds)"
echo "Current CPU Data Points: [62%, 78%, 84%, 89%]"
echo "Evaluation: 2 consecutive breaches detected!"
echo "State Change: OK -> ALARM"
echo "Action Triggered: Publishing notification to SNS topic 'arn:aws:sns:us-east-1:123:ops-alerts'"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create a CloudWatch Metric Alarm for High CPU",
        description: "Configure an automated alarm that checks if CPU utilization exceeds 80%.",
        consoleInstruction: "CloudWatch Console -> Alarms -> Create Alarm -> Select Metric -> EC2 -> Per-Instance -> CPUUtilization -> Threshold: >= 80 -> Period: 5 minutes.",
        cliCommand: "aws cloudwatch put-metric-alarm --alarm-name Lab-High-CPU-Alarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold --evaluation-periods 2",
        expectedOutput: "Alarm created with return code 0.",
        verificationTip: "Run 'aws cloudwatch describe-alarms --alarm-names Lab-High-CPU-Alarm' to verify state is INSUFFICIENT_DATA or OK.",
        troubleshooting: "Ensure comparison-operator syntax matches exact AWS API enum."
      },
      {
        stepNumber: 2,
        title: "Query CloudTrail Event History",
        description: "Audit recent management API activities in your account.",
        consoleInstruction: "CloudTrail Console -> Event history -> Filter by Event Name (e.g. CreateSecurityGroup or RunInstances).",
        cliCommand: "aws cloudtrail lookup-events --max-results 5 --query 'Events[].{Event:EventName,User:Username,Time:EventTime}' --output table",
        expectedOutput: "Formatted table showing recent API calls and caller usernames.",
        verificationTip: "CloudTrail records events within approximately 15 minutes of occurrence.",
        troubleshooting: "CloudTrail lookup-events covers the past 90 days of management events for free."
      },
      {
        stepNumber: 3,
        title: "Delete Test CloudWatch Alarm",
        description: "Remove test alarm.",
        consoleInstruction: "Select Lab-High-CPU-Alarm -> Actions -> Delete.",
        cliCommand: "aws cloudwatch delete-alarms --alarm-names Lab-High-CPU-Alarm",
        expectedOutput: "Alarm deleted.",
        verificationTip: "Verify alarm list is clean.",
        troubleshooting: "None."
      }
    ]
  },
  13: {
    title: "Lab 13: Secrets Manager Rotation & WAF Rule Enforcement",
    level: "Advanced",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: "Secrets Manager costs $0.40/secret/month after 30-day free trial. Delete test secrets immediately after testing.",
    prerequisites: "AWS CLI or Secrets Manager console access.",
    requiredPermissions: "secretsmanager:CreateSecret, secretsmanager:GetSecretValue, secretsmanager:DeleteSecret",
    cleanupGuide: "Delete test secret with immediate recovery suppression: aws secretsmanager delete-secret --secret-id LabAppDbSecret --force-delete-without-recovery.",
    safeSimulationScript: `#!/bin/bash
# Local Secrets Manager & AWS WAF Simulator
echo "=== Secrets Manager & AWS WAF Simulator ==="
echo "[WAF EDGE TEST] Sending simulated HTTP request with SQL Injection: 'OR 1=1'..."
echo "AWS WAF Rule 'AWSManagedRulesSQLiRuleSet' triggered -> ACTION: BLOCK (HTTP 403 Forbidden)"
echo "[SECRETS TEST] Fetching database credentials via AWS SDK (zero hardcoded passwords):"
echo "{ username: 'db_admin', password: '***AUTO_ROTATED_32_CHAR_SECRET***' }"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create an Encrypted Secret in AWS Secrets Manager",
        description: "Store database credentials encrypted with AWS KMS.",
        consoleInstruction: "Secrets Manager Console -> Store a new secret -> Other type of secret -> Key/value: 'username'='admin', 'password'='SuperSecretPass123!' -> Name: 'LabAppDbSecret'.",
        cliCommand: `aws secretsmanager create-secret --name LabAppDbSecret --description 'Test DB credentials' --secret-string '{"username":"admin","password":"SuperSecretPassword123!"}'`,
        expectedOutput: "Returns ARN and VersionId of the created secret.",
        verificationTip: "Retrieve the decrypted secret value: aws secretsmanager get-secret-value --secret-id LabAppDbSecret.",
        troubleshooting: "Secret names must be unique within an account."
      },
      {
        stepNumber: 2,
        title: "Clean Up Secret Without 30-Day Recovery Delay",
        description: "Force delete the secret immediately so no monthly charges occur.",
        consoleInstruction: "Select secret -> Actions -> Delete secret -> Check 'Delete without recovery'.",
        cliCommand: "aws secretsmanager delete-secret --secret-id LabAppDbSecret --force-delete-without-recovery",
        expectedOutput: "DeletionDate timestamp returned.",
        verificationTip: "Verify 'aws secretsmanager describe-secret --secret-id LabAppDbSecret' returns ResourceNotFoundException.",
        troubleshooting: "By default, Secrets Manager schedules deletion for 30 days; the --force-delete-without-recovery flag purges it instantly."
      }
    ]
  },
  14: {
    title: "Lab 14: Infrastructure as Code with CloudFormation / Terraform",
    level: "Advanced",
    estimatedMinutes: 25,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI installed, text editor.",
    requiredPermissions: "cloudformation:CreateStack, cloudformation:DescribeStacks, cloudformation:DeleteStack",
    cleanupGuide: "Delete the CloudFormation stack: aws cloudformation delete-stack --stack-name LabS3Stack.",
    safeSimulationScript: `#!/bin/bash
# Local CloudFormation / Terraform validation simulation
echo "=== Infrastructure as Code Linter & Simulator ==="
cat << 'EOF' > /tmp/demo_stack.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Free Tier S3 Bucket Stack
Resources:
  MySecureBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
EOF
echo "Validating CloudFormation template syntax..."
aws cloudformation validate-template --template-body file:///tmp/demo_stack.yaml 2>/dev/null || echo "Template syntax: VALID (AWS::S3::Bucket with AES256 encryption & BlockPublicAccess)"
rm -f /tmp/demo_stack.yaml`,
    steps: [
      {
        stepNumber: 1,
        title: "Write Declarative CloudFormation YAML Template",
        description: "Define a secure S3 bucket and tags as code.",
        consoleInstruction: "Prepare YAML template file locally.",
        cliCommand: `cat << 'EOF' > template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  DemoBucket:
    Type: AWS::S3::Bucket
    Properties:
      Tags:
        - Key: Environment
          Value: LearningLab
EOF`,
        expectedOutput: "template.yaml written to disk.",
        verificationTip: "Validate template: aws cloudformation validate-template --template-body file://template.yaml.",
        troubleshooting: "Ensure indentation in YAML uses 2 spaces, not tabs."
      },
      {
        stepNumber: 2,
        title: "Deploy Stack and Observe Resource Provisioning",
        description: "Deploy the stack and watch events in real time.",
        consoleInstruction: "CloudFormation Console -> Create stack -> Upload template file -> Stack name: 'LabS3Stack' -> Submit.",
        cliCommand: "aws cloudformation create-stack --stack-name LabS3Stack --template-body file://template.yaml",
        expectedOutput: "StackId returned.",
        verificationTip: "Wait for CREATE_COMPLETE: aws cloudformation describe-stacks --stack-name LabS3Stack --query 'Stacks[0].StackStatus'.",
        troubleshooting: "If ROLLBACK_COMPLETE occurs, inspect stack events to see which resource failed."
      },
      {
        stepNumber: 3,
        title: "Tear Down Infrastructure via Single Command",
        description: "Delete the entire stack and all its provisioned resources automatically.",
        consoleInstruction: "Select LabS3Stack -> Delete.",
        cliCommand: "aws cloudformation delete-stack --stack-name LabS3Stack && rm -f template.yaml",
        expectedOutput: "Stack deletion initiated.",
        verificationTip: "Confirm 'aws cloudformation describe-stacks --stack-name LabS3Stack' returns StackDoesNotExist.",
        troubleshooting: "If the bucket contains objects, empty them first or add DeletionPolicy: Retain."
      }
    ]
  },
  15: {
    title: "Lab 15: Production Well-Architected Review & Cost Audit",
    level: "Advanced",
    estimatedMinutes: 30,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "AWS CLI or Cost Management console.",
    requiredPermissions: "ce:GetCostAndUsage, budgets:ViewBudget",
    cleanupGuide: "This audit lab is 100% read-only and inspects account posture and budgets. Zero cleanup needed.",
    safeSimulationScript: `#!/bin/bash
# Local Well-Architected & Cost Anomaly Simulator
echo "=== AWS Well-Architected Framework Audit Simulator ==="
echo "Pillar 1: Security -> Root MFA: ENABLED | Unencrypted EBS: 0 | Open Security Groups: 0"
echo "Pillar 2: Reliability -> Multi-AZ Compute: ACTIVE | Auto Scaling: CONFIGURED"
echo "Pillar 3: Cost Optimization -> Idle Elastic IPs: 0 | Unattached EBS: 0"
echo "Budget Status: Monthly Forecast = $0.00 / $5.00 Budget Limit (OK)"
echo "Overall Well-Architected Score: 96 / 100"`,
    steps: [
      {
        stepNumber: 1,
        title: "Audit Active Resources to Detect Forgotten Billable Items",
        description: "Run automated checks for unattached EBS volumes, idle Elastic IPs, and orphan snapshots.",
        consoleInstruction: "Check EC2 Console -> Elastic IPs (ensure 0 idle) -> Volumes (ensure 0 available unattached) -> Snapshots.",
        cliCommand: `aws ec2 describe-addresses --query 'Addresses[?InstanceId==null].{IP:PublicIp,AllocationId:AllocationId}' --output table`,
        expectedOutput: "Empty table (meaning NO unattached Elastic IPs generating idle fees!).",
        verificationTip: "If any Elastic IP is listed without an InstanceId, release it immediately using 'aws ec2 release-address --allocation-id ID'.",
        troubleshooting: "Remember that AWS charges ~$0.005/hr for unattached public IPv4 addresses."
      },
      {
        stepNumber: 2,
        title: "Configure Free-Tier Budget Alert with Email Notification",
        description: "Set up an AWS Budget alerting you when spend exceeds $1.00.",
        consoleInstruction: "Billing Console -> Budgets -> Create budget -> Zero spend budget or Monthly cost budget -> Set threshold at $1.00 -> Enter email.",
        cliCommand: "echo 'Configure AWS Budget with alert threshold at 80% ($0.80) and 100% ($1.00) of your Free Tier safety limit.'",
        expectedOutput: "Budget alert configuration documented.",
        verificationTip: "Always test receiving the SNS budget email.",
        troubleshooting: "None."
      }
    ]
  }
};
