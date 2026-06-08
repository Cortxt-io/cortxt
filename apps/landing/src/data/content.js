export const content = {
  hero: {
    headline: ["Structured context", "for AI-assisted development."],
    subtext:
      "Every project decision — structured, versioned, and ready for your next session. No re-explaining. No wasted tokens.",
  },
  cns: {
    label: 'Foundation',
    title: 'Most AI tools see your code.',
    titleAccent: "Cortxt sees your thinking.",
    intro:
      "What you're building and why. Where you are in the MVP journey. What risks you've accepted. What changed since last week and what that means for today's priorities.",
    intro2:
      "Structured as files. Validated against a schema. Versioned in git. Ready for any tool that can read text. That's CNS – the knowledge layer beneath Cortxt.",
    comparison: [
      {
        tool: 'GitHub Copilot',
        knows: 'You have a function called run_analyze()',
        icon: '⌨️',
      },
      {
        tool: 'Cortxt',
        knows:
          'cns-analyst is in solution_test phase. Primary risk: LLM output inconsistency (3/5). ROI estimate: 400%. MVP Steps changed 3 days ago.',
        icon: '🧠',
        highlight: true,
      },
    ],
    layers: [
      {
        file: 'project.md',
        description:
          'What, why and where you are. Status, MVP stage, risks, ROI – validated against a schema on every write.',
      },
      {
        file: 'planning/',
        description:
          'How and when. Roadmaps, architecture decisions and tradeoffs documented as they happen.',
      },
      {
        file: 'notes/',
        description:
          "Raw signal. Session observations and user feedback that don't fit a structure yet.",
      },
      {
        file: 'research/',
        description:
          'Evidence. Market data, competitor analysis and sources that informed your decisions.',
      },
    ],
    codeExample: `title: DocsWatch
status: early_mvp
mvp_stage: solution_test
family: monitoring-pipeline
roi_percent: 243
risks:
  - category: market
    score: 2
    description: Dev teams may solve this with ad-hoc scripts
  - category: positioning
    score: 3
    description: Risk of blending into generic website monitoring`,
    gitNote:
      'Every decision has a timestamp. AI suggestions are queued as JSON. Approvals are commits. Six months from now you can trace every decision back to the moment it was made.',
    auditFlow: [
      'A file changes',
      'Analysis is triggered',
      'Suggestions are structured and queued',
      'You review and decide',
      'Approved changes are committed',
      "Tomorrow's digest knows what happened today",
    ],
  },
  pipeline: {
    tracks: [
      {
        id: 'external',
        label: 'External World',
        nodes: [
          { id: 'ext-docs', label: 'External Docs / Changelogs', status: 'live' },
          { id: 'docswatch', label: 'DocsWatch', status: 'live' },
          { id: 'engine', label: 'Changelog Engine Mini', status: 'live', sublabel: 'scored output' },
        ],
      },
      {
        id: 'internal',
        label: 'Internal World',
        nodes: [
          { id: 'proj-md', label: 'project.md files', status: 'live' },
          { id: 'cns-watch', label: 'cns-watch', status: 'live' },
          { id: 'cns-devwatch', label: 'cns-devwatch', status: 'live', sublabel: 'git diff output' },
        ],
      },
    ],
    mergeNode:    { id: 'claude',    label: 'Claude Analysis',                status: 'live' },
    reviewNode:   { id: 'vault',     label: 'Cortxt Vault – Human Review',    status: 'live' },
    approvedNode: { id: 'approved',  label: 'Approved Changes',               status: 'live' },
    outputNodes: [
      { id: 'git',       label: 'Git + GitHub',          status: 'live' },
      { id: 'digest',    label: 'Daily Digest',           status: 'live' },
      { id: 'dashboard', label: 'cortxt.io Dashboard',   status: 'live' },
    ],
    configNote: {
      label: 'Scoring Studio',
      description: 'Configures relevance weights for both tracks, letting you control which external signals and internal changes matter most before they reach Claude Analysis.',
      status: 'coming_soon',
    },
    futureNodes: [
      { id: 'mcp',          label: 'MCP Server Integration' },
      { id: 'multiteam',    label: 'Multi-team Collaboration' },
      { id: 'tokentracker', label: 'Token Cost Tracker' },
      { id: 'webhook',      label: 'Webhook Router' },
    ],
  },
  stack: {
    categories: [
      {
        title: 'Languages & Runtimes',
        status: 'live',
        items: ['Python', 'TypeScript', 'JavaScript', 'YAML'],
      },
      {
        title: 'Frameworks & Tools',
        status: 'live',
        items: ['Flask', 'React', 'Vite', 'Tailwind', 'Shadcn/ui'],
      },
      {
        title: 'AI & Context',
        status: 'live',
        items: [
          'Anthropic Claude API',
          'Structured output',
          'Context hierarchies',
          'Token optimization',
          'MCP servers',
          'Prompt engineering',
        ],
      },
      {
        title: 'Infrastructure',
        status: 'live',
        items: [
          'Railway',
          'GitHub Actions',
          'GitHub Pages',
          'Git as communication channel',
          'REST APIs · CORS · OAuth (planned)',
        ],
      },
      {
        title: 'Architecture Patterns',
        status: 'live',
        items: [
          'Local-first, file-based source of truth',
          'Event-driven pipelines (git hooks, file watchers)',
          'Monorepo + standalone repo hybrid',
          'Progressive enhancement (static → dynamic)',
        ],
      },
      {
        title: 'Coming Next',
        status: 'coming_soon',
        items: [
          'React SPA',
          'Reactflow knowledge graph',
          'Multi-tenant Railway deployment',
          'Scoring Studio',
          'cx CLI package (PyPI)',
        ],
      },
    ],
  },
};
