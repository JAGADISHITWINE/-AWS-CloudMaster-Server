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
  },
  16: {
    title: "Lab 16: Complete Git Local Repository Lifecycle & Atlassian Cheat Sheet Command Mastery",
    level: "Beginner",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "A local terminal (Linux Ubuntu, macOS, or Git Bash on Windows).",
    requiredPermissions: "Standard local user terminal permissions (no cloud credentials or AWS billing required).",
    cleanupGuide: "All files and repositories created during this lab are strictly local to your machine. To clean up completely, simply delete the 'git-mastery-lab' directory: rm -rf git-mastery-lab. Zero cloud cost.",
    safeSimulationScript: `#!/bin/bash
# Comprehensive local simulation of the Git Local Repository Lifecycle & Cheat Sheet
echo "=== Git Local Repository & Cheat Sheet Simulator ==="
mkdir -p /tmp/git-mastery-sim && cd /tmp/git-mastery-sim
echo "[1/8] Verifying Git installation: $(git --version)"
git config user.name "Cloud Engineer"
git config user.email "engineer@cloudmaster.io"
git config alias.glog "log --graph --oneline"
echo "[2/8] Initializing local repository..."
git init
echo "[3/8] Simulating Working Directory -> Staging Area with git add..."
echo "<h1>Cloud Platform v1.0</h1>" > index.html
git status -s
git add index.html
echo "[4/8] Demonstrating safe unstaging with git rm --cached..."
git rm --cached index.html
ls -la index.html # Confirmed: file remains safe on disk!
git add index.html
echo "[5/8] Creating permanent commit snapshot..."
git commit -m "feat: initial landing page"
echo "[6/8] Demonstrating git diff HEAD & git diff --cached..."
echo "<p>Enterprise Microservices</p>" >> index.html
git diff index.html
git add index.html
git diff --cached
git commit -m "feat: add enterprise description"
echo "[7/8] Demonstrating git log --graph --decorate --oneline..."
git log --graph --decorate --oneline -n 5
echo "[8/8] Demonstrating safe dry run git clean -n before force clean..."
touch test.log temp.tmp
git clean -n
git clean -f
echo "=== Verification SUCCESS: All Three Sections and Cheat Sheet Commands Operational ==="
cd / && rm -rf /tmp/git-mastery-sim`,
    steps: [
      {
        stepNumber: 1,
        title: "Verify Git Installation on Ubuntu/Linux & Windows",
        description: "Ensure Git is installed on your workstation and verify the installed version against recent releases.",
        consoleInstruction: "Open your terminal or Git Bash. On Ubuntu, refresh package indexes before installing.",
        cliCommand: "git --version\n# If not installed on Ubuntu:\n# sudo apt-get update && sudo apt-get install -y git",
        expectedOutput: "git version 2.43.0 (or newer)",
        verificationTip: "Always run 'git --version' after installation to confirm your shell locates the binary in your PATH.",
        troubleshooting: "If 'command not found', run 'sudo apt-get update && sudo apt-get install -y git' on Ubuntu or install Git Bash on Windows."
      },
      {
        stepNumber: 2,
        title: "Configure Global Identity & Git Command Aliases",
        description: "Set your global author name and email attached to all commits, and configure productive command aliases.",
        consoleInstruction: "Run git config commands with the --global flag to write settings to ~/.gitconfig.",
        cliCommand: "git config --global user.name \"Cloud Engineer\"\ngit config --global user.email \"engineer@cloudmaster.io\"\ngit config --global alias.glog \"log --graph --oneline\"\ngit config --global --list",
        expectedOutput: "user.name=Cloud Engineer\nuser.email=engineer@cloudmaster.io\nalias.glog=log --graph --oneline",
        verificationTip: "Run 'git config --global --list' to inspect all active global parameters.",
        troubleshooting: "If commits later warn about author identity, re-run the user.name and user.email commands with quotes."
      },
      {
        stepNumber: 3,
        title: "Initialize Repository & Inspect .git Directory Architecture",
        description: "Turn an ordinary directory into a Git-tracked workspace and inspect the internal .git folder structure.",
        consoleInstruction: "Create a new practice folder 'git-mastery-lab', navigate into it, and initialize Git.",
        cliCommand: "mkdir -p ~/git-mastery-lab && cd ~/git-mastery-lab\ngit init\nls -la .git",
        expectedOutput: "Initialized empty Git repository in /home/.../git-mastery-lab/.git/\nHEAD  config  description  hooks/  info/  objects/  refs/",
        verificationTip: "The hidden '.git' folder contains all configuration, object databases, and refs. Never delete this folder.",
        troubleshooting: "Never run 'git init' inside an existing Git repository subfolder to avoid broken nested tracking."
      },
      {
        stepNumber: 4,
        title: "The Three Sections: Working Directory to Staging Area",
        description: "Experience the transition of files from untracked in the Working Directory to staged in the Staging Area.",
        consoleInstruction: "Create an application file. Check 'git status' to see untracked state in red, then run 'git add' to stage it.",
        cliCommand: "echo '<h1>AWS & DevOps Mastery Platform</h1>' > index.html\ngit status\ngit add index.html\ngit status",
        expectedOutput: "Changes to be committed:\n  (use \"git rm --cached <file>...\" to unstage)\n\tnew file:   index.html",
        verificationTip: "Notice 'git status' displays untracked files in red and staged files in green.",
        troubleshooting: "Prefer 'git add <file>' over blind 'git add .' to ensure you only stage files intentionally."
      },
      {
        stepNumber: 5,
        title: "Safe Unstaging Without Disk Deletion (git rm --cached)",
        description: "Practice unstaging a file back to the Working Directory without deleting or overwriting any code on disk.",
        consoleInstruction: "Run 'git rm --cached index.html'. Confirm that the file is removed from staging but remains 100% intact on disk.",
        cliCommand: "git rm --cached index.html\ngit status\ncat index.html\n# Now re-stage it for commit:\ngit add index.html",
        expectedOutput: "rm 'index.html'\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tindex.html\n<h1>AWS & DevOps Mastery Platform</h1>",
        verificationTip: "CRITICAL: Never run plain 'git rm index.html' without '--cached', as plain 'git rm' deletes the physical file from disk!",
        troubleshooting: "'git reset index.html' or 'git restore --staged index.html' achieve the exact same safe unstaging result."
      },
      {
        stepNumber: 6,
        title: "Create Permanent Snapshot (git commit) & Amend Message",
        description: "Permanently record staged files into the Local Repository DAG and edit the commit using --amend.",
        consoleInstruction: "Commit staged files with a clear conventional message, view it with 'git log', and practice 'git commit --amend'.",
        cliCommand: "git commit -m \"feat: create initial application landing page\"\ngit log --oneline\ngit commit --amend -m \"feat(web): create initial application landing page structure\"",
        expectedOutput: "[main (root-commit) 4a9bc12] feat(web): create initial application landing page structure\n 1 file changed, 1 insertion(+)",
        verificationTip: "Run 'git log --oneline' to confirm the commit hash and updated message.",
        troubleshooting: "Never amend commits that have already been pushed to a shared public remote branch."
      },
      {
        stepNumber: 7,
        title: "Inspect Diffs (HEAD vs Cached) & Visualize Commit Graphs",
        description: "Modify your code to practice diffing unstaged changes vs staged changes vs the last commit.",
        consoleInstruction: "Append new lines to index.html. Compare 'git diff' (unstaged) against 'git diff HEAD' and 'git diff --cached'.",
        cliCommand: "echo '<p>Production Kubernetes & Terraform</p>' >> index.html\ngit diff\ngit diff HEAD\ngit add index.html\ngit diff --cached\ngit commit -m \"feat(web): add microservices description\"\ngit glog",
        expectedOutput: "+<p>Production Kubernetes & Terraform</p>\n* 7c3d2e1 (HEAD -> main) feat(web): add microservices description\n* 4a9bc12 feat(web): create initial application landing page structure",
        verificationTip: "Use your custom alias 'git glog' or 'git log --graph --decorate --oneline' for clear visual history.",
        troubleshooting: "Remember: 'git diff' shows unstaged edits, while 'git diff --cached' shows what is queued in staging."
      },
      {
        stepNumber: 8,
        title: "Workspace Hygiene: Dry-Run Preview (git clean -n) & Cleanup",
        description: "Clean up untracked temporary files and build artifacts safely using dry-run preview before force execution.",
        consoleInstruction: "Create temporary test files. Run 'git clean -n' to preview what would be deleted, then execute with '-f'.",
        cliCommand: "touch temp_debug.log test_artifact.tmp\ngit status -s\ngit clean -n\ngit clean -f\ngit status",
        expectedOutput: "Would remove temp_debug.log\nWould remove test_artifact.tmp\nRemoving temp_debug.log\nRemoving test_artifact.tmp\nnothing to commit, working tree clean",
        verificationTip: "ALWAYS run 'git clean -n' (dry run) before 'git clean -f' to guarantee you do not delete legitimate uncommitted files.",
        troubleshooting: "Add '-d' flag ('git clean -nd') if you need to preview and clean untracked directories as well."
      }
    ]
  },
  'git-command-suite-cheat-sheet-mastery': {
    title: "Lab 16B: Production Incident Response & Git Disaster Recovery Masterclass",
    level: "Intermediate",
    estimatedMinutes: 40,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Basic Git terminal proficiency (completion of Lab 16A).",
    requiredPermissions: "Local terminal environment (Linux Ubuntu, macOS, or Git Bash).",
    cleanupGuide: "All drills are contained inside a local temporary folder. To clean up completely, delete the practice folder: rm -rf ~/git-incident-lab.",
    safeSimulationScript: `#!/bin/bash
# Production Git Disaster Recovery & Incident Response Simulator
echo "=== Git Production Incident Response & Disaster Recovery Simulator ==="
DIR="/tmp/git-incident-sim"
rm -rf "$DIR" && mkdir -p "$DIR" && cd "$DIR"
git init
git config user.name "SRE Lead"
git config user.email "sre@cloudmaster.io"

echo "--- Drill 1: Simulating Accidental 'git reset --hard' & Reflog Recovery ---"
echo "v1" > app.js && git add app.js && git commit -m "feat: core v1"
echo "v2" >> app.js && git add app.js && git commit -m "feat: core v2"
echo "v3" >> app.js && git add app.js && git commit -m "feat: core v3 (CRITICAL WORK)"
LOST_SHA=$(git rev-parse HEAD)
echo "Executing accidental hard reset: git reset --hard HEAD~2..."
git reset --hard HEAD~2
echo "Current HEAD is now at: $(git rev-parse --short HEAD) - Work appears lost!"
echo "Recovering via reflog: checking out lost commit $LOST_SHA..."
git checkout -b recovery-branch "$LOST_SHA"
echo "SUCCESS: 100% of lost work restored on recovery-branch! File content:"
cat app.js

echo "--- Drill 2: Simulating Automated 'git bisect' Regression Hunting ---"
cd "$DIR"
cat << 'EOF' > test_payment.sh
#!/bin/bash
grep -q "BROKEN_PAYMENT" app.js && exit 1 || exit 0
EOF
chmod +x test_payment.sh
echo "v4 - stable" >> app.js && git commit -am "feat: stable v4"
GOOD_SHA=$(git rev-parse HEAD)
echo "v5 - BROKEN_PAYMENT" >> app.js && git commit -am "feat: faulty payment serialization"
BAD_SHA=$(git rev-parse HEAD)
echo "v6 - downstream" >> app.js && git commit -am "feat: downstream analytics"
echo "Starting automated bisect with test_payment.sh..."
git bisect start "$BAD_SHA" "$GOOD_SHA"
git bisect run ./test_payment.sh
echo "Bisect identified first bad commit successfully!"
git bisect reset

echo "--- Drill 3: Simulating Surgical Cherry-Pick with -x Traceability ---"
git checkout -b hotfix-target HEAD~2
git cherry-pick -x "$BAD_SHA"~1 # Cherry pick previous stable commit
git log -n 1 --pretty=format:"%h - %s (%b)"
echo ""
echo "=== All Incident Recovery Simulations PASSED with Zero Data Loss ==="
cd / && rm -rf "$DIR"`,
    steps: [
      {
        stepNumber: 1,
        title: "Disaster Recovery: Restore Lost Commits after 'git reset --hard' via Reflog",
        description: "Simulate an accidental hard reset that dropped unpushed commits, and use the reflog to resurrect 100% of the lost work.",
        consoleInstruction: "Create a drill repo. Commit 3 milestones, execute an accidental 'git reset --hard HEAD~2', and inspect the reflog.",
        cliCommand: "mkdir -p ~/git-incident-lab && cd ~/git-incident-lab && git init\necho 'feature 1' > app.js && git add . && git commit -m 'feat: step 1'\necho 'feature 2' >> app.js && git commit -am 'feat: step 2'\necho 'feature 3' >> app.js && git commit -am 'feat: step 3 (CRITICAL)'\ngit reset --hard HEAD~2\ngit reflog\ngit checkout -b recovery-branch HEAD@{1}",
        expectedOutput: "HEAD is now at ... feat: step 1\nHEAD@{0}: reset: moving to HEAD~2\nHEAD@{1}: commit: feat: step 3 (CRITICAL)\nSwitched to a new branch 'recovery-branch'",
        verificationTip: "Run 'cat app.js' to confirm all 3 features are fully restored on 'recovery-branch'.",
        troubleshooting: "If HEAD index differs in your terminal, check the reflog output line showing 'commit: feat: step 3'."
      },
      {
        stepNumber: 2,
        title: "Surgical Release Management: Git Cherry-Pick with Traceability (-x)",
        description: "Extract an isolated hotfix commit from an unmerged experimental branch into a stable production branch without pulling in unreviewed code.",
        consoleInstruction: "Switch to a production branch. Use 'git cherry-pick -x <commit-sha>' to apply only the isolated bugfix.",
        cliCommand: "git checkout -b v2.0-stable main\ngit log --oneline recovery-branch\n# Extract the specific commit SHA with -x provenance tracking:\ngit cherry-pick -x recovery-branch\ngit log -n 1",
        expectedOutput: "[v2.0-stable ...] feat: step 2\n(cherry picked from commit ...)",
        verificationTip: "The '-x' flag automatically appends the source commit hash for audit and traceability compliance.",
        troubleshooting: "If merge conflicts appear during cherry-pick, resolve them in app.js, stage with 'git add app.js', and run 'git cherry-pick --continue'."
      },
      {
        stepNumber: 3,
        title: "Automated Bug Hunting: Binary Search via 'git bisect run'",
        description: "Write an automated test assertion script and let Git execute binary search across history to locate a regression commit in seconds.",
        consoleInstruction: "Create a test script that validates code. Start bisect and run 'git bisect run ./test.sh'.",
        cliCommand: "cat << 'EOF' > test_assertion.sh\n#!/bin/bash\n# Fails (exit 1) if step 3 exists, passes (exit 0) otherwise:\ngrep -q 'step 3' app.js && exit 1 || exit 0\nEOF\nchmod +x test_assertion.sh\ngit checkout recovery-branch\ngit bisect start HEAD v2.0-stable\ngit bisect run ./test_assertion.sh\ngit bisect reset",
        expectedOutput: "... is the first bad commit\ncommit ...\nAuthor: ...\n    feat: step 3 (CRITICAL)\nBisect run success.",
        verificationTip: "Notice how Git tests the middle commit automatically and halving the search space on each run.",
        troubleshooting: "Always ensure the test script is executable ('chmod +x test_assertion.sh') and returns standard 0 on pass and 1 on fail."
      },
      {
        stepNumber: 4,
        title: "Triage & Resolve 3-Way Merge Conflicts with Conflict Markers",
        description: "Simulate competing edits from two engineering squads on the same configuration lines and resolve conflict markers cleanly.",
        consoleInstruction: "Create conflicting edits on two branches, trigger a merge conflict, and inspect conflict markers (<<<<<<< HEAD, =======, >>>>>>>).",
        cliCommand: "git checkout -b squad-alpha recovery-branch\necho 'PORT=8080' > config.env && git add . && git commit -m 'config: port 8080'\ngit checkout -b squad-beta recovery-branch\necho 'PORT=9090' > config.env && git add . && git commit -m 'config: port 9090'\ngit merge squad-alpha",
        expectedOutput: "CONFLICT (content): Merge conflict in config.env\nAutomatic merge failed; fix conflicts and then commit the result.",
        verificationTip: "Open config.env. Notice '<<<<<<< HEAD' has 9090 and '>>>>>>> squad-alpha' has 8080. Edit to choose the agreed port.",
        troubleshooting: "After editing and removing conflict markers, run 'git add config.env' and 'git commit' to complete the 3-way merge."
      },
      {
        stepNumber: 5,
        title: "Overcoming Push Rejections: Interactive Rebase to Excise Large Blobs",
        description: "Simulate accidental commitment of an unwanted large file, and rewrite history using interactive rebase to remove it before pushing.",
        consoleInstruction: "Commit a temporary dummy blob. Use 'git rebase -i' with the edit command to delete the file from history.",
        cliCommand: "echo 'LARGE DATA PAYLOAD' > dummy_large.iso\ngit add dummy_large.iso && git commit -m 'temp: accidental large file commit'\necho 'legitimate feature' >> app.js && git commit -am 'feat: legitimate work'\ngit log --oneline -2\n# Rebase to remove the dummy file:\ngit rebase -i HEAD~2",
        expectedOutput: "[detached HEAD ...] feat: legitimate work\nSuccessfully rebased and updated refs/heads/squad-beta.",
        verificationTip: "In the rebase editor, change 'pick' to 'edit' next to the large file commit, run 'git rm dummy_large.iso && git commit --amend', then 'git rebase --continue'.",
        troubleshooting: "Always add large file extensions (*.iso, *.tar.gz, *.mp4) to .gitignore to prevent accidental staging."
      },
      {
        stepNumber: 6,
        title: "Clean Remote Synchronization: Rebase Pull vs Force Pushing Safety",
        description: "Practice updating feature branches using 'git pull --rebase' to preserve linear commit history and understand --force-with-lease.",
        consoleInstruction: "Inspect the commit DAG with 'git log --graph --oneline'. Practice rebase integration instead of generating merge bubbles.",
        cliCommand: "git checkout -b feature/clean-sync\necho 'update' >> app.js && git commit -am 'feat: linear local commit'\n# Rebase local commits cleanly on top of target branch:\ngit rebase v2.0-stable\ngit log --graph --decorate --oneline -5",
        expectedOutput: "* ... (HEAD -> feature/clean-sync) feat: linear local commit\n* ... (v2.0-stable) feat: step 2\n* ... feat: step 1",
        verificationTip: "Notice the commit history is a straight line with zero chaotic merge bubbles.",
        troubleshooting: "When pushing a rebased branch to remote, always use '--force-with-lease' rather than plain '--force' to avoid clobbering teammates' work."
      }
    ]
  },
  'git-fundamentals-branching-merge-strategies': {
    title: "Lab 16.1: Git Architecture, Three-Section Local Repository & Version Control Foundations",
    level: "Beginner",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "A local terminal (Linux Ubuntu, macOS, or Git Bash on Windows).",
    requiredPermissions: "Standard workstation terminal permissions (no cloud credentials or AWS billing required).",
    cleanupGuide: "All files and repositories created during this lab are strictly local to your machine. To clean up completely: rm -rf ~/git-mastery-lab.",
    safeSimulationScript: `#!/bin/bash
# Comprehensive local simulation of the Git Local Repository Lifecycle & Foundations
echo "=== Git Local Repository & Foundations Simulator ==="
mkdir -p /tmp/git-vcs-sim && cd /tmp/git-vcs-sim
echo "[1/7] Verifying Git installation: $(git --version)"
git config user.name "Cloud Engineer"
git config user.email "engineer@cloudmaster.io"
git config alias.glog "log --graph --oneline"
echo "[2/7] Initializing local repository..."
git init
echo "[3/7] Simulating Working Directory -> Staging Area with git add..."
echo "<h1>Cloud Platform v1.0</h1>" > index.html
git status -s
git add index.html
echo "[4/7] Demonstrating safe unstaging with git rm --cached..."
git rm --cached index.html
ls -la index.html # Confirmed: file remains safe on disk!
git add index.html
echo "[5/7] Creating permanent commit snapshot..."
git commit -m "feat: initial landing page"
echo "[6/7] Creating and merging feature branch..."
git checkout -b feature/auth-guard
echo "const auth = true;" > auth.js
git add auth.js && git commit -m "feat(auth): add authentication guard"
git checkout main
git merge --ff-only feature/auth-guard
echo "[7/7] Verifying commit DAG..."
git log --graph --oneline
echo "=== Verification SUCCESS: Topic 1 Architecture & Foundations Operational ==="
cd / && rm -rf /tmp/git-vcs-sim`,
    steps: [
      {
        stepNumber: 1,
        title: "Verify Git Installation on Ubuntu/Linux & Windows",
        description: "Ensure Git is installed on your workstation and verify the installed version against recent releases.",
        consoleInstruction: "Open your terminal or Git Bash. On Ubuntu, refresh package indexes before installing.",
        cliCommand: "git --version\n# If not installed on Ubuntu:\n# sudo apt-get update && sudo apt-get install -y git",
        expectedOutput: "git version 2.43.0 (or newer)",
        verificationTip: "Always run 'git --version' after installation to confirm your shell locates the binary in your PATH.",
        troubleshooting: "If 'command not found', run 'sudo apt-get update && sudo apt-get install -y git' on Ubuntu or install Git Bash on Windows."
      },
      {
        stepNumber: 2,
        title: "Configure Global Identity & Git Command Aliases",
        description: "Set your global author name and email attached to all commits, and configure productive command aliases.",
        consoleInstruction: "Run git config commands with the --global flag to write settings to ~/.gitconfig.",
        cliCommand: "git config --global user.name \"Cloud Engineer\"\ngit config --global user.email \"engineer@cloudmaster.io\"\ngit config --global alias.glog \"log --graph --oneline\"\ngit config --global --list",
        expectedOutput: "user.name=Cloud Engineer\nuser.email=engineer@cloudmaster.io\nalias.glog=log --graph --oneline",
        verificationTip: "Run 'git config --global --list' to inspect all active global parameters.",
        troubleshooting: "If commits later warn about author identity, re-run the user.name and user.email commands with quotes."
      },
      {
        stepNumber: 3,
        title: "Initialize Repository & Inspect .git Directory Architecture",
        description: "Turn an ordinary directory into a Git-tracked workspace and inspect the internal .git folder structure.",
        consoleInstruction: "Create a new practice folder 'git-mastery-lab', navigate into it, and initialize Git.",
        cliCommand: "mkdir -p ~/git-mastery-lab && cd ~/git-mastery-lab\ngit init\nls -la .git",
        expectedOutput: "Initialized empty Git repository in /home/.../git-mastery-lab/.git/\nHEAD  config  description  hooks/  info/  objects/  refs/",
        verificationTip: "The hidden '.git' folder contains all configuration, object databases, and refs. Never delete this folder.",
        troubleshooting: "Never run 'git init' inside an existing Git repository subfolder to avoid broken nested tracking."
      },
      {
        stepNumber: 4,
        title: "The Three Sections: Working Directory to Staging Area",
        description: "Experience the transition of files from untracked in the Working Directory to staged in the Staging Area.",
        consoleInstruction: "Create an application file. Check 'git status' to see untracked state in red, then run 'git add' to stage it.",
        cliCommand: "echo '<h1>AWS & DevOps Mastery Platform</h1>' > index.html\ngit status\ngit add index.html\ngit status",
        expectedOutput: "Changes to be committed:\n  (use \"git rm --cached <file>...\" to unstage)\n\tnew file:   index.html",
        verificationTip: "Notice 'git status' displays untracked files in red and staged files in green.",
        troubleshooting: "Prefer 'git add <file>' over blind 'git add .' to ensure you only stage files intentionally."
      },
      {
        stepNumber: 5,
        title: "Safe Unstaging Without Disk Deletion (git rm --cached)",
        description: "Practice unstaging a file back to the Working Directory without deleting or overwriting any code on disk.",
        consoleInstruction: "Run 'git rm --cached index.html'. Confirm that the file is removed from staging but remains 100% intact on disk.",
        cliCommand: "git rm --cached index.html\ngit status\ncat index.html\n# Now re-stage it for commit:\ngit add index.html",
        expectedOutput: "rm 'index.html'\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tindex.html\n<h1>AWS & DevOps Mastery Platform</h1>",
        verificationTip: "CRITICAL: Never run plain 'git rm index.html' without '--cached', as plain 'git rm' deletes the physical file from disk!",
        troubleshooting: "'git reset index.html' or 'git restore --staged index.html' achieve the exact same safe unstaging result."
      },
      {
        stepNumber: 6,
        title: "Create Permanent Snapshot (git commit) & Inspect Log",
        description: "Permanently record staged files into the Local Repository DAG with a conventional commit message.",
        consoleInstruction: "Commit staged files with a clear message and view the resulting commit object.",
        cliCommand: "git commit -m \"feat: create initial application landing page\"\ngit log --oneline\ngit show HEAD",
        expectedOutput: "[main (root-commit) 4a9bc12] feat: create initial application landing page\n 1 file changed, 1 insertion(+)",
        verificationTip: "Run 'git log --oneline' to confirm the commit hash and updated message.",
        troubleshooting: "Never commit credentials or debug secrets into the local repository."
      },
      {
        stepNumber: 7,
        title: "Create Feature Branch & Fast-Forward Integration",
        description: "Practice creating lightweight movable branch pointers and merging cleanly with fast-forward mechanics.",
        consoleInstruction: "Create a feature branch, author a new module, commit, switch back to main, and merge.",
        cliCommand: "git checkout -b feature/auth-guard\necho 'const auth = true;' > auth.js\ngit add auth.js && git commit -m \"feat(auth): implement auth guard module\"\ngit checkout main\ngit merge --ff-only feature/auth-guard\ngit log --graph --oneline",
        expectedOutput: "Updating ...\nFast-forward\n auth.js | 1 +\n 1 file changed, 1 insertion(+)",
        verificationTip: "Notice that fast-forward merges simply move the main pointer forward without creating extra merge commits.",
        troubleshooting: "Use 'git branch -d feature/auth-guard' after merging to keep local branch lists clean."
      }
    ]
  },
  'github-actions-cicd-matrix-secrets': {
    title: "Lab 16.3: GitHub Actions Enterprise CI/CD Pipeline, Matrix Testing & Secret Management",
    level: "Intermediate",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "A GitHub account and Git installed locally.",
    requiredPermissions: "GitHub repository write / admin permissions.",
    cleanupGuide: "Repository and workflow files reside in your personal GitHub account. No cloud resources created; zero cost cleanup.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of GitHub Actions runner & matrix CI workflow
echo "=== GitHub Actions Enterprise CI/CD Simulator ==="
echo "Event: push to branch 'main' triggered workflow '.github/workflows/ci.yml'"
echo "[Runner: ubuntu-latest | Node: 18.x] Setting up Node.js 18.x..."
echo "[Runner: ubuntu-latest | Node: 18.x] Running 'npm ci' -> 42 packages installed in 2.1s"
echo "[Runner: ubuntu-latest | Node: 18.x] Running 'npm test' -> 24/24 tests passed (100% coverage)"
echo "[Runner: ubuntu-latest | Node: 20.x] Setting up Node.js 20.x..."
echo "[Runner: ubuntu-latest | Node: 20.x] Running 'npm ci' -> 42 packages installed in 1.9s"
echo "[Runner: ubuntu-latest | Node: 20.x] Running 'npm test' -> 24/24 tests passed (100% coverage)"
echo "[Secrets] Masking AWS_ACCESS_KEY_ID: ***"
echo "[Branch Protection] Status checks validated: PASS"
echo "Status: SUCCESS (exit code 0). Pull request ready for automated deployment!"`,
    steps: [
      {
        stepNumber: 1,
        title: "Scaffold GitHub Actions Directory & Workflow YAML",
        description: "Create the standard .github/workflows directory and author an enterprise continuous integration pipeline definition.",
        consoleInstruction: "Create .github/workflows/ci.yml specifying triggers on push and pull_request.",
        cliCommand: "mkdir -p .github/workflows && cat << 'EOF' > .github/workflows/ci.yml\nname: Enterprise CI Matrix\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n    branches: [ main ]\njobs:\n  test:\n    name: Test on Node ${{ matrix.node-version }} - ${{ matrix.os }}\n    runs-on: ${{ matrix.os }}\n    strategy:\n      matrix:\n        os: [ubuntu-latest]\n        node-version: [18.x, 20.x]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n          cache: 'npm'\n      - run: npm ci\n      - run: npm test --if-present\nEOF",
        expectedOutput: "Created .github/workflows/ci.yml with multi-OS and multi-version matrix strategy.",
        verificationTip: "Verify that YAML files use strictly 2 spaces for indentation; never use tab characters.",
        troubleshooting: "Run a YAML validator to ensure triggers and job mappings conform to GitHub Actions syntax."
      },
      {
        stepNumber: 2,
        title: "Configure Encrypted Repository Secrets & Environment Variables",
        description: "Store sensitive API tokens securely in GitHub Repository Secrets and inject them safely into workflow steps.",
        consoleInstruction: "Use GitHub CLI or web UI (Settings -> Secrets and variables -> Actions) to store encrypted credentials.",
        cliCommand: "# Using GitHub CLI to set encrypted secrets from terminal:\ngh secret set AWS_ACCESS_KEY_ID --body 'AKIAIOSFODNN7EXAMPLE'\ngh secret set AWS_SECRET_ACCESS_KEY --body 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'",
        expectedOutput: "✓ Set Actions secret AWS_ACCESS_KEY_ID for org/repo\n✓ Set Actions secret AWS_SECRET_ACCESS_KEY for org/repo",
        verificationTip: "GitHub automatically masks secret values in runner terminal execution logs as '***'.",
        troubleshooting: "Never use 'echo $AWS_SECRET_ACCESS_KEY' in shell run steps to prevent accidental log exposure."
      },
      {
        stepNumber: 3,
        title: "Test Workflow Execution Locally Using Docker (act)",
        description: "Run and validate your GitHub Actions workflows locally inside Docker containers without pushing to remote.",
        consoleInstruction: "Use the open-source 'act' tool to execute GitHub Actions workflows on your workstation.",
        cliCommand: "# List workflows in repository:\nact -l\n# Simulate pull_request event execution locally:\nact pull_request -s AWS_ACCESS_KEY_ID=mock_key",
        expectedOutput: "[Enterprise CI Matrix/Test] ⭐ Run actions/checkout@v4\n[Enterprise CI Matrix/Test] ⭐ Run npm test\n[Enterprise CI Matrix/Test] 🏁 Job succeeded",
        verificationTip: "'act' spins up local Docker containers mimicking GitHub's ubuntu-latest runner image.",
        troubleshooting: "Ensure Docker daemon is running locally before executing 'act'."
      },
      {
        stepNumber: 4,
        title: "Commit Workflow & Enforce Branch Protection Rules",
        description: "Commit the workflow to your repository and configure Branch Protection Rules on the 'main' branch.",
        consoleInstruction: "Stage the workflow file, commit, and push. Enable Branch Protection requiring passing CI checks.",
        cliCommand: "git add .github/workflows/ci.yml\ngit commit -m \"ci: add enterprise matrix testing workflow\"\ngit push origin main",
        expectedOutput: "Branch 'main' set up to track remote branch 'main' from 'origin'.\nWorkflow queued and running in GitHub Actions tab.",
        verificationTip: "In GitHub: Settings -> Branches -> Add branch protection rule for 'main' -> Require status checks to pass before merging.",
        troubleshooting: "If CI fails on remote, inspect the Actions tab log output to locate failing unit tests or missing dependencies."
      }
    ]
  },
  "jenkins-architecture-master-agents": {
    title: "Lab 17.1: Jenkins RHEL Setup, Unlock Wizard, Global Security & Role Strategy RBAC",
    level: "Intermediate",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Linux terminal (RHEL/CentOS or Ubuntu/Debian) or Docker installed.",
    requiredPermissions: "Root/sudo privileges on Linux host or local Docker daemon permissions.",
    cleanupGuide: "Stop and disable Jenkins service: sudo systemctl stop jenkins && sudo systemctl disable jenkins. (If Docker: docker stop jenkins-lab && docker rm jenkins-lab).",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Jenkins Enterprise Setup and Security Configuration
echo "=== 1. Checking Java 17 Prerequisite ==="
java -version 2>&1 | head -n 1
echo "=== 2. Starting Jenkins Systemd Service ==="
echo "Active: active (running) since Wed 2026-11-04 10:00:00 UTC; 5s ago"
echo "Main PID: 1420 (java) | Listening on port 8080"
echo "=== 3. Retrieving Initial Admin Password ==="
echo "e4b2a8d39f7c4618a510e193bd85f67a"
echo "=== 4. Configuring Global Security: Role Strategy Plugin ==="
echo "Roles defined: Admin (Full), Developer (Job/Build, Job/Read), QA (Job/Read only)"
echo "=== 5. Controller-Agent Topology ==="
echo "Controller executors set to: 0 (No build execution on Master)"
echo "Connected Agent: linux-builder-1 (label: 'linux-builder') -> ONLINE"`,
    steps: [
      {
        stepNumber: 1,
        title: "Install OpenJDK 17 and Add Jenkins YUM Repository",
        description: "Jenkins is a Java application and strictly requires Java 17. Add the official Red Hat repository and import the signing key.",
        consoleInstruction: "Update package manager, install Java 17, download repo definition, and import signing key.",
        cliCommand: "sudo yum update -y\nsudo yum install fontconfig java-17-openjdk -y\nsudo curl -o /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo\nsudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key",
        expectedOutput: "java-17-openjdk installed successfully.\nImported GPG key from https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key",
        verificationTip: "Verify Java version: java -version (must output openjdk version '17.x.x').",
        troubleshooting: "If GPG import fails with network error, verify outbound HTTPS access to pkg.jenkins.io."
      },
      {
        stepNumber: 2,
        title: "Install Jenkins Package and Enable Systemd Service",
        description: "Install the Jenkins package via YUM and configure systemd to start and survive system reboots.",
        consoleInstruction: "Install Jenkins, reload systemd daemon, start service, and enable on boot.",
        cliCommand: "sudo yum install jenkins -y\nsudo systemctl daemon-reload\nsudo systemctl start jenkins\nsudo systemctl enable jenkins",
        expectedOutput: "Created symlink /etc/systemd/system/multi-user.target.wants/jenkins.service -> /usr/lib/systemd/system/jenkins.service.",
        verificationTip: "Run: sudo systemctl status jenkins (verify 'active (running)' and port 8080 binding).",
        troubleshooting: "If port 8080 conflicts with another service, edit /usr/lib/systemd/system/jenkins.service and change JENKINS_PORT=8081."
      },
      {
        stepNumber: 3,
        title: "Retrieve Initial Admin Password and Complete Unlock Wizard",
        description: "Retrieve the auto-generated cryptographic password from disk and unlock the browser setup wizard.",
        consoleInstruction: "Display initial password file and open http://<server-ip>:8080 in browser.",
        cliCommand: "sudo cat /var/lib/jenkins/secrets/initialAdminPassword",
        expectedOutput: "32-character hexadecimal string printed to console (e.g., 7a8f9c2d1e4b5038f6a9e102bc45d781).",
        verificationTip: "Navigate to http://localhost:8080, paste password into 'Administrator password', and select 'Install suggested plugins'.",
        troubleshooting: "Do not delete initialAdminPassword until you create your primary named admin user account in the setup wizard."
      },
      {
        stepNumber: 4,
        title: "Install Role-based Authorization Strategy Plugin",
        description: "Install the Role Strategy plugin to replace the dangerous default 'logged-in users can do anything' setting.",
        consoleInstruction: "In Jenkins web console: Manage Jenkins -> Manage Plugins -> Available tab -> search 'Role-based Authorization Strategy' -> Install without restart.",
        cliCommand: "# Via Jenkins CLI (or Web UI):\njava -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:<token> install-plugin role-strategy -restart",
        expectedOutput: "Installing Role-based Authorization Strategy plugin... Success. Restarted Jenkins.",
        verificationTip: "Confirm plugin is listed under Manage Jenkins -> Manage Plugins -> Installed tab.",
        troubleshooting: "If plugin installation times out, check proxy settings under Manage Plugins -> Advanced."
      },
      {
        stepNumber: 5,
        title: "Configure Global Security Realms & Role-Based Permissions",
        description: "Enforce least-privilege RBAC: define 'Developer' and 'QA' roles with tailored permissions.",
        consoleInstruction: "Navigate to Manage Jenkins -> Configure Global Security -> Authorization -> Select 'Role-Based Strategy' -> Save. Then Manage Jenkins -> Manage and Assign Roles.",
        cliCommand: "# Verification: Confirm authorization strategy is active\ncurl -s -u admin:token http://localhost:8080/manage | grep -i 'role-strategy'",
        expectedOutput: "Role Strategy active. Roles defined: Developer (Job/Build, Job/Read, Job/Workspace), QA (Job/Read only).",
        verificationTip: "Log in as a QA user: verify they cannot see 'Configure' button on jobs or access Manage Jenkins.",
        troubleshooting: "Always ensure your admin user is assigned to the 'admin' role with Administer permission before saving, to prevent locking yourself out."
      },
      {
        stepNumber: 6,
        title: "Configure Distributed Controller-Agent Architecture",
        description: "Set Controller executors to 0 to prevent build tasks from crashing the UI, and register a dedicated build agent node.",
        consoleInstruction: "Navigate to Manage Jenkins -> Manage Nodes -> Built-In Node -> Configure -> Set '# of executors' to 0. Then click 'New Node' -> name 'linux-builder-1' -> label 'linux-builder'.",
        cliCommand: "# Verify controller executors via groovy script\ncurl -d \"script=println Jenkins.instance.numExecutors\" -u admin:token http://localhost:8080/scriptText",
        expectedOutput: "0\nlinux-builder-1 node registered with label 'linux-builder'. Status: Online.",
        verificationTip: "Jobs pinned with 'agent { label 'linux-builder' }' will schedule strictly to the dedicated worker agent.",
        troubleshooting: "If agent fails to connect, verify Agent TCP port (default 50000) is open between agent and controller."
      }
    ]
  },
  "declarative-jenkinsfile-production-pipelines": {
    title: "Lab 17.2: Git Webhooks, Cron Triggers & Multi-Stage Declarative Pipelines",
    level: "Advanced",
    estimatedMinutes: 40,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Jenkins server running with Git and Pipeline plugins installed, and a GitHub account.",
    requiredPermissions: "Jenkins job creation rights and GitHub repository admin rights (for webhooks).",
    cleanupGuide: "Delete created Jenkins pipeline job and remove webhook from GitHub repository settings.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Declarative Pipeline with Webhook & Cron Triggers
echo "=== 1. GitHub Webhook Payload Received ==="
echo "POST /github-webhook/ -> Matching job 'production-pipeline' for branch 'main'"
echo "=== 2. Starting Declarative Pipeline Build #42 ==="
echo "[Pipeline] { (Declarative: Checkout SCM)"
echo "[Pipeline] git https://github.com/org/app.git -> commit b7a10f3"
echo "[Pipeline] } (Stage: Build) -> 'mvn compile' SUCCESS"
echo "[Pipeline] } (Stage: Test) -> 'mvn test' 18/18 passed"
echo "[Pipeline] } (Stage: Production Approval Gate)"
echo "[Input] Deploy to Production? [Waiting for user approval] -> Approved by Lead DevOps"
echo "[Pipeline] } (Stage: Deploy) -> Artifact deployed to AWS production"
echo "[Pipeline] } (Declarative: Post Actions)"
echo "[Post] Pipeline succeeded! Workspace cleaned via cleanWs()."
echo "[Pipeline] Finished: SUCCESS"`,
    steps: [
      {
        stepNumber: 1,
        title: "Configure GitHub Webhook for Instant Event-Driven Builds",
        description: "Configure GitHub to notify Jenkins instantly on code push events, eliminating manual polling.",
        consoleInstruction: "In your GitHub repository: Settings -> Webhooks -> Add webhook. Set Payload URL to http://<your-jenkins-url>/github-webhook/, content type application/json, and select 'Just the push event'.",
        cliCommand: "# Test connectivity from GitHub host or local curl:\ncurl -X POST -H \"Content-Type: application/json\" http://<jenkins-url>:8080/github-webhook/ -d '{\"repository\":{\"name\":\"demo\"}}'",
        expectedOutput: "HTTP 200 OK or Webhook delivered successfully with green checkmark in GitHub Webhook dashboard.",
        verificationTip: "Ensure the URL ends strictly in '/github-webhook/'.",
        troubleshooting: "If GitHub reports HTTP 403 or connection timeout, ensure Jenkins port 8080 is accessible from the internet (use ngrok for local testing)."
      },
      {
        stepNumber: 2,
        title: "Configure Pipeline Job with GitHub Webhook and Cron Triggers",
        description: "Create a Pipeline job in Jenkins and enable automatic triggers in job configuration.",
        consoleInstruction: "Jenkins dashboard -> New Item -> Enter 'microservice-cicd' -> Select 'Pipeline' -> OK. Under Build Triggers, check 'GitHub hook trigger for GITScm polling' and 'Build periodically'.",
        cliCommand: "# Cron schedule to run nightly at 2 AM Mon-Fri:\n# H 2 * * 1-5\n# Or every 5 minutes for automated testing:\n# */5 * * * *",
        expectedOutput: "Job configuration saved with GitHub hook trigger and cron schedule active.",
        verificationTip: "Verify trigger description shows: 'Build periodically: H 2 * * 1-5'.",
        troubleshooting: "Remember the 5 cron fields: Minute (0-59), Hour (0-23), Day-of-month (1-31), Month (1-12), Day-of-week (0-6 Sun-Sat)."
      },
      {
        stepNumber: 3,
        title: "Author Production Declarative Jenkinsfile",
        description: "Create a version-controlled Jenkinsfile defining Checkout, Build, Test, and Artifact stages.",
        consoleInstruction: "Create a Jenkinsfile in the root of your Git repository.",
        cliCommand: "cat << 'EOF' > Jenkinsfile\npipeline {\n  agent any\n  stages {\n    stage('Checkout') {\n      steps {\n        checkout scm\n      }\n    }\n    stage('Compile & Build') {\n      steps {\n        sh 'mvn clean compile'\n      }\n    }\n    stage('Unit & Integration Tests') {\n      steps {\n        sh 'mvn test'\n      }\n    }\n  }\n}\nEOF",
        expectedOutput: "Jenkinsfile created with valid Declarative syntax (pipeline { agent { } stages { } }).",
        verificationTip: "Validate syntax using Jenkins CLI: java -jar jenkins-cli.jar -s http://localhost:8080/ declarative-linter < Jenkinsfile.",
        troubleshooting: "Declarative pipelines require strict enclosing 'pipeline' block; never mix top-level node { } blocks with pipeline { }."
      },
      {
        stepNumber: 4,
        title: "Add Interactive Production Approval Gate with 'input' Step",
        description: "Enforce human change management before deploying to production environments.",
        consoleInstruction: "Add an 'Approval' stage before the deploy stage in your Jenkinsfile.",
        cliCommand: "cat << 'EOF' >> Jenkinsfile\n    stage('Production Gate') {\n      steps {\n        input message: 'Promote build to AWS Production environment?', ok: 'Approve Deployment'\n      }\n    }\n    stage('Deploy to Production') {\n      steps {\n        echo 'Deploying release artifact to production cluster...'\n      }\n    }\nEOF",
        expectedOutput: "Pipeline execution pauses at 'Production Gate' stage with interactive 'Proceed' and 'Abort' prompt.",
        verificationTip: "In Jenkins UI, click 'microservice-cicd' build in progress: confirm prompt appears in Stage View.",
        troubleshooting: "Configure timeout(time: 1, unit: 'HOURS') around the input step to prevent pipelines from hanging indefinitely if unattended."
      },
      {
        stepNumber: 5,
        title: "Implement Email-ext SMTP Notifications inside post { failure }",
        description: "Configure post-build actions to alert engineering teams immediately when a build fails, avoiding alert fatigue on success.",
        consoleInstruction: "Add a post block to your Jenkinsfile referencing email recipients.",
        cliCommand: "cat << 'EOF' >> Jenkinsfile\n  post {\n    always {\n      cleanWs()\n    }\n    failure {\n      mail to: 'devs@example.com',\n           subject: \"[ALERT] Pipeline Failure: \${currentBuild.fullDisplayName}\",\n           body: \"Build failed at stage! Please review console logs at: \${env.BUILD_URL}\"\n    }\n  }\n}\nEOF",
        expectedOutput: "post block appended to Jenkinsfile with always and failure condition handlers.",
        verificationTip: "Trigger an intentional syntax error in a test commit: verify pipeline enters failure block and triggers SMTP mail.",
        troubleshooting: "Configure SMTP server settings under Manage Jenkins -> Configure System -> Extended E-mail Notification (use an App Password for Gmail)."
      },
      {
        stepNumber: 6,
        title: "Trigger End-to-End Pipeline Execution via Git Push",
        description: "Push changes to your GitHub repository and watch Jenkins trigger, build, pause for approval, and complete automatically.",
        consoleInstruction: "Commit and push the Jenkinsfile to GitHub. Monitor Jenkins build dashboard.",
        cliCommand: "git add Jenkinsfile\ngit commit -m \"ci: add complete declarative pipeline with approval gate and email alerts\"\ngit push origin main",
        expectedOutput: "GitHub webhook fires -> Jenkins starts Build #1 immediately -> Stages pass -> Click 'Approve' -> Build SUCCESS.",
        verificationTip: "Inspect Blue Ocean or Classic Stage View to confirm all green stages and duration metrics.",
        troubleshooting: "If build does not start, inspect Jenkins system log: Manage Jenkins -> System Log -> All Jenkins Logs to check for incoming webhook events."
      }
    ]
  },
  "jenkins-selenium-maven-headless-testing": {
    title: "Lab 17.3: Automated Headless Selenium Testing in Jenkins with Maven & JUnit Reports",
    level: "Intermediate",
    estimatedMinutes: 40,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Java 17, Maven 3.8+, Google Chrome or Chromium, and ChromeDriver installed on the Jenkins host or agent.",
    requiredPermissions: "Local command line execution rights and Jenkins pipeline creation rights.",
    cleanupGuide: "Kill any leftover chrome processes and clean Maven build target: pkill -f chrome || true && mvn clean.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Maven Headless Selenium Test Suite with JUnit Reporting
echo "=== 1. Validating Chrome & ChromeDriver on Linux CI Host ==="
google-chrome --version || echo "Google Chrome 124.0.6367.60"
chromedriver --version || echo "ChromeDriver 124.0.6367.60"
echo "=== 2. Running Maven Headless Selenium Test Suite ==="
echo "[INFO] Scanning for projects..."
echo "[INFO] Running com.example.SeleniumWebTest"
echo "[INFO] Starting ChromeDriver in headless mode (--headless=new, --no-sandbox)..."
echo "[INFO] Navigating to https://example.com"
echo "[INFO] Asserting page title: 'Example Domain' -> PASSED"
echo "[INFO] Executing driver.quit() -> Browser closed, memory freed."
echo "[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0"
echo "=== 3. Publishing JUnit Test Result Report ==="
echo "Recording test results: target/surefire-reports/*.xml"
echo "JUnit Test Report: 5 tests passed in 4.2 seconds. Test trend graph updated in Jenkins."`,
    steps: [
      {
        stepNumber: 1,
        title: "Create Maven Project with Selenium & JUnit Dependencies",
        description: "Manage test dependencies using Maven's pom.xml rather than manually downloading JAR files in Eclipse.",
        consoleInstruction: "Create a pom.xml with selenium-java and junit in <scope>test</scope>.",
        cliCommand: "cat << 'EOF' > pom.xml\n<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n  xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>com.example</groupId>\n  <artifactId>selenium-ci-tests</artifactId>\n  <version>1.0-SNAPSHOT</version>\n  <properties>\n    <maven.compiler.source>17</maven.compiler.source>\n    <maven.compiler.target>17</maven.compiler.target>\n  </properties>\n  <dependencies>\n    <dependency>\n      <groupId>org.seleniumhq.selenium</groupId>\n      <artifactId>selenium-java</artifactId>\n      <version>4.21.0</version>\n      <scope>test</scope>\n    </dependency>\n    <dependency>\n      <groupId>junit</groupId>\n      <artifactId>junit</artifactId>\n      <version>4.13.2</version>\n      <scope>test</scope>\n    </dependency>\n  </dependencies>\n</project>\nEOF",
        expectedOutput: "pom.xml configured with Selenium 4.21.0 and JUnit 4.13.2 test-scoped dependencies.",
        verificationTip: "Verify dependencies resolve: mvn dependency:resolve (downloads JARs to ~/.m2/repository).",
        troubleshooting: "Always ensure <scope>test</scope> is specified so test libraries are never bundled into production artifacts."
      },
      {
        stepNumber: 2,
        title: "Write Robust Headless Selenium WebDriver Test Case",
        description: "Author a Java Selenium test case configured for headless execution on Linux CI agents, with driver.quit() teardown.",
        consoleInstruction: "Create test directory structure and SimpleWebTest.java.",
        cliCommand: "mkdir -p src/test/java/com/example\ncat << 'EOF' > src/test/java/com/example/SimpleWebTest.java\npackage com.example;\nimport org.junit.Test;\nimport org.junit.After;\nimport org.junit.Before;\nimport static org.junit.Assert.assertEquals;\nimport org.openqa.selenium.WebDriver;\nimport org.openqa.selenium.chrome.ChromeDriver;\nimport org.openqa.selenium.chrome.ChromeOptions;\n\npublic class SimpleWebTest {\n    private WebDriver driver;\n\n    @Before\n    public void setUp() {\n        ChromeOptions options = new ChromeOptions();\n        options.addArguments(\"--headless=new\");\n        options.addArguments(\"--no-sandbox\");\n        options.addArguments(\"--disable-dev-shm-usage\");\n        driver = new ChromeDriver(options);\n    }\n\n    @Test\n    public void testPageTitle() {\n        driver.get(\"https://example.com\");\n        assertEquals(\"Example Domain\", driver.getTitle());\n    }\n\n    @After\n    public void tearDown() {\n        if (driver != null) {\n            driver.quit();\n        }\n    }\n}\nEOF",
        expectedOutput: "SimpleWebTest.java created with headless ChromeOptions and @After driver.quit().",
        verificationTip: "Notice driver.quit() in @After ensures browser processes terminate even if assertions fail.",
        troubleshooting: "Missing '--no-sandbox' or '--disable-dev-shm-usage' causes Chrome to crash inside Linux containers due to shared memory limits."
      },
      {
        stepNumber: 3,
        title: "Execute Test Suite Locally via Maven Surefire",
        description: "Run the test suite using 'mvn test' to verify test execution and Surefire XML report generation.",
        consoleInstruction: "Run mvn test and inspect the target/surefire-reports directory.",
        cliCommand: "mvn test\nls -la target/surefire-reports/",
        expectedOutput: "[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0\nTEST-com.example.SimpleWebTest.xml generated.",
        verificationTip: "Check target/surefire-reports/TEST-com.example.SimpleWebTest.xml (contains test duration, assertions, and outcomes).",
        troubleshooting: "If tests fail with 'ChromeDriver executable needs to be in PATH', install chromedriver via package manager or add it to system PATH."
      },
      {
        stepNumber: 4,
        title: "Create Jenkins Freestyle Job with Top-Level Maven Target",
        description: "Configure a traditional Jenkins Freestyle job to execute Maven tests and archive JUnit reports.",
        consoleInstruction: "Jenkins dashboard -> New Item -> 'selenium-freestyle-job' -> Freestyle project -> OK. In Source Code Management, set Git repo. In Build, add 'Invoke top-level Maven targets' with Goal: 'test'. In Post-build Actions, add 'Publish JUnit test result report' with Test report XMLs: '**/target/surefire-reports/*.xml'.",
        cliCommand: "# Equivalent command executed by Jenkins agent:\nmvn test -Dtest=SimpleWebTest",
        expectedOutput: "Build succeeds; Jenkins reports: 'Test Result: 1 test, 0 failures'.",
        verificationTip: "Click 'Test Result' link on the build page to view per-test execution duration and stack traces.",
        troubleshooting: "Ensure the path pattern in Publish JUnit report is '**/target/surefire-reports/*.xml' with double asterisks to handle sub-modules."
      },
      {
        stepNumber: 5,
        title: "Author Declarative Jenkinsfile with Automated JUnit Publishing",
        description: "Migrate the build to Pipeline-as-Code by defining the test stage and JUnit post block in a Jenkinsfile.",
        consoleInstruction: "Create a Jenkinsfile implementing checkout, mvn test, and junit XML report publishing.",
        cliCommand: "cat << 'EOF' > Jenkinsfile\npipeline {\n  agent any\n  stages {\n    stage('Checkout') {\n      steps {\n        checkout scm\n      }\n    }\n    stage('Run Selenium Tests') {\n      steps {\n        sh 'mvn test'\n      }\n    }\n  }\n  post {\n    always {\n      junit '**/target/surefire-reports/*.xml'\n    }\n    failure {\n      echo 'Selenium tests failed! Investigating failure report...'\n    }\n  }\n}\nEOF",
        expectedOutput: "Jenkinsfile created with post { always { junit '**/target/surefire-reports/*.xml' } }.",
        verificationTip: "Using 'always' ensures JUnit XML reports are parsed and published even when individual tests fail.",
        troubleshooting: "If you place junit under 'success', test reports won't publish when tests fail, which defeats the purpose of test reporting."
      },
      {
        stepNumber: 6,
        title: "Analyze Test Result Trends and Failure Diagnostics in Jenkins",
        description: "Review interactive test charts in Jenkins dashboard: pass/fail rates, execution duration trends, and failure root causes.",
        consoleInstruction: "Trigger the pipeline in Jenkins. Click on 'Test Result Trend' graph in project dashboard.",
        cliCommand: "# View summary from CLI\ncurl -s -u admin:token http://localhost:8080/job/selenium-pipeline/lastBuild/testReport/api/json | grep -o '\"totalCount\":[0-9]*'",
        expectedOutput: "Total test count and failure count displayed. Trend graph shows green pass history over successive builds.",
        verificationTip: "If a test fails, click into the test method name to view the exact JUnit assertion error and Selenium stack trace.",
        troubleshooting: "To eliminate flaky tests, replace any remaining Thread.sleep() calls with explicit WebDriverWait expected conditions."
      }
    ]
  },
  17: {
    title: "Lab 17: Enterprise Jenkins CI/CD & Automated Selenium Testing Masterclass",
    level: "Intermediate",
    estimatedMinutes: 40,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Docker installed locally or Jenkins running on a local port.",
    requiredPermissions: "Local Docker execution rights or Linux host sudo permissions.",
    cleanupGuide: "Stop and remove the local test container: docker stop jenkins-lab && docker rm jenkins-lab.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Jenkins Declarative Pipeline execution
echo "=== Jenkins Declarative Pipeline Execution ==="
echo "[Pipeline] Start of Pipeline"
echo "[Stage: Checkout] Pulling from git https://github.com/org/app.git (commit: 8f3c21a)"
echo "[Stage: Unit Test] Executing 'mvn test' -> 18 passed in 3.1s"
echo "[Stage: Selenium Tests] Headless Chrome running 5 browser scenarios -> 5/5 PASSED"
echo "[Stage: Post] Publishing JUnit XML reports: target/surefire-reports/*.xml"
echo "[Stage: Post] Success! Sending notification to Slack #devops-deployments"
echo "[Pipeline] Finished: SUCCESS"`,
    steps: [
      {
        stepNumber: 1,
        title: "Launch Local Isolated Jenkins Container",
        description: "Run Jenkins LTS container in Docker with port forward and volume mounting.",
        consoleInstruction: "Run the docker run command to launch Jenkins on host port 8080.",
        cliCommand: "docker run -d -p 8080:8080 -p 50000:50000 --name jenkins-lab jenkins/jenkins:lts-jdk17",
        expectedOutput: "Container ID printed to terminal, verifying Jenkins daemon started.",
        verificationTip: "Run 'docker logs jenkins-lab' to confirm HTTP listener is active on 8080.",
        troubleshooting: "If port 8080 is in use, remap to -p 8081:8080."
      },
      {
        stepNumber: 2,
        title: "Create Declarative Jenkinsfile with Multi-Stage Execution",
        description: "Write a Jenkinsfile implementing Build, Selenium Test, and JUnit Archive stages.",
        consoleInstruction: "Create a file named 'Jenkinsfile' in the root directory.",
        cliCommand: "cat << 'EOF' > Jenkinsfile\npipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps { echo 'Compiling application via Maven...' }\n    }\n    stage('Selenium Headless Test') {\n      steps { echo 'Running automated browser test suites...' }\n    }\n  }\n  post {\n    always {\n      echo 'Archiving test results...'\n    }\n  }\n}\nEOF",
        expectedOutput: "Jenkinsfile created with declarative pipeline structure.",
        verificationTip: "Verify pipeline syntax using the Jenkins Pipeline Syntax Generator in the web console.",
        troubleshooting: "Ensure 'pipeline' is all lowercase."
      }
    ]
  },
  18: {
    title: "Lab 18: Docker Multi-Stage Optimization & Multi-Service Compose",
    level: "Beginner",
    estimatedMinutes: 30,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "Docker Engine installed locally.",
    requiredPermissions: "Local docker daemon permissions.",
    cleanupGuide: "Tear down containers and prune local test images: docker compose down -v && docker rmi web-optimized:v1.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Docker multi-stage build & compose stack
echo "=== Docker Multi-Stage Image Builder ==="
echo "Stage 1 (Builder): FROM node:20-alpine -> installed typescript, webpack, dependencies (Total: 480MB)"
echo "Stage 2 (Runtime): FROM node:20-alpine -> copied dist/ and production node_modules ONLY (Total: 62MB)"
echo "→ 87% Image Size Reduction achieved!"
echo "Starting docker-compose multi-service stack..."
echo "[+] Network app_default Created"
echo "[+] Container db-1 Started (MySQL 8.0 on port 3306)"
echo "[+] Container api-1 Started (Node.js on port 5000)"
echo "[+] Container web-1 Started (Nginx on port 80)"
echo "Healthcheck: All services healthy! Zero cost local dev stack running."`,
    steps: [
      {
        stepNumber: 1,
        title: "Build Hardened Multi-Stage Dockerfile",
        description: "Create an optimized Dockerfile that compiles code in builder stage and runs as non-root user in runtime stage.",
        consoleInstruction: "Inspect Dockerfile instructions: FROM -> WORKDIR -> COPY -> RUN -> USER -> CMD.",
        cliCommand: "cat << 'EOF' > Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nUSER node\nCOPY --from=builder /app/package*.json ./\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/dist ./dist\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]\nEOF",
        expectedOutput: "Multi-stage Dockerfile created with non-root security.",
        verificationTip: "Run 'docker build -t app-prod:test .' and observe final image size under 80MB.",
        troubleshooting: "If permission denied during build, ensure files have readable permissions."
      },
      {
        stepNumber: 2,
        title: "Define Multi-Service Stack with Docker Compose",
        description: "Orchestrate Web Frontend, Backend API, and MySQL Database with automated network isolation.",
        consoleInstruction: "Create docker-compose.yml defining services, environment variables, and persistent named volumes.",
        cliCommand: "cat << 'EOF' > compose.yaml\nservices:\n  app:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      - NODE_ENV=production\n      - DB_HOST=db\n    depends_on:\n      - db\n  db:\n    image: mysql:8.0\n    environment:\n      - MYSQL_ROOT_PASSWORD=secret\n      - MYSQL_DATABASE=app_db\n    volumes:\n      - db_data:/var/lib/mysql\nvolumes:\n  db_data:\nEOF",
        expectedOutput: "compose.yaml created with declarative service dependencies.",
        verificationTip: "Test configuration using 'docker compose config' before starting.",
        troubleshooting: "Ensure indentation is consistent 2-space YAML."
      }
    ]
  },
  19: {
    title: "Lab 19: Kubernetes Deployment, Service Discovery & Zero-Downtime Rollout",
    level: "Advanced",
    estimatedMinutes: 35,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: null,
    prerequisites: "kubectl installed locally or access to Minikube/Kind.",
    requiredPermissions: "Kubernetes namespace create/apply permissions.",
    cleanupGuide: "Delete the test deployment and service: kubectl delete -f k8s-deployment.yaml.",
    safeSimulationScript: `#!/bin/bash
# Local simulation of Kubernetes declarative state reconciliation
echo "=== Kubernetes Cluster Simulator ==="
echo "$ kubectl apply -f k8s-deployment.yaml"
echo "deployment.apps/frontend-app created"
echo "service/frontend-svc created"
echo "configmap/app-config created"
echo "Waiting for rollout to finish: 0 of 3 updated replicas are available..."
echo "Waiting for rollout to finish: 1 of 3 updated replicas are available..."
echo "Waiting for rollout to finish: 3 of 3 updated replicas are available..."
echo "deployment 'frontend-app' successfully rolled out!"
echo "$ kubectl get pods -l app=frontend-app"
echo "NAME                            READY   STATUS    RESTARTS   AGE"
echo "frontend-app-769d4bc8f-2k9jx   1/1     Running   0          18s"
echo "frontend-app-769d4bc8f-8pxmn   1/1     Running   0          18s"
echo "frontend-app-769d4bc8f-m5twq   1/1     Running   0          18s"`,
    steps: [
      {
        stepNumber: 1,
        title: "Create Kubernetes Deployment Manifest with Probes & Resource Limits",
        description: "Author a production-grade Deployment YAML with 3 replicas, CPU/memory limits, and Liveness/Readiness probes.",
        consoleInstruction: "Create k8s-deployment.yaml defining apiVersion: apps/v1, kind: Deployment.",
        cliCommand: "cat << 'EOF' > k8s-deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: cloud-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: cloud-app\n  template:\n    metadata:\n      labels:\n        app: cloud-app\n    spec:\n      containers:\n      - name: web\n        image: nginx:alpine\n        resources:\n          requests:\n            memory: \"64Mi\"\n            cpu: \"50m\"\n          limits:\n            memory: \"128Mi\"\n            cpu: \"100m\"\n        readinessProbe:\n          httpGet:\n            path: /\n            port: 80\n          initialDelaySeconds: 5\n          periodSeconds: 10\nEOF",
        expectedOutput: "k8s-deployment.yaml created with health probes and resource limits.",
        verificationTip: "Verify YAML validation using 'kubectl apply --dry-run=client -f k8s-deployment.yaml'.",
        troubleshooting: "Always ensure resource requests are strictly smaller than limits."
      },
      {
        stepNumber: 2,
        title: "Expose Pods with a Kubernetes ClusterIP Service",
        description: "Create a Service manifest to provide stable DNS resolution and internal load balancing across pod replicas.",
        consoleInstruction: "Create k8s-service.yaml defining apiVersion: v1, kind: Service.",
        cliCommand: "cat << 'EOF' > k8s-service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: cloud-app-svc\nspec:\n  selector:\n    app: cloud-app\n  ports:\n    - protocol: TCP\n      port: 80\n      targetPort: 80\n  type: ClusterIP\nEOF",
        expectedOutput: "k8s-service.yaml created with selector pointing to app: cloud-app.",
        verificationTip: "Inspect endpoints using 'kubectl get endpoints cloud-app-svc' to confirm target pod IPs are mapped.",
        troubleshooting: "If endpoints are empty, check that the service selector matches the pod template labels exactly."
      }
    ]
  },
  20: {
    title: "Lab 20: Unified Enterprise Pipeline: GitHub -> Jenkins -> Docker -> AWS ECR -> EKS",
    level: "Advanced",
    estimatedMinutes: 45,
    freeTierEligible: true,
    costRiskLevel: "LOW",
    paidAlternativeWarning: "Amazon EKS clusters incur $0.10/hr control plane costs; this lab includes our zero-cost safe local CLI simulator so you can master the exact commands without deploying billable clusters.",
    prerequisites: "AWS CLI, Docker, and kubectl configured.",
    requiredPermissions: "ecr:GetAuthorizationToken, ecr:PutImage, eks:DescribeCluster",
    cleanupGuide: "Zero AWS charges incurred when using the built-in simulator. If deployed to real AWS: aws ecr delete-repository --repository-name prod-api --force.",
    safeSimulationScript: `#!/bin/bash
# Complete End-to-End Enterprise CI/CD Pipeline Simulator
echo "=== Enterprise DevOps Pipeline Simulation ==="
echo "Step 1 [GitHub]: Push received on 'main' branch (commit sha: 9a7e2b1)"
echo "Step 2 [Jenkins]: Webhook received. Allocating dynamic Docker build agent..."
echo "Step 3 [CI Test]: Running unit tests & SonarQube static analysis -> 100% Passed"
echo "Step 4 [Docker]: Building multi-stage container -> 'prod-api:9a7e2b1'"
echo "Step 5 [DevSecOps]: Trivy scanning image layers -> 0 CRITICAL CVEs detected (Passed)"
echo "Step 6 [AWS ECR]: Authenticating to 123456789012.dkr.ecr.us-east-1.amazonaws.com"
echo "Step 7 [AWS ECR]: Pushing image layers -> SHA256 verified in registry"
echo "Step 8 [Amazon EKS]: Executing 'kubectl set image deployment/prod-api api=prod-api:9a7e2b1'"
echo "Step 9 [K8s Rollout]: Pod 1 updated -> Ready. Pod 2 updated -> Ready. Pod 3 updated -> Ready."
echo "Pipeline execution finished successfully in 48 seconds with ZERO downtime!"`,
    steps: [
      {
        stepNumber: 1,
        title: "Authenticate Docker Client to Amazon ECR",
        description: "Obtain an AWS STS authentication token and pipe it into Docker CLI to authenticate with private ECR registry.",
        consoleInstruction: "Open AWS Console -> ECR Dashboard -> Repositories -> Click 'View push commands' for copy-paste instructions.",
        cliCommand: "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com",
        expectedOutput: "Login Succeeded",
        verificationTip: "Verify login credentials stored in ~/.docker/config.json with temporary 12-hour expiration.",
        troubleshooting: "If AuthFailure occurs, confirm AWS CLI credentials have ecr:GetAuthorizationToken permission."
      },
      {
        stepNumber: 2,
        title: "Build, Tag with Git SHA, and Push to Amazon ECR",
        description: "Build the container image locally, apply an immutable tag containing the current Git commit SHA, and push to ECR.",
        consoleInstruction: "Run docker build and docker push commands.",
        cliCommand: "docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/prod-api:v1.0-9a7e2b1 . && docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/prod-api:v1.0-9a7e2b1",
        expectedOutput: "The push refers to repository [123456789012.dkr.ecr.us-east-1.amazonaws.com/prod-api]\n9a7e2b1: Pushed\nv1.0-9a7e2b1: digest: sha256:... size: 1782",
        verificationTip: "Check ECR console to confirm the image tag and scan-on-push results appear.",
        troubleshooting: "Ensure the ECR repository 'prod-api' exists before pushing."
      },
      {
        stepNumber: 3,
        title: "Trigger Zero-Downtime Rolling Update on Amazon EKS",
        description: "Instruct the Kubernetes cluster to roll out the newly pushed container image with live health verification.",
        consoleInstruction: "Run kubectl set image command followed by rollout status check.",
        cliCommand: "kubectl set image deployment/prod-api api=123456789012.dkr.ecr.us-east-1.amazonaws.com/prod-api:v1.0-9a7e2b1 --record && kubectl rollout status deployment/prod-api",
        expectedOutput: "deployment.apps/prod-api image updated\ndeployment 'prod-api' successfully rolled out",
        verificationTip: "Run 'kubectl rollout history deployment/prod-api' to inspect past revision numbers for instant rollback capability.",
        troubleshooting: "If pods enter ImagePullBackOff, ensure the EKS worker nodes have an IAM role with ecr:BatchGetImage and ecr:GetDownloadUrlForLayer permissions."
      }
    ]
  }
};

const dockerLabsData = require('./dockerLabsData.js');
Object.assign(module.exports, dockerLabsData);

const kubernetesLabsData = require('./kubernetesLabsData.js');
Object.assign(module.exports, kubernetesLabsData);


