/**
 * Dedicated Quizzes & Assessments for Full-Stack Modules 21, 22, 23, and 24
 *
 * Module 21: Angular Enterprise Frontend Architecture
 * Module 22: Node.js Scalable Backend Architecture
 * Module 23: RESTful APIs, Integration, Security & Performance
 * Module 24: Database Engineering, Query Optimization & Full-Stack System Design
 */

const fullstackQuizzes = [
  // ==========================================
  // MODULE 21: ANGULAR ENTERPRISE FRONTEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 21,
    topicNumber: 1,
    topicSlug: "angular-core-components-lifecycle-databinding",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Standalone Components Architecture",
    prompt: "In Angular 15+, what is the primary architectural advantage of standalone components over traditional NgModule-based components?",
    explanation: "Standalone components specify their dependencies directly in their @Component metadata 'imports' array, simplifying modularity and enabling superior tree-shaking without requiring intermediate NgModules.",
    hintsJson: JSON.stringify(["Think about eliminating NgModule boilerplate and improving tree-shaking."]),
    options: [
      { optionKey: "A", optionText: "They run completely outside Zone.js by default without any compiler intervention.", isCorrect: false },
      { optionKey: "B", optionText: "They declare dependencies directly in their imports array, eliminating NgModule boilerplate and enabling fine-grained tree-shaking.", isCorrect: true },
      { optionKey: "C", optionText: "They can only be rendered inside Web Workers rather than the browser main thread.", isCorrect: false },
      { optionKey: "D", optionText: "They convert all TypeScript code into WebAssembly binary at compile time.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 21,
    topicNumber: 1,
    topicSlug: "angular-core-components-lifecycle-databinding",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "ViewEncapsulation.Emulated Scoping Mechanism",
    prompt: "How does Angular's default ViewEncapsulation.Emulated prevent component styles from leaking into the global document?",
    explanation: "The Ivy compiler transforms CSS selectors by appending unique host and content attributes (e.g. _nghost-ng-c12 and _ngcontent-ng-c12) to DOM elements and rules without using native browser Shadow DOM.",
    hintsJson: JSON.stringify(["Look for compiler-generated unique attributes."]),
    options: [
      { optionKey: "A", optionText: "It attaches a native shadowRoot to every component custom element.", isCorrect: false },
      { optionKey: "B", optionText: "It transforms CSS rules by appending generated unique attributes (_ngcontent-ng-c* and _nghost-ng-c*) to elements and selectors.", isCorrect: true },
      { optionKey: "C", optionText: "It converts all CSS into inline style attributes on every DOM element.", isCorrect: false },
      { optionKey: "D", optionText: "It executes a JavaScript post-processor that deletes all global CSS after rendering.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 21,
    topicNumber: 1,
    topicSlug: "angular-core-components-lifecycle-databinding",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Component Lifecycle Execution Order",
    prompt: "When an Angular component with an @Input() property is rendered for the first time, in which exact order do constructor, ngOnInit, and ngOnChanges execute?",
    explanation: "constructor executes first during class instantiation, followed by ngOnChanges when @Input properties are first resolved, and finally ngOnInit executes when component inputs are initialized.",
    hintsJson: JSON.stringify(["Inputs are resolved before ngOnInit."]),
    options: [
      { optionKey: "A", optionText: "constructor -> ngOnInit -> ngOnChanges", isCorrect: false },
      { optionKey: "B", optionText: "constructor -> ngOnChanges -> ngOnInit", isCorrect: true },
      { optionKey: "C", optionText: "ngOnInit -> constructor -> ngOnChanges", isCorrect: false },
      { optionKey: "D", optionText: "ngOnChanges -> constructor -> ngOnInit", isCorrect: false }
    ]
  },

  {
    moduleNumber: 21,
    topicNumber: 2,
    topicSlug: "angular-rxjs-services-dependency-injection",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "RxJS Higher-Order Mapping Operators",
    prompt: "Which RxJS flattening operator should be used for a search typeahead input where any previous in-flight HTTP request must be cancelled immediately when the user types a new character?",
    explanation: "switchMap unsubscribes from and cancels any previous active inner Observable when a new emission arrives from the source stream, making it ideal for search auto-completion.",
    hintsJson: JSON.stringify(["It 'switches' to the newest stream and drops previous ones."]),
    options: [
      { optionKey: "A", optionText: "concatMap (buffers and processes in strict sequential order)", isCorrect: false },
      { optionKey: "B", optionText: "mergeMap (executes all requests concurrently without cancellation)", isCorrect: false },
      { optionKey: "C", optionText: "switchMap (cancels previous pending inner request when new value emits)", isCorrect: true },
      { optionKey: "D", optionText: "exhaustMap (ignores all new emissions while inner request is active)", isCorrect: false }
    ]
  },
  {
    moduleNumber: 21,
    topicNumber: 2,
    topicSlug: "angular-rxjs-services-dependency-injection",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "BehaviorSubject vs ReplaySubject",
    prompt: "What is the key functional difference between a BehaviorSubject and a ReplaySubject(1) in Angular reactive state management?",
    explanation: "A BehaviorSubject requires an initial default value at instantiation and stores only the current latest value. A ReplaySubject does not require an initial value and will replay its buffered emissions to new subscribers.",
    hintsJson: JSON.stringify(["Which one requires a seed value in its constructor?"]),
    options: [
      { optionKey: "A", optionText: "BehaviorSubject requires an initial seed value, whereas ReplaySubject(1) can be instantiated without an initial value.", isCorrect: true },
      { optionKey: "B", optionText: "BehaviorSubject never emits to late subscribers, while ReplaySubject does.", isCorrect: false },
      { optionKey: "C", optionText: "ReplaySubject cannot be completed or thrown into an error state.", isCorrect: false },
      { optionKey: "D", optionText: "BehaviorSubject is only compatible with Angular Signals, not RxJS Observables.", isCorrect: false }
    ]
  },

  {
    moduleNumber: 21,
    topicNumber: 3,
    topicSlug: "angular-routing-forms-change-detection-signals",
    type: "MCQ",
    difficulty: "Advanced",
    title: "ChangeDetectionStrategy.OnPush Mechanics",
    prompt: "Under ChangeDetectionStrategy.OnPush, which of the following actions will NOT automatically cause Angular to check the component's template?",
    explanation: "Mutating a property of an existing object passed as an @Input (e.g. user.name = 'Bob') does not change the object reference. OnPush checks inputs using strict equality (===), so the component is skipped.",
    hintsJson: JSON.stringify(["OnPush relies on reference comparison (===)."]),
    options: [
      { optionKey: "A", optionText: "A DOM event handler (such as (click) or (input)) inside the component template fires.", isCorrect: false },
      { optionKey: "B", optionText: "An Observable bound in the template with the async pipe emits a new value.", isCorrect: false },
      { optionKey: "C", optionText: "Mutating a nested property of an object passed via @Input without creating a new object reference.", isCorrect: true },
      { optionKey: "D", optionText: "A new object reference is passed to an @Input property from the parent component.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 21,
    topicNumber: 3,
    topicSlug: "angular-routing-forms-change-detection-signals",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Angular Signals Reactivity Model",
    prompt: "How do Angular Signals (signal, computed, effect) differ fundamentally from RxJS Observables for local component reactivity?",
    explanation: "Signals are synchronous, glitch-free value holders that track dependencies automatically and notify the template directly without requiring Zone.js or manual subscription teardown.",
    hintsJson: JSON.stringify(["Signals are synchronous and track dependencies automatically."]),
    options: [
      { optionKey: "A", optionText: "Signals are asynchronous streams that require explicit .subscribe() and .unsubscribe() calls.", isCorrect: false },
      { optionKey: "B", optionText: "Signals are synchronous, glitch-free reactive getters that automatically track dependencies and do not require Zone.js.", isCorrect: true },
      { optionKey: "C", optionText: "Signals can only store primitive strings and numbers, never objects or arrays.", isCorrect: false },
      { optionKey: "D", optionText: "Signals replace HTTP client entirely by compiling into WebSockets.", isCorrect: false }
    ]
  },

  // ==========================================
  // MODULE 22: NODE.JS SCALABLE BACKEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 22,
    topicNumber: 1,
    topicSlug: "nodejs-event-loop-libuv-async-programming",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "libuv Event Loop Microtask Precedence",
    prompt: "In the Node.js event loop, when are process.nextTick callbacks processed relative to Promise.then microtasks?",
    explanation: "process.nextTick queue is processed immediately after the current operation finishes and runs before the standard Promise microtask queue at every tick boundary.",
    hintsJson: JSON.stringify(["process.nextTick takes highest priority among microtasks."]),
    options: [
      { optionKey: "A", optionText: "process.nextTick runs after all Promise.then microtasks and timer callbacks.", isCorrect: false },
      { optionKey: "B", optionText: "process.nextTick runs before Promise.then microtasks on every transition between event loop phases.", isCorrect: true },
      { optionKey: "C", optionText: "process.nextTick only executes during the Poll phase of the event loop.", isCorrect: false },
      { optionKey: "D", optionText: "process.nextTick and Promise.then run in round-robin FIFO order with equal precedence.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 22,
    topicNumber: 1,
    topicSlug: "nodejs-event-loop-libuv-async-programming",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "libuv Default Thread Pool Size",
    prompt: "What is the default thread pool size allocated by libuv in Node.js for asynchronous I/O and crypto operations?",
    explanation: "libuv initializes a thread pool with 4 worker threads by default, which can be modified via the UV_THREADPOOL_SIZE environment variable up to 1024.",
    hintsJson: JSON.stringify(["The default is a small single-digit power of 2."]),
    options: [
      { optionKey: "A", optionText: "1 thread (matching the V8 single thread)", isCorrect: false },
      { optionKey: "B", optionText: "4 threads", isCorrect: true },
      { optionKey: "C", optionText: "16 threads", isCorrect: false },
      { optionKey: "D", optionText: "64 threads", isCorrect: false }
    ]
  },

  {
    moduleNumber: 22,
    topicNumber: 2,
    topicSlug: "nodejs-streams-buffer-file-handling",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Stream Backpressure Mechanics",
    prompt: "In Node.js writable streams, how does a consumer indicate backpressure to a fast readable producer, and how does the producer resume writing?",
    explanation: "writable.write(chunk) returns false when internal highWaterMark buffer is exceeded. The producer pauses, and the writable emits the 'drain' event when the buffer has emptied, signaling the producer to resume.",
    hintsJson: JSON.stringify(["write() returns a boolean; what event signifies buffer empty?"]),
    options: [
      { optionKey: "A", optionText: "writable throws an 'EBACKPRESSURE' exception; producer catches and sleeps for 100ms.", isCorrect: false },
      { optionKey: "B", optionText: "writable.write() returns false when buffer fills; producer waits for the 'drain' event before writing more.", isCorrect: true },
      { optionKey: "C", optionText: "writable drops all incoming chunks silently until CPU load falls below 50%.", isCorrect: false },
      { optionKey: "D", optionText: "Node.js switches automatically from TCP to UDP mode.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 22,
    topicNumber: 2,
    topicSlug: "nodejs-streams-buffer-file-handling",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "stream/promises.pipeline vs readable.pipe",
    prompt: "Why is stream/promises.pipeline() strongly preferred over readable.pipe(writable) in production Node.js applications?",
    explanation: "pipeline() automatically forwards errors, destroys intermediate streams, and closes file descriptors if an error occurs mid-stream, whereas readable.pipe() leaves streams open and causes resource leaks.",
    hintsJson: JSON.stringify(["Think about error propagation and cleanup on failure."]),
    options: [
      { optionKey: "A", optionText: "pipeline() runs in worker threads, whereas pipe() is synchronous.", isCorrect: false },
      { optionKey: "B", optionText: "pipeline() properly forwards errors, cleans up and destroys all streams on failure, preventing memory/file descriptor leaks.", isCorrect: true },
      { optionKey: "C", optionText: "readable.pipe() was deprecated and removed from Node.js in version 18.", isCorrect: false },
      { optionKey: "D", optionText: "pipeline() compresses all data using gzip automatically.", isCorrect: false }
    ]
  },

  {
    moduleNumber: 22,
    topicNumber: 3,
    topicSlug: "express-middleware-security-performance-caching",
    type: "MCQ",
    difficulty: "Beginner",
    title: "Express Centralized Error Middleware Signature",
    prompt: "How does Express.js distinguish a centralized error-handling middleware from a standard request middleware?",
    explanation: "Express inspects the function's arity (Function.length). A middleware declaring exactly 4 parameters (err, req, res, next) is recognized as an error handler.",
    hintsJson: JSON.stringify(["How many parameters does the callback function take?"]),
    options: [
      { optionKey: "A", optionText: "By registering it with app.useError() instead of app.use().", isCorrect: false },
      { optionKey: "B", optionText: "By the function declaring exactly 4 parameters: (err, req, res, next).", isCorrect: true },
      { optionKey: "C", optionText: "By marking the function with the @ErrorHandler TypeScript decorator.", isCorrect: false },
      { optionKey: "D", optionText: "By returning a Promise.reject() from the function body.", isCorrect: false }
    ]
  },

  // ==========================================
  // MODULE 23: RESTFUL APIS, INTEGRATION, SECURITY & PERFORMANCE
  // ==========================================
  {
    moduleNumber: 23,
    topicNumber: 1,
    topicSlug: "rest-api-design-http-protocol-idempotency",
    type: "MCQ",
    difficulty: "Beginner",
    title: "HTTP PUT vs PATCH Semantics",
    prompt: "According to HTTP specifications (RFC 7231 and RFC 7396), what is the difference between PUT and PATCH methods?",
    explanation: "PUT is an idempotent full replacement of the entire resource representation. PATCH is used for partial modifications of resource attributes.",
    hintsJson: JSON.stringify(["Full replacement vs partial update."]),
    options: [
      { optionKey: "A", optionText: "PUT creates resources; PATCH only deletes resources.", isCorrect: false },
      { optionKey: "B", optionText: "PUT replaces the entire resource state idempotently; PATCH applies partial modifications.", isCorrect: true },
      { optionKey: "C", optionText: "PUT can only be called from browsers; PATCH is reserved for curl and Postman.", isCorrect: false },
      { optionKey: "D", optionText: "There is no difference; they are exact aliases in modern HTTP servers.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 23,
    topicNumber: 1,
    topicSlug: "rest-api-design-http-protocol-idempotency",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "HTTP Method Idempotency Classifications",
    prompt: "Which of the following sets of HTTP methods are strictly guaranteed to be IDEMPOTENT by specification?",
    explanation: "GET, HEAD, PUT, DELETE, and OPTIONS are idempotent because making multiple identical requests has the same intended effect on server state as making a single request.",
    hintsJson: JSON.stringify(["Can you safely repeat a DELETE or PUT without changing the resulting state?"]),
    options: [
      { optionKey: "A", optionText: "POST, PATCH, CONNECT", isCorrect: false },
      { optionKey: "B", optionText: "GET, HEAD, PUT, DELETE, OPTIONS", isCorrect: true },
      { optionKey: "C", optionText: "POST, PUT, DELETE", isCorrect: false },
      { optionKey: "D", optionText: "Only GET and HEAD; all modifying methods are non-idempotent.", isCorrect: false }
    ]
  },

  {
    moduleNumber: 23,
    topicNumber: 2,
    topicSlug: "api-security-jwt-rbac-rate-limiting-cors",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Refresh Token Rotation (RTR) Defense",
    prompt: "In modern OAuth2 / JWT architectures, how does Refresh Token Rotation (RTR) protect against token theft?",
    explanation: "Every time a refresh token is exchanged, a new refresh token is issued and the old one invalidated. If an attacker presents an already-used refresh token, the server detects token reuse and invalidates the entire token family.",
    hintsJson: JSON.stringify(["What happens when an old already-used token is presented again?"]),
    options: [
      { optionKey: "A", optionText: "It encrypts the token with the client's MAC address so it cannot run elsewhere.", isCorrect: false },
      { optionKey: "B", optionText: "Each refresh token can only be used once; presenting an already-used token triggers reuse detection and revokes the whole token family.", isCorrect: true },
      { optionKey: "C", optionText: "It rotates the RSA private key on every single HTTP request.", isCorrect: false },
      { optionKey: "D", optionText: "It disables HTTPS and relies solely on base64 encoding.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 23,
    topicNumber: 2,
    topicSlug: "api-security-jwt-rbac-rate-limiting-cors",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "CORS Preflight OPTIONS Trigger",
    prompt: "Which of the following HTTP requests will trigger a browser CORS Preflight (OPTIONS) request prior to sending the actual request?",
    explanation: "A preflight OPTIONS request is triggered whenever the request uses non-simple HTTP methods (e.g. PUT, DELETE, PATCH) or non-simple headers (e.g. Authorization, Content-Type: application/json).",
    hintsJson: JSON.stringify(["Content-Type: application/json triggers preflight."]),
    options: [
      { optionKey: "A", optionText: "A GET request with no custom headers.", isCorrect: false },
      { optionKey: "B", optionText: "A POST request with Content-Type: application/x-www-form-urlencoded.", isCorrect: false },
      { optionKey: "C", optionText: "A POST request with Content-Type: application/json and an Authorization header.", isCorrect: true },
      { optionKey: "D", optionText: "A HEAD request with standard Accept header.", isCorrect: false }
    ]
  },

  {
    moduleNumber: 23,
    topicNumber: 3,
    topicSlug: "api-validation-pagination-filtering-error-handling",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "Keyset (Cursor) vs OFFSET Pagination",
    prompt: "Why is Keyset (Cursor-based) pagination dramatically more scalable than OFFSET/LIMIT pagination for tables with millions of rows?",
    explanation: "OFFSET requires the database engine to scan and discard N rows (O(N) seek penalty). Cursor pagination uses indexed comparison (WHERE id > cursor) which resolves in O(log N) time via B-Tree index seek.",
    hintsJson: JSON.stringify(["Consider how the database locates row 1,000,000."]),
    options: [
      { optionKey: "A", optionText: "Cursor pagination downloads all database rows into Node.js memory upfront.", isCorrect: false },
      { optionKey: "B", optionText: "Cursor pagination uses B-tree indexed seeks (WHERE id > :cursor) in O(log N) time, avoiding the O(N) scan-and-discard overhead of OFFSET.", isCorrect: true },
      { optionKey: "C", optionText: "OFFSET pagination is not supported by SQL databases.", isCorrect: false },
      { optionKey: "D", optionText: "Cursor pagination automatically compresses the response into Brotli format.", isCorrect: false }
    ]
  },

  // ==========================================
  // MODULE 24: DATABASE ENGINEERING, QUERY OPTIMIZATION & SYSTEM DESIGN
  // ==========================================
  {
    moduleNumber: 24,
    topicNumber: 1,
    topicSlug: "sql-nosql-schema-modeling-indexing",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "B-Tree Composite Index Leftmost Prefix Rule",
    prompt: "If a database table has a composite B-Tree index on (tenant_id, status, created_at), which of the following WHERE queries CANNOT use this index effectively?",
    explanation: "Under the Leftmost Prefix rule, a B-tree composite index can only be navigated starting from its leading column(s). A query filtering only on 'status' skips the leading 'tenant_id' column and cannot use the index.",
    hintsJson: JSON.stringify(["The index tree is ordered by tenant_id first."]),
    options: [
      { optionKey: "A", optionText: "WHERE tenant_id = 'org_1' AND status = 'ACTIVE'", isCorrect: false },
      { optionKey: "B", optionText: "WHERE tenant_id = 'org_1'", isCorrect: false },
      { optionKey: "C", optionText: "WHERE status = 'ACTIVE' AND created_at > '2025-01-01'", isCorrect: true },
      { optionKey: "D", optionText: "WHERE tenant_id = 'org_1' AND status = 'ACTIVE' AND created_at > '2025-01-01'", isCorrect: false }
    ]
  },
  {
    moduleNumber: 24,
    topicNumber: 1,
    topicSlug: "sql-nosql-schema-modeling-indexing",
    type: "MCQ",
    difficulty: "Advanced",
    title: "ACID Isolation Levels & Anomalies",
    prompt: "Which database transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads in standard ANSI SQL?",
    explanation: "Repeatable Read guarantees that data read once during a transaction will not change if read again (preventing Dirty Reads and Non-Repeatable Reads), but new rows inserted by concurrent transactions may appear (Phantom Reads).",
    hintsJson: JSON.stringify(["Repeatable Read prevents non-repeatable reads."]),
    options: [
      { optionKey: "A", optionText: "Read Uncommitted", isCorrect: false },
      { optionKey: "B", optionText: "Read Committed", isCorrect: false },
      { optionKey: "C", optionText: "Repeatable Read", isCorrect: true },
      { optionKey: "D", optionText: "Serializable", isCorrect: false }
    ]
  },

  {
    moduleNumber: 24,
    topicNumber: 2,
    topicSlug: "query-optimization-execution-plans-caching",
    type: "MCQ",
    difficulty: "Intermediate",
    title: "The N+1 Query Problem",
    prompt: "In full-stack backend development, what constitutes the classic 'N+1 Query Problem' when fetching a list of 50 users and their profile details?",
    explanation: "The application executes 1 initial query to fetch the 50 parent records, followed by N (50) separate queries in a loop to fetch each child relation, causing 51 total database queries instead of 1 eager JOIN query.",
    hintsJson: JSON.stringify(["1 initial query + N queries in a loop."]),
    options: [
      { optionKey: "A", optionText: "Running a query that takes N+1 seconds to complete.", isCorrect: false },
      { optionKey: "B", optionText: "Executing 1 query to retrieve N records, followed by N separate queries to fetch related child entities instead of eager loading.", isCorrect: true },
      { optionKey: "C", optionText: "Creating N+1 indexes on a single database table.", isCorrect: false },
      { optionKey: "D", optionText: "Attempting to insert N+1 columns into a table with only N defined columns.", isCorrect: false }
    ]
  },
  {
    moduleNumber: 24,
    topicNumber: 2,
    topicSlug: "query-optimization-execution-plans-caching",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Cache-Aside (Lazy Loading) Pattern",
    prompt: "In high-throughput microservices, how does the Cache-Aside pattern handle read requests when an item is requested?",
    explanation: "The application first checks the cache. On a cache hit, it returns the data immediately. On a cache miss, it reads the data from the database, writes it to the cache with a TTL, and returns it to the client.",
    hintsJson: JSON.stringify(["Check cache first; on miss fetch from DB and write to cache."]),
    options: [
      { optionKey: "A", optionText: "The database automatically pushes all updates to the cache before committing transactions.", isCorrect: false },
      { optionKey: "B", optionText: "The application checks the cache; on a miss, it queries the DB, writes the result to cache with TTL, and returns it.", isCorrect: true },
      { optionKey: "C", optionText: "The cache intercepts all network packets at the NIC hardware level.", isCorrect: false },
      { optionKey: "D", optionText: "All reads bypass the cache completely and only writes touch Redis.", isCorrect: false }
    ]
  },

  {
    moduleNumber: 24,
    topicNumber: 3,
    topicSlug: "fullstack-system-design-angular-node-integration",
    type: "MCQ",
    difficulty: "Advanced",
    title: "Full Jitter Reconnection in Distributed Systems",
    prompt: "Why is randomized 'Full Jitter' exponential backoff implemented in Angular clients when reconnecting to Node.js backend WebSocket clusters?",
    explanation: "Full Jitter distributes reconnection attempts randomly across a time interval, preventing thousands of clients from synchronizing their retries into massive load spikes (the Thundering Herd problem).",
    hintsJson: JSON.stringify(["It breaks synchronization to prevent thundering herd spikes."]),
    options: [
      { optionKey: "A", optionText: "It speeds up the TCP three-way handshake by 50%.", isCorrect: false },
      { optionKey: "B", optionText: "It decorrelates client reconnection spikes, preventing the Thundering Herd storm from overwhelming the server cluster.", isCorrect: true },
      { optionKey: "C", optionText: "It bypasses Nginx load balancer connection limits.", isCorrect: false },
      { optionKey: "D", optionText: "It encrypts WebSocket payloads without TLS certificates.", isCorrect: false }
    ]
  }
];

module.exports = fullstackQuizzes;
