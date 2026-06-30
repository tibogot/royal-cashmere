function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPlainDescriptionAsHtml(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map(escapeHtml);

      return `<p>${lines.join("<br />")}</p>`;
    })
    .join("");
}

const SHOPIFY_PLAIN_TEXT_HTML =
  /^<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>$/i;

export function getProductDescriptionHtml(
  description: string,
  descriptionHtml: string,
) {
  const plain = description.trim();
  const html = descriptionHtml.trim();

  if (html) {
    const preCodeMatch = html.match(SHOPIFY_PLAIN_TEXT_HTML);
    if (preCodeMatch) {
      return formatPlainDescriptionAsHtml(preCodeMatch[1]);
    }

    return html;
  }

  if (plain) {
    return formatPlainDescriptionAsHtml(plain);
  }

  return "";
}
