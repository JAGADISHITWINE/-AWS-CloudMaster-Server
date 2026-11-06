/**
 * Dedicated Technical Interview Questions for Full-Stack Modules 21, 22, 23, and 24
 *
 * Module 21: Angular Enterprise Frontend Architecture
 * Module 22: Node.js Scalable Backend Architecture
 * Module 23: RESTful APIs, Integration, Security & Performance
 * Module 24: Database Engineering, Query Optimization & Full-Stack System Design
 */

module.exports = [
  // ==========================================
  // MODULE 21: ANGULAR ENTERPRISE FRONTEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 21,
    topicNumber: 1,
    topicSlug: "angular-core-components-lifecycle-databinding",
    title: "Angular Ivy Compilation, Standalone Components & ViewEncapsulation Deep Dive",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'Can you explain how the Angular Ivy compiler processes templates into executable bytecode? Compare ViewEncapsulation modes (Emulated vs ShadowDom vs None), detail how modern standalone components eliminate NgModule baggage, and outline the exact lifecycle execution order from class instantiation to destroy.'",
    explanation: "Tests thorough comprehension of Angular's rendering engine, template compilation, DOM encapsulation strategies, and lifecycle management.",
    hintsJson: JSON.stringify([
      "Explain the Ivy compiler: generates template functions (instructions like ɵɵelementStart, ɵɵtext, ɵɵproperty).",
      "Detail ViewEncapsulation.Emulated: generated host/content attributes (_nghost, _ngcontent).",
      "Contrast with ShadowDom (native browser encapsulation) and None (global CSS leak).",
      "Explain the exact hook order: constructor -> ngOnChanges -> ngOnInit -> ngDoCheck -> ngAfterContentInit -> ngAfterContentChecked -> ngAfterViewInit -> ngAfterViewChecked -> ngOnDestroy."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Angular Ivy Compiler & Template Bytecode:
- **How Ivy Works:** The Ivy compiler does not generate abstract metadata JSON files. Instead, it compiles each component template directly into **static JavaScript instructions** (e.g. \`ɵɵelementStart\`, \`ɵɵtextInterpolate\`, \`ɵɵproperty\`, \`ɵɵadvance\`).
- **Two Execution Phases:** When change detection runs, these compiled instructions execute in two modes:
  1. **Creation Phase (\`rf & 1\`):** Executes only once to construct DOM elements, register event listeners, and wire up bindings.
  2. **Update Phase (\`rf & 2\`):** Compares current expression values against previous values and mutates only changed DOM properties.
- **Tree-Shaking:** Because template instructions are standard exported functions, any unused instruction (like an unused pipe or directive) is cleanly dropped by bundlers (Vite/Webpack).

#### 2. ViewEncapsulation Modes:
- **Emulated (Default):** Angular simulates style scoping without native browser Shadow DOM. The Ivy compiler appends unique host attributes (\`_nghost-ng-c12\`) to component wrappers and content attributes (\`_ngcontent-ng-c12\`) to child elements. CSS rules are transformed to target \`.card[_ngcontent-ng-c12]\`. Styles cannot leak outward.
- **ShadowDom:** Angular attaches a real browser \`shadowRoot\` (\`element.attachShadow({ mode: 'open' })\`). Provides absolute encapsulation using browser standards, but global styles (Bootstrap, Tailwind) cannot penetrate the shadow root without CSS custom variables or \`::part\`.
- **None:** No encapsulation. Component styles are added to the global document \`<head>\` and leak across the entire application.

#### 3. Standalone Components vs NgModules:
- Standalone components specify \`standalone: true\` and declare their exact dependencies in their \`imports: [CommonModule, ReactiveFormsModule, UserCardComponent]\` array.
- This eliminates the boilerplate of shared modules, simplifies lazy loading (\`loadComponent: () => import(...)\`), and allows fine-grained dependency isolation.

#### 4. Lifecycle Execution Sequence:
1. **\`constructor()\`:** Class instantiation; dependency injection is wired. Inputs are NOT yet available.
2. **\`ngOnChanges()\`:** Fires before \`ngOnInit\` whenever \`@Input\` properties resolve or change.
3. **\`ngOnInit()\`:** Component initialized; inputs are guaranteed available. Ideal for HTTP calls and subscriptions.
4. **\`ngDoCheck()\`:** Custom change detection hook running on every CD cycle.
5. **\`ngAfterContentInit()\` & \`ngAfterContentChecked()\`:** Projected content (\`<ng-content>\`) is initialized and checked.
6. **\`ngAfterViewInit()\` & \`ngAfterViewChecked()\`:** Component's view and child views are fully mounted. Mutating bindings here in dev mode triggers \`NG0100\`!
7. **\`ngOnDestroy()\`:** Teardown phase. Unsubscribe from RxJS streams, detach listeners, and clean up timers.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Ivy Template Instructions & Two Phases", weight: 25, description: "Explains Ivy bytecode, creation vs update phases, and tree-shaking benefits." },
        { name: "ViewEncapsulation Scoping Mechanisms", weight: 25, description: "Accurately contrasts Emulated attributes, native ShadowDom, and None." },
        { name: "Standalone Components Architecture", weight: 25, description: "Explains direct imports, elimination of NgModules, and granular lazy loading." },
        { name: "Lifecycle Hook Order & Gotchas", weight: 25, description: "Details constructor through ngOnDestroy sequence and the NG0100 hazard in ngAfterViewInit." }
      ]
    }),
    tagsJson: JSON.stringify(["Angular", "Ivy Compiler", "ViewEncapsulation", "Lifecycle Hooks", "Standalone", "Frontend"])
  },

  {
    moduleNumber: 21,
    topicNumber: 2,
    topicSlug: "angular-rxjs-services-dependency-injection",
    title: "RxJS Higher-Order Mapping Operators, Memory Leaks & Hierarchical Dependency Injection",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'In an enterprise Angular application, when would you specifically choose switchMap, mergeMap, concatMap, or exhaustMap? How does Angular's hierarchical injector resolve dependencies between root, environment, and element injectors, and how do you systematically prevent RxJS subscription memory leaks?'",
    explanation: "Evaluates production RxJS decision-making, deep understanding of Angular's multi-tiered DI system, and memory leak mitigation strategies.",
    hintsJson: JSON.stringify([
      "Explain switchMap: cancellation on new emissions (search queries).",
      "Explain mergeMap: concurrent processing (independent file uploads).",
      "Explain concatMap: ordered sequential processing (chat messages, balance updates).",
      "Explain exhaustMap: ignores new emissions while active (submit buttons, payments).",
      "Explain DI hierarchy: Element Injector -> Environment Injector -> Root -> Platform -> NullInjector.",
      "Explain memory leaks: takeUntilDestroyed() or async pipe."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. The 4 Higher-Order RxJS Mapping Operators:
- **\`switchMap\` (Switch & Cancel):**
  - **Behavior:** Unsubscribes from and aborts any active inner Observable as soon as a new emission arrives from the source.
  - **Use Case:** Auto-complete search inputs, table filter dropdowns, and route parameter changes where outdated in-flight responses must be discarded.
- **\`concatMap\` (Queue & Maintain Order):**
  - **Behavior:** Buffers incoming emissions and processes each inner Observable strictly sequentially one after another.
  - **Use Case:** Sequential file writes, credit balance ledger transactions, or ordering steps in a wizard where sequence must be preserved.
- **\`mergeMap\` (Concurrent Parallel Execution):**
  - **Behavior:** Immediately subscribes to all inner Observables concurrently with no cancellation or buffering.
  - **Use Case:** Multi-file simultaneous uploads, independent metric pings, or batch operations where order does not matter and cancellation is unwanted.
- **\`exhaustMap\` (Ignore While Busy):**
  - **Behavior:** Ignores and drops all incoming source emissions until the currently active inner Observable completes.
  - **Use Case:** Non-reentrant button submissions (e.g. 'Pay Now', 'Submit Form', 'Download Report') to prevent accidental duplicate actions.

#### 2. Angular Hierarchical Injector Resolution:
When a component requests a dependency via \`inject(Service)\` or \`constructor(private s: Service)\`, Angular walks up a two-branch tree:
1. **Element Injector Hierarchy:**
   - Checks the component's own \`providers\` array.
   - If not found, walks up parent component element injectors to the root component.
2. **Environment Injector Hierarchy:**
   - If not found in the Element branch, jumps to the **Environment Injector** of the current route/feature.
   - If not found, checks the **Root Injector** (\`providedIn: 'root'\`), which provides singleton instances application-wide.
   - If not found, checks the **Platform Injector** (shared across multiple Angular apps on same page, e.g. DomSanitizer).
   - If not found, terminates at the **NullInjector**, throwing \`NullInjectorError: No provider for Service!\`.

#### 3. Preventing RxJS Memory Leaks:
- **Root Cause:** Subscribing to an infinite stream (e.g. \`service.state$\`) retains a closure reference to \`this\`, preventing the garbage collector from reclaiming the unmounted component and its DOM nodes.
- **Best Practice 1 (\`takeUntilDestroyed\`):**
  Angular 16+ provides \`takeUntilDestroyed(destroyRef)\`, which automatically completes the stream when the component is destroyed:
  \`\`\`typescript
  this.userService.user$.pipe(takeUntilDestroyed()).subscribe(...);
  \`\`\`
- **Best Practice 2 (\`async\` Pipe):**
  Use the \`async\` pipe in templates (\`<div *ngIf=\"data$ | async as data\">\`). It subscribes upon component initialization and unsubscribes automatically on view teardown.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Mapping Operators Decision Matrix", weight: 35, description: "Accurately contrasts switchMap, mergeMap, concatMap, exhaustMap with enterprise use cases." },
        { name: "Hierarchical Injector Resolution", weight: 30, description: "Explains Element vs Environment vs Root vs NullInjector resolution sequence." },
        { name: "Memory Leak Prevention Patterns", weight: 35, description: "Details takeUntilDestroyed, async pipe, and the closure retention mechanics of unmanaged subscriptions." }
      ]
    }),
    tagsJson: JSON.stringify(["Angular", "RxJS", "Dependency Injection", "switchMap", "exhaustMap", "Memory Leaks"])
  },

  {
    moduleNumber: 21,
    topicNumber: 3,
    topicSlug: "angular-routing-forms-change-detection-signals",
    title: "Zone.js vs OnPush vs Angular Signals: Architectural Evolution & Performance Tuning",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How does Zone.js detect changes in an Angular app, and why can it cause performance bottlenecks at scale? Explain how ChangeDetectionStrategy.OnPush prunes the change detection tree, and contrast OnPush with modern Angular 16+ Signals. How do functional routing guards and interceptors fit into modern Angular architecture?'",
    explanation: "Tests deep understanding of Angular performance optimization, the architectural evolution from monkey-patched Zone.js dirty-checking to fine-grained Signals, and modern functional routing.",
    hintsJson: JSON.stringify([
      "Explain Zone.js: monkey-patches async browser APIs (setTimeout, addEventListener, Promise.then, fetch) to trigger ApplicationRef.tick().",
      "Explain Default CD: top-down tree walk checking every expression in every component.",
      "Explain OnPush: skips checking unless @Input reference changes, DOM event fires inside, or async pipe emits.",
      "Explain Signals: fine-grained, dependency-tracking reactivity without Zone.js overhead.",
      "Explain functional guards: CanActivateFn using inject() instead of class-based CanActivate."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. How Zone.js Works & Why It Bottlenecks:
- **Zone.js Monkey-Patching:**
  Zone.js intercepts all asynchronous browser APIs: DOM event listeners (\`click\`, \`mousemove\`, \`input\`), timers (\`setTimeout\`, \`setInterval\`), and network requests (\`fetch\`, \`XMLHttpRequest\`).
- **Top-Down Tree Check:**
  Whenever ANY monkey-patched callback completes, Zone.js triggers \`onMicrotaskEmpty\` which calls \`ApplicationRef.tick()\`. Under \`ChangeDetectionStrategy.Default\`, Angular walks the **entire component tree from root to leaf**, evaluating every template binding in every component.
- **The Bottleneck:**
  In large dashboards with 1,000+ components, a single mouse movement or keystroke causes thousands of binding checks, causing dropped frames and high CPU usage.

#### 2. Optimization with ChangeDetectionStrategy.OnPush:
- **Pruning the Tree:**
  Marking a component \`OnPush\` tells Angular: *'Do not check this component or any of its children unless one of 4 specific triggers occurs:'*
  1. An \`@Input()\` property receives a **new object reference** (compared using \`===\` strict equality).
  2. A DOM event originated from **inside this component's template** (e.g. button click).
  3. An Observable bound via the \`async\` pipe emits a new value.
  4. Manual triggering via \`ChangeDetectorRef.markForCheck()\`.
- **Reference Immutability:**
  Because checks rely on \`===\`, developers must practice immutable updates (\`this.user = { ...this.user, name: 'Alice' }\`). Mutating an existing object property in place will NOT trigger change detection under OnPush!

#### 3. Modern Angular Signals (The Zoneless Future):
- **Fine-Grained Reactivity:**
  Unlike Zone.js which checks entire component trees, Angular Signals (\`signal()\`, \`computed()\`, \`effect()\`) track exact data dependencies.
- **Push-Pull Model:**
  When a signal changes (\`count.update(n => n + 1)\`), it marks only the specific DOM text nodes or elements bound to that signal as dirty. No top-down tree scanning is required.
- **Glitch-Free & Synchronous:**
  Derived signals (\`computed()\`) execute synchronously and are memoized, eliminating the double-check pass and \`NG0100\` hazards.

#### 4. Modern Functional Routing Guards & Interceptors:
- Angular has moved away from verbose class-based guards (\`implements CanActivate\`) to lightweight **functional guards** (\`CanActivateFn\`):
  \`\`\`typescript
  export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
  };
  \`\`\`
- Functional HTTP Interceptors (\`HttpInterceptorFn\`) chain cleanly in \`provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]))\` without NgModule registration.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Zone.js Monkey Patching & Bottlenecks", weight: 25, description: "Explains browser API interception and top-down dirty checking overhead." },
        { name: "OnPush Pruning Triggers & Immutability", weight: 30, description: "Accurately details the 4 OnPush triggers and reference identity comparison." },
        { name: "Angular Signals Reactive Model", weight: 25, description: "Contrasts coarse tree-checks with fine-grained dependency tracking and glitch-free computed state." },
        { name: "Modern Functional Guards & Interceptors", weight: 20, description: "Demonstrates modern CanActivateFn and HttpInterceptorFn using inject()." }
      ]
    }),
    tagsJson: JSON.stringify(["Angular", "Zone.js", "OnPush", "Signals", "Routing Guards", "Performance"])
  },

  // ==========================================
  // MODULE 22: NODE.JS SCALABLE BACKEND ARCHITECTURE
  // ==========================================
  {
    moduleNumber: 22,
    topicNumber: 1,
    topicSlug: "nodejs-event-loop-libuv-async-programming",
    title: "Node.js Event Loop Execution Phases, Microtasks & Scalable Non-Blocking I/O",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'Describe the exact internal architecture of Node.js: V8, libuv, and the OS kernel. Walk through the 6 phases of the libuv event loop in order. Where do process.nextTick and Promise microtasks fit into this lifecycle, and how do you prevent CPU-bound tasks from stalling the event loop?'",
    explanation: "Tests foundational mastery of the Node.js runtime, the libuv event loop lifecycle phases, microtask queuing rules, and thread offloading techniques.",
    hintsJson: JSON.stringify([
      "Explain the 6 phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks.",
      "Explain Poll phase: calculates poll timeout and processes incoming I/O events.",
      "Explain Check phase: setImmediate callbacks execute here.",
      "Explain Microtask drain: process.nextTick and Promise queues run between each phase.",
      "Explain CPU-bound offloading: worker_threads or cluster module."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Node.js Internal Architecture:
Node.js combines three core layers:
1. **Google V8 Engine:** Compiles and executes JavaScript into native machine code, manages call stack, heap memory, and garbage collection.
2. **libuv (C Library):** Provides the cross-platform asynchronous I/O engine, the event loop, and a background thread pool (default 4 threads) for blocking system tasks (file I/O, DNS resolution, crypto).
3. **OS Kernel:** Modern OS asynchronous primitives (epoll on Linux, kqueue on macOS, IOCP on Windows) handle thousands of non-blocking TCP network sockets directly without thread overhead.

#### 2. The 6 Phases of the libuv Event Loop:
1. **Timers Phase:** Executes callbacks scheduled by expired \`setTimeout()\` and \`setInterval()\` timers (ordered via a min-heap).
2. **Pending Callbacks (I/O Callbacks):** Executes deferred I/O callbacks from previous loop iterations (e.g. system-level TCP errors like \`ECONNREFUSED\`).
3. **Idle, Prepare:** Internal libuv housekeeping operations.
4. **Poll Phase (Heart of the Loop):**
   - Retrieves new I/O events from the OS kernel (incoming HTTP connections, data packets).
   - Executes callbacks for I/O operations.
   - If no timers are pending and the check queue is empty, the loop will block and wait here for new I/O events up to a calculated timeout.
5. **Check Phase:** Executes callbacks scheduled by \`setImmediate()\`. Crucially, inside an I/O callback (poll phase), \`setImmediate()\` is guaranteed to run BEFORE any \`setTimeout(0)\`.
6. **Close Callbacks:** Executes close events, such as \`socket.on('close', ...)\` and stream teardown.

#### 3. Microtasks & Tick Boundaries:
- Microtasks do NOT run in a dedicated event loop phase; they run **between every individual callback** and on every phase transition.
- **Precedence Order:**
  1. \`process.nextTick()\` queue (drained completely first).
  2. \`Promise.then()\` / \`queueMicrotask()\` queue (drained next).
  *Warning:* An infinite recursion of \`process.nextTick()\` completely starves the event loop, freezing all I/O!

#### 4. Handling CPU-Bound Tasks:
Since JavaScript runs on a single thread, heavy CPU computation (image resizing, ML inference, PDF generation, bcrypt hashing) blocks the call stack:
- **Worker Threads (\`worker_threads\`):** Spawns real OS threads sharing memory via \`SharedArrayBuffer\` for parallel CPU processing.
- **Native Thread Pool (\`UV_THREADPOOL_SIZE\`):** Scaling libuv threads up to 16 or 32 for parallel crypto/fs operations.
- **Cluster Module / Child Processes:** Forks separate OS processes across CPU cores listening on the same server port.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Node.js Core Architecture Components", weight: 25, description: "Explains V8, libuv thread pool, and OS non-blocking primitives (epoll/kqueue)." },
        { name: "The 6 Event Loop Phases", weight: 35, description: "Correctly outlines Timers, Pending, Idle, Poll, Check, and Close in order." },
        { name: "Microtask Queues & Precedence", weight: 20, description: "Explains nextTick vs Promise priority and tick boundary drainage." },
        { name: "CPU-Bound Offloading Patterns", weight: 20, description: "Details worker_threads, clustering, and thread pool scaling." }
      ]
    }),
    tagsJson: JSON.stringify(["Node.js", "Event Loop", "libuv", "V8", "Microtasks", "Worker Threads", "Backend"])
  },

  {
    moduleNumber: 22,
    topicNumber: 2,
    topicSlug: "nodejs-streams-buffer-file-handling",
    title: "V8 Buffers, Stream Backpressure Management & Pipeline Error Handling",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do Node.js Buffers manage raw binary memory outside the V8 heap? Explain how backpressure works between readable and writable streams, what highWaterMark signifies, and why stream.promises.pipeline is critical for production reliability.'",
    explanation: "Tests mastery of low-level memory representation in Node.js, stream backpressure flow control, and resilient stream chaining.",
    hintsJson: JSON.stringify([
      "Explain Buffers: allocated outside V8 heap by C++ bindings, avoiding V8 GC pauses.",
      "Explain highWaterMark: internal threshold buffer limit (default 16KB for byte streams, 16 for objectMode).",
      "Explain Backpressure: writable.write() returning false -> readable.pause() -> 'drain' event -> readable.resume().",
      "Explain pipeline: properly cleans up resources and forwards errors, unlike .pipe()."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Node.js Buffer Architecture:
- **Off-Heap Memory Allocation:**
  A \`Buffer\` represents fixed-size chunks of raw memory allocated **outside the V8 JavaScript garbage-collected heap** via C++ \`node::Buffer\` bindings.
- **Why Off-Heap Matters:**
  Storing multi-gigabyte binary files or images in the V8 heap causes severe garbage collector pauses (mark-sweep compaction) that can stall the server for seconds. Buffers allow Node.js to stream huge payloads without bloating the JavaScript heap.
- **Buffer Pool:** Node.js pre-allocates an 8 KB internal memory pool (\`Buffer.poolSize\`) to optimize small slice allocations.

#### 2. Stream Backpressure Flow Control:
- **The Problem:** A fast readable stream (e.g. reading from NVMe SSD at 2 GB/s) piped to a slow writable stream (e.g. sending over a 10 Mbps cellular socket) will overwhelm the recipient's internal buffer, consuming gigabytes of system RAM until the process crashes.
- **The Backpressure Mechanism:**
  1. Every writable stream has a **\`highWaterMark\`** (default 16 KB for byte streams, 16 for object streams).
  2. When \`writable.write(chunk)\` is called, the writable pushes the chunk to its internal buffer.
  3. If the internal buffer size exceeds \`highWaterMark\`, \`writable.write()\` returns **\`false\`**.
  4. This boolean \`false\` signals backpressure: the readable stream must immediately **pause reading** (\`readable.pause()\`).
  5. Once the slow consumer flushes the buffer down to the kernel socket, the writable emits the **\`'drain'\` event**.
  6. The readable stream listens for \`'drain'\` and **resumes reading** (\`readable.resume()\`).

#### 3. Why stream.promises.pipeline is Critical:
- **The Flaw of \`readable.pipe(writable)\`:**
  \`readable.pipe(writable)\` was the legacy API. If an error occurs halfway through (e.g. client disconnects or disk full), \`pipe()\` does NOT close the file descriptors or destroy the streams. Memory and file descriptors leak permanently.
- **The Pipeline Solution:**
  \`\`\`javascript
  const { pipeline } = require('stream/promises');
  await pipeline(readableStream, transformStream, writableStream);
  \`\`\`
  \`pipeline\` automatically registers error handlers on all streams in the chain, ensures all streams are destroyed (\`.destroy()\`), closes underlying file handles, and returns a clean Promise.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Buffer Off-Heap Architecture", weight: 30, description: "Explains raw C++ allocation outside V8 heap and avoidance of GC pauses." },
        { name: "Backpressure & highWaterMark Mechanism", weight: 40, description: "Accurately details write() returning false, pausing, highWaterMark, and the drain event." },
        { name: "pipeline vs pipe Resource Teardown", weight: 30, description: "Explains automatic file descriptor cleanup and error propagation in stream/promises.pipeline." }
      ]
    }),
    tagsJson: JSON.stringify(["Node.js", "Streams", "Buffers", "Backpressure", "highWaterMark", "Pipeline"])
  },

  {
    moduleNumber: 22,
    topicNumber: 3,
    topicSlug: "express-middleware-security-performance-caching",
    title: "Production Express Pipeline: Security, Redis Caching, Clustering & Error Handling",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do you design a battle-tested Express.js middleware pipeline for an enterprise microservice? Walk through the exact middleware ordering (security, parsing, logging, rate limiting, routing, error handling), explain Redis response caching, and detail how to scale across CPU cores using Node clustering or PM2.'",
    explanation: "Tests enterprise backend system architecture, middleware execution lifecycle, caching strategies, and process clustering.",
    hintsJson: JSON.stringify([
      "Explain pipeline ordering: Correlation ID -> Security (Helmet/CORS) -> Body Parser -> Rate Limiter -> Logging -> Cache -> Routes -> 404 -> Error Handler.",
      "Explain Redis caching: key generation, TTL, X-Cache HIT/MISS headers, and cache invalidation on mutations.",
      "Explain Error handling: 4 parameters (err, req, res, next) with RFC 7807 problem details.",
      "Explain Clustering: cluster.fork() per CPU core, IPC, master process distributing TCP handles."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Strict Middleware Ordering Architecture:
In Express, middleware executes in strict registration order. The production sequence:
1. **Correlation ID Middleware:** Attaches \`X-Correlation-ID\` UUID to \`req.id\` and \`res\` header for distributed tracing.
2. **Security Headers (Helmet):** Configures CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
3. **CORS Configuration:** Enforces trusted origin whitelist and handles preflight OPTIONS caching.
4. **Body Parsers with Size Guards:** \`express.json({ limit: '100kb' })\` to prevent memory exhaustion attacks.
5. **Rate Limiting:** Distributed Redis-backed sliding window limiter protecting against brute-force attacks.
6. **Structured Logging (Pino / Morgan):** Logs inbound requests with correlation IDs and timestamps.
7. **Idempotent Caching Layer:** Redis cache middleware for GET endpoints.
8. **Application Route Handlers:** Business logic routes.
9. **404 Not Found Catch-All:** Handles unmatched URLs.
10. **Centralized Error Handler (MUST BE LAST):** 4-parameter \`(err, req, res, next)\` normalizing error responses.

#### 2. Redis Response Caching Pattern:
- **Cache Key Design:** \`cache:<tenantId>:<route>:<sha256(queryString)>\`.
- **Cache-Aside Middleware:**
  - On \`GET\`: Query Redis. If found, set header \`X-Cache: HIT\` and return cached JSON.
  - If miss: set \`X-Cache: MISS\`, hook into \`res.json()\` to write the payload to Redis with an explicit TTL (e.g. 60 seconds), and return.
- **Invalidation on Mutation:**
  When \`POST\`, \`PUT\`, \`PATCH\`, or \`DELETE\` mutations succeed, immediately evict matching cache keys.

#### 3. Scaling Across CPU Cores (Clustering & PM2):
- **Why Clustering is Necessary:** A single Node.js instance only utilizes 1 CPU core. On an 8-core server, 7 cores sit idle without clustering.
- **How Node.js Cluster Works:**
  - The Primary (Master) process creates a master TCP listening socket on port 3000.
  - The master calls \`cluster.fork()\` for each CPU core (\`os.cpus().length\`).
  - Incoming connections are distributed across worker processes using an internal **Round-Robin** algorithm on Linux/macOS.
  - If a worker crashes, the master catches the \`'exit'\` event and immediately forks a replacement worker.
- **In Production Containers:** In Kubernetes or PM2 (\`pm2 start server.js -i max\`), clustering ensures zero-downtime rolling reloads and maximum server saturation.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Middleware Pipeline Ordering Logic", weight: 30, description: "Outlines correct order from Correlation ID/Helmet through Centralized Error Handler." },
        { name: "Redis Caching & Invalidation Architecture", weight: 25, description: "Explains cache key design, TTL, X-Cache headers, and mutation invalidation." },
        { name: "Centralized Error Handling Contract", weight: 20, description: "Explains 4-parameter arity and RFC 7807 normalized error responses." },
        { name: "Multi-Core Clustering & Worker Lifecycle", weight: 25, description: "Explains cluster.fork, master TCP port sharing, round-robin, and worker self-healing." }
      ]
    }),
    tagsJson: JSON.stringify(["Express.js", "Middleware", "Redis", "Clustering", "PM2", "Security", "Backend"])
  },

  // ==========================================
  // MODULE 23: RESTFUL APIS, INTEGRATION, SECURITY & PERFORMANCE
  // ==========================================
  {
    moduleNumber: 23,
    topicNumber: 1,
    topicSlug: "rest-api-design-http-protocol-idempotency",
    title: "Enterprise REST Architectural Principles, Idempotency Keys & Conditional Caching",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'What are the 6 architectural constraints of REST according to Roy Fielding? How do you guarantee idempotency in payment/order POST requests using Idempotency Keys and Redis? Explain conditional caching using ETag, If-None-Match, and HTTP 304.'",
    explanation: "Tests theoretical foundation of REST, practical implementation of idempotency for non-idempotent HTTP methods, and HTTP conditional caching protocols.",
    hintsJson: JSON.stringify([
      "Explain the 6 REST constraints: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code-on-Demand.",
      "Explain Idempotency Key flow: Client sends UUID header -> Redis distributed lock -> Return cached response on duplicate.",
      "Explain HTTP 304: Server calculates ETag hash; client sends If-None-Match; server returns 304 Not Modified with empty body."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. The 6 Architectural Constraints of REST (Roy Fielding):
1. **Client-Server Architecture:** Separation of concerns; UI concerns are decoupled from data storage concerns.
2. **Statelessness:** Each request from client to server must contain all information necessary to understand and process the request. No client context is stored on the server session.
3. **Cacheability:** Responses must implicitly or explicitly define themselves as cacheable or non-cacheable (\`Cache-Control\`, \`ETag\`).
4. **Uniform Interface:**
   - Identification of resources (URIs).
   - Manipulation of resources through representations (JSON/XML).
   - Self-descriptive messages (Media types, HTTP headers).
   - HATEOAS (Hypermedia As The Engine Of Application State).
5. **Layered System:** Client cannot tell whether it is connected directly to the end server or an intermediate proxy, CDN, or load balancer.
6. **Code on Demand (Optional):** Servers can temporarily extend client functionality by transferring executable code (e.g. JavaScript).

#### 2. Idempotency Key Architecture for Financial POST Requests:
- **The Challenge:** HTTP \`POST\` is non-idempotent by design. Network drops during checkout cause clients to retry, risking duplicate credit card charges.
- **The Resolution Protocol:**
  1. **Key Generation:** Client generates a unique UUIDv4 and attaches \`Idempotency-Key: <uuid>\` header.
  2. **Atomic Lock in Redis:**
     Backend executes \`SET idempotency:<userId>:<key> "IN_FLIGHT" EX 120 NX\`.
     - If \`NX\` fails (key already exists):
       - If status is \`"IN_FLIGHT"\`: Return \`HTTP 409 Conflict\` (concurrent duplicate request in progress).
       - If status is \`"COMPLETED"\`: Return the previously saved HTTP status code and response body with header \`X-Cache-Lookup: IDEMPOTENCY-HIT\`.
  3. **Execution & Cache Save:** If lock acquired, execute the charge and save the resulting response in Redis with a 24-hour expiration.

#### 3. Conditional Caching with ETag & HTTP 304 Not Modified:
- **ETag (Entity Tag):** A cryptographic hash (e.g. MD5/SHA) of the resource representation:
  \`\`\`http
  HTTP/1.1 200 OK
  ETag: W/"68b329da9893e34099c7d8ad5cb9c940"
  Cache-Control: public, max-age=3600, must-revalidate
  \`\`\`
- **Validation Request:** When the client re-requests the resource, it sends the stored hash in the request header:
  \`\`\`http
  GET /api/v1/products/42
  If-None-Match: W/"68b329da9893e34099c7d8ad5cb9c940"
  \`\`\`
- **The 304 Response:** Server calculates the current ETag. If identical, the server sends:
  \`\`\`http
  HTTP/1.1 304 Not Modified
  \`\`\`
  With **0 bytes body**! The client immediately renders from local browser cache, saving 99% of bandwidth and network transfer time.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "6 REST Constraints Definition", weight: 30, description: "Clearly outlines Fielding's 6 constraints with statelessness and uniform interface." },
        { name: "Idempotency Key Mechanism & Redis Locking", weight: 40, description: "Accurately details UUID header, SET NX lock, concurrent 409, and replay headers." },
        { name: "ETag & 304 Conditional Caching Flow", weight: 30, description: "Explains ETag hash, If-None-Match request, and 304 Not Modified bandwidth savings." }
      ]
    }),
    tagsJson: JSON.stringify(["REST API", "HTTP", "Idempotency", "ETag", "Caching", "Roy Fielding", "APIs"])
  },

  {
    moduleNumber: 23,
    topicNumber: 2,
    topicSlug: "api-security-jwt-rbac-rate-limiting-cors",
    title: "Dual-Token JWT Security Architecture, Refresh Token Rotation & CORS Defense",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do you design a secure full-stack authentication system using JWT? Address: 1) Why storing tokens in localStorage is dangerous and how httpOnly cookies solve this. 2) Short-lived access tokens vs Refresh Token Rotation (RTR). 3) Instant token revocation for stateless JWTs. 4) How CORS preflight works and how to configure it safely in production.'",
    explanation: "Tests comprehensive knowledge of web application security, token vulnerabilities, XSS/CSRF mitigation, and enterprise CORS configuration.",
    hintsJson: JSON.stringify([
      "Explain localStorage XSS risk: accessible to any rogue JS dependency or XSS script.",
      "Explain httpOnly, Secure, SameSite=Strict cookies: inaccessible to JavaScript.",
      "Explain RTR: Refresh token can only be used once; reuse invalidates entire token family.",
      "Explain revocation: token version in Redis blacklist checked at API gateway.",
      "Explain CORS: Origin, Access-Control-Allow-Origin, credentials require explicit origin (never *)."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Token Storage Vulnerabilities (LocalStorage vs httpOnly Cookies):
- **The LocalStorage Hazard:** Any script executing in the browser (via third-party npm packages, malicious ads, or XSS vulnerabilities) can read \`localStorage.getItem('token')\` and exfiltrate it. It is completely undefended against XSS.
- **The httpOnly Cookie Defense:**
  - Marking the cookie \`httpOnly\` prevents client-side JavaScript from reading \`document.cookie\`.
  - Marking \`Secure\` ensures the cookie is only transmitted over encrypted HTTPS.
  - Setting \`SameSite=Strict\` (or \`Lax\`) prevents Cross-Site Request Forgery (CSRF) by preventing the browser from attaching the cookie to cross-site requests.

#### 2. Dual-Token Architecture with Refresh Token Rotation (RTR):
- **Access Token:**
  - Short-lived (10-15 minutes).
  - Stored in memory (e.g. Angular service variable) or short-lived cookie.
  - Contains claims (userId, roles, permissions) for stateless API verification.
- **Refresh Token & Rotation:**
  - Long-lived (7-30 days), stored in an \`httpOnly\` cookie.
  - **One-Time Use Guarantee:** Every time the refresh token is presented to \`/auth/refresh\`, the backend issues a **NEW access token AND a NEW refresh token**, immediately invalidating the old refresh token.
  - **Automatic Breach Detection:** If an attacker and a legitimate user both attempt to use the same refresh token, the server detects **token reuse**, immediately revokes the entire token family, and forces re-login across all devices.

#### 3. Instant Token Revocation for Stateless JWTs:
- **The Paradox:** Purely stateless JWTs cannot be revoked until their expiration timestamp passes.
- **Enterprise Solutions:**
  - **Approach A (Redis Blacklist):** When a user logs out or is suspended, store the \`jti\` (JWT ID) in Redis with TTL matching remaining token lifespan. API gateway checks Redis before forwarding.
  - **Approach B (User Token Versioning):** Store a \`tokenVersion\` integer on the user record in Redis/DB. Embed \`version: 3\` in the JWT. When revoking, increment version to 4. Any JWT with version 3 is rejected instantly in sub-millisecond cache check.

#### 4. CORS Architecture & Preflight OPTIONS:
- **Preflight Requirement:** Browser fires an \`OPTIONS\` request before any 'non-simple' request (e.g. \`PUT\`, \`DELETE\`, or any request with \`Content-Type: application/json\` or custom headers).
- **Production Rules:**
  - **Never use \`Access-Control-Allow-Origin: *\`** when authentication credentials (\`Access-Control-Allow-Credentials: true\`) are enabled. Browsers strictly reject this combination.
  - Maintain an explicit whitelist of trusted origins:
    \`\`\`javascript
    const whitelist = ['https://app.enterprise.domain', 'https://admin.enterprise.domain'];
    if (whitelist.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400'); // 24-hr preflight cache
    }
    \`\`\``,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Token Storage Security & XSS/CSRF", weight: 25, description: "Accurately contrasts localStorage XSS vulnerability with httpOnly/Secure/SameSite cookies." },
        { name: "Refresh Token Rotation & Family Defense", weight: 30, description: "Explains one-time refresh token usage, issuance of new pairs, and reuse breach detection." },
        { name: "Stateless Revocation Patterns", weight: 25, description: "Details Redis blacklist by JTI or user token versioning for instantaneous termination." },
        { name: "CORS Rules & Preflight Mechanics", weight: 20, description: "Explains OPTIONS preflight, credential rules, and whitelisting trusted origins." }
      ]
    }),
    tagsJson: JSON.stringify(["API Security", "JWT", "RTR", "CORS", "XSS", "CSRF", "APIs"])
  },

  {
    moduleNumber: 23,
    topicNumber: 3,
    topicSlug: "api-validation-pagination-filtering-error-handling",
    title: "High-Scale Cursor Pagination, Schema Validation & RFC 7807 Error Standards",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'Why does OFFSET pagination collapse on large tables, and how does Keyset (Cursor) pagination fix it? Explain how to implement robust request schema validation in Node.js, and detail how RFC 7807 Problem Details improves API client error handling.'",
    explanation: "Tests API scalability, pagination algorithms, schema validation integrity, and adhering to RFC 7807 error communication standards.",
    hintsJson: JSON.stringify([
      "Explain OFFSET disk seek penalty: database reads N+M rows and discards N.",
      "Explain Cursor pagination: WHERE (created_at, id) < (cursor_date, cursor_id) ORDER BY ... LIMIT M.",
      "Explain Schema validation: Zod / Joi stripping unknown fields and returning 422.",
      "Explain RFC 7807: standardized JSON with type, title, status, detail, instance, and invalidParams."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Why OFFSET Pagination Collapses vs Cursor Pagination:
- **The Flaw of OFFSET:**
  Executing \`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 20 OFFSET 100000\` forces the database engine to **traverse 100,020 index nodes**, fetch the table rows, and discard the first 100,000 rows. Query execution time degrades linearly (O(N)), leading to disk thrashing and high latency.
- **The Stability Problem:** If new rows are inserted while a user browses page 2, records shift, causing users to see duplicate rows or miss items.
- **The Cursor (Keyset) Solution:**
  Instead of an offset, the client passes an opaque cursor representing the last seen record's sort keys:
  \`\`\`sql
  SELECT * FROM transactions
  WHERE (created_at, id) < ($last_created_at, $last_id)
  ORDER BY created_at DESC, id DESC
  LIMIT 20;
  \`\`\`
  - **O(log N) Performance:** The database performs a direct B-tree index seek to the exact row, executing in **< 1ms** whether fetching page 1 or page 50,000.
  - **Completely Stable:** Newly inserted items never cause duplicate or skipped records.

#### 2. Request Schema Validation (Zod / Joi):
- **Why Validation Must Occur at the Edge:** Unvalidated request bodies lead to SQL/NoSQL injection, prototype pollution, and silent database corruption.
- **Modern Schema Validation (e.g. Zod):**
  - Validates types, string lengths, regex patterns, and nested objects.
  - **Strips Unknown Properties (\`strip\`):** Eliminates mass-assignment vulnerabilities where malicious users inject \`isAdmin: true\`.
  - **Infers TypeScript Types:** Automatically generates compile-time types from runtime schemas.
  - On failure, aborts request before controller logic with **HTTP 422 Unprocessable Entity**.

#### 3. Standardized Error Handling with RFC 7807 Problem Details:
- **The Problem:** Inconsistent error shapes (\`{ error: '...' }\` vs \`{ msg: '...' }\` vs \`{ errors: [] }\`) break frontend error handling.
- **RFC 7807 Standard (\`application/problem+json\`):**
  \`\`\`json
  {
    "type": "https://api.enterprise.domain/errors/validation-failed",
    "title": "Validation Failed",
    "status": 422,
    "detail": "The request payload failed schema validation constraints.",
    "instance": "/api/v1/users",
    "correlationId": "req_a9f812b4",
    "invalidParams": [
      { "field": "email", "reason": "Must be a valid corporate email address." },
      { "field": "password", "reason": "Must contain at least 1 uppercase and 1 symbol." }
    ]
  }
  \`\`\`
  This enables Angular HTTP interceptors to build automated, accessible UI error toasts and attach field-level validation messages directly onto form controls.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "OFFSET vs Keyset Performance Mechanics", weight: 35, description: "Explains O(N) scan-and-discard vs O(log N) B-tree seek and data drift stability." },
        { name: "Edge Schema Validation & Mass-Assignment Defense", weight: 30, description: "Details Zod/Joi validation, unknown property stripping, and 422 responses." },
        { name: "RFC 7807 Specification & Client Integration", weight: 35, description: "Details problem+json structure, correlation IDs, and Angular interceptor integration." }
      ]
    }),
    tagsJson: JSON.stringify(["Pagination", "Cursor", "Schema Validation", "RFC 7807", "Zod", "APIs"])
  },

  // ==========================================
  // MODULE 24: DATABASE ENGINEERING, QUERY OPTIMIZATION & SYSTEM DESIGN
  // ==========================================
  {
    moduleNumber: 24,
    topicNumber: 1,
    topicSlug: "sql-nosql-schema-modeling-indexing",
    title: "SQL vs NoSQL Architectural Decisions, B-Tree Index Mechanics & ACID Isolation",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do you decide between a Relational SQL database (PostgreSQL) and a NoSQL Document store (MongoDB) for an enterprise application? Explain how B-Tree indexes work internally and the Leftmost Prefix rule. What are the 4 ACID transaction isolation levels, and what anomalies do they prevent?'",
    explanation: "Tests foundational data engineering, storage engine internals, B-tree mechanics, and concurrency isolation anomalies.",
    hintsJson: JSON.stringify([
      "Explain SQL vs NoSQL: ACID/relational joins/strict schemas vs horizontal scaling/polymorphic schema/high write volume.",
      "Explain B-Tree: balanced search tree with O(log N) seeks; leftmost prefix rule requires leading columns.",
      "Explain 4 Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.",
      "Explain anomalies: Dirty Read, Non-Repeatable Read, Phantom Read, Serialization Anomaly."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. SQL vs NoSQL Architectural Decision Matrix:
- **Choose Relational SQL (PostgreSQL / MySQL) when:**
  - Strong ACID guarantees and financial transactional integrity are mandatory.
  - Complex relational joins, multi-table foreign key constraints, and declarative schema integrity are required.
  - Access patterns are varied and unpredictable (analytical queries, dynamic reporting).
- **Choose NoSQL Document Store (MongoDB) when:**
  - Data is hierarchical or polymorphic with rapidly evolving schemas.
  - Workloads require massive horizontal scale (sharding) across clusters with terabytes of writes per day.
  - Data access is predominantly key-value or document-centric (e.g. user session, shopping cart, product catalog).

#### 2. B-Tree Index Internals & The Leftmost Prefix Rule:
- **B-Tree Structure:** A balanced, self-balancing search tree where each node contains multiple sorted keys and child pointers (typically matching an 8 KB OS disk page).
- **Seek Performance:** Navigating from the root node through branch pages to leaf pages takes **O(log N)** operations, converting random full-table disk scans into a handful of page reads. Leaf nodes are linked bidirectionally for fast range scans.
- **The Leftmost Prefix Rule:**
  - A composite index on \`(tenant_id, status, created_at)\` sorts data by \`tenant_id\` first, then by \`status\` within each tenant, then by \`created_at\`.
  - **Satisfies:** Queries filtering on \`(tenant_id)\`, \`(tenant_id, status)\`, or \`(tenant_id, status, created_at)\`.
  - **CANNOT Satisfy:** A query filtering ONLY on \`(status)\` or \`(status, created_at)\` cannot use the index because the tree branches are partitioned by \`tenant_id\`. Skipping the leading column forces a Full Table Scan!

#### 3. ACID Transaction Isolation Levels & Prevented Anomalies:
1. **Read Uncommitted:**
   - Transactions can read uncommitted data written by other concurrent transactions.
   - *Suffers from:* **Dirty Reads** (reading data that gets rolled back).
2. **Read Committed (PostgreSQL / SQL Server default):**
   - Transactions only read data committed before the query started. Prevents Dirty Reads.
   - *Suffers from:* **Non-Repeatable Reads** (re-reading the same row within the same transaction returns different values because another transaction committed an update).
3. **Repeatable Read (MySQL InnoDB default):**
   - Guarantees that any row read by a transaction remains unchanged for the duration of the transaction (via MVCC snapshot).
   - *Suffers from:* **Phantom Reads** (re-running a range query returns newly inserted rows committed by other transactions).
4. **Serializable:**
   - Strictest isolation level. Guarantees execution is equivalent to serial, non-concurrent execution.
   - Prevents all anomalies (Dirty Read, Non-Repeatable Read, Phantom Read, and Write Skew). Trades throughput for safety.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "SQL vs NoSQL Architectural Decision Framework", weight: 30, description: "Accurately contrasts ACID/relational integrity with sharding/polymorphic document storage." },
        { name: "B-Tree Mechanics & Leftmost Prefix Rule", weight: 35, description: "Explains balanced page nodes, leaf range chains, and composite index ordering constraints." },
        { name: "4 ACID Isolation Levels & Database Anomalies", weight: 35, description: "Correctly outlines Read Uncommitted, Read Committed, Repeatable Read, Serializable, and anomalies." }
      ]
    }),
    tagsJson: JSON.stringify(["Databases", "PostgreSQL", "MongoDB", "B-Tree", "ACID", "Indexes", "System Design"])
  },

  {
    moduleNumber: 24,
    topicNumber: 2,
    topicSlug: "query-optimization-execution-plans-caching",
    title: "Database Query Tuning: EXPLAIN ANALYZE, Joins, N+1 Elimination & Cache-Aside Invalidation",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'How do you profile a slow database query using EXPLAIN ANALYZE? Walk through how to eliminate the N+1 query problem, compare the 3 primary relational join algorithms, and detail the Cache-Aside pattern with strategies to prevent Cache Stampede.'",
    explanation: "Tests practical database performance tuning, execution plan interpretation, join strategies, and caching resiliency.",
    hintsJson: JSON.stringify([
      "Explain EXPLAIN ANALYZE: Seq Scan vs Index Scan, execution time, buffers shared hit/read.",
      "Explain N+1: 1 parent query + N loop queries; fixed by eager loading JOIN or DataLoader.",
      "Explain 3 Joins: Nested Loop, Hash Join, Merge Join.",
      "Explain Cache Stampede: Mutex lock (Redlock) or Probabilistic Early Expiration (XFetch)."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. Interpreting EXPLAIN ANALYZE:
- **\`EXPLAIN\` vs \`EXPLAIN ANALYZE\`:** \`EXPLAIN\` only prints the optimizer's estimated cost. \`EXPLAIN (ANALYZE, BUFFERS)\` actually executes the query and reports actual execution time and hardware buffer usage.
- **Critical Red Flags in Execution Plans:**
  - **Seq Scan (Sequential Scan):** Scanning millions of rows on disk instead of an index. Solution: Add index on filter/join columns.
  - **Cost \`(cost=0.42..8.44 rows=1)\`:** Estimated startup cost vs total completion cost in arbitrary page fetch units.
  - **Buffers: shared read=... vs hit=...:** \`hit\` means data was served from RAM buffer cache; \`read\` means data had to be fetched from physical NVMe/SSD disk. High \`read\` indicates memory cache pressure.

#### 2. Eliminating the N+1 Query Problem:
- **The Problem:** An application queries 100 users, and then inside a loop queries the orders for each user: 1 initial query + 100 loop queries = 101 queries!
- **Solution 1 (Relational SQL JOIN):**
  Use eager loading to fetch users and orders in a single SQL statement:
  \`\`\`sql
  SELECT u.id, u.name, o.id AS order_id, o.amount
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  WHERE u.status = 'ACTIVE';
  \`\`\`
- **Solution 2 (Application-Level Batching / DataLoader):**
  Collect all user IDs (\`[1, 2, ... 100]\`) and execute a single batched query:
  \`\`\`sql
  SELECT * FROM orders WHERE user_id IN (1, 2, ..., 100);
  \`\`\`
  Reduces 101 queries to exactly **2 queries** with zero relational Cartesian product overhead.

#### 3. The 3 Primary Relational Join Algorithms:
1. **Nested Loop Join:** For each row in the outer table, searches matching rows in the inner table. Optimal when outer set is small (< 1,000 rows) and inner table has a B-tree index on the join key.
2. **Hash Join:** Scans the smaller table, builds an in-memory hash table of join keys, and probes it while scanning the larger table. Optimal for large, unsorted sets.
3. **Merge Join:** Both tables must be sorted on the join key (e.g. from index scans). Walks both tables in parallel like a merge sort. Highly efficient for massive sorted datasets.

#### 4. Cache-Aside Pattern & Cache Stampede Defense:
- **Cache-Aside Architecture:** Application checks Redis. On hit, returns data. On miss, reads SQL database, writes to Redis with TTL, and returns.
- **The Cache Stampede (Thundering Herd) Disaster:**
  When a high-traffic cache key (e.g. homepage banner) expires, 10,000 concurrent requests simultaneously experience a cache miss. All 10,000 fire identical queries to the database, causing DB CPU to spike to 100% and crash.
- **Stampede Defenses:**
  1. **Distributed Mutex Lock (Redlock / SET NX):** Only the first worker acquires a lock to query the DB and refresh cache; others wait or receive stale data.
  2. **Probabilistic Early Expiration (XFetch Algorithm):** Background workers compute whether to recompute the cache before it officially expires based on remaining TTL and computation time.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "EXPLAIN ANALYZE Plan Interpretation", weight: 30, description: "Explains Seq Scan vs Index Scan, actual time, and shared buffer hit vs read." },
        { name: "N+1 Problem & Eager Batching Solutions", weight: 25, description: "Contrasts loop queries with SQL JOINs and DataLoader IN batching." },
        { name: "3 Relational Join Algorithms", weight: 20, description: "Accurately details Nested Loop, Hash Join, and Merge Join heuristics." },
        { name: "Cache-Aside & Cache Stampede Defenses", weight: 25, description: "Details Redis Lazy Loading, distributed mutex locking, and probabilistic early refresh." }
      ]
    }),
    tagsJson: JSON.stringify(["Query Optimization", "EXPLAIN ANALYZE", "N+1", "Joins", "Redis", "Cache Stampede"])
  },

  {
    moduleNumber: 24,
    topicNumber: 3,
    topicSlug: "fullstack-system-design-angular-node-integration",
    title: "Full-Stack Enterprise System Design: Angular SPA + Node.js Microservices + Redis + DB",
    difficulty: "Advanced",
    prompt: "An interviewer asks: 'Design a resilient, high-throughput enterprise web platform supporting 100,000 concurrent users built with Angular, Node.js, WebSockets, Redis, and PostgreSQL. Address: 1) High-level multi-tier topology (CDN, reverse proxy, microservices, databases). 2) Bi-directional real-time architecture and horizontal WebSocket scaling. 3) Optimistic UI updates with failure rollback in Angular. 4) Distributed tracing across microservice boundaries.'",
    explanation: "Tests end-to-end full-stack system design, real-time bi-directional scalability, client-side optimistic UI patterns, and distributed observability.",
    hintsJson: JSON.stringify([
      "Explain Tier topology: Cloudflare CDN -> Nginx load balancer -> Node.js cluster -> Redis + PostgreSQL read replicas.",
      "Explain WebSockets: Socket.io with Redis Pub/Sub adapter to broadcast events across independent Node worker instances.",
      "Explain Optimistic UI: Update Signal/State immediately -> rollback on API rejection.",
      "Explain Distributed Tracing: Correlation ID in Angular HTTP interceptor propagated through Nginx and Node via AsyncLocalStorage."
    ]),
    recommendedSolution: `### Model Senior Full-Stack Architect Answer:

#### 1. High-Level Multi-Tier Production Topology:
\`\`\`
[100,000 Angular Clients]
         │
         ▼ (HTTPS / WSS)
[Cloudflare Edge CDN & WAF] (DDoS Mitigation, TLS 1.3, Edge Asset Caching)
         │
         ▼ (Port 443)
[Nginx Reverse Proxy & Load Balancer] (SSL Termination, Gzip/Brotli, Round-Robin)
         │
   ┌─────┴─────────────────────┐
   ▼                           ▼
[Node.js API Microservice]  [Node.js WebSocket Cluster]
(Stateless Express / Fastify)  (Real-Time Event Engine)
   │                           │
   ├──────────────┬────────────┤
   ▼              ▼            ▼
[Redis Cluster] [PostgreSQL Primary] ──▶ [PostgreSQL Read Replicas]
(Cache / PubSub)  (ACID Writes)            (Read Queries)
\`\`\`

#### 2. Bi-Directional Real-Time WebSockets at Scale:
- **The Challenge:** WebSocket connections are stateful TCP sockets held open to a specific server. When scaling to multiple Node.js instances, Server A cannot emit a message directly to a client connected to Server B.
- **The Solution (Redis Pub/Sub Adapter):**
  - Attach \`@socket.io/redis-adapter\` to all Node.js WebSocket instances.
  - When Server A emits \`io.to('room:42').emit('ORDER_UPDATE', data)\`, it publishes the event to a Redis Pub/Sub channel.
  - All Node worker instances receive the Redis payload and broadcast it to their locally connected clients in that room.
- **Client Reconnection Resiliency:** Angular client connects with randomized exponential backoff (Full Jitter) to avoid thundering herd storms on edge reconnects.

#### 3. Angular Optimistic UI Updates with Error Rollback:
- **Why Optimistic UI Matters:** Waiting for network round-trips (200-500ms) makes UI feel sluggish. Optimistic UI applies state updates immediately, creating instant responsiveness.
- **The Architecture:**
  \`\`\`typescript
  @Injectable({ providedIn: 'root' })
  export class TaskStore {
    private tasks = signal<Task[]>([]);
    
    toggleTask(taskId: string) {
      // 1. Snapshot previous state
      const previousState = this.tasks();
      
      // 2. Optimistic Update (Immediate UI reaction)
      this.tasks.update(tasks => tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
      
      // 3. Dispatch backend request
      this.http.patch(\`/api/v1/tasks/\${taskId}\`, { done: !task.done }).pipe(
        catchError(error => {
          // 4. Rollback on failure & alert user
          this.tasks.set(previousState);
          this.toastService.error('Failed to update task. Changes reverted.');
          return EMPTY;
        })
      ).subscribe();
    }
  }
  \`\`\`

#### 4. Distributed Tracing Across Tiers (Correlation IDs):
- **Generation:** Angular functional HTTP interceptor generates a UUIDv4 and attaches \`X-Correlation-ID: req_8a7b1c...\` to every outbound request.
- **Proxy Forwarding:** Nginx preserves the header using \`proxy_set_header X-Correlation-ID $http_x_correlation_id;\`.
- **Node.js Context Propagation:** Node backend attaches the ID to \`AsyncLocalStorage\`, ensuring all asynchronous database queries, logs, and downstream microservice HTTP calls log the exact same correlation ID without manual parameter passing.
- **Observability:** Developers can search OpenTelemetry or Datadog for a single correlation ID and view the complete trace from Angular click through DB query in milliseconds.`,
    rubricJson: JSON.stringify({
      criteria: [
        { name: "Multi-Tier Production Architecture", weight: 25, description: "Explains CDN, reverse proxy, stateless Node backend, Redis cluster, and DB read replicas." },
        { name: "WebSocket Horizontal Scaling with Redis PubSub", weight: 30, description: "Explains cross-node event broadcasting via Redis adapter and client jitter reconnection." },
        { name: "Angular Optimistic UI Rollback Pattern", weight: 25, description: "Demonstrates Signal/state snapshotting, immediate UI update, and catchError rollback." },
        { name: "Distributed Tracing with AsyncLocalStorage", weight: 20, description: "Details X-Correlation-ID generation, Nginx pass-through, and AsyncLocalStorage propagation." }
      ]
    }),
    tagsJson: JSON.stringify(["System Design", "WebSockets", "Angular", "Node.js", "Redis", "Distributed Tracing"])
  }
];
