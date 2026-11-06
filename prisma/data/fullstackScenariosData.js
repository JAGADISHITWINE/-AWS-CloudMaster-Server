/**
 * Dedicated Real-World Troubleshooting Scenarios for Full-Stack Modules 21, 22, 23, and 24
 *
 * Module 21: Angular Enterprise Frontend Architecture
 * - angular-core-components-lifecycle-databinding
 * - angular-rxjs-services-dependency-injection
 * - angular-routing-forms-change-detection-signals
 *
 * Module 22: Node.js Scalable Backend Architecture
 * - nodejs-event-loop-libuv-async-programming
 * - nodejs-streams-buffer-file-handling
 * - express-middleware-security-performance-caching
 *
 * Module 23: RESTful APIs, Integration, Security & Performance
 * - rest-api-design-http-protocol-idempotency
 * - api-security-jwt-rbac-rate-limiting-cors
 * - api-validation-pagination-filtering-error-handling
 *
 * Module 24: Database Engineering, Query Optimization & Full-Stack System Design
 * - sql-nosql-schema-modeling-indexing
 * - query-optimization-execution-plans-caching
 * - fullstack-system-design-angular-node-integration
 */

module.exports = [
  // ==========================================
  // MODULE 21: ANGULAR ENTERPRISE FRONTEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 21,
    topicNumber: 1,
    topicSlug: "angular-core-components-lifecycle-databinding",
    title: "Scenario: Production UI Glitch & ExpressionChangedAfterItHasBeenCheckedError During Tab Switching",
    difficulty: "Advanced",
    prompt: "In an enterprise Angular banking portal, developers notice the console flooding with 'NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: false. Current value: true' whenever users switch between transaction dashboard tabs. In production dev builds, the tab header badge briefly flickers and shows inconsistent unread counts. What is the fundamental change detection mechanism causing this error, why does it only happen in development mode, and what is the architecturally correct fix?",
    explanation: "Tests deep understanding of Angular's two-phase change detection lifecycle in development mode (render pass followed by verification pass) and the danger of mutating parent state or component bindings inside ngAfterViewInit or child lifecycle hooks.",
    hintsJson: JSON.stringify([
      "Why does Angular change detection run a second verification pass in Development mode?",
      "In which lifecycle hook was the property updated: ngOnInit, ngOnChanges, or ngAfterViewInit?",
      "Can updating a parent property in a child's ngAfterViewInit cause this error?",
      "What are the recommended fixes: ChangeDetectorRef.detectChanges(), queueMicrotask(), or restructuring state ownership?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Architecture Resolution:

#### 1. Why NG0100 Occurs (Two-Pass Change Detection):
In Angular development mode, change detection executes **two consecutive passes**:
1. **Pass 1 (Change Detection & DOM Render):** Angular traverses the component tree from top to bottom, evaluates template expressions, checks bindings, and updates DOM nodes.
2. **Pass 2 (Verification Pass):** Angular re-traverses the tree and asserts that no template expressions have changed their values since Pass 1. If an expression produces a different value, Angular throws \`NG0100\`.

This guarantees **unidirectional data flow**: data must flow down from parent to child, and rendering must stabilize in a single pass. If a child updates a parent property inside \`ngAfterViewInit\` or \`ngAfterViewChecked\`, the parent's template binding changes after it was already verified.

#### 2. Root Cause in Tab Switching Component:
A child tab component updated the parent tab-header's badge count inside \`ngAfterViewInit()\`:
\`\`\`typescript
// ANTI-PATTERN: Mutating parent state after view check
ngAfterViewInit() {
  this.parentDashboard.hasUnreadAlerts = true; // NG0100!
}
\`\`\`

#### 3. Production Solutions:
- **Solution A (Best Practice - Upstream State or Signals):**
  Move the shared state to an injected reactive service or Angular Signal evaluated before view rendering:
  \`\`\`typescript
  // Service-based reactive state
  @Injectable({ providedIn: 'root' })
  export class AlertStateService {
    unreadCount = signal(0);
  }
  \`\`\`
- **Solution B (Asynchronous Deferral via queueMicrotask):**
  Schedule the state mutation to occur in the next microtask turn, allowing the current change detection pass to complete cleanly:
  \`\`\`typescript
  ngAfterViewInit() {
    queueMicrotask(() => {
      this.hasUnreadAlerts.set(true);
    });
  }
  \`\`\`
- **Solution C (Manual Change Detection Trigger):**
  Inject \`ChangeDetectorRef\` and invoke \`cdr.detectChanges()\` if synchronization must occur synchronously.`,
    tagsJson: JSON.stringify(["Angular", "Change Detection", "Lifecycle Hooks", "NG0100", "Frontend Architecture"])
  },

  {
    moduleNumber: 21,
    topicNumber: 2,
    topicSlug: "angular-rxjs-services-dependency-injection",
    title: "Scenario: Single-Page Application Memory Leak and Stale State from Unmanaged RxJS Subscriptions",
    difficulty: "Advanced",
    prompt: "An Angular healthcare application that stays open continuously on clinic workstations experiences severe memory degradation. Over an 8-hour shift, browser RAM climbs from 120MB to over 2.8GB, causing tabs to freeze. Profiling reveals thousands of orphan RxJS Subscriber instances retaining component DOM nodes in memory, and event handlers fire multiple duplicate notifications for a single incoming WebSocket payload. Where is the memory leak stemming from, and how do you remediate it using modern Angular best practices?",
    explanation: "Tests diagnosis and resolution of RxJS memory leaks in single-page applications where components subscribe to infinite Observable streams (e.g. from singleton services or NgRx stores) without unsubscribing on component destruction.",
    hintsJson: JSON.stringify([
      "Do subscriptions to infinite Observables (like BehaviorSubject, Router events, or interval) complete on their own?",
      "Why does retaining a subscription keep the entire unmounted component and its DOM in heap memory?",
      "What is the modern Angular 16+ replacement for the traditional 'takeUntil(destroy$)' pattern?",
      "Why is the async pipe naturally immune to this leak?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Memory Remediation:

#### 1. Why the Memory Leak Occurs:
1. **Singleton Service Lifetime:**
   Services provided with \`@Injectable({ providedIn: 'root' })\` live for the entire duration of the browser tab.
2. **Retained Reference Cycles:**
   When a short-lived component subscribes to an infinite stream on a root service:
   \`\`\`typescript
   // ANTI-PATTERN: Leaks memory every time user visits this page!
   this.telemetryService.vitals$.subscribe(data => {
     this.patientVitals = data; // Component instance cannot be garbage collected!
   });
   \`\`\`
   The service holds an active reference to the observer callback, which holds a reference to the component instance (\`this\`), which in turn references DOM trees and component state. Even after routing away, the component is never garbage collected.
3. **Duplicate Handlers:**
   Every time the user visits the page, a new subscriber is added. After 10 page visits, 10 duplicate handlers execute for every emitted event!

#### 2. Modern Angular 16+ Remediation:
- **Strategy 1: Use takeUntilDestroyed() Operator (Recommended):**
  \`\`\`typescript
  import { Component, OnInit, inject, DestroyRef } from '@angular/core';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

  @Component({ ... })
  export class PatientVitalsComponent implements OnInit {
    private telemetryService = inject(TelemetryService);
    private destroyRef = inject(DestroyRef);

    ngOnInit() {
      this.telemetryService.vitals$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(data => {
          this.patientVitals = data;
        });
    }
  }
  \`\`\`
- **Strategy 2: Declarative async Pipe in Template:**
  \`\`\`html
  <div *ngIf="telemetryService.vitals$ | async as vitals">
    <span>Heart Rate: {{ vitals.bpm }}</span>
  </div>
  \`\`\`
  The \`async\` pipe automatically subscribes on render and unsubscribes immediately when the template element is destroyed.`,
    tagsJson: JSON.stringify(["Angular", "RxJS", "Memory Leak", "takeUntilDestroyed", "Dependency Injection"])
  },

  {
    moduleNumber: 21,
    topicNumber: 3,
    topicSlug: "angular-routing-forms-change-detection-signals",
    title: "Scenario: 5,000-Row Grid Locks Browser on Keystrokes & Insecure Child Route Access",
    difficulty: "Advanced",
    prompt: "In an enterprise financial trading application: 1) A tabular grid with 5,000 active positions stutters and freezes for 800ms on every search input keystroke. 2) Security auditing discovers that unauthenticated users can directly navigate to '/admin/audit-logs' by typing the URL, even though '/admin' has a CanActivate guard attached. What are the two distinct root causes (one in Zone.js change detection, one in Angular router guard inheritance), and how do you resolve both?",
    explanation: "Tests optimization of high-frequency DOM re-rendering using ChangeDetectionStrategy.OnPush / Angular Signals, and security nuances between CanActivate vs CanActivateChild in Angular route hierarchies.",
    hintsJson: JSON.stringify([
      "How does Zone.js handle DOM events like (input) or (keydown)? Does it check the entire application tree?",
      "How does ChangeDetectionStrategy.OnPush prune the change detection tree?",
      "Does a CanActivate guard placed on a parent route automatically protect child routes when navigating directly to a child URL?",
      "What is the difference between CanActivate and CanActivateChild?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Architecture Resolution:

#### Problem 1: Change Detection Thrashing on 5,000 Rows:
- **Root Cause:**
  By default, Angular uses \`ChangeDetectionStrategy.Default\`. Zone.js patches all browser event listeners (\`input\`, \`keydown\`, \`mousemove\`, HTTP responses). Every keystroke in the search box triggers a top-down dirty-check pass evaluating expressions on all 5,000 table rows, resulting in severe CPU lag.
- **Resolution:**
  1. Set \`changeDetection: ChangeDetectionStrategy.OnPush\` on the row/grid components.
  2. Implement virtual scrolling with \`@angular/cdk/scrolling\` (\`cdk-virtual-scroll-viewport\`) so only the 20 visible rows exist in the DOM.
  3. Migrate search filtering to Angular Signals:
     \`\`\`typescript
     searchTerm = signal('');
     filteredPositions = computed(() => {
       const term = this.searchTerm().toLowerCase();
       return this.allPositions().filter(p => p.symbol.toLowerCase().includes(term));
     });
     \`\`\`

#### Problem 2: Child Route Bypass:
- **Root Cause:**
  In Angular's router, \`canActivate\` attached to a parent route only runs when the parent route itself is activated. If child routes exist and a user directly enters \`/admin/audit-logs\`, some router configurations bypass the parent \`canActivate\` check or do not evaluate child permissions.
- **Resolution:**
  Use \`canActivateChild\` on the parent route to guarantee every descendant child route executes the guard:
  \`\`\`typescript
  export const routes: Routes = [
    {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivateChild: [authGuard], // Enforces guard on all child routes!
      children: [
        { path: 'audit-logs', component: AuditLogsComponent },
        { path: 'users', component: UserManagementComponent }
      ]
    }
  ];
  \`\`\``,
    tagsJson: JSON.stringify(["Angular", "OnPush", "Zone.js", "Routing Guards", "CanActivateChild"])
  },

  // ==========================================
  // MODULE 22: NODE.JS SCALABLE BACKEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 22,
    topicNumber: 1,
    topicSlug: "nodejs-event-loop-libuv-async-programming",
    title: "Scenario: Production API Latency Spikes to 30 Seconds Caused by Event Loop Starvation",
    difficulty: "Advanced",
    prompt: "A Node.js e-commerce microservice normally responds to GET /api/v1/products in 15ms. During a Black Friday flash sale, average p99 latency spikes to 32 seconds, Kubernetes health probes (/healthz) begin failing with 503 timeouts, and pods are terminated as unhealthy. Server CPU is at 98%, but database CPU is below 15%. Investigation reveals synchronous password hashing (bcrypt.hashSync) and an inefficient regex on search queries. Explain why this brought down the entire Node.js server, and detail the architectural remedy.",
    explanation: "Tests deep understanding of Node.js single-threaded V8 execution model, libuv event loop starvation, the dangers of synchronous CPU-bound operations on the main thread, and how to properly offload CPU-intensive tasks.",
    hintsJson: JSON.stringify([
      "Can the Node.js event loop process incoming TCP packets or HTTP requests while executing a synchronous while loop or hashSync?",
      "Why did the /healthz probe time out even though it doesn't touch the database?",
      "What is the difference between bcrypt.hashSync and bcrypt.hash (or worker_threads)?",
      "How do catastrophic backtracking regular expressions (ReDoS) stall the V8 engine?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Architecture Resolution:

#### 1. The Root Cause: Event Loop Starvation:
- **Single-Threaded Execution:**
  Node.js executes JavaScript on a single thread (the V8 call stack). While this thread executes synchronous JavaScript code, **the event loop cannot process any other work**, including incoming HTTP connections, timer callbacks, or Kubernetes \`/healthz\` ping checks.
- **The Culprits:**
  1. \`bcrypt.hashSync('pass', 12)\`: Takes ~250ms of pure CPU time per call. Under 100 concurrent logins, the call stack is blocked for 25 continuous seconds!
  2. Catastrophic Regex Backtracking (ReDoS): An unanchored nested quantifier regex (e.g. \`/^(a+)+$/\`) on unvalidated user input took 8,000ms to evaluate a 40-character malformed payload.
- **Cascading Failure:**
  Because the main thread was stalled, Kubernetes liveness probes timed out (>3s). Kubelet assumed the container was dead and killed the pod, compounding load on remaining instances and causing a total service outage.

#### 2. Architecture Remediation Protocol:
1. **Never use Synchronous Crypto / Hashing on the Main Thread:**
   Switch to asynchronous hashing which libuv delegates to its C++ background worker thread pool:
   \`\`\`javascript
   // ASYNC: Runs in libuv background thread pool, freeing V8 event loop!
   const hash = await bcrypt.hash(password, 12);
   \`\`\`
2. **Prevent ReDoS with Safe Regex & Input Limits:**
   - Use non-backtracking regex engines or test patterns with tools like \`safe-regex\`.
   - Impose strict maximum lengths on search queries (e.g. \`req.query.q.slice(0, 100)\`).
3. **Offload Heavy CPU Computation to Node Worker Threads:**
   For report generation or heavy math, spawn \`worker_threads\` or use a dedicated queue service (RabbitMQ / BullMQ) with standalone worker processes.
4. **Isolate Health Checks:**
   Implement \`perf_hooks.monitorEventLoopDelay()\` to track lag, and configure Kubernetes liveness probe thresholds with appropriate timeout buffers.`,
    tagsJson: JSON.stringify(["Node.js", "Event Loop", "libuv", "ReDoS", "Worker Threads", "Performance"])
  },

  {
    moduleNumber: 22,
    topicNumber: 2,
    topicSlug: "nodejs-streams-buffer-file-handling",
    title: "Scenario: Node.js Container Crashes with 'JavaScript heap out of memory' During Multi-Gigabyte CSV Export",
    difficulty: "Advanced",
    prompt: "An internal financial tool allows managers to export historical audit records to a CSV file. When an analyst requests 5 years of transactions (approx. 850,000 rows, 1.2 GB of data), the Node.js container abruptly exits with error: 'FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory' (Exit Code 137). The code was doing: const rows = await db.query(); const csv = formatCsv(rows); fs.writeFileSync('export.csv', csv);. How do you redesign this feature using Node.js streaming and backpressure to run with under 50MB RAM?",
    explanation: "Tests mastery of Node.js stream pipelines, Transform streams, chunk-by-chunk processing, and avoiding in-memory array/string buffer accumulation on large I/O workloads.",
    hintsJson: JSON.stringify([
      "What is the default Node.js V8 max heap size on a 64-bit Linux container?",
      "Why does holding 850,000 JavaScript objects in memory require 4-5x more RAM than the raw CSV file on disk?",
      "How can a database query stream (e.g. pg-query-stream) emit rows one by one?",
      "Why should you use stream.promises.pipeline() instead of raw readable.pipe()?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Streaming Solution:

#### 1. Why Heap Exhaustion Occurs:
- **V8 Heap Overhead:**
  A 1.2 GB CSV file on disk translates to over 4 GB of JavaScript heap objects due to V8 object wrappers, hidden classes, and string duplication.
- **Buffer Ingestion:**
  \`fs.writeFileSync()\` requires the **entire payload** to be present in memory as a single contiguous string or Buffer before writing. When heap usage hits ~1.4GB - 2GB (default Node V8 heap limit), V8 aborts with OOM crash.

#### 2. Redesigning with Node.js Streaming Architecture:
By chaining database query streams directly through a CSV Transform stream to the HTTP response or file writable stream, memory usage remains **constant (~30MB)** regardless of whether the export is 10,000 rows or 10,000,000 rows.

\`\`\`javascript
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');
const QueryStream = require('pg-query-stream');
const fs = require('fs');

async function exportLargeAuditCsv(res) {
  const client = await pool.connect();
  try {
    const query = new QueryStream('SELECT id, timestamp, user_id, amount, status FROM audit_logs ORDER BY timestamp ASC');
    const dbStream = client.query(query);

    // Transform stream converts JSON object chunks into CSV line strings
    let isFirst = true;
    const csvTransformer = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        if (isFirst) {
          this.push(Object.keys(chunk).join(',') + '\\n');
          isFirst = false;
        }
        const line = Object.values(chunk).map(v => \`"\${String(v).replace(/"/g, '""')}"\`).join(',');
        this.push(line + '\\n');
        callback();
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit_export.csv"');

    // stream/promises.pipeline manages backpressure, errors, and cleanup automatically
    await pipeline(dbStream, csvTransformer, res);
    console.log('Export streamed successfully with constant memory!');
  } finally {
    client.release();
  }
}
\`\`\`

#### 3. Verification:
- Monitor container memory with \`docker stats\`: RSS memory remains flat at ~42MB throughout the entire 1.2GB streaming transfer.`,
    tagsJson: JSON.stringify(["Node.js", "Streams", "Backpressure", "OOM", "Memory Management", "Transform"])
  },

  {
    moduleNumber: 22,
    topicNumber: 3,
    topicSlug: "express-middleware-security-performance-caching",
    title: "Scenario: Express Server Crashes Silently on Async Errors & Missing CORS on 500 Responses",
    difficulty: "Advanced",
    prompt: "In a production Express.js microservice: 1) Whenever a database timeout occurs inside an async route handler (e.g. app.get('/items', async (req, res) => { await db.query(); })), the process crashes with 'UnhandledPromiseRejection'. 2) When errors do return, the Angular frontend cannot read the error details because the browser displays 'No Access-Control-Allow-Origin header is present on the requested resource'. What are the Express middleware flaws leading to these issues, and how do you resolve them in Express 4 and Express 5?",
    explanation: "Tests error handling mechanics in Express.js (lack of automatic async promise trapping in Express 4 vs Express 5), middleware registration order, and placing CORS and centralized error handlers properly.",
    hintsJson: JSON.stringify([
      "Does Express 4 automatically catch rejected promises in async route handlers?",
      "Why must async handlers in Express 4 use try/catch or an express-async-errors wrapper?",
      "Why did the error response lack CORS headers? Where was app.use(cors()) placed relative to the router and error handler?",
      "What are the 4 arguments required for an Express centralized error-handling middleware?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Architecture Resolution:

#### 1. Why Express 4 Crashes on Async Errors:
In **Express 4**, the router engine only handles synchronous errors thrown inside middleware. If an \`async\` route handler rejects without a \`try...catch\` block, the rejected promise is unhandled by Express:
\`\`\`javascript
// EXPRESS 4 ANTI-PATTERN: Crashes process on DB error!
app.get('/items', async (req, res) => {
  const items = await db.query(); // If this throws, Express NEVER catches it!
  res.json(items);
});
\`\`\`
In Node.js 16+, unhandled promise rejections terminate the process with exit code 1.

#### 2. Why CORS Headers Were Missing on Error Responses:
If \`app.use(cors())\` is placed after some routes, or if the error handler manually creates a new response without headers, browser CORS policy blocks the client from inspecting HTTP 500 details.

#### 3. Enterprise Fix:
1. **In Express 4:** Install \`express-async-errors\` or use an \`asyncHandler\` wrapper:
   \`\`\`javascript
   const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
   app.get('/items', asyncHandler(async (req, res) => {
     const items = await db.query();
     res.json(items);
   }));
   \`\`\`
   *(Note: Express 5 natively catches rejected promises in route handlers).*
2. **Middleware Ordering Protocol:**
   Place security headers and CORS **at the very top** of the middleware chain:
   \`\`\`javascript
   const app = express();
   app.use(helmet());
   app.use(cors({ origin: 'https://app.enterprise.domain', credentials: true })); // FIRST!
   app.use(express.json());

   // Routes
   app.use('/api/v1', router);

   // Centralized 4-parameter error handler (MUST BE LAST!)
   app.use((err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     res.status(statusCode).json({
       status: statusCode,
       message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
     });
   });
   \`\`\``,
    tagsJson: JSON.stringify(["Express.js", "Error Handling", "CORS", "Middleware", "Async/Await"])
  },

  // ==========================================
  // MODULE 23: RESTFUL APIS, INTEGRATION, SECURITY & PERFORMANCE
  // ==========================================
  {
    moduleNumber: 23,
    topicNumber: 1,
    topicSlug: "rest-api-design-http-protocol-idempotency",
    title: "Scenario: Customers Double-Charged During Mobile Network Dropouts (Missing Idempotency Keys)",
    difficulty: "Advanced",
    prompt: "A mobile banking app allows customers to transfer money via POST /api/v1/transfers. On slow cellular networks (3G/trains), the client sends the payment request, the backend processes the charge, but the cellular tower drops before the HTTP 201 response reaches the phone. The mobile app automatically retries the request upon reconnecting. As a result, 4% of users are double-debited. How do you design an Idempotency-Key transaction mechanism using Redis and HTTP headers to make POST requests safely retryable?",
    explanation: "Tests deep understanding of HTTP method idempotency constraints, the difference between safe and unsafe methods, and implementing the IETF Idempotency-Key specification with distributed locks and Redis cache.",
    hintsJson: JSON.stringify([
      "Is HTTP POST inherently idempotent according to RFC 7231?",
      "What HTTP header does Stripe and the IETF draft specify for safe retries?",
      "How should the backend handle a duplicate request while the first request is still processing (concurrent duplicate)?",
      "What HTTP status code and cached body should be returned on an idempotent replay?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Idempotency Key Architecture:

#### 1. Why the Failure Occurs:
- **POST is Non-Idempotent:**
  According to HTTP/1.1 specifications, POST operations create new resources or initiate side effects each time they are executed.
- **The Two-Generals Problem:**
  In distributed networks, when a client does not receive an HTTP response, it cannot distinguish between:
  a) The request never reached the server.
  b) The server processed the request, but the response was lost during transmission.
  Retrying a naive POST request causes duplicate charges.

#### 2. The Idempotency-Key Solution Protocol (IETF Standard):
1. **Client Generates V4 UUID:**
   Before initiating payment, client generates a unique \`Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d\` and sends it in the HTTP headers.
2. **Server Middleware Pipeline:**
   \`\`\`javascript
   async function idempotencyMiddleware(req, res, next) {
     const key = req.headers['idempotency-key'];
     if (!key) return next();

     const redisKey = \`idempotency:\${req.user.id}:\${key}\`;
     
     // 1. Check if previously completed
     const cachedRecord = await redis.get(redisKey);
     if (cachedRecord) {
       const { status, statusCode, headers, body } = JSON.parse(cachedRecord);
       if (status === 'IN_FLIGHT') {
         // Concurrent duplicate in progress: return 409 Conflict
         return res.status(409).json({
           title: 'Conflict',
           detail: 'A transaction with this Idempotency-Key is currently in progress.'
         });
       }
       // Return cached result with custom replay header
       res.setHeader('X-Cache-Lookup', 'IDEMPOTENCY-HIT');
       return res.status(statusCode).json(body);
     }

     // 2. Acquire lock in Redis with 120s TTL
     await redis.set(redisKey, JSON.stringify({ status: 'IN_FLIGHT' }), 'EX', 120, 'NX');

     // 3. Intercept response to store result
     const originalJson = res.json.bind(res);
     res.json = (body) => {
       redis.set(redisKey, JSON.stringify({
         status: 'COMPLETED',
         statusCode: res.statusCode,
         body
       }), 'EX', 86400); // 24hr retention
       return originalJson(body);
     };

     next();
   }
   \`\`\`
3. **Verification:**
   Retried requests receive HTTP 201 with identical payment reference ID and header \`X-Cache-Lookup: IDEMPOTENCY-HIT\`, completely preventing double charges.`,
    tagsJson: JSON.stringify(["REST API", "Idempotency", "HTTP", "Redis", "Payment Architecture"])
  },

  {
    moduleNumber: 23,
    topicNumber: 2,
    topicSlug: "api-security-jwt-rbac-rate-limiting-cors",
    title: "Scenario: Compromised JWT Access Token Allows 24 Hours of Unauthorized API Access Post-Suspension",
    difficulty: "Advanced",
    prompt: "An employee at a fintech enterprise has their credentials compromised. Security immediately suspends the user account in PostgreSQL and changes their role to SUSPENDED. However, SIEM logs show the attacker continues making authenticated API calls and downloading customer PII for the next 24 hours. The engineering team used self-contained, stateless JWTs with 24-hour expiration stored in localStorage. How do you re-architect the authentication and authorization system to achieve instantaneous revocation and secure token storage?",
    explanation: "Tests security architecture trade-offs of purely stateless JWTs, implementing token blacklists/Redis revocation lists, dual-token architecture (short-lived access + rotated refresh tokens), and immune token storage.",
    hintsJson: JSON.stringify([
      "Can a stateless JWT be revoked before its 'exp' timestamp without checking a central store?",
      "What is the recommended lifespan for a stateless JWT access token (15 minutes vs 24 hours)?",
      "Why is storing tokens in localStorage dangerous against XSS attacks?",
      "How does a dual-token (access + refresh) architecture with refresh token rotation prevent this vulnerability?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Security Re-Architecture:

#### 1. Why the Compromise Succeeded:
- **Stateless Verification Trap:**
  The API gateways verified the JWT solely by checking the cryptographic signature and \`exp\` claim without querying the database or cache. Because the token had a 24-hour lifespan, it remained cryptographically valid even after the database record was set to SUSPENDED.
- **LocalStorage XSS Vulnerability:**
  Storing tokens in \`localStorage\` allows any Cross-Site Scripting (XSS) vulnerability to exfiltrate the token to an external server.

#### 2. Enterprise Authentication Re-Architecture:
1. **Drastically Shorten Access Token Lifespan (10 - 15 Minutes):**
   Stateless access tokens should expire within 10-15 minutes. This bounds the maximum window of vulnerability.
2. **Dual-Token with Refresh Token Rotation (RTR):**
   - **Access Token:** Short-lived (15 mins), passed in \`Authorization: Bearer <token>\`.
   - **Refresh Token:** Long-lived (7 days), stored in an \`httpOnly\`, \`Secure\`, \`SameSite=Strict\` cookie (inaccessible to JavaScript XSS).
   - Each refresh token can be used **exactly once**. Issuing a new access token invalidates the previous refresh token and issues a new one.
3. **Instant Revocation via Redis Revocation List / Versioning:**
   - Add a \`tokenVersion\` or \`lastRevocationTime\` field to the user entity.
   - Embed \`tokenVersion: 3\` inside the JWT payload.
   - When suspending a user, increment \`tokenVersion\` in Redis/DB.
   - Gateway checks \`jwtPayload.tokenVersion === redis.get('user:version:' + userId)\` via fast sub-millisecond Redis lookup.
4. **Immediate Revocation on Suspension:**
   \`\`\`javascript
   async function suspendUser(userId) {
     await db.users.update({ where: { id: userId }, data: { status: 'SUSPENDED' } });
     await redis.set(\`blacklist:user:\${userId}\`, 'SUSPENDED', 'EX', 900); // 15 min TTL matching access token
     await redis.del(\`refresh_token:\${userId}\`); // Destroy active refresh session
   }
   \`\`\``,
    tagsJson: JSON.stringify(["API Security", "JWT", "RBAC", "Authentication", "Redis", "XSS"])
  },

  {
    moduleNumber: 23,
    topicNumber: 3,
    topicSlug: "api-validation-pagination-filtering-error-handling",
    title: "Scenario: 100% Database CPU and Memory Exhaustion from OFFSET 500,000 Pagination",
    difficulty: "Advanced",
    prompt: "A SaaS analytics platform provides an API endpoint: GET /api/v1/events?offset=500000&limit=50. When marketing scrapers and automated ETL scripts query deep pagination pages, database CPU utilization hits 100%, disk I/O saturates, and query times climb from 4ms to 18 seconds. Simultaneously, client developers complain that error responses lack standardized format, making it impossible to build generic error toast notifications in Angular. How do you fix both issues?",
    explanation: "Tests mastery of cursor-based / keyset pagination vs classic OFFSET-based degradation, and adopting RFC 7807 (Problem Details for HTTP APIs) for standardized error reporting.",
    hintsJson: JSON.stringify([
      "How does the database execute 'OFFSET 500000 LIMIT 50'? Does it read and discard 500,000 index entries?",
      "How does Keyset (Cursor) pagination achieve O(1) performance regardless of page depth?",
      "What standard fields are defined in RFC 7807 (type, title, status, detail, instance)?",
      "How do cursor tokens encode values securely using Base64URL?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Solution Protocol:

#### 1. The OFFSET Performance Disaster:
- **Why OFFSET Fails at Scale:**
  When executing \`SELECT * FROM events ORDER BY id ASC LIMIT 50 OFFSET 500000\`, the database cannot magically jump to row 500,000. It must **scan 500,050 rows**, sort them, and discard the first 500,000 rows. Disk seek times and buffer thrashing cause O(N) degradation.
- **The Keyset / Cursor Solution:**
  Use an indexed seek condition (\`WHERE id > :last_seen_id ORDER BY id ASC LIMIT 50\`). The database traverses the B-Tree directly to the target row in **O(log N)** time (~1-2ms), regardless of whether it is page 1 or page 10,000!

\`\`\`javascript
// Keyset Cursor Pagination Implementation
async function listEvents(limit = 50, afterCursor = null) {
  let whereClause = {};
  if (afterCursor) {
    const { id, createdAt } = decodeCursor(afterCursor);
    whereClause = {
      OR: [
        { createdAt: { lt: createdAt } },
        { createdAt, id: { lt: id } }
      ]
    };
  }

  const items = await prisma.events.findMany({
    where: whereClause,
    take: limit + 1, // Fetch 1 extra to check if next page exists
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
  });

  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? encodeCursor(data[data.length - 1]) : null;

  return { data, pagination: { limit, hasMore, nextCursor } };
}
\`\`\`

#### 2. Adopting RFC 7807 Standardized Problem Details:
Standardize all error payloads with Content-Type \`application/problem+json\`:
\`\`\`json
{
  "type": "https://api.enterprise.domain/errors/invalid-cursor",
  "title": "Invalid Pagination Cursor",
  "status": 400,
  "detail": "The provided cursor token has expired or is malformed.",
  "instance": "/api/v1/events?after=invalid_token",
  "correlationId": "req_8f12b7a9"
}
\`\`\`
Angular HTTP interceptors can now universally parse \`error.title\` and \`error.detail\` for clean UI alerts!`,
    tagsJson: JSON.stringify(["Pagination", "Cursor Pagination", "RFC 7807", "Query Performance", "REST API"])
  },

  // ==========================================
  // MODULE 24: DATABASE ENGINEERING, QUERY OPTIMIZATION & SYSTEM DESIGN
  // ==========================================
  {
    moduleNumber: 24,
    topicNumber: 1,
    topicSlug: "sql-nosql-schema-modeling-indexing",
    title: "Scenario: Relational Deadlocks and Flash Sale Inventory Inconsistency",
    difficulty: "Advanced",
    prompt: "During a limited-inventory product flash sale (1,000 units available), an e-commerce platform processes 10,000 concurrent checkout attempts. Database error logs report hundreds of 'ERROR: deadlock detected (SQLSTATE 40P01)', several transactions crash, and an inventory audit reveals 1,048 units were sold (oversold by 48 units). Code was executing: 1) SELECT stock FROM inventory WHERE product_id = 1; 2) if (stock > 0) UPDATE inventory SET stock = stock - 1; 3) INSERT INTO orders. Explain the concurrency race condition, why deadlocks occurred, and provide the ACID solution.",
    explanation: "Tests deep understanding of ACID transaction isolation levels, read-modify-write race conditions, row-level locking (SELECT FOR UPDATE), and atomic decrement queries.",
    hintsJson: JSON.stringify([
      "What is the difference between Read Committed and Serializable isolation levels?",
      "Why does checking stock in application code before updating create a classic Race Condition (Time-of-Check to Time-of-Use)?",
      "How does 'SELECT ... FOR UPDATE' acquire an exclusive row lock?",
      "Can this be solved with a single atomic SQL statement: 'UPDATE inventory SET stock = stock - 1 WHERE id = ? AND stock > 0'?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Concurrency Resolution:

#### 1. Why Overselling Occurred (Time-of-Check to Time-of-Use):
The code suffered from a classic **read-modify-write race condition**:
1. When stock was 1, 50 concurrent transactions executed \`SELECT stock FROM inventory\` simultaneously. All 50 read \`stock = 1\`.
2. Each transaction passed the \`if (stock > 0)\` check in Node.js.
3. All 50 proceeded to execute \`UPDATE inventory SET stock = stock - 1\`.
4. Result: 50 orders were placed for a single available unit (oversold by 49)!

#### 2. Why Deadlocks Occurred:
Transactions updated multiple related tables (inventory, orders, user wallets) in **inconsistent order**:
- Transaction A locked Product 101, then requested Product 102.
- Transaction B locked Product 102, then requested Product 101.
- Both transactions blocked each other indefinitely until PostgreSQL aborted one with \`ERROR: deadlock detected\`.

#### 3. Enterprise ACID Resolution Protocol:
- **Solution 1: Atomic Conditional Decrement (Simplest & Highest Throughput):**
  \`\`\`sql
  UPDATE inventory
  SET stock = stock - 1
  WHERE product_id = 1 AND stock >= 1;
  \`\`\`
  In Node.js, inspect the affected row count (\`result.rowCount\`):
  - If \`rowCount === 1\`: Inventory reserved successfully; proceed with order.
  - If \`rowCount === 0\`: Sold out; abort transaction immediately with 409 Conflict.
  This avoids application-level race conditions and requires zero manual locking!

- **Solution 2: Explicit Row Locking (SELECT FOR UPDATE):**
  If business logic requires inspection inside a transaction:
  \`\`\`sql
  BEGIN;
  SELECT stock FROM inventory WHERE product_id = 1 FOR UPDATE; -- Acquires exclusive row lock
  -- Perform additional validations...
  UPDATE inventory SET stock = stock - 1 WHERE product_id = 1;
  INSERT INTO orders (...);
  COMMIT;
  \`\`\`
- **Deadlock Prevention Rule:**
  Always acquire locks in a globally deterministic order (e.g. sorted by primary key ID).`,
    tagsJson: JSON.stringify(["PostgreSQL", "ACID", "Transactions", "Deadlocks", "Row Locking", "Concurrency"])
  },

  {
    moduleNumber: 24,
    topicNumber: 2,
    topicSlug: "query-optimization-execution-plans-caching",
    title: "Scenario: Dashboard Latency Degrades from 40ms to 12 Seconds Due to N+1 Queries and Sequential Scans",
    difficulty: "Advanced",
    prompt: "An Angular enterprise admin dashboard displays a list of 50 organizations, each showing member count, active subscription tier, and latest invoice date. As user volume grew to 200,000 records, the dashboard API response time degraded from 40ms to 12.4 seconds. EXPLAIN ANALYZE reveals: 1) Over 150 separate SQL queries fired per HTTP request. 2) A 'Seq Scan on subscriptions (cost=0.00..18450.00 rows=200000)' taking 9,200ms. What are the two distinct database bottlenecks, and how do you optimize the query plan to achieve sub-50ms latency?",
    explanation: "Tests query execution plan analysis (EXPLAIN ANALYZE), recognizing and fixing the N+1 ORM query problem, and adding composite indexes on foreign keys to eliminate sequential disk scans.",
    hintsJson: JSON.stringify([
      "What is the N+1 query problem, and why do ORMs (TypeORM/Prisma/Hibernate) produce it when lazy-loading relations?",
      "How do you eliminate N+1 queries using SQL JOINs or DataLoader batching?",
      "Why did the database perform a Sequential Scan on the subscriptions table instead of an Index Scan?",
      "What composite index should be added to subscriptions (organization_id, status)?"
    ]),
    recommendedSolution: `### Root Cause Analysis & Query Optimization:

#### 1. Bottleneck 1: The N+1 Query Disaster:
- **Root Cause:**
  The backend code queried the 50 organizations, and then executed separate queries inside a loop for each organization's subscriptions and members:
  \`\`\`javascript
  // ANTI-PATTERN: Fired 1 + 50 + 50 = 101 queries!
  const orgs = await db.organizations.findMany();
  for (const org of orgs) {
    org.members = await db.members.count({ where: { orgId: org.id } });
    org.subscription = await db.subscriptions.findFirst({ where: { orgId: org.id } });
  }
  \`\`\`
  Network round-trips to the database caused cumulative latency delays.

#### 2. Bottleneck 2: Missing Index Causing Full Sequential Scan:
- **Root Cause:**
  The \`subscriptions\` table had no index on the \`organization_id\` foreign key. To find an organization's subscription, PostgreSQL had to read every single 8KB disk block across all 200,000 rows (Sequential Scan).

#### 3. Sub-50ms Optimization Protocol:
1. **Add Composite Covering Index:**
   \`\`\`sql
   CREATE INDEX CONCURRENTLY idx_subscriptions_org_status
   ON subscriptions (organization_id, status)
   INCLUDE (plan_tier, current_period_end);
   \`\`\`
   This transforms the Sequential Scan into an **Index Only Scan** completing in 0.04ms.
2. **Eager Loading with Aggregated SQL JOIN:**
   Replace the 101 separate queries with a single optimized SQL query:
   \`\`\`sql
   SELECT 
     o.id, 
     o.name, 
     COUNT(m.id) AS member_count, 
     s.plan_tier, 
     s.current_period_end
   FROM organizations o
   LEFT JOIN members m ON m.organization_id = o.id
   LEFT JOIN subscriptions s ON s.organization_id = o.id AND s.status = 'ACTIVE'
   GROUP BY o.id, s.plan_tier, s.current_period_end;
   \`\`\`
3. **Add Redis Cache-Aside Layer:**
   Cache the aggregated dashboard payload with a 60-second TTL to reduce database load to near-zero for repeat visits. Response time drops from 12,400ms to **8ms**!`,
    tagsJson: JSON.stringify(["Query Optimization", "EXPLAIN ANALYZE", "N+1 Problem", "Indexes", "PostgreSQL", "Redis"])
  },

  {
    moduleNumber: 24,
    topicNumber: 3,
    topicSlug: "fullstack-system-design-angular-node-integration",
    title: "Scenario: 50,000 Reconnecting Angular Clients Crash Node.js Cluster (WebSocket Storm)",
    difficulty: "Advanced",
    prompt: "A collaborative project management tool built with Angular and Node.js uses WebSockets (Socket.io) for live document updates. During a brief 10-second Nginx load balancer reload, all 50,000 connected clients lose connection. The instant Nginx recovers, all 50,000 clients simultaneously attempt to reconnect, negotiate TLS, perform JWT verification, and query user permissions from PostgreSQL. The backend Node.js cluster experiences 100% CPU lockup, DB connection pools exhaust, and the cluster enters an unrecoverable restart loop. How do you re-architect the client reconnection and backend capacity to withstand connection storms?",
    explanation: "Tests enterprise full-stack system design, WebSocket scalability, the Thundering Herd / Connection Storm problem, exponential backoff with jitter on the Angular client, and Redis Pub/Sub adapter scaling.",
    hintsJson: JSON.stringify([
      "Why does simultaneous reconnection from 50,000 clients create a 'Thundering Herd' on authentication endpoints?",
      "How does exponential backoff with randomized jitter prevent synchronized reconnection spikes?",
      "Why should WebSocket token validation use cached public keys rather than hitting the primary database?",
      "How does the Socket.io Redis Streams / PubSub adapter decouple WebSocket instances?"
    ]),
    recommendedSolution: `### Root Cause Analysis & System Design Architecture:

#### 1. Why the Thundering Herd Crashed the System:
- **Synchronized Reconnection:**
  The Angular frontend had a naive reconnection policy: on disconnect, immediately retry every 1,000ms. When 50,000 clients disconnected at the same instant, all 50,000 fired reconnection handshakes at exact 1-second intervals.
- **Resource Exhaustion:**
  Each handshake required:
  a) TLS Handshake computation.
  b) HTTP upgrade overhead.
  c) Database query to verify user permissions (\`SELECT * FROM users\`).
  The database connection pool limit (100 connections) was exceeded in 50ms, causing database connection timeouts and cascading node crashes.

#### 2. System Design Resolution:

##### A. Angular Client: Exponential Backoff with Full Jitter:
Never retry on fixed intervals. Implement full jitter so client retries are uniformly distributed across time:
\`\`\`typescript
function getReconnectDelay(retryAttempt: number): number {
  const baseDelay = 1000; // 1s
  const maxDelay = 30000; // 30s
  // Exponential calculation
  const temp = Math.min(maxDelay, baseDelay * Math.pow(2, retryAttempt));
  // Full Jitter: random integer between 0 and temp
  return Math.floor(Math.random() * temp);
}
\`\`\`
This smooths 50,000 simultaneous reconnects into a gradual, manageable trickle over 30 seconds.

##### B. Backend: Stateless JWT Handshake Verification:
- Stop querying the SQL database during the WebSocket handshake!
- Verify the user's JWT locally using the RSA public key.
- Store active channel permissions in Redis in-memory cache.

##### C. Horizontal WebSocket Scaling with Redis Adapter:
Use \`@socket.io/redis-adapter\` so that Node.js worker nodes can scale horizontally across multiple container instances without needing sticky sessions or cross-worker polling.

##### D. Edge Rate Limiting:
Configure Nginx connection limits:
\`\`\`nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_req_zone $binary_remote_addr zone=reconnect_limit:10m rate=10r/s;

location /socket.io/ {
    limit_req zone=reconnect_limit burst=20 nodelay;
    proxy_pass http://node_backend;
}
\`\`\``,
    tagsJson: JSON.stringify(["System Design", "WebSockets", "Thundering Herd", "Exponential Backoff", "Angular", "Node.js"])
  }
];
