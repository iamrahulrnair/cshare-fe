import { useState, useContext, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(import('@monaco-editor/react'), { ssr: false });

const getLanguage = (extension: string) => {
  const languageMap = [
    { extension: 'js', language: 'javascript' },
    { extension: 'py', language: 'python' },
    { extension: 'java', language: 'java' },
    { extension: 'c', language: 'c' },
    { extension: 'cpp', language: 'cpp' },
    { extension: 'cs', language: 'csharp' },
    { extension: 'go', language: 'go' },
    { extension: 'html', language: 'html' },
    { extension: 'css', language: 'css' },
    { extension: 'scss', language: 'scss' },
    { extension: 'php', language: 'php' },
    { extension: 'rb', language: 'ruby' },
    { extension: 'rs', language: 'rust' },
    { extension: 'sql', language: 'sql' },
    { extension: 'swift', language: 'swift' },
    { extension: 'ts', language: 'typescript' },
    { extension: 'kt', language: 'kotlin' },
    { extension: 'scala', language: 'scala' },
    { extension: 'r', language: 'r' },
    { extension: 'dart', language: 'dart' },
    { extension: 'lua', language: 'lua' },
    { extension: 'sh', language: 'shell' },
    { extension: 'jsx', language: 'javascriptreact' },
    { extension: 'tsx', language: 'typescriptreact' },
    { extension: 'json', language: 'json' },
    { extension: 'yml', language: 'yaml' },
    { extension: 'xml', language: 'xml' },
    { extension: 'md', language: 'markdown' },
    { extension: 'txt', language: 'plaintext' },
  ];

  const language = languageMap.find((lang) => lang.extension === extension);
  if (language) {
    return language.language;
  }
  return 'plaintext';
};

export function CodeEditor({
  handleCodeUpdate,
  codeDetails,
  options = {},
  language,
}: any) {
  const [height, setHeight] = useState(0);

  function handleEditorDidMount(editor: any, _: any) {
    setHeight(
      editor.getContentHeight() <= 65 ? 300 : editor.getContentHeight()
    );
  }

  return (
    <Editor
      // @ts-ignore
      language={getLanguage(language)}
      height={height}
      onChange={(code) => handleCodeUpdate(code!)}
      value={codeDetails.code}
      theme='vs-dark'
      onMount={handleEditorDidMount}
      options={{
        ...options,
        padding: { top: 20, bottom: 20 },
        lineHeight: 25,
        matchBrackets: 'always',
        scrollbar: {
          verticalHasArrows: true,
          verticalSliderSize: 6,
          horizontalHasArrows: true,
          horizontalScrollbarSize: 6,
        },
        smoothScrolling: true,
        formatOnPaste: true,
        fontWeight: 'bold',
      }}
    />
  );
}
