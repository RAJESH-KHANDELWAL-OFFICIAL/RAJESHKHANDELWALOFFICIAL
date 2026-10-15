# MAIN BASE FOUNDATION — Global Code Ecosystem

## What is included

- Monaco Editor with syntax highlighting, minimap, folding, bracket matching and keyboard autocomplete.
- Extensible language / framework catalog in `src/data/languageCatalog.js`.
- Local completion provider in `src/services/completionProviders.js`.
- Optional remote completion endpoint for AI or organization-specific suggestions.
- Optional WebSocket JSON-RPC/LSP client in `src/services/lspClient.js`; it can consume completions and diagnostics from a compatible language-server gateway.
- HTML/CSS/JavaScript live preview. Other languages remain editable/exportable until a safe runtime is connected.
- Frontend build workflow at `.github/workflows/frontend-build.yml`.

## Run the frontend

From the `frontend` directory:

```bash
npm install
npm start
```

Run a production build with `npm run build`.

## Optional remote AI / completion provider

Create a local `.env` file in `frontend` using `.env.example` as a guide:

```env
REACT_APP_COMPLETION_API_URL=https://YOUR-OWN-SERVER.example/api/completions
```

The browser sends a POST request with JSON fields `language`, `prefix`, `code`, `line`, and `column`. The endpoint can return either an array or an object with a `suggestions` array, e.g.:

```json
{
  "suggestions": [
    {
      "label": "fetch JSON",
      "insertText": "const response = await fetch('/api/data');\\nconst data = await response.json();",
      "detail": "Fetch JSON from an API"
    }
  ]
}
```

Implement authentication, rate limits, validation, CORS and provider secrets on the server. **Never put API keys or other secrets in a `REACT_APP_*` variable**; frontend environment variables are bundled into client code.

## Optional Language Server Protocol (LSP)

Set `REACT_APP_LSP_WEBSOCKET_URL` to a secured WebSocket gateway that transports JSON-RPC messages as individual WebSocket frames and implements LSP `initialize`, `initialized`, `textDocument/didOpen`, `textDocument/didChange`, `textDocument/completion` and `textDocument/publishDiagnostics`.

A compatible language server / gateway is a separate service and must be deployed and secured (TLS, origin checks and authentication). The browser-side client is included, but **no language-server backend is bundled or hosted by this repository**.

## Coverage and limitations

The language catalog is broad and intentionally extensible; it is not a complete index of every language, library, API, version or framework. Local suggestions are keyword/snippet starters, not an AI model. Monaco provides editor-level language features where supported. Deeper semantic completion, project-wide symbol search, compiler diagnostics and code execution require suitable language servers, analyzers, compilers or isolated execution services.
