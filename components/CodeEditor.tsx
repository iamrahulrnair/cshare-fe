import { useState, useContext, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(import('@monaco-editor/react'), { ssr: false });

function App({ updateCodeState, codeDetails, options = {} }: any) {
  const [height, setHeight] = useState(0);

  function handleEditorDidMount(editor: any, _: any) {
    setHeight(editor.getContentHeight());
    // console.log(editor.getModel()?.getLineCount());
  }
  return (
    <Editor
      // @ts-ignore
      height={height}
      onChange={(code) => updateCodeState(code!)}
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

export default App;
