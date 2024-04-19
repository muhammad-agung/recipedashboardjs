import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import Box from '@mui/material/Box';
import { Editor } from '@tinymce/tinymce-react'; // Import Editor component directly

const ContentDetailScreen = () => {
  const location = useLocation(); // Initialize useLocation hook
  const currentRecipe = location.state && location.state.currentRecipe;
  
  if (!currentRecipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#FFCCBC', paddingTop: '1%', paddingBottom: '50px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1%',
        }}
      >
        <h1>{currentRecipe.title}</h1>
        <p>{currentRecipe.shortDesc}</p>
        <img style={{paddingBottom: 20}} src={currentRecipe.thumbnail} alt={`Thumbnail for ${currentRecipe.title}`} />
        <Editor
          apiKey= {process.env.REACT_APP_FIREBASE_TINYMCE_ID}
          init={{
            plugins: 'anchor autolink charmap codesample emoticons image link lists searchreplace visualblocks wordcount checklist casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate mentions tableofcontents footnotes mergetags autocorrect inlinecss markdown',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image | spellcheckdialog | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            selector: 'textarea',
            height: 800,
        }}
          initialValue={currentRecipe.content} // Pass the content as initialValue
          disabled
        />
      </Box>
    </div>
  );
};

export default ContentDetailScreen;
