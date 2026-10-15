import React, { useMemo, useState } from 'react';
import './App.css';
import GlobalCodeEditor from './components/GlobalCodeEditor';
import { LANGUAGE_GROUPS, LANGUAGE_META, BASE_COMPLETIONS, LANGUAGE_KEYWORDS, ECOSYSTEMS } from './data/languageCatalog';

const STARTER_HTML = `<main class="card">
  <div class="eyebrow">LIVE PREVIEW</div>
  <h1>DR RAJESH KHANDELWAL IBC</h1>
  <p>Choose a language and explore code suggestions across the global ecosystem.</p>
  <a class="cta" href="#preview">Explore Design</a>
</main>`;
const STARTER_CSS = `* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; font-family: Arial, sans-serif; color: #172033; background: #eef3fb; }
.card { width: min(100%, 680px); padding: clamp(24px, 5vw, 52px); text-align: center; background: white; border: 1px solid #dbe4f2; border-radius: 24px; box-shadow: 0 18px 55px #182e5018; }
.eyebrow { color: #8a6810; font-size: 12px; font-weight: 800; letter-spacing: 2px; }
h1 { color: #b18a20; font-size: clamp(24px, 5vw, 44px); line-height: 1.15; }
p { color: #526078; line-height: 1.7; }
.cta { display: inline-block; margin-top: 12px; padding: 12px 20px; color: white; background: #142b4b; border-radius: 10px; text-decoration: none; font-weight: 700; }`;
const STARTER_JS = `document.querySelector('.cta')?.addEventListener('click', (event) => {
  event.preventDefault();
  alert('Your live preview is working!');
});`;
const DEVICE_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '390px' };
const PREVIEW_LANGUAGES = new Set(['html', 'css', 'javascript']);
const ALIASES = {
  xml: 'html', svg: 'html', jsx: 'javascript', tsx: 'typescript',
  react: 'javascript', nextjs: 'javascript', vue: 'javascript', angular: 'typescript', svelte: 'javascript',
  node: 'javascript', express: 'javascript', nestjs: 'typescript', php: 'php', laravel: 'php', wordpress: 'php',
  flutter: 'dart', reactnative: 'javascript', android: 'kotlin', ios: 'swift', electron: 'javascript',
  cypress: 'javascript', playwright: 'javascript', jupyter: 'python', pyspark: 'python', pytorch: 'python',
  tensorflow: 'python', githubactions: 'yaml', kubernetes: 'yaml', ansible: 'yaml', terraform: 'terraform',
  openapi: 'yaml', protobuf: 'protobuf'
};

function getLanguageId(id) {
  if (id === 'js') return 'javascript';
  return ALIASES[id] || id;
}

function buildSuggestions(languageId) {
  const id = getLanguageId(languageId);
  const snippets = BASE_COMPLETIONS[id] || [];
  const words = (LANGUAGE_KEYWORDS[id] || '').split(/\s+/).filter(Boolean);
  const keywordItems = words.map((word) => ({
    label: word,
    insert: word,
    detail: `${LANGUAGE_META[languageId]?.label || LANGUAGE_META[id]?.label || id} keyword / API token`,
    code: word
  }));
  const snippetItems = snippets.map(([label, detail, code]) => ({ label, insert: label, detail, code }));
  return [...snippetItems, ...keywordItems].filter((item, index, all) =>
    all.findIndex((candidate) => candidate.label.toLowerCase() === item.label.toLowerCase()) === index
  );
}

