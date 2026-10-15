import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { MONACO_LANGUAGE_IDS, registerCompletionProvider } from '../services/completionProviders';

export default function GlobalCodeEditor({ language, value, onChange, onCursorChange, onReady }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const languageId = MONACO_LANGUAGE_IDS[language] || 'plaintext';

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.defineTheme('mainBaseFoundation', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#fbfcff',
        'editorLineNumber.foreground': '#9aa6b8',
        'editorLineNumber.activeForeground': '#10213d',
        'editorCursor.foreground': '#b18a20',
        'editor.selectionBackground': '#dbe7fb'
      }
    });
    monaco.editor.setTheme('mainBaseFoundation');
    editor.updateOptions({
      fontSize: 13,
      lineHeight: 23,
      minimap: { enabled: true, scale: 1 },
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'off',
      scrollBeyondLastLine: false,
      suggestOnTriggerCharacters: true,
      quickSuggestions: { other: true, comments: false, strings: true },
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top',
      folding: true,
      bracketPairColorization: { enabled: true },
      padding: { top: 16, bottom: 16 }
    });
    editor.onDidChangeCursorPosition((event) => {
      const model = editor.getModel();
      if (model) onCursorChange(model.getOffsetAt(event.position));
    });
    onReady?.(editor);
  };

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return undefined;
    const disposable = registerCompletionProvider(monaco, language, () => valueRef.current);
    return () => disposable.dispose();
  }, [language]);

  return (
    <div className="monaco-editor-host">
      <Editor
        height="100%"
        language={languageId}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        onMount={handleMount}
        loading={<div className="editor-loading">Loading global code editor…</div>}
        options={{
          readOnly: false,
          ariaLabel: `${language} code editor`,
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false
        }}
      />
    </div>
  );
}
