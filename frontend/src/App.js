import React, { useMemo, useState } from 'react';
import './App.css';

const STARTER_HTML = `<main class="card">
  <div class="eyebrow">LIVE PREVIEW</div>
  <h1>DR RAJESH KHANDELWAL IBC</h1>
  <p>Write or paste your code and see the result instantly.</p>
  <a class="cta" href="#preview">Explore Design</a>
</main>`;

const STARTER_CSS = `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #172033;
  background: #eef3fb;
}
.card {
  width: min(100%, 680px);
  padding: clamp(24px, 5vw, 52px);
  text-align: center;
  background: white;
  border: 1px solid #dbe4f2;
  border-radius: 24px;
  box-shadow: 0 18px 55px #182e5018;
}
.eyebrow { color: #8a6810; font-size: 12px; font-weight: 800; letter-spacing: 2px; }
h1 { color: #b18a20; font-size: clamp(24px, 5vw, 44px); line-height: 1.15; }
p { color: #526078; line-height: 1.7; }
.cta { display: inline-block; margin-top: 12px; padding: 12px 20px; color: white; background: #142b4b; border-radius: 10px; text-decoration: none; font-weight: 700; }`;

const STARTER_JS = `document.querySelector('.cta')?.addEventListener('click', (event) => {
  event.preventDefault();
  alert('Your live preview is working!');
});`;

const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '390px' };

