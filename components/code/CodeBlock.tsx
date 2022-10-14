import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';

import styles from './styles/CodeBlock.module.scss';

const BlogCodeBlock = ({ code, language }: any) => (
  <Highlight
    {...defaultProps}
    theme={theme}
    code={code.trim()}
    language={language}
  >
    {({ className, style, tokens, getLineProps, getTokenProps }) => {
      return (
        <pre className={styles.codeBlock} style={style}>
          {tokens.map((line, i) => {
            return (
              <span
                {...getLineProps({ line, key: i })}
                className={styles.blockLine}
              >
                <span className={styles.lineNumber}>{i + 1}</span>
                {line.map((token, key) => {
                  const props = getTokenProps({ token, key });

                  if (key === 0 && !/\S/.test(props.children)) {
                    props.className += styles.whitespace;
                  }
                  return (
                    <span
                      {...props}
                      className={[props.className, styles.token].join(' ')}
                    />
                  );
                })}
              </span>
            );
          })}
        </pre>
      );
    }}
  </Highlight>
);

export default BlogCodeBlock;