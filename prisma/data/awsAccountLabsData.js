/**
 * Dedicated Practical Labs for Module 1: AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure
 * Aligned with the MicroDegree AWS Account Creation Guide
 *
 * Lab 1.1: aws-account-creation-root-security-iam
 * Lab 1.2: accidental-charges-cost-explorer-support-refunds
 * Lab 1.3: regions-azs-and-edge-infrastructure
 */

const awsAccountLabs = {
  "aws-account-creation-root-security-iam": {
    title: "Lab 1.1: AWS Free Tier Account Setup, Root MFA Hardening & AWS Budgets Alert ($1)",
    level: "Beginner",
    estimatedMinutes: 45,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Account Registration & Identity Verification Checklist",
        description: "Open the AWS Management Console sign-up portal, input personal email, verify email verification code, configure strong root password, and select the Free Tier 6-month trial plan.",
        command: "# Verification Step: Query current identity once account is active\naws sts get-caller-identity",
        expectedOutput: `{\n  "UserId": "123456789012",\n  "Account": "123456789012",\n  "Arn": "arn:aws:iam::123456789012:root"\n}`,
        verification: "Run 'aws sts get-caller-identity' to verify your 12-digit AWS Account ID.",
        troubleshooting: "If account activation email is delayed, verify that international transactions are enabled on your card and check SMS spam filters."
      },
      {
        stepNumber: 2,
        title: "Root Account Virtual MFA Device Hardening",
        description: "Secure the supreme Root account by activating a Virtual Multi-Factor Authentication (MFA) device using Google Authenticator or Authy.",
        command: "aws iam create-virtual-mfa-device \\\n  --virtual-mfa-device-name root-virtual-mfa \\\n  --outfile /tmp/QRCode.png \\\n  --bootstrap-method QRCodePNG",
        expectedOutput: "Virtual MFA device created. Scan /tmp/QRCode.png with your authenticator app and submit two consecutive 6-digit TOTP codes.",
        verification: "Log out of the AWS Console and verify that sign-in requires both the root password and the 6-digit rotating MFA code.",
        troubleshooting: "If MFA codes are rejected, check the time synchronization settings on your mobile device (time drift causes TOTP failure)."
      },
      {
        stepNumber: 3,
        title: "Provision Admin IAM User & Enforce Least Privilege",
        description: "Create a dedicated IAM administrative user for day-to-day operations so the Root account never needs to be used for development tasks.",
        command: "aws iam create-user --user-name cloud-admin\naws iam attach-user-policy --user-name cloud-admin --policy-arn arn:aws:iam::aws:policy/AdministratorAccess\naws iam create-login-profile --user-name cloud-admin --password 'InitialPass123!@#' --password-reset-required",
        expectedOutput: "IAM user 'cloud-admin' created with AdministratorAccess policy and forced password rotation upon initial login.",
        verification: "Sign in to the AWS Console using the custom IAM sign-in URL: https://<account-id>.signin.aws.amazon.com/console as 'cloud-admin'.",
        troubleshooting: "Ensure you attach the AdministratorAccess managed policy so you have permissions to manage EC2, VPC, and S3."
      },
      {
        stepNumber: 4,
        title: "Deploy Automated AWS Budget Alert ($1.00 USD Threshold)",
        description: "Deploy an automated AWS Budget with an absolute $1.00 monthly spending limit triggering immediate email alerts at 80% and 100% of threshold.",
        command: `cat << 'EOF' > /tmp/budget.json
{
  "BudgetLimit": { "Amount": "1.0", "Unit": "USD" },
  "BudgetName": "Zero-Cost-Safety-Budget",
  "BudgetType": "COST",
  "CostTypes": { "IncludeTax": true, "IncludeSubscription": true, "UseBlended": false },
  "TimeUnit": "MONTHLY"
}
EOF
aws budgets create-budget --account-id $(aws sts get-caller-identity --query Account --output text) --budget file:///tmp/budget.json`,
        expectedOutput: "Budget 'Zero-Cost-Safety-Budget' successfully created with 1.00 USD monthly threshold.",
        verification: "Open AWS Billing Console -> Budgets and verify the active status and email subscriber list of Zero-Cost-Safety-Budget.",
        troubleshooting: "Ensure your IAM user has the 'budgets:*' permission policy attached to create cost monitoring objects."
      },
      {
        stepNumber: 5,
        title: "Audit Free Tier Dashboard & Service Usage",
        description: "Inspect the AWS Free Tier Dashboard to monitor consumption quotas across Amazon EC2 (750 hours), Amazon S3 (5 GB), and EBS (30 GB).",
        command: "aws ec2 describe-instance-types \\\n  --filters Name=free-tier-eligible,Values=true \\\n  --query 'InstanceTypes[*].{Type:InstanceType,vCPU:VCpuInfo.DefaultVCpus,RAM_MiB:MemoryInfo.SizeInMiB}' \\\n  --output table",
        expectedOutput: "Displays eligible free-tier instance types (t2.micro and t3.micro with 1 vCPU and 1024 MiB RAM).",
        verification: "Confirm that only t2.micro or t3.micro are selected when launching virtual servers.",
        troubleshooting: "If t2.micro is not available in newer AWS regions, use t3.micro which is also free-tier eligible in those locations."
      },
      {
        stepNumber: 6,
        title: "Verify Account Cleanup & Security Baseline",
        description: "Execute a baseline audit to confirm that zero unneeded compute, storage, or unattached IP resources are active in your account.",
        command: "aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' --output table\naws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[*].VolumeId' --output text",
        expectedOutput: "No running instances or unattached EBS volumes found. Clean baseline verified.",
        verification: "Confirm that current month spend in AWS Cost Explorer is $0.00.",
        troubleshooting: "If instances appear, terminate them immediately via 'aws ec2 terminate-instances --instance-ids <id>'."
      }
    ]
  },

  "accidental-charges-cost-explorer-support-refunds": {
    title: "Lab 1.2: Cost Explorer Telemetry, Resource Cleanup Drills & AWS Support Refund Simulation",
    level: "Intermediate",
    estimatedMinutes: 50,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Simulate an Accidental High-Cost Service Audit",
        description: "Query AWS Cost Explorer programmatically to extract daily unblended cost metrics grouped by service and identify unexpected charges.",
        command: "aws ce get-cost-and-usage \\\n  --time-period Start=$(date -d '7 days ago' +%Y-%m-%d),End=$(date +%Y-%m-%d) \\\n  --granularity DAILY \\\n  --metrics 'UnblendedCost' \\\n  --group-by Type=DIMENSION,Key=SERVICE \\\n  --output table",
        expectedOutput: "Tabular breakdown of daily expenditures showing services generating nonzero costs (e.g. Amazon EC2, Amazon EBS, NAT Gateway).",
        verification: "Verify which service contributed the largest dollar amount over the analyzed billing window.",
        troubleshooting: "If Cost Explorer is disabled, open the Billing Console and enable Cost Explorer (takes up to 24 hours to generate historical data)."
      },
      {
        stepNumber: 2,
        title: "Unattached Elastic IP Discovery & Immediate Release",
        description: "Detect idle Elastic IPs incurring the hourly unattached penalty ($0.005/hr) and release them back to the AWS public IPv4 pool.",
        command: "aws ec2 describe-addresses \\\n  --query 'Addresses[?InstanceId==null].{IP:PublicIp,AllocationId:AllocationId}' \\\n  --output table",
        expectedOutput: "Lists all unattached Elastic IPs. If any exist, release them with 'aws ec2 release-address --allocation-id <id>'.",
        verification: "Re-run the command to confirm zero idle Elastic IPs remain allocated.",
        troubleshooting: "If an IP is associated with a stopped instance, disassociate the address first before attempting to release it."
      },
      {
        stepNumber: 3,
        title: "Orphan EBS Volume & Forgotten Snapshot Cleanup Drill",
        description: "Identify and permanently purge 'available' (unattached) EBS block storage volumes and aged snapshots left behind by terminated EC2 instances.",
        command: "aws ec2 describe-volumes \\\n  --filters Name=status,Values=available \\\n  --query 'Volumes[*].{VolumeId:VolumeId,Size:Size,CreateTime:CreateTime}' \\\n  --output table",
        expectedOutput: "Lists unattached volumes. Purge using: aws ec2 delete-volume --volume-id <VolumeId>.",
        verification: "Verify 'aws ec2 describe-volumes --filters Name=status,Values=available' returns an empty array.",
        troubleshooting: "If volume deletion is blocked, check if an automated AWS Backup policy has locked the volume."
      },
      {
        stepNumber: 4,
        title: "Multi-Region Resource Sweep Across All Global Regions",
        description: "Execute a cross-region script to audit and detect rogue EC2 instances running in forgotten global regions (e.g. Frankfurt, Sydney, Tokyo).",
        command: `for region in $(aws ec2 describe-regions --query 'Regions[*].RegionName' --output text); do
  count=$(aws ec2 describe-instances --region $region --filters Name=instance-state-name,Values=running --query 'length(Reservations[*].Instances[*])')
  if [ "$count" -gt 0 ]; then
    echo "WARNING: $count running instance(s) found in $region!"
  else
    echo "Region $region: Clean (0 running instances)"
  fi
done`,
        expectedOutput: "Iterates through all 30+ AWS regions, verifying that zero running instances exist outside your designated home region.",
        verification: "Ensure all regions return 'Clean (0 running instances)'.",
        troubleshooting: "If a region check hangs, verify your network allows outbound TLS to regional AWS API endpoints."
      },
      {
        stepNumber: 5,
        title: "Draft & Validate an AWS Billing Support Refund Appeal",
        description: "Draft a formal, polite one-time courtesy refund appeal case in accordance with AWS Support Center guidelines for accidental learning usage.",
        command: `cat << 'EOF' > /tmp/support_appeal.txt
Case Type: Account and billing support
Category: Dispute a charge / Accidental usage refund
Subject: Request for one-time courtesy refund for unintentional learning charges

Hello AWS Billing Support Team,

I am a student / new AWS Free Tier user learning cloud engineering. I accidentally launched resources outside the Free Tier limits in region [Region Name]. 

As soon as I discovered the charge in Cost Explorer, I immediately terminated all running instances, deleted unattached EBS volumes, and released all Elastic IPs across all regions. My account is now verified clean.

I have also configured an AWS Budget alert ($1.00 threshold) to prevent future overrun. As this was an honest mistake during learning, I kindly request a one-time courtesy refund or credit for this billing cycle.

Thank you for your assistance,
[Your Name] - Account ID: $(aws sts get-caller-identity --query Account --output text)
EOF
cat /tmp/support_appeal.txt`,
        expectedOutput: "Formatted support appeal template verified with active Account ID injected.",
        verification: "Open AWS Support Center (Console -> Support -> Support Center -> Create Case) and paste the structured message.",
        troubleshooting: "Remember that Basic Support accounts have 100% free access to Account and Billing support specialists."
      },
      {
        stepNumber: 6,
        title: "Configure Emergency Kill-Switch Alarm in CloudWatch",
        description: "Create an estimated billing alarm in Amazon CloudWatch that alerts your mobile phone or Slack whenever total charges exceed $5.00.",
        command: "aws cloudwatch put-metric-alarm \\\n  --alarm-name 'Billing-Emergency-Threshold-5USD' \\\n  --metric-name 'EstimatedCharges' \\\n  --namespace 'AWS/Billing' \\\n  --statistic Maximum \\\n  --period 21600 \\\n  --threshold 5.0 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 1",
        expectedOutput: "CloudWatch metric alarm 'Billing-Emergency-Threshold-5USD' armed and active in us-east-1.",
        verification: "Run 'aws cloudwatch describe-alarms --alarm-names Billing-Emergency-Threshold-5USD' to verify state.",
        troubleshooting: "Billing metrics are published exclusively in us-east-1 (N. Virginia), regardless of where your infrastructure runs."
      }
    ]
  },

  "regions-azs-and-edge-infrastructure": {
    title: "Lab 1.3: Multi-Region Latency Probing, Availability Zone Mapping & Edge Distribution",
    level: "Beginner",
    estimatedMinutes: 40,
    freeTierSafe: true,
    steps: [
      {
        stepNumber: 1,
        title: "Audit Available Commercial Regions",
        description: "List all enabled commercial AWS regions worldwide and inspect their regional API endpoints.",
        command: "aws ec2 describe-regions \\\n  --all-regions \\\n  --query 'Regions[*].{Region:RegionName,Endpoint:Endpoint}' \\\n  --output table",
        expectedOutput: "Displays all AWS regions (e.g. ap-south-1 Mumbai, us-east-1 N. Virginia, eu-west-1 Ireland) and their DNS endpoints.",
        verification: "Identify your lowest-latency home region based on geographical proximity.",
        troubleshooting: "Some newer regions (e.g. ap-south-2 Hyderabad) require explicit account opt-in under Account Settings."
      },
      {
        stepNumber: 2,
        title: "Availability Zone & Immutable AZ ID Mapping",
        description: "Inspect the physical Availability Zones within your home region and map randomized AZ names (ap-south-1a) to physical AZ IDs (aps1-az1).",
        command: "aws ec2 describe-availability-zones \\\n  --region ap-south-1 \\\n  --query 'AvailabilityZones[*].{ZoneName:ZoneName,ZoneId:ZoneId,State:State}' \\\n  --output table",
        expectedOutput: "Displays ZoneName (ap-south-1a, ap-south-1b, ap-south-1c) paired with immutable physical ZoneIds (aps1-az1, aps1-az2, aps1-az3).",
        verification: "Understand that ZoneId represents the true physical datacenter building across different AWS accounts.",
        troubleshooting: "Ensure you pass the '--region' flag if your default AWS CLI configuration points to another region."
      },
      {
        stepNumber: 3,
        title: "Benchmark Network Latency Across Global Regions",
        description: "Execute ICMP ping and HTTP handshake latency tests from your local terminal to measure round-trip times (RTT) across global regions.",
        command: `echo "=== Ping Latency Benchmark ==="
for endpoint in "ec2.ap-south-1.amazonaws.com" "ec2.us-east-1.amazonaws.com" "ec2.eu-central-1.amazonaws.com"; do
  echo -n "$endpoint: "
  ping -c 3 $endpoint | tail -1 | awk -F '/' '{print $5 " ms"}'
done`,
        expectedOutput: "Outputs average round-trip latency in milliseconds, demonstrating that closest geographic region offers fastest response.",
        verification: "Compare local region (< 50ms) against cross-continental regions (> 200ms).",
        troubleshooting: "If ping is blocked by corporate firewall, use 'curl -o /dev/null -s -w '%{time_total}s\\n' https://<endpoint>' instead."
      },
      {
        stepNumber: 4,
        title: "Create an Amazon S3 Bucket in a Specific Region",
        description: "Provision a free-tier eligible Amazon S3 bucket pinned strictly to your home region to satisfy local data residency requirements.",
        command: "BUCKET_NAME=\"aws-cloud-lab-$(date +%s)\"\naws s3api create-bucket \\\n  --bucket $BUCKET_NAME \\\n  --region ap-south-1 \\\n  --create-bucket-configuration LocationConstraint=ap-south-1",
        expectedOutput: `{\n  "Location": "http://$BUCKET_NAME.s3.amazonaws.com/"\n}`,
        verification: "Run 'aws s3 ls' to verify the regional bucket exists and is listed.",
        troubleshooting: "Bucket names must be globally unique across all AWS customers worldwide; if creation fails, append random digits."
      },
      {
        stepNumber: 5,
        title: "Upload Static Content & Enable Edge Acceleration",
        description: "Upload an HTML file to the regional S3 bucket and inspect how Amazon CloudFront Edge Locations cache the content globally.",
        command: `echo "<h1>AWS Global Infrastructure Multi-Region Lab</h1>" > /tmp/index.html
aws s3 cp /tmp/index.html s3://$BUCKET_NAME/index.html
aws s3api get-bucket-location --bucket $BUCKET_NAME`,
        expectedOutput: "File uploaded successfully to regional S3 storage bucket; location confirms pinned region.",
        verification: "Verify upload via 'aws s3 ls s3://$BUCKET_NAME/'.",
        troubleshooting: "Ensure you do not enable public read permissions without CloudFront Origin Access Control (OAC) to maintain security."
      },
      {
        stepNumber: 6,
        title: "Lab Teardown & Clean Baseline Verification",
        description: "Permanently delete the test S3 bucket and uploaded assets to guarantee zero ongoing storage costs under the Free Tier.",
        command: "aws s3 rb s3://$BUCKET_NAME --force",
        expectedOutput: "Bucket and objects deleted successfully.",
        verification: "Run 'aws s3 ls' to confirm the test bucket is gone.",
        troubleshooting: "The '--force' flag deletes all remaining objects inside the bucket before removing the bucket itself."
      }
    ]
  }
};

module.exports = awsAccountLabs;