function App() {
  const [language, setLanguage] = useState('html');
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [js, setJs] = useState(STARTER_JS);
  const [codeByLanguage, setCodeByLanguage] = useState({});
  const [device, setDevice] = useState('desktop');
  const [notice, setNotice] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [search, setSearch] = useState('');
  const editorRef = React.useRef(null);

  const languageInfo = LANGUAGE_META[language] || { label: language, category: 'Programming' };
  const activeValue = language === 'html' ? html : language === 'css' ? css : language === 'javascript' ? js : (codeByLanguage[language] || '');
  const setActiveValue = (value) => {
    if (language === 'html') setHtml(value);
    else if (language === 'css') setCss(value);
    else if (language === 'javascript') setJs(value);
    else setCodeByLanguage((previous) => ({ ...previous, [language]: value }));
  };

  const previewDocument = useMemo(() => `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style></head>
<body>${html}<script>try { ${js} } catch (error) { document.body.insertAdjacentHTML('beforeend', '<pre style="color:#b91c1c;padding:12px;white-space:pre-wrap">Preview JavaScript error: ' + String(error) + '</pre>'); }</script></body></html>`, [html, css, js]);

  const textBeforeCursor = activeValue.slice(0, cursorPosition);
  const tokenMatch = textBeforeCursor.match(/[A-Za-z_$][A-Za-z0-9_$.-]*$/);
  const typedPrefix = tokenMatch ? tokenMatch[0] : '';
  const suggestions = useMemo(() => {
    const items = buildSuggestions(language);
    const query = (typedPrefix || search).toLowerCase();
    if (!query) return items.slice(0, 10);
    return items.filter((item) => item.label.toLowerCase().startsWith(query) || item.insert.toLowerCase().startsWith(query) || item.detail.toLowerCase().includes(query)).slice(0, 24);
  }, [language, typedPrefix, search]);

  const setMessage = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const applySuggestion = (suggestion) => {
    const editor = editorRef.current;
    const replacement = (suggestion.code || suggestion.insert || suggestion.label).replace(/\\n/g, '\n');
    if (editor) {
      const model = editor.getModel();
      const position = editor.getPosition();
      if (model && position) {
        const word = model.getWordUntilPosition(position);
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
        editor.executeEdits('main-base-suggestion', [{ range, text: replacement, forceMoveMarkers: true }]);
        editor.focus();
      }
    } else {
      const before = activeValue.slice(0, cursorPosition);
      const after = activeValue.slice(cursorPosition);
      const match = before.match(/[A-Za-z_$][A-Za-z0-9_$.-]*$/);
      const startAt = match ? before.length - match[0].length : before.length;
      setActiveValue(before.slice(0, startAt) + replacement + after);
      setCursorPosition(startAt + replacement.length);
    }
    setMessage('Inserted ' + suggestion.label);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCursorPosition((nextLanguage === 'html' ? html : nextLanguage === 'css' ? css : nextLanguage === 'javascript' ? js : (codeByLanguage[nextLanguage] || '')).length);
    setSearch('');
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(activeValue); setMessage('Code copied'); }
    catch { setMessage('Clipboard unavailable — select the code and copy it'); }
  };

  const downloadCode = () => {
    const extension = ({ html: 'html', css: 'css', javascript: 'js', typescript: 'ts', python: 'py', java: 'java', cpp: 'cpp', csharp: 'cs', c: 'c', php: 'php', sql: 'sql', json: 'json', yaml: 'yml', bash: 'sh', rust: 'rs', go: 'go', kotlin: 'kt', swift: 'swift', ruby: 'rb' })[language] || 'txt';
    const content = language === 'html' ? previewDocument : activeValue;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `main-base-foundation.${extension}`; anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Code file downloaded');
  };

  const resetCode = () => {
    if (language === 'html') setHtml(STARTER_HTML);
    else if (language === 'css') setCss(STARTER_CSS);
    else if (language === 'javascript') setJs(STARTER_JS);
    else setCodeByLanguage((previous) => ({ ...previous, [language]: '' }));
    setMessage(`${languageInfo.label} editor reset`);
  };

  return (
    <main className="studio">
      <header className="studio-header">
        <div className="brand-mark" aria-hidden="true">RK</div>
        <div className="brand-copy"><div className="brand-title">MAIN BASE FOUNDATION</div><div className="brand-subtitle">GLOBAL CODE ECOSYSTEM</div></div>
        <div className="live-indicator"><span /> MULTI-LANGUAGE WORKSPACE</div>
      </header>

      <section className="welcome">
        <div className="welcome-kicker">EXPLORE · WRITE · BUILD · EXTEND</div>
        <h1>One workspace. <span>Global code.</span></h1>
        <p>Programming languages, frameworks, databases, APIs, mobile, AI, cloud aur DevOps ke liye extensible code workspace.</p>
      </section>

      <section className="ecosystem-strip">
        <div className="ecosystem-title">ECOSYSTEM INDEX</div>
        <div className="ecosystem-tags">{ECOSYSTEMS.slice(0, 18).map((item) => <span key={item}>{item}</span>)}<span className="more-tag">+ {ECOSYSTEMS.length - 18} more</span></div>
      </section>

      <section className="workspace">
        <div className="editor-panel">
          <div className="panel-top"><div><div className="panel-title">Global Code Editor</div><div className="panel-caption">Selected language: {languageInfo.label} · {languageInfo.category}</div></div><button className="text-button" type="button" onClick={resetCode}>Reset</button></div>
          <div className="language-picker-wrap"><label htmlFor="language-picker">LANGUAGE / FILE TYPE</label><select id="language-picker" value={language} onChange={(event) => handleLanguageChange(event.target.value)}>{LANGUAGE_GROUPS.map((group) => <optgroup key={group.label} label={group.label}>{group.items.map(([id, label]) => <option key={id + label} value={id}>{label}</option>)}</optgroup>)}</select></div>
          <div className="editor-area monaco-editor-area">
            <GlobalCodeEditor
              language={language}
              value={activeValue}
              onChange={setActiveValue}
              onCursorChange={setCursorPosition}
              onReady={(editor) => { editorRef.current = editor; }}
            />
          </div>
          <div className="editor-footer"><span><i className="tiny-live-dot" /> LOCAL EDITOR READY</span><span>{activeValue.split('\n').length} lines · {activeValue.length} chars</span><button className="text-button" type="button" onClick={copyCode}>Copy</button><button className="text-button" type="button" onClick={downloadCode}>Download</button></div>
        </div>

        <div className="right-column">
          <section className="suggestions-panel">
            <div className="panel-top suggestions-heading"><div><div className="panel-title">Smart Code Suggestions</div><div className="panel-caption">Type a prefix or search the selected language catalog</div></div><span className="suggestion-count">{suggestions.length}</span></div>
            <div className="suggestion-search"><input aria-label="Search code suggestions" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={typedPrefix ? `Prefix: ${typedPrefix}` : 'Search keyword, API, snippet...'} /><span>{languageInfo.label}</span></div>
            <div className="suggestions-list">{suggestions.map((suggestion, index) => <button className="suggestion-item" type="button" key={suggestion.label + index} onClick={() => applySuggestion(suggestion)}><span className="suggestion-main"><span className="suggestion-name">{suggestion.label}</span><span className="suggestion-detail">{suggestion.detail}</span><code className="suggestion-code">{suggestion.code}</code></span><span className="suggestion-insert">↵</span></button>)}{suggestions.length === 0 && <div className="no-suggestions"><strong>No local match found</strong><span>Try another prefix or search term. Full ecosystem coverage is extensible through language servers and provider integrations.</span></div>}</div>
            <div className="suggestions-footnote">Local catalog suggestions · language-aware starter set · expandable registry</div>
          </section>

          <section className="preview-panel">
            <div className="panel-top"><div><div className="panel-title">Live Preview / Output</div><div className="panel-caption">{PREVIEW_LANGUAGES.has(language) ? 'HTML, CSS and JavaScript preview updates as you edit.' : `${languageInfo.label} is editable here; execution needs a compatible runtime or sandbox.`}</div></div><div className="preview-status"><span /> {PREVIEW_LANGUAGES.has(language) ? 'LIVE' : 'EDITOR'}</div></div>
            {PREVIEW_LANGUAGES.has(language) ? <><div className="device-toolbar">{[['desktop','Desktop'],['tablet','Tablet'],['mobile','Mobile']].map(([id,label]) => <button key={id} type="button" className={`device-button ${device === id ? 'selected' : ''}`} onClick={() => setDevice(id)}>{label}</button>)}</div><div className={`preview-canvas device-${device}`}><div className="preview-frame-wrap" style={{ width: DEVICE_WIDTHS[device] }}><iframe className="preview-frame" title="Live code preview" sandbox="allow-scripts" srcDoc={previewDocument} /></div></div></> : <div className="runtime-note"><div className="runtime-icon">⌘</div><strong>{languageInfo.label} workspace selected</strong><p>Code editing, local suggestions and file export are available. Running or compiling this language requires its runtime, compiler, or a secure remote execution service.</p><span>Runtime adapter: not connected</span></div>}
            <div className="preview-footer">Security note: code is edited locally. Non-web languages are not executed inside this browser preview.</div>
          </section>
        </div>
      </section>
      <footer className="studio-footer"><span>DR RAJESH KHANDELWAL IBC · MAIN BASE FOUNDATION</span><span>Global language catalog · expandable architecture · not yet connected to language-server / AI completion providers</span></footer>
      {notice && <div className="notice" role="status">{notice}</div>}
    </main>
  );
}

export default App;
