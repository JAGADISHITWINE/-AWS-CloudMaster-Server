module.exports = [
  {
    "moduleNumber": 21,
    "title": "Angular Enterprise Frontend Architecture (Components, RxJS, Signals & Change Detection)",
    "slug": "angular-enterprise-frontend-architecture",
    "description": "Master modern Angular architecture: Standalone components, Ivy compiler, ViewEncapsulation, DI hierarchies, RxJS reactive streams, functional routing guards, dynamic Reactive Forms, OnPush change detection, and fine-grained Angular Signals.",
    "icon": "code",
    "level": "Intermediate",
    "topics": [
      {
        "topicNumber": 1,
        "title": "Angular Architecture, Standalone Components, View Encapsulation & Lifecycle Hooks",
        "slug": "angular-core-components-lifecycle-databinding",
        "summary": "Master modern Angular standalone components, Ivy compiler template bytecode, ViewEncapsulation modes (Emulated vs ShadowDom vs None), 4-way data binding, and the component lifecycle execution sequence from constructor through ngOnDestroy.",
        "difficulty": "Intermediate",
        "estimatedMinutes": 45,
        "keyTakeaway": "Standalone components eliminate NgModule boilerplate, while Emulated View Encapsulation scopes CSS using generated host/content attributes without Shadow DOM overhead."
      },
      {
        "topicNumber": 2,
        "title": "Dependency Injection, Hierarchical Injectors & RxJS Reactive Streams",
        "slug": "angular-rxjs-services-dependency-injection",
        "summary": "Deep dive into Angular's multi-tiered DI hierarchy (providedIn: 'root', Element vs Environment injectors), InjectionTokens, and RxJS reactive programming (Observables, Subjects: Behavior/Replay, pipeable operators switchMap/mergeMap/concatMap/exhaustMap, and memory leak prevention).",
        "difficulty": "Intermediate",
        "estimatedMinutes": 50,
        "keyTakeaway": "Use switchMap for cancellable search queries and exhaustMap for non-reentrant button submissions. Avoid subscription memory leaks by using takeUntilDestroyed() or the async pipe."
      },
      {
        "topicNumber": 3,
        "title": "Routing Guards, Reactive Forms, OnPush Change Detection & Angular Signals",
        "slug": "angular-routing-forms-change-detection-signals",
        "summary": "Build enterprise routing with functional guards and interceptors, author dynamic Reactive Forms with custom async validators, and master Zone.js change detection, OnPush immutability optimization, and modern fine-grained Angular Signals (signal, computed, effect).",
        "difficulty": "Advanced",
        "estimatedMinutes": 50,
        "keyTakeaway": "OnPush change detection skips subtrees unless input object references change or events fire. Angular Signals enable fine-grained reactivity without Zone.js overhead."
      }
    ]
  },
  {
    "moduleNumber": 22,
    "title": "Node.js Scalable Backend & Async Runtime Architecture",
    "slug": "nodejs-scalable-backend-architecture",
    "description": "Deep dive into the Node.js V8 runtime: libuv event loop phases, microtask queue precedence, asynchronous patterns, streams, backpressure management, Express middleware chains, Redis in-memory caching, and multi-core cluster scaling.",
    "icon": "server",
    "level": "Intermediate",
    "topics": [
      {
        "topicNumber": 1,
        "title": "Node.js Architecture, libuv Event Loop Phases, Microtasks & Async Programming",
        "slug": "nodejs-event-loop-libuv-async-programming",
        "summary": "Deconstruct the single-threaded V8 execution model, libuv thread pool (UV_THREADPOOL_SIZE), event loop phases (Timers, Pending I/O, Poll, Check, Close), and microtask queue precedence (process.nextTick vs Promise.then vs setImmediate).",
        "difficulty": "Intermediate",
        "estimatedMinutes": 45,
        "keyTakeaway": "Node.js is single-threaded for JavaScript execution but offloads I/O and crypto/fs to libuv threads. Never block the event loop with synchronous computation or heavy loops."
      },
      {
        "topicNumber": 2,
        "title": "Node.js Streams, Buffer Internals, File Handling & Backpressure Management",
        "slug": "nodejs-streams-buffer-file-handling",
        "summary": "Master high-throughput streaming architectures: Readable, Writable, Duplex, and Transform streams, binary Buffer manipulation, stream piping with stream.pipeline(), and handling high-water mark backpressure to prevent out-of-memory crashes.",
        "difficulty": "Intermediate",
        "estimatedMinutes": 50,
        "keyTakeaway": "Streams process data in chunks without loading entire multi-gigabyte files into RAM. Always check stream.write() return value and listen for 'drain' to handle backpressure."
      },
      {
        "topicNumber": 3,
        "title": "Express.js Middleware Pipeline, Redis Caching, Clustering & PM2 Scalability",
        "slug": "express-middleware-security-performance-caching",
        "summary": "Architect production-grade Express applications: Custom middleware chaining, error-handling middleware (err, req, res, next), in-memory caching with Redis, Node.js cluster multi-core utilization, and PM2 process management.",
        "difficulty": "Advanced",
        "estimatedMinutes": 50,
        "keyTakeaway": "Error-handling middleware must declare 4 parameters (err, req, res, next). Multi-core cluster mode forks worker processes to utilize all server CPU cores via OS round-robin load distribution."
      }
    ]
  },
  {
    "moduleNumber": 23,
    "title": "RESTful APIs, Integration, Security & Performance",
    "slug": "restful-apis-integration-security-performance",
    "description": "Architect enterprise REST APIs: Roy Fielding constraints, HTTP method idempotency, status code contracts, schema validation with Zod/Joi, JWT authentication lifecycle with refresh token rotation, RBAC, rate limiting, and CORS preflight handling.",
    "icon": "zap",
    "level": "Advanced",
    "topics": [
      {
        "topicNumber": 1,
        "title": "RESTful API Architectural Constraints, HTTP Protocol & Idempotency",
        "slug": "rest-api-design-http-protocol-idempotency",
        "summary": "Master REST constraints: Statelessness, client-server decoupling, uniform interface, noun-based URI design, HTTP verbs (GET, POST, PUT, PATCH, DELETE), status codes (2xx, 3xx, 4xx, 5xx), and method idempotency.",
        "difficulty": "Intermediate",
        "estimatedMinutes": 45,
        "keyTakeaway": "GET, PUT, and DELETE must be idempotent (multiple identical requests yield identical server state). POST is non-idempotent and creates new sub-resources."
      },
      {
        "topicNumber": 2,
        "title": "API Security: JWT Token Lifecycle, RBAC Authorization, Rate Limiting & CORS",
        "slug": "api-security-jwt-rbac-rate-limiting-cors",
        "summary": "Implement defense-in-depth API security: Cryptographically signed JWT tokens, access token + refresh token rotation in HttpOnly cookies, Role-Based Access Control (RBAC) middleware, Redis token-bucket rate limiting, and CORS preflight OPTIONS headers.",
        "difficulty": "Advanced",
        "estimatedMinutes": 50,
        "keyTakeaway": "Store short-lived JWT access tokens in memory and long-lived refresh tokens in secure HttpOnly SameSite cookies to protect against both XSS and CSRF."
      },
      {
        "topicNumber": 3,
        "title": "Schema Validation, Cursor Pagination, Filtering, Sorting & RFC 7807 Errors",
        "slug": "api-validation-pagination-filtering-error-handling",
        "summary": "Enforce strict API request/response contracts using Zod/Joi schema validation, implement high-performance cursor-based pagination over offset pagination, and standardize error responses adhering to RFC 7807 Problem Details.",
        "difficulty": "Advanced",
        "estimatedMinutes": 50,
        "keyTakeaway": "Offset pagination degrades to O(N) at high page counts and suffers from data shift; cursor-based pagination uses indexed WHERE clauses to achieve constant O(1) performance."
      }
    ]
  },
  {
    "moduleNumber": 24,
    "title": "Database Engineering, Query Optimization & Full-Stack System Design",
    "slug": "database-engineering-fullstack-system-design",
    "description": "Enterprise database engineering and system design: Relational ACID vs NoSQL BASE, normalization vs denormalization, B-Tree indexes, transactions, EXPLAIN ANALYZE query tuning, avoiding N+1 queries, and end-to-end full-stack integration.",
    "icon": "database",
    "level": "Advanced",
    "topics": [
      {
        "topicNumber": 1,
        "title": "SQL vs NoSQL Data Modeling, B-Tree Indexing & ACID Transactions",
        "slug": "sql-nosql-schema-modeling-indexing",
        "summary": "Compare Relational ACID databases (PostgreSQL/MySQL) with NoSQL document stores (MongoDB), master normalization vs denormalization trade-offs, B-Tree index structures, and ACID transactional isolation levels.",
        "difficulty": "Intermediate",
        "estimatedMinutes": 50,
        "keyTakeaway": "Relational databases enforce schema consistency and transactional atomicity; NoSQL provides flexible schemas and horizontal sharding. Indexes speed up reads but add overhead on writes."
      },
      {
        "topicNumber": 2,
        "title": "Query Optimization, EXPLAIN ANALYZE, Joins & Cache Invalidation Patterns",
        "slug": "query-optimization-execution-plans-caching",
        "summary": "Diagnose database bottlenecks using EXPLAIN ANALYZE execution plans, optimize complex multi-table joins (Nested Loop, Hash, Merge Joins), eliminate N+1 query antipatterns, and implement Cache-Aside with Redis.",
        "difficulty": "Advanced",
        "estimatedMinutes": 50,
        "keyTakeaway": "Sequential scans (Seq Scan) on large tables indicate missing indexes. Solve N+1 queries by replacing iterative queries with JOINs or SQL IN(...) batch fetching."
      },
      {
        "topicNumber": 3,
        "title": "Full-Stack Enterprise System Design: Angular + Node.js + DB + WebSockets",
        "slug": "fullstack-system-design-angular-node-integration",
        "summary": "Synthesize the entire modern full-stack: Angular standalone frontend client communicating with an Express/Node.js API gateway, relational database with read replicas, Redis caching tier, and real-time bidirectional WebSockets.",
        "difficulty": "Advanced",
        "estimatedMinutes": 55,
        "keyTakeaway": "A scalable full-stack system cleanly separates concerns: client-side SPA rendering, stateless Node.js compute, managed database clusters, and sub-millisecond in-memory caching."
      }
    ]
  }
];