const COMPLETIONS = {
  html: [
    { label: 'label', insert: 'label', detail: 'HTML form label element', code: '<label for="name">Name</label>' },
    { label: 'legend', insert: 'legend', detail: 'Caption for a fieldset', code: '<legend>Personal details</legend>' },
    { label: 'link', insert: 'link', detail: 'Link an external stylesheet', code: '<link rel="stylesheet" href="style.css">' },
    { label: 'li', insert: 'li', detail: 'List item element', code: '<li>List item</li>' },
    { label: 'li*', insert: 'li', detail: 'List item with an example', code: '<ul>\\n  <li>Item one</li>\\n  <li>Item two</li>\\n</ul>' },
    { label: 'letter', insert: 'letter', detail: 'Text placeholder example', code: '<p>Write your letter here</p>' },
    { label: 'let', insert: 'let', detail: 'JavaScript variable (switch to JS tab)', code: 'let message = "Hello";' },
    { label: 'header', insert: 'header', detail: 'Page or section header', code: '<header>\\n  <h1>Page title</h1>\\n</header>' },
    { label: 'section', insert: 'section', detail: 'Semantic section', code: '<section>\\n  <h2>Section title</h2>\\n</section>' },
    { label: 'button', insert: 'button', detail: 'Clickable button', code: '<button type="button">Click me</button>' },
    { label: 'h1', insert: 'h1', detail: 'Main heading', code: '<h1>Main heading</h1>' },
    { label: 'img', insert: 'img', detail: 'Image element', code: '<img src="image.jpg" alt="Description">' }
  ],
  css: [
    { label: 'letter-spacing', insert: 'letter-spacing', detail: 'Space between letters', code: 'letter-spacing: 1px;' },
    { label: 'left', insert: 'left', detail: 'Position offset from left', code: 'left: 0;' },
    { label: 'line-height', insert: 'line-height', detail: 'Text line spacing', code: 'line-height: 1.5;' },
    { label: 'list-style', insert: 'list-style', detail: 'List marker style', code: 'list-style: none;' },
    { label: 'linear-gradient', insert: 'linear-gradient', detail: 'Gradient background', code: 'background: linear-gradient(135deg, #10213d, #d4af37);' },
    { label: 'layout: flex', insert: 'display', detail: 'Flexbox layout', code: 'display: flex;\\nalign-items: center;\\njustify-content: center;' },
    { label: 'layout: grid', insert: 'display', detail: 'CSS grid layout', code: 'display: grid;\\ngrid-template-columns: repeat(2, minmax(0, 1fr));\\ngap: 16px;' },
    { label: 'width', insert: 'width', detail: 'Element width', code: 'width: 100%;' },
    { label: 'max-width', insert: 'max-width', detail: 'Maximum element width', code: 'max-width: 1200px;' },
    { label: 'color', insert: 'color', detail: 'Text color', code: 'color: #d4af37;' },
    { label: 'box-shadow', insert: 'box-shadow', detail: 'Soft shadow', code: 'box-shadow: 0 8px 24px #00000018;' }
  ],
  js: [
    { label: 'let', insert: 'let', detail: 'Declare a changeable variable', code: 'let message = "Hello";' },
    { label: 'length', insert: 'length', detail: 'Read string or array length', code: 'const count = items.length;' },
    { label: 'letter', insert: 'letter', detail: 'Example variable for a letter', code: 'const letter = "L";' },
    { label: 'let…of', insert: 'let', detail: 'Loop through iterable values', code: 'for (let item of items) {\\n  console.log(item);\\n}' },
    { label: 'let…in', insert: 'let', detail: 'Loop through object keys', code: 'for (let key in object) {\\n  console.log(key, object[key]);\\n}' },
    { label: 'localStorage', insert: 'localStorage', detail: 'Store data in this browser', code: 'localStorage.setItem("key", "value");' },
    { label: 'location', insert: 'location', detail: 'Current page URL information', code: 'console.log(window.location.href);' },
    { label: 'log', insert: 'log', detail: 'Print a value for debugging', code: 'console.log(value);' },
    { label: 'function', insert: 'function', detail: 'Declare a function', code: 'function greet(name) {\\n  return `Hello, ${name}!`;\\n}' },
    { label: 'addEventListener', insert: 'addEventListener', detail: 'Listen for a user interaction', code: 'element.addEventListener("click", () => {\\n  // Your code here\\n});' },
    { label: 'map', insert: 'map', detail: 'Transform array items', code: 'const result = items.map((item) => item);' },
    { label: 'filter', insert: 'filter', detail: 'Filter array items', code: 'const result = items.filter((item) => item);' }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('html');
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [js, setJs] = useState(STARTER_JS);
  const [device, setDevice] = useState('desktop');
  const [notice, setNotice] = useState('');\n  const [cursorPosition, setCursorPosition] = useState(0);

  const previewDocument = useMemo(() => {
    const isFullDocument = /<!doctype|<html[\s>]/i.test(html);
    if (isFullDocument) {
      let result = html;
      if (/<\/head>/i.test(result)) {
        result = result.replace(/<\/head>/i, `<style>\n${css}\n</style>\n</head>`);
      } else {
        result = `<style>\n${css}\n</style>\n${result}`;
      }
      if (js.trim()) {
        if (/<\/body>/i.test(result)) result = result.replace(/<\/body>/i, `<script>\n${js}\n<\/script>\n</body>`);
        else result += `\n<script>\n${js}\n<\/script>`;
      }
      return result;
    }
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (error) {
  document.body.insertAdjacentHTML('beforeend', '<pre style="color:#b91c1c;padding:12px;white-space:pre-wrap">Preview JavaScript error: ' + String(error) + '</pre>');
}
<\/script>
</body>
</html>`;
  }, [html, css, js]);

  const activeValue = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const setActiveValue = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs;
  const textBeforeCursor = activeValue.slice(0, cursorPosition || activeValue.length);
  const tokenMatch = textBeforeCursor.match(/[A-Za-z_$][A-Za-z0-9_$-]*$/);
  const typedPrefix = tokenMatch ? tokenMatch[0] : '';
  const suggestions = useMemo(() => {
    const items = COMPLETIONS[activeTab] || [];
    if (!typedPrefix) return items.slice(0, 6);
    const prefix = typedPrefix.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().startsWith(prefix) || item.insert.toLowerCase().startsWith(prefix)).slice(0, 8);
  }, [activeTab, typedPrefix]);

  const applySuggestion = (suggestion) => {
    const before = activeValue.slice(0, cursorPosition || activeValue.length);
    const after = activeValue.slice(cursorPosition || activeValue.length);
    const match = before.match(/[A-Za-z_$][A-Za-z0-9_$-]*$/);
    const start = match ? before.length - match[0].length : before.length;
    const replacement = suggestion.insert;
    const updated = before.slice(0, start) + replacement + after;
    setActiveValue(updated);
    setCursorPosition(start + replacement.length);
    setNotice(`Added suggestion: ${suggestion.label}`);
    window.setTimeout(() => setNotice(''), 1800);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeValue);
      setNotice('Code copied');
    } catch {
      setNotice('Copy not available in this browser — select the code and copy it');
    }
    window.setTimeout(() => setNotice(''), 2500);
  };

  const downloadHtml = () => {
    const blob = new Blob([previewDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'live-preview.html';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('HTML preview downloaded');
    window.setTimeout(() => setNotice(''), 2500);
  };

  const resetCode = () => {
    setHtml(STARTER_HTML);
    setCss(STARTER_CSS);
    setJs(STARTER_JS);
    setNotice('Starter code restored');
    window.setTimeout(() => setNotice(''), 2500);
  };

  return (
    <main className="studio">
      <header className="studio-header">
        <div className="brand-mark" aria-hidden="true">RK</div>
        <div className="brand-copy">
          <div className="brand-title">MAIN BASE FOUNDATION</div>
          <div className="brand-subtitle">LIVE CODE STUDIO</div>
        </div>
        <div className="live-indicator"><span /> LIVE PREVIEW</div>
      </header>

      <section className="welcome">
        <div className="welcome-kicker">BUILD · TEST · VISUALIZE</div>
        <h1>Code it. <span>See it live.</span></h1>
        <p>HTML, CSS aur JavaScript likho ya paste karo — design ka preview turant dekho.</p>
      </section>

      <section className="workspace">
        <div className="editor-panel">
          <div className="panel-top">
            <div>
              <div className="panel-title">Code Editor</div>
              <div className="panel-caption">Changes preview mein automatically dikhte hain</div>
            </div>
            <button className="text-button" type="button" onClick={resetCode}>Reset</button>
          </div>

          <div className="editor-tabs" role="tablist" aria-label="Code language">
            {['html', 'css', 'js'].map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`editor-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className={`language-dot ${tab}`} />
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="editor-area">
            <div className="line-count" aria-hidden="true">
              {activeValue.split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            <textarea
              aria-label={`${activeTab.toUpperCase()} code editor`}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              value={activeValue}
              onChange={(event) => { setActiveValue(event.target.value); setCursorPosition(event.target.selectionStart); }}\n              onClick={(event) => setCursorPosition(event.target.selectionStart)}\n              onKeyUp={(event) => setCursorPosition(event.target.selectionStart)}
              placeholder={`Paste your ${activeTab.toUpperCase()} code here...`}
            />
          </div>

          <div className="editor-footer">
            <span><span className="tiny-live-dot" /> Auto-preview enabled</span>
            <button className="text-button" type="button" onClick={copyCode}>Copy code</button>
          </div>
        </div>

        <div className="right-column">
          <div className="suggestions-panel">
            <div className="panel-top suggestions-heading">
              <div>
                <div className="panel-title">Smart Code Suggestions</div>
                <div className="panel-caption">{typedPrefix ? `Matches for “${typedPrefix}”` : 'Start typing to find matching code'}</div>
              </div>
              <span className="suggestion-count">{suggestions.length}</span>
            </div>
            <div className="suggestions-list">
              {suggestions.length ? suggestions.map((suggestion, index) => (
                <button className="suggestion-item" type="button" key={suggestion.label + index} onClick={() => applySuggestion(suggestion)}>
                  <span className="suggestion-main">
                    <span className="suggestion-name">{suggestion.label}</span>
                    <span className="suggestion-detail">{suggestion.detail}</span>
                    <code className="suggestion-code">{suggestion.code}</code>
                  </span>
                  <span className="suggestion-insert" aria-hidden="true">↙</span>
                </button>
              )) : (
                <div className="no-suggestions">
                  <strong>No exact match yet</strong>
                  <span>Keep typing, or switch HTML / CSS / JS to see suggestions for that language.</span>
                </div>
              )}
            </div>
            <div className="suggestions-footnote">Select a suggestion to insert it at your cursor.</div>
          </div>

          <div className="preview-panel">
          <div className="panel-top preview-heading">
            <div>
              <div className="panel-title">Visual Preview</div>
              <div className="panel-caption">Rendered result</div>
            </div>
            <div className="preview-status"><span /> Updated live</div>
          </div>

          <div className="device-toolbar" aria-label="Preview screen size">
            {Object.keys(deviceWidths).map((size) => (
              <button
                key={size}
                type="button"
                className={`device-button ${device === size ? 'selected' : ''}`}
                onClick={() => setDevice(size)}
                aria-pressed={device === size}
              >
                {size === 'desktop' ? '▰' : size === 'tablet' ? '▯' : '▯'} <span>{size[0].toUpperCase() + size.slice(1)}</span>
              </button>
            ))}
            <button className="download-button" type="button" onClick={downloadHtml}>Download HTML</button>
          </div>

          <div className={`preview-canvas device-${device}`}>
            <div className="preview-frame-wrap" style={{ width: deviceWidths[device] }}>
              <iframe
                title="Live code preview"
                sandbox="allow-scripts"
                srcDoc={previewDocument}
                className="preview-frame"
              />
            </div>
          </div>
          <div className="preview-footer">Preview isolated from the main app for safer testing.</div>
          </div>
        </div>
      </section>

      <footer className="studio-footer">
        <span>DR RAJESH KHANDELWAL IBC</span>
        <span>Code changes are previewed locally; they are not automatically committed to GitHub.</span>
      </footer>
      {notice && <div className="notice" role="status">{notice}</div>}
    </main>
  );
}

export default App;
