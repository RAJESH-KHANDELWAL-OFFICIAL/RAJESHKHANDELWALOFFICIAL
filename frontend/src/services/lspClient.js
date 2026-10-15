const SEVERITY = { 1: 'Error', 2: 'Warning', 3: 'Info', 4: 'Hint' };

/**
 * Optional browser-side LSP client for a WebSocket gateway that transports
 * JSON-RPC messages as individual JSON WebSocket frames.
 * A compatible language-server process/gateway must be deployed separately.
 */
export function createLspClient({ monaco, editor, language }) {
  const endpoint = process.env.REACT_APP_LSP_WEBSOCKET_URL;
  if (!endpoint || typeof WebSocket === 'undefined') return null;

  let socket;
  let nextId = 1;
  let disposed = false;
  let initialized = false;
  const pending = new Map();
  const uri = `inmemory://main-base-foundation/${language}/workspace.${language}`;
  const model = editor.getModel();
  if (!model) return null;

  const send = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  };
  const request = (method, params) => new Promise((resolve, reject) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return reject(new Error('LSP socket is not open'));
    const id = nextId++;
    pending.set(id, { resolve, reject });
    send({ jsonrpc: '2.0', id, method, params });
    window.setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('LSP request timed out'));
      }
    }, 12000);
  });
  const notify = (method, params) => send({ jsonrpc: '2.0', method, params });
  const sendDocument = () => {
    if (!initialized) return;
    notify('textDocument/didChange', {
      textDocument: { uri, version: model.getVersionId() },
      contentChanges: [{ text: model.getValue() }]
    });
  };

  try {
    socket = new WebSocket(endpoint);
  } catch {
    return null;
  }

  socket.addEventListener('open', async () => {
    try {
      await request('initialize', {
        processId: null,
        rootUri: null,
        capabilities: {
          textDocument: {
            completion: { completionItem: { snippetSupport: true, documentationFormat: ['markdown', 'plaintext'] } },
            publishDiagnostics: { relatedInformation: true }
          }
        },
        initializationOptions: { language }
      });
      if (disposed) return;
      initialized = true;
      notify('initialized', {});
      notify('textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: language,
          version: model.getVersionId(),
          text: model.getValue()
        }
      });
    } catch {
      // LSP is optional; local Monaco completions remain available.
    }
  });

  socket.addEventListener('message', (event) => {
    let message;
    try { message = JSON.parse(event.data); } catch { return; }
    if (message.id !== undefined && pending.has(message.id)) {
      const waiter = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message || 'LSP error'));
      else waiter.resolve(message.result);
    }
    if (message.method === 'textDocument/publishDiagnostics' && message.params?.uri === uri) {
      const markers = (message.params.diagnostics || []).map((diagnostic) => ({
        severity: monaco.MarkerSeverity[SEVERITY[diagnostic.severity] || 'Info'],
        message: diagnostic.message || 'Language server diagnostic',
        source: diagnostic.source || 'language server',
        startLineNumber: Math.max(1, diagnostic.range?.start?.line + 1 || 1),
        startColumn: Math.max(1, diagnostic.range?.start?.character + 1 || 1),
        endLineNumber: Math.max(1, diagnostic.range?.end?.line + 1 || 1),
        endColumn: Math.max(1, diagnostic.range?.end?.character + 1 || 1)
      }));
      monaco.editor.setModelMarkers(model, 'main-base-lsp', markers);
    }
  });

  const changeDisposable = model.onDidChangeContent(sendDocument);

  return {
    isReady: () => initialized && socket?.readyState === WebSocket.OPEN,
    async complete(position) {
      if (!initialized) return [];
      try {
        const result = await request('textDocument/completion', {
          textDocument: { uri },
          position: { line: position.lineNumber - 1, character: position.column - 1 }
        });
        return Array.isArray(result) ? result : (result?.items || []);
      } catch {
        return [];
      }
    },
    dispose() {
      disposed = true;
      changeDisposable.dispose();
      monaco.editor.setModelMarkers(model, 'main-base-lsp', []);
      pending.forEach(({ reject }) => reject(new Error('LSP client disposed')));
      pending.clear();
      try { notify('textDocument/didClose', { textDocument: { uri } }); } catch { /* ignore close errors */ }
      if (socket) socket.close();
    }
  };
}
