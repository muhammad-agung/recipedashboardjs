import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { handleSave, checkEmpty } from '../Functions/ContentCreatorFunc';
import SaveModal from '../Components/Modal/SaveModal';
import RichTextEditor from '../Components/RichTextEditor/Textditor';
import ImageUploadHandler from '../Components/ImageUploadHandler';

const RecipeCreator = () => {
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [thumbnail, setThumbnail] = useState([]);
  const [content, setContent] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const handleEditorStateChange = (newContent) => {
    setContent(newContent);
  };

  const handleSaveClick = async () => {
    try {
      const saving = await handleSave(title, shortDesc, content, thumbnail);
      if (saving) {
        alert('Save success');
        window.location.reload();
        setIsConfirmationVisible(false);
      } else {
        alert('Save failed');
        setIsConfirmationVisible(false);
      }
    } catch (error) {
      console.error('Error handling save:', error);
    }
  };

  const checkEmptyFunc = () => {
    const checking = checkEmpty(title, shortDesc, thumbnail, content);
    setIsConfirmationVisible(checking);
  };

  const handleThumbnailSelected = (uri) => {
    setThumbnail(uri); // Set the resized image URI to the thumbnail state
  };

  const deleteThumbnail = () => {
    setThumbnail(null); // Set thumbnail state to null to delete the image
  };

  const handleClose = () => {
    setIsConfirmationVisible(false);
  };

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
        <TextField
          inputProps={{ maxLength: 50 }}
          required
          id="outlined-required"
          label="Title"
          defaultValue={title}
          onChange={(text) => setTitle(text.target.value)}
          style={{ marginBottom: '10px', width: '80%' }}
        />
        <TextField
          inputProps={{ maxLength: 150 }}
          required
          id="outlined-required"
          label="Short Description"
          defaultValue={shortDesc}
          onChange={(text) => setShortDesc(text.target.value)}
          style={{ marginBottom: '10px', width: '80%' }}
        />
        <ImageUploadHandler onThumbnailSelected={handleThumbnailSelected} deleteThumbnail={deleteThumbnail} />
        <RichTextEditor handleEditorStateChange={handleEditorStateChange} />
        <Button variant="contained" onClick={checkEmptyFunc} style={{ marginTop: '20px' }}>
          Save Recipe
        </Button>
      </Box>
      <SaveModal open={isConfirmationVisible} handleClose={() => handleClose()} handleSave={handleSaveClick} />
    </div>
  );
};

export default RecipeCreator;
