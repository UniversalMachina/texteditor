import React, { useState } from 'react';
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

  // Handler to toggle bold styling
  const handleBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  // Function to apply yellow color to every second word
  const applyYellowToEverySecondWord = (editorState) => {
    const selectionState = editorState.getSelection();
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

    return EditorState.push(editorState, newContentState, 'change-inline-style');
  };

  return (
    <div className="editor-container p-4">
      <div className="toolbar mb-2">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents losing focus
            handleBoldClick();
          }}>
          Bold
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-700"
          onMouseDown={(e) => {
            e.preventDefault(); // Avoid losing focus
            const newState = applyYellowToEverySecondWord(editorState);
            setEditorState(newState);
          }}>
          Color Second Words
        </button>
      </div>
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
