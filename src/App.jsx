import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, Modifier, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Import Draft.css for basic styles

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Define custom styles
  const styleMap = {
    'BLUE_TEXT': { color: 'blue' },
    'RED_BOLD_TEXT': { color: 'red', fontWeight: 'bold' },
    'YELLOW_ITALIC_TEXT': { color: 'yellow', fontStyle: 'italic' },
  };

  const applyStylesToWords = (editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    let styledContentState = contentState;

    contentState.getBlockMap().forEach((block) => {
      const blockKey = block.getKey();
      let start = 0;
      block.getText().split(/\s+/).forEach((word, index) => {
        const end = start + word.length;
        let style = 'YELLOW_ITALIC_TEXT'; // Default style for the third word and beyond
        if (index === 0) {
          style = 'BLUE_TEXT';
        } else if (index === 1) {
          style = 'RED_BOLD_TEXT';
        }

        const wordSelection = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: start,
          focusOffset: end,
        });

        styledContentState = Modifier.applyInlineStyle(
          styledContentState,
          wordSelection,
          style
        );

        start = end + 1; // Account for the space
      });
    });

    // Preserve the selection and restore it after styling
    return EditorState.forceSelection(
      EditorState.push(editorState, styledContentState, 'change-inline-style'),
      selection
    );
  };

  // Apply styles dynamically as the content changes
  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const newState = applyStylesToWords(editorState);
    if (newState !== editorState) {
      setEditorState(newState);
    }
  }, [editorState.getCurrentContent().getPlainText()]); // Depend on plain text content

  return (
    <div className="editor-container p-4">
      <div className="editor bg-white p-4 border border-gray-300 min-h-[200px]">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default TextEditor;
