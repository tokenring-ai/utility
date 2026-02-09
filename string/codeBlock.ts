
export default function codeBlock(code: string, language: string = '') {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}