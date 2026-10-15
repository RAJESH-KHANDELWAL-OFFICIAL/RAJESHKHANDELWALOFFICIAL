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

function App() {
  const [activeTab, setActiveTab] = useState('html');
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [js, setJs] = useState(STARTER_JS);
  const [device, setDevice] = useState('desktop');
  const [notice, setNotice] = useState('');

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
              onChange={(event) => setActiveValue(event.target.value)}
              placeholder={`Paste your ${activeTab.toUpperCase()} code here...`}
            />
          </div>

          <div className="editor-footer">
            <span><span className="tiny-live-dot" /> Auto-preview enabled</span>
            <button className="text-button" type="button" onClick={copyCode}>Copy code</button>
          </div>
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
