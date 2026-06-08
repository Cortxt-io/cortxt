---
hero_badge: "Structured context for developers"
hero_headline: "Your second brain\nfor product development"
hero_subtext: "Scattered context costs tokens, time and money. Cortxt keeps your product knowledge structured, validated and ready for every session – without re-explaining what you're building every time."

vision: "The next frontier in software development isn't writing more code. It's knowing which code to write, when, and why. As AI tools become ubiquitous, the differentiator won't be who uses AI – it's who uses it efficiently. Token cost per decision. Context quality per session. Signal-to-noise ratio across an entire development portfolio. Cortxt is built for that world."

builder_name: "Rikard Andersson"
builder_bio: "Rikard Andersson is a self-taught fullstack developer who thinks in systems and builds for the long term. Cortxt started as a personal tool for managing a growing portfolio of ideas. It became a platform for a question that keeps him up at night: as AI becomes the default development environment, who controls the context – and at what cost? The developer who structures their knowledge today will outcompete the one who pays to re-explain it tomorrow."

github_url: "https://github.com/rian010194/cortxt"
app_url: "https://app.cortxt.io"

pipeline:
  tracks:
    - id: external
      label: "External World"
      nodes:
        - id: n-extdocs
          label: "External Docs / Changelogs"
          status: live
        - id: n-docswatch
          label: "DocsWatch"
          status: live
        - id: n-engine
          label: "Changelog Engine Mini"
          status: live
          sublabel: "scored output"

    - id: internal
      label: "Internal World"
      nodes:
        - id: n-projmd
          label: "node.md files"
          status: live
        - id: n-cnswatch
          label: "cns-watch"
          status: live
        - id: n-devwatch
          label: "cns-devwatch"
          status: live
          sublabel: "git diff output"

  merge_node:
    id: n-claude
    label: "Claude Analysis"
    status: live

  review_node:
    id: n-vault
    label: "Cortxt Vault – Human Review"
    status: live

  approved_node:
    id: n-approved
    label: "Approved Changes"
    status: live

  output_nodes:
    - id: n-git
      label: "Git + GitHub"
      status: live
    - id: n-digest
      label: "Daily Digest"
      status: live
    - id: n-dashboard
      label: "cortxt.io Dashboard"
      status: live

  config_nodes:
    - id: scoring-studio
      label: "Scoring Studio"
      description: "Configures relevance weights for both tracks, letting you control which external signals and internal changes matter most before they reach Claude Analysis."
      status: coming_soon

  future_nodes:
    - id: n-mcp
      label: "MCP Server Integration"
      status: coming_soon
    - id: n-multiteam
      label: "Multi-team Collaboration"
      status: coming_soon
    - id: n-tokentracker
      label: "Token Cost Tracker"
      status: coming_soon
    - id: n-webhook
      label: "Webhook Router"
      status: coming_soon

stack:
  categories:
    - title: "Languages & Runtimes"
      status: live
      items:
        - "Python"
        - "TypeScript"
        - "JavaScript"
        - "YAML"

    - title: "Frameworks & Tools"
      status: live
      items:
        - "Flask"
        - "React"
        - "Vite"
        - "Tailwind"
        - "Shadcn/ui"

    - title: "AI & Context"
      status: live
      items:
        - "Anthropic Claude API"
        - "Structured output"
        - "Context hierarchies"
        - "Token optimization"
        - "MCP servers"
        - "Prompt engineering"

    - title: "Infrastructure"
      status: live
      items:
        - "Railway"
        - "GitHub Actions"
        - "GitHub Pages"
        - "Git as communication channel"
        - "REST APIs · CORS · OAuth (planned)"

    - title: "Architecture Patterns"
      status: live
      items:
        - "Local-first, file-based source of truth"
        - "Event-driven pipelines (git hooks, file watchers)"
        - "Monorepo + standalone repo hybrid"
        - "Progressive enhancement (static → dynamic)"

    - title: "Coming Next"
      status: coming_soon
      items:
        - "React SPA"
        - "Reactflow knowledge graph"
        - "Multi-tenant Railway deployment"
        - "Scoring Studio"
        - "cx CLI package (PyPI)"
---
