import { BASE_COMPLETIONS, LANGUAGE_KEYWORDS, LANGUAGE_META } from '../data/languageCatalog';

const LANGUAGE_ALIASES = {
  xml: 'html', svg: 'html', jsx: 'javascript', tsx: 'typescript',
  react: 'javascript', nextjs: 'javascript', vue: 'javascript', angular: 'typescript', svelte: 'javascript',
  node: 'javascript', express: 'javascript', nestjs: 'typescript', laravel: 'php', wordpress: 'php',
  flutter: 'dart', reactnative: 'javascript', android: 'kotlin', ios: 'swift', electron: 'javascript',
  cypress: 'javascript', playwright: 'javascript', jupyter: 'python', pyspark: 'python',
  pytorch: 'python', tensorflow: 'python', githubactions: 'yaml', kubernetes: 'yaml',
  ansible: 'yaml', terraform: 'hcl', openapi: 'yaml', protobuf: 'protobuf', makefile: 'makefile',
  nginx: 'nginx', powershell: 'powershell', docker: 'dockerfile'
};

export const MONACO_LANGUAGE_IDS = {
  html: 'html', css: 'css', javascript: 'javascript', typescript: 'typescript', json: 'json',
  xml: 'xml', svg: 'xml', jsx: 'javascript', tsx: 'typescript', graphql: 'graphql',
  python: 'python', java: 'java', c: 'c', cpp: 'cpp', csharp: 'csharp', go: 'go',
  rust: 'rust', ruby: 'ruby', swift: 'swift', kotlin: 'kotlin', dart: 'dart', scala: 'scala',
  r: 'r', julia: 'julia', lua: 'lua', perl: 'perl', elixir: 'elixir', erlang: 'erlang',
  haskell: 'haskell', clojure: 'clojure', fsharp: 'fsharp', ocaml: 'ocaml', fortran: 'fortran',
  cobol: 'plaintext', objectivec: 'objective-c', assembly: 'asm', solidity: 'sol', sql: 'sql',
  bash: 'shell', powershell: 'powershell', docker: 'dockerfile', yaml: 'yaml', toml: 'ini',
  ini: 'ini', terraform: 'hcl', hcl: 'hcl', makefile: 'makefile', cmake: 'cmake', nix: 'nix',
  nginx: 'nginx', githubactions: 'yaml', kubernetes: 'yaml', ansible: 'yaml', react: 'javascript',
  nextjs: 'javascript', vue: 'javascript', angular: 'typescript', svelte: 'javascript', node: 'javascript',
  express: 'javascript', nestjs: 'typescript', php: 'php', laravel: 'php', wordpress: 'php',
  flutter: 'dart', reactnative: 'javascript', android: 'kotlin', ios: 'swift', electron: 'javascript',
  cypress: 'javascript', playwright: 'javascript', jupyter: 'python', pyspark: 'python',
  pytorch: 'python', tensorflow: 'python', openapi: 'yaml', protobuf: 'proto'
};

export function resolveLanguage(language) {
  return LANGUAGE_ALIASES[language] || language;
}

function localItems(language) {
  const id = resolveLanguage(language);
  const snippets = BASE_COMPLETIONS[id] || [];
  const keywords = (LANGUAGE_KEYWORDS[id] || '').split(/\\s+/).filter(Boolean);
  const items = [
    ...snippets.map(([label, detail, insertText]) => ({ label, detail, insertText, kind: 'Snippet' })),
    ...keywords.map((word) => ({
      label: word,
      detail: `${LANGUAGE_META[language]?.label || LANGUAGE_META[id]?.label || id} keyword / API token`,
      insertText: word,
      kind: 'Keyword'
    }))
  ];
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item.label).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMonacoKind(monaco, kind) {
  return kind === 'Snippet' ? monaco.languages.CompletionItemKind.Snippet : monaco.languages.CompletionItemKind.Keyword;
}

/**
 * Provider contract: optional endpoint receives { language, prefix, code, line, column }
 * and may return { suggestions: [{ label, insertText, detail, kind? }] } or an array.
 * Keep API credentials on a backend; never put provider secrets in REACT_APP variables.
 */
export function registerCompletionProvider(monaco, language, getCode, getLspClient) {
  const languageId = MONACO_LANGUAGE_IDS[language] || MONACO_LANGUAGE_IDS[resolveLanguage(language)] || 'plaintext';
  return monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: ['.', '<', ':', '/', '"', "'", '@'],
    async provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      const prefix = word.word || '';
      let items = localItems(language).filter((item) => !prefix || item.label.toLowerCase().startsWith(prefix.toLowerCase()));

      const lspClient = getLspClient?.();
      if (lspClient?.isReady()) {
        try {
          const lspItems = await lspClient.complete(position);
          const converted = lspItems.map((item) => ({
            label: typeof item.label === 'string' ? item.label : item.label?.label || 'completion',
            detail: typeof item.detail === 'string' ? item.detail : 'Language server completion',
            insertText: item.textEdit?.newText || item.insertText || (typeof item.label === 'string' ? item.label : item.label?.label) || '',
            kind: item.insertTextFormat === 2 ? 'Snippet' : 'Keyword',
            sortText: item.sortText || item.label
          }));
          items = [...converted, ...items].filter((item, index, all) =>
            all.findIndex((other) => String(other.label).toLowerCase() === String(item.label).toLowerCase()) === index
          );
        } catch {
          // Continue with the local and optional remote provider.
        }
      }

      const endpoint = process.env.REACT_APP_COMPLETION_API_URL;
      if (endpoint) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language,
              prefix,
              code: getCode(),
              line: position.lineNumber,
              column: position.column
            })
          });
          if (response.ok) {
            const payload = await response.json();
            const remoteItems = Array.isArray(payload) ? payload : payload.suggestions;
            if (Array.isArray(remoteItems)) {
              items = [...remoteItems, ...items].filter((item, index, all) =>
                all.findIndex((other) => String(other.label).toLowerCase() === String(item.label).toLowerCase()) === index
              );
            }
          }
        } catch {
          // Remote completion is optional; local completions remain available when offline.
        }
      }

      return {
        suggestions: items.slice(0, 80).map((item) => ({
          label: String(item.label),
          kind: getMonacoKind(monaco, item.kind),
          detail: item.detail || 'Code completion',
          insertText: (item.insertText || item.insert || String(item.label)).replace(/\\n/g, '\n'),
          range,
          sortText: item.sortText || (item.kind === 'Snippet' ? '0' + item.label : '1' + item.label)
        }))
      };
    }
  });
}
