"""
build.py — Generates index.html from content.md + template.html using Jinja2.

Usage:
    python build.py

Requires:
    pip install python-frontmatter jinja2
"""

import frontmatter
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

BASE = Path(__file__).parent


def _node_html(node: dict) -> str:
    """Render a single pipeline node div."""
    nid = node.get("id", "")
    label = node.get("label", "")
    status = node.get("status", "live")
    sublabel = node.get("sublabel", "")
    css = "p-node"
    if status == "coming_soon":
        css += " future"
    html = f'<div class="{css}" id="{nid}">{label}'
    if status == "coming_soon":
        html += '<span class="future-tag">coming soon</span>'
    html += "</div>"
    if sublabel:
        html += f'\n<div class="p-node sub-label">{sublabel}</div>'
    return html


def _arrow_html(arrow_id: str) -> str:
    """Render an animated arrow connector."""
    return (
        f'<div class="p-arrow" id="{arrow_id}">'
        '<div class="dot"></div>'
        "</div>"
    )


def _bare_id(node_id: str) -> str:
    """Strip leading 'n-' prefix for arrow IDs."""
    return node_id[2:] if node_id.startswith("n-") else node_id


def generate_stack_html(stack: dict) -> str:
    """
    Generate the stack-grid inner HTML from the stack dict
    defined in content.md frontmatter.

    Returns one stack-card div per category, to be placed
    inside <div class="stack-grid">.
    """
    cards = []
    for cat in stack.get("categories", []):
        title = cat.get("title", "")
        status = cat.get("status", "live")
        items = cat.get("items", [])
        css = "stack-card coming" if status == "coming_soon" else "stack-card"
        items_html = " · ".join(items)
        cards.append(
            f'<div class="{css}">'
            f'<div class="stack-card-title">{title}</div>'
            f'<div class="stack-items">{items_html}</div>'
            f"</div>"
        )
    return "\n".join(cards)


