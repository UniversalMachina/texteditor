import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, Modifier, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Basic Draft.js styles

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Custom style map for yellow text
  const styleMap = {
    'YELLOW_TEXT': {
      color: 'yellow',
    },
  };

  // Handler to update the editor's state
  const onChange = (newEditorState) => setEditorState(newEditorState);

  // Function to apply yellow color to every second word
  const applyYellowToEverySecondWord = (editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    contentState.getBlockMap().forEach((block) => {
      const blockText = block.getText();
      const blockKey = block.getKey();
      let start = 0;
      blockText.split(/\s+/).forEach((word, index) => {
        const end = start + word.length;
        if (index % 2 !== 0) { // Apply style to every second word
          const wordSelection = SelectionState
            .createEmpty(blockKey)
            .merge({
              anchorOffset: start,
              focusOffset: end,
            });
          newContentState = Modifier.applyInlineStyle(
            newContentState,
            wordSelection,
            'YELLOW_TEXT'
          );
        }
        start = end + 1; // +1 for the space or punctuation
      });
    });

    // Preserve the selection and restore it after styling
    return EditorState.forceSelection(
      EditorState.push(editorState, newContentState, 'change-inline-style'),
      selection
    );
  };

  // Automatically apply styling when the editor state changes
  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const newState = applyYellowToEverySecondWord(editorState);
    if (newState !== editorState) {
      setEditorState(newState);
    }
  }, [editorState.getCurrentContent().getPlainText()]); // Depend on plain text content

  return (
    <div className="editor-container p-4">
      <div className="editor bg-white p-4 border border-gray-300 min-h-[200px] text-blue-600">
        <Editor
          editorState={editorState}
          onChange={onChange}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default TextEditor;
