import type { ModuleContent } from "@/types/content";

export const belt8: ModuleContent[] = [
  {
    id: "authentication",
    code: "8.1",
    beltId: "security",
    title: "Authentication: sessions vs tokens",
    tagline: "Proving who you are, at scale.",
    hook: "A user logs in once and stays logged in across a dozen servers. Where does the proof of 'who they are' live — on the server, or in their pocket?",
    tiers: {
      napkin:
        "Authentication verifies identity. Two models: server-side sessions (a session id in a cookie, state on the server) or stateless tokens (a signed JWT the client carries).",
      working:
        "Sessions are easy to revoke but need shared session storage across servers. JWTs are stateless and scale horizontally but are hard to revoke before expiry and must be validated by signature. Store session ids in Secure, HttpOnly, SameSite cookies — never tokens in localStorage.",
      deep: "JWT pitfalls: long expiry + no revocation = risk; use short-lived access tokens + rotating refresh tokens and a denylist for revocation. Always verify signature and audience/issuer. Rotate session ids on login/privilege change to prevent fixation.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Auth", "API"],
      caption: "Login issues a token; API validates it on each call.",
      events: [
        { t: 0, from: 0, to: 1, label: "credentials" },
        { t: 1, from: 1, to: 0, label: "signed token" },
        { t: 2, from: 0, to: 2, label: "request + token" },
        { t: 3, from: 2, to: 2, label: "verify signature" },
      ],
    },
    tradeoff: {
      axis: "Revocability ↔ Statelessness",
      left: "Server sessions",
      right: "Stateless JWT",
      consequence:
        "Sessions are instantly revocable but require shared server-side state that every node must reach. JWTs scale statelessly but can't be revoked before expiry without extra denylist machinery.",
    },
    recall: [
      {
        q: "Why should auth tokens NOT be stored in localStorage?",
        options: [
          "It's slow",
          "Any XSS can read it; use Secure, HttpOnly cookies instead",
          "It can't hold strings",
          "It expires too fast",
        ],
        answer: 1,
        explain: "localStorage is readable by any script, so XSS steals the token; HttpOnly cookies aren't script-accessible.",
      },
    ],
    memory: {
      analogy: "A session is a coat-check ticket the venue can cancel; a JWT is a signed wristband you wear that works until it expires.",
      why: "Because at scale you must prove identity on every request without re-checking a password each time.",
    },
    tags: ["security", "auth", "jwt", "sessions"],
    interactive: true,
  },
  {
    id: "oauth-oidc",
    code: "8.2",
    beltId: "security",
    title: "OAuth 2.0 & OpenID Connect",
    tagline: "Delegated access without sharing passwords.",
    hook: "'Sign in with Google.' You never give the app your Google password — yet it gets access. What just happened behind that button?",
    tiers: {
      napkin:
        "OAuth 2.0 lets a user grant an app limited access to their data on another service, without sharing credentials. OpenID Connect (OIDC) adds identity (who you are) on top.",
      working:
        "The Authorization Code flow: the app redirects to the provider, the user consents, the provider returns a short code, and the app exchanges it (server-side, with its secret + PKCE) for access/ID tokens. Scopes limit what the app can do.",
      deep: "Use PKCE for public clients; never use the implicit flow anymore. The access token authorizes API calls; the OIDC ID token (a JWT) proves identity. Validate issuer, audience, expiry, and signature. Refresh tokens must be rotated and stored securely.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["User/App", "Provider", "API"],
      caption: "Authorization Code flow (with PKCE).",
      events: [
        { t: 0, from: 0, to: 1, label: "redirect + consent" },
        { t: 1, from: 1, to: 0, label: "auth code" },
        { t: 2, from: 0, to: 1, label: "code + secret → tokens" },
        { t: 3, from: 0, to: 2, label: "call API with access token" },
      ],
    },
    tradeoff: {
      axis: "Convenience ↔ Blast radius",
      left: "Broad scopes / long tokens",
      right: "Least-privilege scopes",
      consequence:
        "Requesting broad scopes and long-lived tokens is convenient but a leak exposes everything for a long time. Narrow scopes and short tokens limit damage but need more refreshes and consent care.",
    },
    recall: [
      {
        q: "In OAuth, what does the app exchange for tokens after user consent?",
        options: ["The user's password", "A short-lived authorization code", "The user's email", "A session cookie"],
        answer: 1,
        explain: "The code is exchanged server-side (with the client secret/PKCE) for access and ID tokens — the password is never shared.",
      },
    ],
    memory: {
      analogy: "A hotel key card: the front desk (provider) issues a limited-access card so the valet (app) can park your car without your house keys.",
      why: "Because apps need scoped access to your data, and handing over your password would give them everything.",
    },
    tags: ["security", "oauth", "oidc", "auth"],
    interactive: true,
  },
  {
    id: "authorization-rbac",
    code: "8.3",
    beltId: "security",
    title: "Authorization: RBAC vs ABAC",
    tagline: "Who is allowed to do what.",
    hook: "Authentication says you're Alice. Authorization decides whether Alice can delete this invoice. Get it wrong and anyone can do anything.",
    tiers: {
      napkin:
        "Authorization controls access to resources. RBAC grants permissions via roles (admin, editor). ABAC decides from attributes (user, resource, context) via policies.",
      working:
        "RBAC is simple and auditable but explodes into role sprawl for fine-grained needs. ABAC ('editors can edit docs they own during business hours') is flexible but complex to reason about and test. Enforce checks server-side, on every request — never trust the client.",
      deep: "Policy engines (OPA/Rego, Cedar) externalize authz from code. Beware confused-deputy and IDOR (checking auth but not object ownership). Default-deny, least privilege, and centralized policy evaluation are the guardrails.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Simplicity ↔ Granularity",
      left: "RBAC (roles)",
      right: "ABAC (attributes)",
      consequence:
        "RBAC is easy to understand and audit but coarse — fine-grained rules cause role explosion. ABAC expresses precise, contextual rules but is harder to test, debug, and reason about.",
    },
    recall: [
      {
        q: "IDOR (insecure direct object reference) happens when a system checks…",
        options: [
          "Nothing",
          "That you're logged in, but not that you OWN the specific object",
          "The password twice",
          "The TLS certificate",
        ],
        answer: 1,
        explain: "Authentication ≠ authorization — you must verify the user may access that specific resource.",
      },
    ],
    memory: {
      analogy: "RBAC is a job title that unlocks certain doors; ABAC is a rulebook checking your badge, the room, and the time of day.",
      why: "Because 'logged in' must not mean 'allowed to touch everything' — access must be scoped per resource.",
    },
    tags: ["security", "authorization", "rbac", "abac"],
    interactive: true,
  },
  {
    id: "encryption-rest-transit",
    code: "8.4",
    beltId: "security",
    title: "Encryption at rest & in transit",
    tagline: "Protect data on the wire and on disk.",
    hook: "A backup drive is stolen. A database dump leaks. If the data was encrypted with keys the thief doesn't have, it's useless gibberish.",
    tiers: {
      napkin:
        "Encrypt data in transit (TLS between services/clients) and at rest (disk/DB/field-level). Symmetric ciphers (AES-GCM) encrypt data; asymmetric keys exchange the symmetric key.",
      working:
        "TLS 1.2+/1.3 secures transit. At rest: full-disk, database TDE, or field-level (for sensitive columns). The hard part is key management — where keys live, how they rotate, and who can use them (a KMS/HSM).",
      deep: "Use envelope encryption: a data key encrypts data, a master key (in a KMS/HSM) encrypts the data key. Rotate keys; separate duties so app compromise ≠ key compromise. Approved algorithms only (AES-256-GCM, ChaCha20-Poly1305); never roll your own crypto or use MD5/SHA-1/DES.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Envelope encryption: KMS wraps the data key.",
      nodes: [
        { id: "app", label: "App", x: 10, y: 50, kind: "app" },
        { id: "dk", label: "Data Key", x: 40, y: 30, kind: "cache" },
        { id: "kms", label: "KMS master key", x: 70, y: 60, kind: "net" },
        { id: "db", label: "Encrypted DB", x: 94, y: 40, kind: "db" },
      ],
      edges: [
        { from: "app", to: "dk" },
        { from: "dk", to: "kms" },
        { from: "app", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Protection ↔ Performance/complexity",
      left: "Field-level encryption",
      right: "Disk-level only",
      consequence:
        "Field-level encryption protects sensitive data even from DB admins but adds CPU cost and breaks some queries/indexes. Disk-level is transparent and fast but exposes plaintext to anyone with DB access.",
    },
    recall: [
      {
        q: "Envelope encryption protects the data key by…",
        options: [
          "Storing it in the app code",
          "Encrypting it with a master key held in a KMS/HSM",
          "Hashing it",
          "Emailing it",
        ],
        answer: 1,
        explain: "The data key is wrapped by a master key that never leaves the KMS, so leaking the DB doesn't leak usable keys.",
      },
    ],
    memory: {
      analogy: "Lock your valuables in a box (data key), then lock that box's key in the bank vault (KMS).",
      why: "Because breaches happen — encryption makes stolen data and disks worthless without the keys.",
    },
    tags: ["security", "encryption", "kms", "crypto"],
    interactive: true,
  },
  {
    id: "api-security-owasp",
    code: "8.5",
    beltId: "security",
    title: "API security & OWASP",
    tagline: "The common ways APIs get breached.",
    hook: "Most breaches aren't exotic — they're the same handful of mistakes: injection, broken auth, over-exposed data. Know the top of the list and you dodge most of it.",
    tiers: {
      napkin:
        "Secure APIs validate all input, use parameterized queries, authenticate/authorize every request, and never expose more data than needed.",
      working:
        "The OWASP staples: injection (use parameterized queries), broken access control (check ownership), broken auth (strong sessions/tokens), excessive data exposure (return only needed fields), and missing rate limiting. Add input validation (allowlists), output encoding, and security headers/CORS.",
      deep: "API-specific risks: BOLA/IDOR (object-level authz), mass assignment, and unrestricted resource consumption (rate limit + quotas). Defense in depth: WAF, schema validation, least-privilege service accounts, and logging/alerting on anomalies.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Layered checks before a request reaches your data.",
      nodes: [
        { id: "c", label: "Client", x: 8, y: 50, kind: "client" },
        { id: "waf", label: "WAF / rate limit", x: 34, y: 50, kind: "net" },
        { id: "authz", label: "AuthN + AuthZ", x: 60, y: 50, kind: "net" },
        { id: "val", label: "Validate input", x: 82, y: 30, kind: "app" },
        { id: "db", label: "Param. query", x: 94, y: 65, kind: "db" },
      ],
      edges: [
        { from: "c", to: "waf" },
        { from: "waf", to: "authz" },
        { from: "authz", to: "val" },
        { from: "val", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Security ↔ Friction",
      left: "Strict validation & limits",
      right: "Permissive",
      consequence:
        "Strict validation, rate limits, and authz on every object are safest but add latency and can reject edge-case-but-legitimate requests. Permissive APIs are frictionless but are exactly how most breaches happen.",
    },
    recall: [
      {
        q: "The single best defense against SQL injection is…",
        options: [
          "Escaping quotes manually",
          "Parameterized queries / prepared statements",
          "A longer password",
          "Disabling the database",
        ],
        answer: 1,
        explain: "Parameterization separates code from data so user input can never be executed as SQL.",
      },
    ],
    memory: {
      analogy: "A nightclub with a bouncer (authz), a metal detector (validation), and a capacity limit (rate limiting) — most trouble never gets in.",
      why: "Because APIs are the front door to your data, and attackers probe the same well-known weaknesses first.",
    },
    tags: ["security", "api", "owasp", "injection"],
    interactive: true,
  },
  {
    id: "secrets-management",
    code: "8.6",
    beltId: "security",
    title: "Secrets management",
    tagline: "Keep keys out of your code.",
    hook: "A developer commits an AWS key to a public repo. Within minutes, bots find it and spin up crypto miners on your account. Where should secrets actually live?",
    tiers: {
      napkin:
        "Secrets (API keys, passwords, tokens) must never be hardcoded or committed. Store them in environment config or a dedicated secrets manager and inject them at runtime.",
      working:
        "Use a secrets manager (Vault, AWS Secrets Manager) that provides access control, audit logs, and rotation. Apps fetch secrets at startup via short-lived credentials/identity, never from source. Scan repos and CI for leaked secrets.",
      deep: "Prefer dynamic secrets (generated per-use, auto-expiring) and workload identity over long-lived static keys. Rotate regularly and on suspected leak. Principle: a leaked secret should be low-impact (scoped, short-lived) and instantly revocable.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "App fetches short-lived secrets by identity.",
      nodes: [
        { id: "app", label: "App (identity)", x: 12, y: 50, kind: "app" },
        { id: "vault", label: "Secrets Manager", x: 48, y: 50, kind: "net" },
        { id: "audit", label: "Audit log", x: 78, y: 25, kind: "cache" },
        { id: "db", label: "DB (dynamic creds)", x: 84, y: 72, kind: "db" },
      ],
      edges: [
        { from: "app", to: "vault" },
        { from: "vault", to: "audit" },
        { from: "vault", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Security ↔ Operational effort",
      left: "Dynamic, rotating secrets",
      right: "Static long-lived keys",
      consequence:
        "Dynamic, short-lived, per-workload secrets limit blast radius and are instantly revocable but need a secrets manager and integration work. Static keys are trivial to use but catastrophic when leaked.",
    },
    recall: [
      {
        q: "The best place for a production database password is…",
        options: [
          "In the source code",
          "In a secrets manager, injected at runtime",
          "In a comment",
          "In the frontend bundle",
        ],
        answer: 1,
        explain: "Secrets managers give access control, rotation, and audit — and keep secrets out of code and repos.",
      },
    ],
    memory: {
      analogy: "Don't tape the safe combination to the safe — keep it with a trusted keeper who logs every access and changes it regularly.",
      why: "Because hardcoded secrets leak constantly (repos, logs, images) and are the fastest path to compromise.",
    },
    tags: ["security", "secrets", "vault", "credentials"],
    interactive: true,
  },
  {
    id: "zero-trust-mtls",
    code: "8.7",
    beltId: "security",
    title: "Zero trust & mTLS",
    tagline: "Never trust the network, always verify.",
    hook: "An attacker breaches one internal service. In a flat network they now roam freely. Zero trust assumes that breach and verifies every single hop.",
    tiers: {
      napkin:
        "Zero trust means no request is trusted just because it's 'inside' the network. Every service call is authenticated, authorized, and encrypted — often via mutual TLS (mTLS).",
      working:
        "Each workload gets a cryptographic identity (certificate). mTLS makes both sides prove who they are and encrypts traffic. Combined with least-privilege authz per call, a breach of one service can't freely access others.",
      deep: "A service mesh automates mTLS, identity (SPIFFE/SPIRE), and policy without app changes. Micro-segmentation limits lateral movement. The shift is from a hard perimeter ('castle and moat') to per-request verification everywhere.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Every hop authenticates and encrypts (mTLS).",
      nodes: [
        { id: "a", label: "Svc A 🔐", x: 12, y: 50, kind: "app" },
        { id: "m", label: "mTLS", x: 45, y: 50, kind: "net" },
        { id: "b", label: "Svc B 🔐", x: 78, y: 35, kind: "app" },
        { id: "p", label: "policy check", x: 82, y: 72, kind: "net" },
      ],
      edges: [
        { from: "a", to: "m" },
        { from: "m", to: "b" },
        { from: "m", to: "p" },
      ],
    },
    tradeoff: {
      axis: "Security ↔ Overhead",
      left: "Zero trust (verify all)",
      right: "Perimeter trust",
      consequence:
        "Zero trust contains breaches by verifying every hop but adds cert management, latency, and operational complexity. Perimeter ('trust the internal network') is simpler but lets one breach spread laterally to everything.",
    },
    recall: [
      {
        q: "The core principle of zero trust is…",
        options: [
          "Trust everything inside the firewall",
          "Never trust by location; authenticate & authorize every request",
          "Disable encryption internally",
          "Use one shared password",
        ],
        answer: 1,
        explain: "Being 'inside the network' grants nothing — every call is verified and encrypted.",
      },
    ],
    memory: {
      analogy: "An office where every door needs a badge — not just the front entrance — so a tailgater can't wander the whole building.",
      why: "Because flat internal trust turns a single breach into a full compromise via lateral movement.",
    },
    tags: ["security", "zero-trust", "mtls", "network"],
    interactive: true,
  },
];