def generate_pipeline_html(pipeline: dict) -> str:
    """
    Generate the full pipeline diagram HTML from the pipeline dict
    defined in content.md frontmatter.

    Returns the inner HTML for the pipeline section — includes the
    diagram grid, scoring-note, and future-grid.
    """
    tracks = pipeline.get("tracks", [])
    left_nodes = tracks[0]["nodes"] if len(tracks) > 0 else []
    right_nodes = tracks[1]["nodes"] if len(tracks) > 1 else []
    left_label = tracks[0].get("label", "") if tracks else ""
    right_label = tracks[1].get("label", "") if len(tracks) > 1 else ""

    merge_node = pipeline.get("merge_node", {})
    review_node = pipeline.get("review_node", {})
    approved_node = pipeline.get("approved_node", {})
    output_nodes = pipeline.get("output_nodes", [])
    config_nodes = pipeline.get("config_nodes", [])
    future_nodes = pipeline.get("future_nodes", [])

    lines = []

    # ── Diagram grid ───────────────────────────────────────
    lines.append('<div class="pipeline-wrap">')
    lines.append('<div class="pipeline" id="pipeline-diagram">')

    # Track headers
    lines.append(f'<div class="track-header">{left_label}</div>')
    lines.append("<div></div>")
    lines.append(f'<div class="track-header">{right_label}</div>')

    # Parallel track rows: node → arrow → node → arrow → ...
    max_len = max(len(left_nodes), len(right_nodes))
    for i in range(max_len):
        left = left_nodes[i] if i < len(left_nodes) else None
        right = right_nodes[i] if i < len(right_nodes) else None

        # Node row
        left_col = f'<div class="p-col">{_node_html(left)}</div>' if left else "<div></div>"
        right_col = f'<div class="p-col">{_node_html(right)}</div>' if right else "<div></div>"
        lines.append(left_col)
        lines.append("<div></div>")
        lines.append(right_col)

        # Arrow row below each node
        left_arrow = f'<div class="p-col">{_arrow_html("a-" + _bare_id(left["id"]))}</div>' if left else "<div></div>"
        right_arrow = f'<div class="p-col">{_arrow_html("a-" + _bare_id(right["id"]))}</div>' if right else "<div></div>"
        lines.append(left_arrow)
        lines.append("<div></div>")
        lines.append(right_arrow)

    # ── Y-merge SVG: two tracks converge into one center line ──
    # viewBox 0 0 400 48: left track at x=100, right at x=300, center x=200
    MERGE_SVG = (
        '<svg viewBox="0 0 400 48" width="100%" height="48"'
        ' style="overflow:visible;display:block;max-width:800px;margin:0 auto">'
        # left vertical down to horizontal
        '<line x1="100" y1="0" x2="100" y2="24"'
        ' stroke="var(--border)" stroke-width="1"/>'
        # right vertical down to horizontal
        '<line x1="300" y1="0" x2="300" y2="24"'
        ' stroke="var(--border)" stroke-width="1"/>'
        # horizontal connecting both
        '<line x1="100" y1="24" x2="300" y2="24"'
        ' stroke="var(--border)" stroke-width="1"/>'
        # center vertical down with arrowhead
        '<line x1="200" y1="24" x2="200" y2="42"'
        ' stroke="var(--border)" stroke-width="1"/>'
        '<polygon points="200,48 196,40 204,40"'
        ' fill="var(--border)"/>'
        '</svg>'
    )
    lines.append(f'<div class="p-merge-connector" style="grid-column:1/-1">{MERGE_SVG}</div>')

    # Center column: merge_node → review_node → approved_node → split
    center = []
    center.append(_arrow_html("a-merge"))
    center.append(_node_html(merge_node))
    center.append(_arrow_html("a-" + _bare_id(merge_node.get("id", ""))))
    center.append(_node_html(review_node))
    center.append(_arrow_html("a-" + _bare_id(review_node.get("id", ""))))
    center.append(_node_html(approved_node))

    # Output split: first output = left, second = right (+downstream = third)
    left_out = output_nodes[0] if len(output_nodes) > 0 else None
    right_out = output_nodes[1] if len(output_nodes) > 1 else None
    downstream = output_nodes[2] if len(output_nodes) > 2 else None

    # SVG split: center line down, horizontal, two arrows to left/right outputs
    SPLIT_SVG = (
        '<svg viewBox="0 0 400 48" width="100%" height="48"'
        ' style="overflow:visible;display:block;max-width:420px;margin:0 auto">'
        # center vertical down to horizontal
        '<line x1="200" y1="0" x2="200" y2="24"'
        ' stroke="var(--border)" stroke-width="1"/>'
        # horizontal connecting both branches
        '<line x1="100" y1="24" x2="300" y2="24"'
        ' stroke="var(--border)" stroke-width="1"/>'
        # left arrow down to Git
        '<line x1="100" y1="24" x2="100" y2="42"'
        ' stroke="var(--border)" stroke-width="1"/>'
        '<polygon points="100,48 96,40 104,40"'
        ' fill="var(--border)"/>'
        # right arrow down to Digest
        '<line x1="300" y1="24" x2="300" y2="42"'
        ' stroke="var(--border)" stroke-width="1"/>'
        '<polygon points="300,48 296,40 304,40"'
        ' fill="var(--border)"/>'
        '</svg>'
    )
    center.append(SPLIT_SVG)

    # Output nodes side by side
    left_out_html = f'<div style="flex:1;display:flex;justify-content:flex-end;padding-right:10px">{_node_html(left_out)}</div>' if left_out else '<div style="flex:1"></div>'
    right_out_html = f'<div style="flex:1;display:flex;justify-content:flex-start;padding-left:10px">{_node_html(right_out)}</div>' if right_out else '<div style="flex:1"></div>'
    center.append(
        f'<div style="display:flex;width:100%;max-width:420px;margin:0 auto">'
        + left_out_html
        + right_out_html
        + '</div>'
    )

    # Arrow + downstream node below right output (Daily Digest → Dashboard)
    if downstream and right_out:
        center.append(
            f'<div style="display:flex;width:100%;max-width:420px;margin:0 auto">'
            f'<div style="flex:1"></div>'
            f'<div style="flex:1;display:flex;flex-direction:column;align-items:flex-start;padding-left:10px">'
            + _arrow_html("a-" + _bare_id(right_out["id"]))
            + _node_html(downstream)
            + '</div>'
            + '</div>'
        )

    lines.append('<div class="p-center">' + "\n".join(center) + "</div>")
    lines.append("</div>")  # /pipeline
    lines.append("</div>")  # /pipeline-wrap

    # ── Config nodes (Scoring Studio note) ────────────────
    for cn in config_nodes:
        lines.append(
            '<div class="scoring-note fade-in">'
            '<span class="icon">⚙️</span>'
            f'<p><strong>{cn["label"]}</strong> — {cn["description"]}</p>'
            "</div>"
        )

    # ── Future nodes ───────────────────────────────────────
    if future_nodes:
        future_items = "\n".join(_node_html(fn) for fn in future_nodes)
        lines.append(f'<div class="future-grid fade-in">{future_items}</div>')

    return "\n".join(lines)


# ── Main ───────────────────────────────────────────────────

# Parse YAML frontmatter from content.md
post = frontmatter.load(BASE / "content.md")
data = dict(post.metadata)

# Generate pipeline HTML from YAML data
if "pipeline" in data:
    data["pipeline_html"] = generate_pipeline_html(data["pipeline"])
else:
    data["pipeline_html"] = "<!-- pipeline data missing -->"

# Generate stack HTML from YAML data
if "stack" in data:
    data["stack_html"] = generate_stack_html(data["stack"])
else:
    data["stack_html"] = "<!-- stack data missing -->"

# Render Jinja2 template
env = Environment(loader=FileSystemLoader(str(BASE)))
template = env.get_template("template.html")
html = template.render(**data)

# Write output
out = BASE / "index.html"
out.write_text(html, encoding="utf-8")
print(f"Built: {out}")
