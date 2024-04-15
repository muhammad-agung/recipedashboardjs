import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
// import Editor from '@draft-js-plugins/editor';
import { Editor } from 'react-draft-wysiwyg';    
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw } from 'draft-js';
import Box from '@mui/material/Box';

const ContentDetailScreen = () => {
  const location = useLocation(); // Initialize useLocation hook
  const currentRecipe = location.state && location.state.currentRecipe;
  
  if (!currentRecipe) {
    return <div>Recipe not found</div>;
  }

  const contentState = convertFromRaw(JSON.parse(currentRecipe.content));
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div style={{ width: '100%', backgroundColor: '#FFCCBC' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <h1>{currentRecipe.title}</h1>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <p>{currentRecipe.shortDesc}</p>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img src={currentRecipe.thumbnail} alt={`Thumbnail for ${currentRecipe.title}`} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Editor
            wrapperStyle={{ width: '90%' }}
            editorState={editorState}
            readOnly
            toolbarHidden
            autoHeight
          />
      </Box>
    </div>
  );
};

export default ContentDetailScreen;
