import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { imageHandler } from '../../Functions/ContentCreatorFunc';

const RichTextEditor = ({ handleEditorStateChange, content }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if(content !== undefined){
      const contentState = convertFromRaw(JSON.parse(content));
      const initialEditorState = EditorState.createWithContent(contentState);
      setEditorState(initialEditorState);
    }
  }, [content]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const plainText = newEditorState.getCurrentContent();
    const contentToSave = JSON.stringify(convertToRaw(plainText));
    handleEditorStateChange(contentToSave);
  };

  return (
      <Editor
        wrapperStyle={{ width: '90%', maxWidth: '800px', backgroundColor: 'white' }}
        editorStyle={{overflowWrap: 'break-word'}}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: imageHandler,
            defaultSize: {
              height: '450',
              width: '350',
            },
          },
        }}
      />
  );
};

export default RichTextEditor;
