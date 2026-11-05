/**
 * Dedicated Structured Notes for Module 1: AWS Cloud Account Setup, Free Tier Governance & Global Infrastructure
 * Aligned with the MicroDegree AWS Account Creation Guide
 *
 * Topic 1: aws-account-creation-root-security-iam
 * Topic 2: accidental-charges-cost-explorer-support-refunds
 * Topic 3: regions-azs-and-edge-infrastructure
 */

module.exports = {
  "aws-account-creation-root-security-iam": {
    simpleExplanation: "Creating an AWS account is like registering for a global virtual data center. Before you launch any servers, you must pass 5 prerequisites (email, phone OTP, international card verification, stable internet, and address), lock down the all-powerful Root account with Multi-Factor Authentication (MFA), create a dedicated IAM user for daily tasks, and set a strict $1 AWS Budget alert so unexpected charges never surprise you.",
    coreConceptsJson: JSON.stringify([
      { name: "Prerequisites for Account Creation", description: "Unique personal email (root ID), mobile phone for SMS/Voice OTP verification, and an international payment-enabled credit/debit card (charged ~₹2 or $1 refundable verification fee)." },
      { name: "Root User vs IAM User", description: "The Root user has irrevocable full administrative control over all AWS resources and billing; it must NEVER be used for daily engineering. IAM users provide controlled, auditable access with specific permissions." },
      { name: "Multi-Factor Authentication (MFA)", description: "Mandatory security layer requiring a time-based one-time password (TOTP via Google Authenticator or Authy) or hardware token in addition to the root password." },
      { name: "AWS Free Tier Types", description: "Credit-based new user trial (up to $200 credits for 6 months), 12-Months Free services (e.g. 750 hrs/month of t2.micro/t3.micro EC2, 5GB S3 standard storage), and Always-Free services (e.g. 1 Million Lambda requests, 25GB DynamoDB)." },
      { name: "AWS Budgets ($1 Guardrail)", description: "Proactive cost alert triggering automated emails when forecasted or actual spend crosses a defined threshold (e.g. $1 or ₹100)." },
      { name: "Basic Support Plan", description: "100% free support tier included with all accounts offering 24/7 access to customer service, documentation, Personal Health Dashboard, and basic Trusted Advisor checks." }
    ]),
    internalsExplanation: `### AWS Account Creation & Security Internals

#### 1. Identity Verification & Fraud Prevention Pipeline
When you submit the registration form:
1. **Financial Verification Check:** AWS initiates an automated authorization ping (~₹2 in India, $1 USD globally) against Visa, MasterCard, or Amex network via an international payment gateway to confirm card authenticity. The pre-authorization charge is automatically voided/refunded.
2. **Telephony Verification:** An automated IVR or SMS gateway dispatches a 4-to-6 digit OTP to confirm human ownership and prevent automated bot account generation.
3. **Global Multi-Factor Identity Graph:** AWS evaluates phone number, billing address, card BIN (last 4 digits + issuer), and IP/device fingerprint against their global fraud database. Each physical human identity is strictly entitled to **one Free Tier** lifecycle.

#### 2. Root Account Hardening Standard
- The **Root User** identity is defined solely by the registration email address. It bypasses all IAM permission policies, Service Control Policies (SCPs), and permission boundaries.
- **Immediate Post-Creation Security Checklist:**
  1. Enable Virtual MFA on the Root user using an authenticator app (Authy, 1Password, or Google Authenticator).
  2. Create an IAM User with \`AdministratorAccess\` for development and provisioning tasks.
  3. Enable AWS IAM Identity Center (SSO) or configure strong password policies.
  4. Secure and store the root credentials in an enterprise password vault; never generate Access Keys (\`AKIA...\`) for the root account.

#### 3. Free Tier Compute & Storage Ceilings
- **Amazon EC2:** 750 combined hours per month of \`t2.micro\` (or \`t3.micro\` in regions where t2 is unavailable). Running two \`t2.micro\` instances 24/7 consumes 1,488 hours, resulting in 738 billable hours!
- **Amazon S3:** 5 GB of standard storage, 20,000 GET requests, and 2,000 PUT requests per month.
- **Amazon EBS:** 30 GB of General Purpose (gp2/gp3) or Magnetic volume storage and 2 million I/Os.`,
    architectureSvg: `<svg viewBox="0 0 850 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="840" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Stage 1: Registration & Verification -->
      <g transform="translate(25, 35)">
        <rect width="175" height="170" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="87" y="26" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">1. PREREQUISITES</text>
        <rect x="12" y="42" width="151" height="28" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="87" y="59" fill="#F8FAFC" font-size="8.5" text-anchor="middle">Personal Email (Root ID)</text>
        <rect x="12" y="76" width="151" height="28" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="87" y="93" fill="#34D399" font-size="8.5" text-anchor="middle">Mobile OTP Verification</text>
        <rect x="12" y="110" width="151" height="42" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="87" y="126" fill="#FBBF24" font-size="8" font-family="monospace" text-anchor="middle">International Card</text>
        <text x="87" y="140" fill="#94A3B8" font-size="7" text-anchor="middle">₹2 / $1 Refundable Ping</text>
      </g>
      
      <path d="M 200 120 L 235 120" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="240,120 230,115 230,125" fill="#38BDF8"/>
      
      <!-- Stage 2: Account Activation & Plan -->
      <g transform="translate(240, 35)">
        <rect width="175" height="170" rx="8" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="87" y="26" fill="#C084FC" font-size="11" font-weight="bold" text-anchor="middle">2. ACCOUNT SETUP</text>
        <rect x="12" y="42" width="151" height="34" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="87" y="58" fill="#F8FAFC" font-size="8.5" text-anchor="middle">Free Tier (6-Mo / $200)</text>
        <text x="87" y="70" fill="#94A3B8" font-size="7" text-anchor="middle">Select Services Included</text>
        <rect x="12" y="84" width="151" height="34" rx="4" fill="#0F172A" stroke="#06B6D4" stroke-width="1"/>
        <text x="87" y="100" fill="#22D3EE" font-size="8.5" text-anchor="middle">Basic Support Plan</text>
        <text x="87" y="112" fill="#94A3B8" font-size="7" text-anchor="middle">Free 24/7 Access &amp; Health</text>
        <rect x="12" y="126" width="151" height="28" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="87" y="143" fill="#10B981" font-size="8" font-weight="bold" text-anchor="middle">Console Activated</text>
      </g>
      
      <path d="M 415 120 L 450 120" stroke="#A855F7" stroke-width="2.5"/>
      <polygon points="455,120 445,115 445,125" fill="#A855F7"/>
      
      <!-- Stage 3: Root Hardening & MFA -->
      <g transform="translate(455, 35)">
        <rect width="175" height="170" rx="8" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
        <text x="87" y="26" fill="#F87171" font-size="11" font-weight="bold" text-anchor="middle">3. ROOT HARDENING</text>
        <rect x="12" y="42" width="151" height="48" rx="4" fill="#1E293B" stroke="#EF4444" stroke-width="1"/>
        <text x="87" y="58" fill="#EF4444" font-size="8" font-weight="bold" text-anchor="middle">Enable Virtual MFA</text>
        <text x="87" y="72" fill="#94A3B8" font-size="7" text-anchor="middle">Google Auth / Authy / YubiKey</text>
        <text x="87" y="84" fill="#F87171" font-size="7" text-anchor="middle">LOCK ROOT CREDENTIALS</text>
        <rect x="12" y="98" width="151" height="48" rx="4" fill="#1E293B" stroke="#10B981" stroke-width="1"/>
        <text x="87" y="114" fill="#34D399" font-size="8.5" font-weight="bold" text-anchor="middle">Create IAM Admin User</text>
        <text x="87" y="128" fill="#94A3B8" font-size="7" text-anchor="middle">Daily Engineering Tasks</text>
        <text x="87" y="140" fill="#34D399" font-size="7" text-anchor="middle">Enforce Least Privilege</text>
      </g>
      
      <path d="M 630 120 L 665 120" stroke="#10B981" stroke-width="2.5"/>
      <polygon points="670,120 660,115 660,125" fill="#10B981"/>
      
      <!-- Stage 4: Cost Guardrails -->
      <g transform="translate(670, 35)">
        <rect width="155" height="170" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="77" y="26" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">4. COST SAFETY</text>
        <rect x="10" y="42" width="135" height="44" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="77" y="58" fill="#10B981" font-size="8.5" font-weight="bold" text-anchor="middle">AWS Budgets Alert</text>
        <text x="77" y="72" fill="#34D399" font-size="8" font-family="monospace" text-anchor="middle">Threshold: $1.00</text>
        <rect x="10" y="94" width="135" height="52" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="77" y="110" fill="#FBBF24" font-size="8" font-weight="bold" text-anchor="middle">Free Tier Dashboard</text>
        <text x="77" y="124" fill="#94A3B8" font-size="7" text-anchor="middle">EC2: t2/t3.micro (750h)</text>
        <text x="77" y="138" fill="#94A3B8" font-size="7" text-anchor="middle">S3: 5GB / EBS: 30GB</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws sts get-caller-identity", explanation: "Verifies whether you are currently operating as the root user (arn:aws:iam::account:root) or an IAM user/role." },
      { command: "aws iam create-account-alias --account-alias my-company-cloud-lab", explanation: "Replaces the cumbersome 12-digit AWS account number with a human-readable custom sign-in URL." },
      { command: "aws iam create-user --user-name cloud-admin", explanation: "Creates a dedicated unprivileged or admin IAM user to replace root account usage." },
      { command: "aws iam attach-user-policy --user-name cloud-admin --policy-arn arn:aws:iam::aws:policy/AdministratorAccess", explanation: "Attaches administrative privileges to the newly created IAM user for everyday cloud provisioning." },
      { command: "aws budgets create-budget --account-id 123456789012 --budget file://budget.json --notifications-with-subscribers file://notifications.json", explanation: "Automates deployment of a $1 USD budget alert triggering instantaneous email warnings." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never generate AWS Access Keys (access key ID & secret access key) for the Root account.",
      "Enable hardware or virtual MFA on the root account and retain emergency recovery phone numbers.",
      "Set an AWS Budget alert with a $1.00 threshold on day one before launching any infrastructure.",
      "Stick strictly to free-tier eligible instance types (t2.micro or t3.micro) and single-region deployments (e.g. ap-south-1 Mumbai or us-east-1).",
      "Regularly review the Free Tier Dashboard under AWS Billing to track percentage consumption of free limits."
    ]),
    securityNotes: "The Root user is the supreme authority in an AWS account. If root credentials leak without MFA, attackers can spin up massive GPU clusters, rack up thousands of dollars in debt, lock you out of the account, and delete all backups within minutes.",
    costImplications: "AWS Free Tier provides up to $200 in promotional trial credits for select services for 6 months, plus 12-Months Free for t2.micro/t3.micro (750 hrs/mo) and 5GB S3. Exceeding limits immediately transitions usage to standard on-demand pay-as-you-go pricing.",
    commonMistakesJson: JSON.stringify([
      "Using the root account email and password for everyday development and Docker/Git CLI interactions.",
      "Running two t2.micro instances concurrently 24/7, which consumes 1,488 hours and exceeds the 750 hour/month free tier ceiling.",
      "Creating access keys for root and committing them into a public GitHub repository.",
      "Selecting a paid support plan (Developer $29/mo or Business $100/mo) during signup instead of the Basic Free tier."
    ]),
    quickRevisionJson: JSON.stringify([
      "Prerequisites: Unique email, mobile number for OTP, international debit/credit card (refundable ~₹2/$1 verification).",
      "Support Plan: Choose 'Basic Support - Free' ($0/month, 24/7 service access).",
      "Security Priority #1: Enable MFA on Root user and create an IAM Admin user.",
      "Cost Priority #1: Set a $1 Budget Alert in AWS Billing & Cost Management.",
      "Compute Free Tier: 750 hours/month of t2.micro or t3.micro (1 instance running 24/7)."
    ])
  },

  "accidental-charges-cost-explorer-support-refunds": {
    simpleExplanation: "If you receive an unexpected AWS charge, don't panic! AWS provides tools to immediately identify what caused the bill (Billing Dashboard & Cost Explorer), stop ongoing bleeding (terminating EC2, deleting unattached EBS volumes, releasing idle Elastic IPs, and checking all regions), and open a free Account & Billing support case. When you explain politely that you are a student/learner and have cleaned up the resources, AWS billing specialists frequently approve a one-time courtesy refund.",
    coreConceptsJson: JSON.stringify([
      { name: "Root Cause Diagnosis (Bills vs Cost Explorer)", description: "Bills provides monthly invoice summaries by service. Cost Explorer provides granular daily and hourly usage telemetry filterable by Service, Region, and Usage Type." },
      { name: "The 'Stopped EC2' Storage Trap", description: "Stopping an EC2 instance halts hourly compute ($0/hr), but the underlying Elastic Block Store (EBS) root and data volumes continue to incur storage fees ($0.08-$0.10/GB/month) until explicitly deleted." },
      { name: "Unattached Elastic IP Penalty", description: "AWS charges an hourly penalty fee for Elastic IP addresses that are allocated to your account but NOT attached to a running instance." },
      { name: "Multi-Region Audit Walkthrough", description: "AWS resources are billed regionally. A forgotten database or VM running in Frankfurt (eu-central-1) will accrue charges even if you only check your console in us-east-1." },
      { name: "AWS Support Case Appeal", description: "Account and Billing support cases are 100% free for all accounts. Polite, transparent communication confirming resource termination yields a 90%+ refund approval rate for first-time accidental usage." },
      { name: "Multi-Factor Fraud Detection & Free Tier Limits", description: "AWS uses ML and identity tracking (phone, card, billing address, IP patterns) to enforce one Free Tier per global individual; attempts to circumvent this trigger 'Free Tier Ineligible' restrictions." }
    ]),
    internalsExplanation: `### Accidental Charges Triage & Support Resolution Architecture

#### 1. Forensic Analysis in Cost Explorer
1. Navigate to **AWS Billing and Cost Management** -> **Cost Explorer**.
2. Set Time Range to the dates when charges occurred.
3. Set **Granularity** to **Daily**.
4. Set **Group By** to **Service** -> Immediately reveals whether EC2, S3, RDS, NAT Gateway, or KMS caused the spike.
5. Drill down by changing **Group By** to **Region** and then **Usage Type** (e.g. \`BoxUsage:t3.xlarge\` indicates an accidental high-spec instance; \`NatGateway-Bytes\` indicates runaway internet download).

#### 2. Immediate Resource Termination Protocol
Charges continue to accumulate every second until resources are completely destroyed:
- **Compute:** EC2 instances -> Select -> **Instance State** -> **Terminate Instance**.
- **Block Storage:** EC2 Dashboard -> **Volumes (EBS)** -> Filter by \`State == available\` (unattached) -> **Actions** -> **Delete Volume**. Delete associated snapshots.
- **Networking:** EC2 Dashboard -> **Elastic IPs** -> Select unassociated IPs -> **Actions** -> **Release Elastic IP addresses**.
- **Object Storage:** S3 Dashboard -> Select bucket -> **Empty** -> Confirm deletion -> **Delete bucket** (purges data and stops cross-region replication fees).
- **Global Check:** Systematically toggle through all 30+ AWS regions using the region drop-down in the console header to confirm zero running resources.

#### 3. Opening an Account & Billing Support Case
- **Eligibility:** All AWS accounts (even with $0 Basic Support) have full access to AWS Billing Support specialists via ticket or live chat.
- **Case Configuration:**
  - Case Type: **Account and billing support**
  - Service: **Billing**
  - Category: **Dispute a charge / Refund request**
  - Contact Method: **Chat** (fastest, typically under 5 minutes) or **Web / Email** (replies within 24 hours).
- **The Golden Refund Template:**
  \`\`\`text
  Subject: Request for one-time courtesy refund for accidental learning usage

  Hello AWS Billing Support Team,

  I am a student / new AWS Free Tier user learning cloud engineering. I accidentally launched an instance / service in region [Region Name] (e.g. ap-south-1) and was unaware that it fell outside the Free Tier limits.

  As soon as I identified the unexpected charge on my Billing Dashboard, I immediately stopped and terminated all related resources (EC2 instances, EBS volumes, Elastic IPs, and S3 data). I have verified that no resources are currently running in any region.

  I have also configured an AWS Budget alert ($1.00 threshold) to ensure this does not happen again. Given that this was an unintentional mistake during learning, I kindly request a one-time courtesy refund or credit for this specific billing cycle.

  Thank you for your understanding and support,
  [Your Name]
  [AWS Account ID: 12-digit number]
  \`\`\`

#### 4. The Multi-Factor Identity & Free Tier "Reset" Myth
- Many users mistakenly believe that creating a new Gmail account gives them a brand-new Free Tier.
- **AWS Fraud & Identity Engine:**
  - Correlates Credit Card PAN (last 4 digits + BIN) + Name on card.
  - Correlates Mobile Phone OTP number (+91...).
  - Correlates Billing Address and Postal Code.
  - Correlates IP address subnets and browser telemetry.
- **Consequence:** Re-registering with the same card/phone flags the new account as **"Free Tier Ineligible"** or triggers account suspension.
- **Remedy:** Do NOT create duplicate accounts. Use AWS Password Recovery on your original root account, or contact support to merge accounts.`,
    architectureSvg: `<svg viewBox="0 0 850 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="840" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Step 1: Detect & Drill Down -->
      <g transform="translate(25, 35)">
        <rect width="180" height="170" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="1.5"/>
        <text x="90" y="26" fill="#F87171" font-size="10.5" font-weight="bold" text-anchor="middle">1. ROOT CAUSE TRIAGE</text>
        <rect x="12" y="42" width="156" height="34" rx="4" fill="#0F172A" stroke="#EF4444" stroke-width="1"/>
        <text x="90" y="58" fill="#F8FAFC" font-size="8.5" text-anchor="middle">Bills Dashboard</text>
        <text x="90" y="70" fill="#94A3B8" font-size="7" text-anchor="middle">Identify Top Billable Service</text>
        <rect x="12" y="84" width="156" height="42" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="90" y="100" fill="#FBBF24" font-size="8.5" text-anchor="middle">Cost Explorer Drilldown</text>
        <text x="90" y="112" fill="#94A3B8" font-size="7" text-anchor="middle">Group by Service -> Region</text>
        <text x="90" y="122" fill="#38BDF8" font-size="7" text-anchor="middle">Check UsageType (e.g. EBS gp3)</text>
        <rect x="12" y="132" width="156" height="24" rx="4" fill="#0F172A" stroke="#EF4444" stroke-width="1"/>
        <text x="90" y="148" fill="#EF4444" font-size="7.5" font-weight="bold" text-anchor="middle">Check ALL 30+ Regions!</text>
      </g>
      
      <path d="M 205 120 L 240 120" stroke="#EF4444" stroke-width="2.5"/>
      <polygon points="245,120 235,115 235,125" fill="#EF4444"/>
      
      <!-- Step 2: Stop Charges Immediately -->
      <g transform="translate(245, 35)">
        <rect width="180" height="170" rx="8" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="90" y="26" fill="#FBBF24" font-size="10.5" font-weight="bold" text-anchor="middle">2. STOP THE BLEEDING</text>
        <rect x="12" y="42" width="156" height="26" rx="4" fill="#1E293B" stroke="#F59E0B" stroke-width="1"/>
        <text x="90" y="59" fill="#F8FAFC" font-size="8" text-anchor="middle">Terminate EC2 Instances</text>
        <rect x="12" y="72" width="156" height="26" rx="4" fill="#1E293B" stroke="#EF4444" stroke-width="1"/>
        <text x="90" y="89" fill="#F87171" font-size="8" text-anchor="middle">Delete Unattached EBS Disks</text>
        <rect x="12" y="102" width="156" height="26" rx="4" fill="#1E293B" stroke="#A855F7" stroke-width="1"/>
        <text x="90" y="119" fill="#C084FC" font-size="8" text-anchor="middle">Release Idle Elastic IPs</text>
        <rect x="12" y="132" width="156" height="26" rx="4" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="149" fill="#38BDF8" font-size="8" text-anchor="middle">Empty &amp; Delete S3 Buckets</text>
      </g>
      
      <path d="M 425 120 L 460 120" stroke="#F59E0B" stroke-width="2.5"/>
      <polygon points="465,120 455,115 455,125" fill="#F59E0B"/>
      
      <!-- Step 3: Contact Support -->
      <g transform="translate(465, 35)">
        <rect width="180" height="170" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="90" y="26" fill="#38BDF8" font-size="10.5" font-weight="bold" text-anchor="middle">3. SUPPORT CENTER CASE</text>
        <rect x="12" y="42" width="156" height="34" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="58" fill="#F8FAFC" font-size="8.5" text-anchor="middle">Account &amp; Billing Support</text>
        <text x="90" y="70" fill="#34D399" font-size="7" text-anchor="middle">100% Free on Basic Plan</text>
        <rect x="12" y="84" width="156" height="38" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="90" y="100" fill="#34D399" font-size="8.5" text-anchor="middle">Live Chat or Ticket</text>
        <text x="90" y="112" fill="#94A3B8" font-size="7" text-anchor="middle">Response within 24 Hours</text>
        <rect x="12" y="128" width="156" height="30" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="90" y="147" fill="#38BDF8" font-size="7.5" font-family="monospace" text-anchor="middle">Attach Polite Appeal Script</text>
      </g>
      
      <path d="M 645 120 L 680 120" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="685,120 675,115 675,125" fill="#38BDF8"/>
      
      <!-- Step 4: Outcome & Guardrails -->
      <g transform="translate(685, 35)">
        <rect width="145" height="170" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="72" y="26" fill="#10B981" font-size="10.5" font-weight="bold" text-anchor="middle">4. RESOLUTION</text>
        <rect x="10" y="42" width="125" height="48" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="72" y="60" fill="#34D399" font-size="8.5" font-weight="bold" text-anchor="middle">One-Time Refund</text>
        <text x="72" y="74" fill="#F8FAFC" font-size="7.5" text-anchor="middle">Credited to Card / Bill</text>
        <text x="72" y="84" fill="#94A3B8" font-size="7" text-anchor="middle">90%+ Approval Rate</text>
        <rect x="10" y="98" width="125" height="58" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="72" y="116" fill="#FBBF24" font-size="8" font-weight="bold" text-anchor="middle">Cost Prevention</text>
        <text x="72" y="130" fill="#94A3B8" font-size="7" text-anchor="middle">Set $1 Budgets</text>
        <text x="72" y="142" fill="#94A3B8" font-size="7" text-anchor="middle">Lightsail ($3.50/mo)</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ce get-cost-and-usage --time-period Start=2026-11-01,End=2026-11-05 --granularity DAILY --metrics 'UnblendedCost' --group-by Type=DIMENSION,Key=SERVICE", explanation: "Queries Cost Explorer API to output daily spend grouped by AWS service name." },
      { command: "aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[*].{ID:VolumeId,Size:Size,Type:VolumeType,Created:CreateTime}' --output table", explanation: "Lists all unattached EBS volumes across the current region that are actively incurring storage charges." },
      { command: "aws ec2 delete-volume --volume-id vol-0123456789abcdef0", explanation: "Permanently deletes an orphan EBS disk volume to halt ongoing monthly storage fees." },
      { command: "aws ec2 describe-addresses --query 'Addresses[?InstanceId==null].{IP:PublicIp,AllocId:AllocationId}' --output table", explanation: "Discovers all unassociated Elastic IP addresses that are incurring hourly idle penalties." },
      { command: "aws ec2 release-address --allocation-id eipalloc-0123456789abcdef0", explanation: "Releases an unattached Elastic IP address back to the AWS IPv4 pool to immediately stop hourly billing." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Never simply 'stop' EC2 instances if you are finished testing; terminate them so EBS root disks are deleted automatically.",
      "Check the AWS Billing Dashboard and Cost Explorer at least once per week during active learning.",
      "Always inspect all AWS regions in the top-right console dropdown to verify no rogue resources exist in forgotten datacenters.",
      "When filing a support case, be polite, state you are a student, confirm resources are already terminated, and ask for a one-time courtesy exception.",
      "If Free Tier expires, switch to predictable low-cost alternatives like Amazon Lightsail ($3.50/mo VPS) or Spot instances (up to 90% discount)."
    ]),
    securityNotes: "Be cautious of third-party scripts or cloned GitHub repositories that spin up heavy cloud infrastructure (EKS, NAT Gateways, multi-node RDS) without teardown logic. Never share account credentials or run untrusted Terraform/CloudFormation templates.",
    costImplications: "An unattached Elastic IP costs ~$0.005/hour ($3.60/month). A forgotten 100 GB gp3 EBS volume costs $8.00/month. A running m5.large instance costs ~$70/month. Running resources in 3 forgotten regions can generate $300+ in unexpected charges in 30 days.",
    commonMistakesJson: JSON.stringify([
      "Assuming that stopping an EC2 instance stops all charges, ignoring attached EBS volumes, Elastic IPs, and snapshots.",
      "Checking only us-east-1 when accidental resources were launched in ap-south-1 Mumbai or eu-west-1 Ireland.",
      "Filing an angry or entitled support ticket before terminating the offending resources, causing the refund request to be denied.",
      "Attempting to create multiple AWS accounts using the same phone number or credit card to 'reset' the Free Tier, leading to immediate fraud flags."
    ]),
    quickRevisionJson: JSON.stringify([
      "First Response: Check Cost Explorer (Group by Service & Region) -> Terminate resources across all regions immediately.",
      "EBS Trap: Stopped EC2 instances STILL charge for EBS storage volumes until deleted.",
      "Elastic IP Trap: Unattached Elastic IPs are billed hourly.",
      "Support Case: Support Center -> 'Account and billing support' -> Free for all accounts -> Request one-time courtesy refund.",
      "Free Tier Reset Myth: AWS tracks global identity (card, phone, address, ML behavior); 1 Free Tier per person."
    ])
  },

  "regions-azs-and-edge-infrastructure": {
    simpleExplanation: "AWS Global Infrastructure is the worldwide physical foundation powering the cloud. It is divided into geographic Regions (e.g. us-east-1 N. Virginia, ap-south-1 Mumbai), physically isolated Availability Zones (clusters of datacenters within a Region connected by redundant low-latency fiber), and hundreds of Edge Locations (CloudFront points of presence that cache data close to end users worldwide).",
    coreConceptsJson: JSON.stringify([
      { name: "AWS Region", description: "A distinct physical geographic location containing two or more (typically 3+) isolated Availability Zones designed for fault tolerance and data sovereignty." },
      { name: "Availability Zone (AZ)", description: "One or more discrete physical data centers with independent power, cooling, and physical security, connected via ultra-low latency fiber networks." },
      { name: "Edge Locations (CloudFront & Route 53)", description: "Hundreds of globally distributed points of presence (PoPs) that cache web content and route DNS queries with sub-millisecond latency." },
      { name: "AWS Local Zones & Wavelength", description: "Extensions of AWS infrastructure placing compute, storage, and database services close to large population centers and 5G telecommunication networks." },
      { name: "Multi-AZ Resilience", description: "Architectural design pattern deploying active-active or active-standby workloads across multiple AZs to survive catastrophic data center fires, floods, or power grid failures." }
    ]),
    internalsExplanation: `### AWS Global Infrastructure Engineering & Topology

#### 1. Region & Availability Zone Decoupling
- **Geographic Independence:** Each AWS Region is completely isolated from all other regions. This guarantees maximum fault containment and allows organizations to comply with strict local data sovereignty laws (e.g. GDPR in Europe, RBI data localization in India).
- **Physical AZ Isolation:**
  - Every Availability Zone is situated within a meaningful distance (typically 10 to 60 miles) from other AZs in the same Region.
  - This distance is far enough to prevent a single natural disaster (flood, earthquake, power outage) from affecting multiple AZs, but close enough to maintain single-digit millisecond round-trip network latency (< 2ms).
- **AZ Naming Randomization:**
  - To prevent resource concentration, AWS dynamically maps AZ names (e.g. \`us-east-1a\`) to different physical data center clusters across different AWS accounts.
  - Your \`us-east-1a\` may be another company's \`us-east-1c\`. To coordinate physical locations across accounts, use the immutable **AZ ID** (e.g. \`use1-az1\`).

#### 2. The AWS Global Private Fiber Backbone
- Inter-region traffic, cross-AZ traffic, and API calls travel over AWS's purpose-built private transoceanic fiber network, bypassing the congested and unencrypted public internet.
- All network traffic traveling across physical AWS boundaries is automatically encrypted at the physical link layer (MACsec) with zero performance degradation.

#### 3. Edge Locations & Regional Edge Caches
- **CloudFront CDN:** Leverages 450+ Points of Presence (PoPs) worldwide. When a user requests content, DNS routes the request to the nearest edge location via Anycast routing.
- **Cache Hit vs Miss:** If the edge location does not have the cached file, it queries a **Regional Edge Cache** (larger tier) before contacting the origin server (S3 bucket or EC2 load balancer) over the dedicated AWS private backbone.`,
    architectureSvg: `<svg viewBox="0 0 850 240" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="5" y="5" width="840" height="230" rx="12" fill="#0B1120" stroke="#1E293B" stroke-width="2"/>
      
      <!-- Region Box -->
      <rect x="25" y="25" width="530" height="190" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4 2"/>
      <text x="45" y="46" fill="#38BDF8" font-size="11" font-weight="bold" font-family="monospace">AWS REGION (e.g. ap-south-1 Mumbai)</text>
      
      <!-- AZ 1 -->
      <g transform="translate(45, 60)">
        <rect width="150" height="135" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="75" y="24" fill="#34D399" font-size="10" font-weight="bold" text-anchor="middle">Availability Zone A</text>
        <text x="75" y="38" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">AZ ID: aps1-az1</text>
        <rect x="15" y="50" width="120" height="32" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="75" y="68" fill="#34D399" font-size="8" text-anchor="middle">EC2 Primary Web</text>
        <rect x="15" y="90" width="120" height="32" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
        <text x="75" y="108" fill="#38BDF8" font-size="8" text-anchor="middle">RDS Primary (Writer)</text>
      </g>
      
      <!-- AZ 2 -->
      <g transform="translate(215, 60)">
        <rect width="150" height="135" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="75" y="24" fill="#34D399" font-size="10" font-weight="bold" text-anchor="middle">Availability Zone B</text>
        <text x="75" y="38" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">AZ ID: aps1-az2</text>
        <rect x="15" y="50" width="120" height="32" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="75" y="68" fill="#34D399" font-size="8" text-anchor="middle">EC2 Standby Web</text>
        <rect x="15" y="90" width="120" height="32" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="75" y="108" fill="#C084FC" font-size="8" text-anchor="middle">RDS Standby (Sync)</text>
      </g>
      
      <!-- Sync Fiber -->
      <path d="M 195 140 L 215 140" stroke="#A855F7" stroke-width="2" stroke-dasharray="2 2"/>
      <text x="205" y="132" fill="#C084FC" font-size="6.5" text-anchor="middle">&lt; 2ms</text>
      
      <!-- AZ 3 -->
      <g transform="translate(385, 60)">
        <rect width="150" height="135" rx="6" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="75" y="24" fill="#34D399" font-size="10" font-weight="bold" text-anchor="middle">Availability Zone C</text>
        <text x="75" y="38" fill="#94A3B8" font-size="7.5" font-family="monospace" text-anchor="middle">AZ ID: aps1-az3</text>
        <rect x="15" y="50" width="120" height="32" rx="4" fill="#0F172A" stroke="#10B981" stroke-width="1"/>
        <text x="75" y="68" fill="#34D399" font-size="8" text-anchor="middle">EC2 Backup Worker</text>
        <rect x="15" y="90" width="120" height="32" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="75" y="108" fill="#FBBF24" font-size="8" text-anchor="middle">Auto Scaling Target</text>
      </g>
      
      <!-- Fiber Connectors -->
      <path d="M 555 120 L 595 120" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="600,120 590,115 590,125" fill="#38BDF8"/>
      
      <!-- Edge Network -->
      <g transform="translate(605, 35)">
        <rect width="220" height="170" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="110" y="26" fill="#FBBF24" font-size="11" font-weight="bold" text-anchor="middle">EDGE NETWORK</text>
        
        <rect x="15" y="42" width="190" height="38" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1"/>
        <text x="110" y="58" fill="#FBBF24" font-size="8.5" text-anchor="middle">450+ Edge Locations</text>
        <text x="110" y="72" fill="#94A3B8" font-size="7" text-anchor="middle">CloudFront CDN &amp; Route 53 DNS</text>
        
        <rect x="15" y="86" width="190" height="38" rx="4" fill="#0F172A" stroke="#06B6D4" stroke-width="1"/>
        <text x="110" y="102" fill="#22D3EE" font-size="8.5" text-anchor="middle">AWS Local Zones</text>
        <text x="110" y="116" fill="#94A3B8" font-size="7" text-anchor="middle">Single-Digit ms Latency to Cities</text>
        
        <rect x="15" y="130" width="190" height="34" rx="4" fill="#0F172A" stroke="#A855F7" stroke-width="1"/>
        <text x="110" y="146" fill="#C084FC" font-size="8.5" text-anchor="middle">AWS Wavelength</text>
        <text x="110" y="158" fill="#94A3B8" font-size="7" text-anchor="middle">5G Telecom Carrier Edge</text>
      </g>
    </svg>`,
    cliExamplesJson: JSON.stringify([
      { command: "aws ec2 describe-regions --all-regions --query 'Regions[*].RegionName' --output table", explanation: "Queries AWS APIs to list all available global commercial regions." },
      { command: "aws ec2 describe-availability-zones --region us-east-1 --query 'AvailabilityZones[*].{Zone:ZoneName,ID:ZoneId,Status:State}' --output table", explanation: "Maps human-readable AZ names (us-east-1a) to immutable physical AZ IDs (use1-az1)." },
      { command: "aws cloudfront list-distributions", explanation: "Inspects globally deployed CloudFront Content Delivery Network distributions." },
      { command: "ping -c 4 ec2.ap-south-1.amazonaws.com", explanation: "Measures network round-trip latency to the regional endpoint from your local workstation." }
    ]),
    bestPracticesJson: JSON.stringify([
      "Always deploy production applications across at least 2 or 3 Availability Zones to achieve High Availability (HA).",
      "Deploy stateless web servers behind an Application Load Balancer spanning multiple public subnets across AZs.",
      "Use Amazon CloudFront in front of static S3 websites to cache assets globally and shield your origin from DDoS attacks.",
      "Check regional compliance laws before choosing a region (e.g. keeping financial customer data within Indian or EU borders)."
    ]),
    securityNotes: "AWS operates under the Shared Responsibility Model: AWS manages the physical security, power, cooling, and fiber links of Global Infrastructure, while you are responsible for securing your data, IAM credentials, and operating system patches inside the cloud.",
    costImplications: "Data transfer within the same Availability Zone is free. Data transfer between two different AZs in the same Region incurs $0.01/GB. Data transfer out to the public internet incurs standard outbound egress fees ($0.09/GB).",
    commonMistakesJson: JSON.stringify([
      "Deploying all compute and database instances into a single Availability Zone, causing total downtime during an AZ-level power event.",
      "Assuming AZ 'a' in one AWS account corresponds to the exact same physical building as AZ 'a' in another account.",
      "Ignoring cross-AZ data transfer fees when designing high-throughput distributed microservices."
    ]),
    quickRevisionJson: JSON.stringify([
      "Region: Geographic area containing 3+ isolated AZs connected by private fiber.",
      "Availability Zone (AZ): One or more physical data centers with independent power/cooling.",
      "Edge Locations: 450+ global points of presence for CloudFront CDN and Route 53 DNS.",
      "Shared Responsibility Model: AWS secures 'OF the cloud'; customer secures 'IN the cloud'."
    ])
  }
};

