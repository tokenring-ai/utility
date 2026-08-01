export default function codeBlock(code: string, language: string = "") {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

export function jsonBlock(json: unknown) {
  return codeBlock(JSON.stringify(json, null, 2), "json");
}
