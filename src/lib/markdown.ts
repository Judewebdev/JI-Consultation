/**
 * A deliberately small Markdown subset renderer.
 *
 * Lesson bodies, assignment briefs and community posts are authored in
 * Markdown. Rather than pull in a full parser plus a sanitiser, we escape all
 * HTML first and then re-introduce only the constructs we support. Nothing a
 * learner types can produce a tag we did not generate ourselves.
 *
 * Supported: headings (##, ###), bold, italic, inline code, fenced code,
 * links, unordered/ordered lists, blockquotes, horizontal rules, paragraphs.
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only http(s) and relative links survive — blocks javascript: and data:. */
function safeHref(href: string): string | null {
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/[^/]/.test(trimmed) || trimmed.startsWith("#")) return trimmed;
  if (/^mailto:[^\s]+@[^\s]+$/i.test(trimmed)) return trimmed;
  return null;
}

function renderInline(text: string): string {
  let out = escapeHtml(text);

  // `code`
  out = out.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

  // [label](href)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
    const safe = safeHref(href);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="md-link" href="${escapeHtml(safe)}"${attrs}>${label}</a>`;
  });

  // **bold** then *italic* / _italic_
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|\s)_([^_\n]+)_/g, "$1<em>$2</em>");

  return out;
}

export function renderMarkdown(source: string): string {
  const lines = (source ?? "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  let listType: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let paragraph: string[] = [];

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    closeList();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Fenced code
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        html.push(`<pre class="md-pre"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushAll();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    if (line.trim() === "") {
      flushAll();
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushAll();
      html.push('<hr class="md-hr" />');
      continue;
    }

    // Headings
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      const level = Math.min(heading[1]!.length + 1, 6); // "#" renders as h2
      html.push(`<h${level}>${renderInline(heading[2]!)}</h${level}>`);
      continue;
    }

    // Blockquote
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushAll();
      html.push(`<blockquote class="md-quote">${renderInline(quote[1]!)}</blockquote>`);
      continue;
    }

    // Lists
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const wanted: "ul" | "ol" = bullet ? "ul" : "ol";
      if (listType !== wanted) {
        closeList();
        html.push(`<${wanted} class="md-list">`);
        listType = wanted;
      }
      html.push(`<li>${renderInline((bullet ?? numbered)![1]!)}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  if (inCodeBlock && codeBuffer.length) {
    html.push(`<pre class="md-pre"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
  }
  flushAll();

  return html.join("\n");
}

/** Plain-text preview for cards and thread lists. */
export function excerpt(source: string, maxLength = 180): string {
  const text = (source ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}
