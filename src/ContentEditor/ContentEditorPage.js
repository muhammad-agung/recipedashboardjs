import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation hook

import { handleSave, checkEmpty } from '../Functions/ContentEditorFunc';
import SaveModal from '../Components/Modal/SaveModal';
import RichTextEditor from '../Components/RichTextEditor/TinyMceEditor'; // Import RichTextEditor component

import ImageUploadHandler from '../Components/ImageUploadHandler';

const RecipeEditor = () => {
  const location = useLocation(); // Initialize useLocation hook
  const currentRecipe = location.state && location.state.currentRecipe;
  const navigate = useNavigate();

  const [title, setTitle] = useState(currentRecipe.title);
  const [shortDesc, setShortDesc] = useState(currentRecipe.shortDesc);
  const [thumbnail, setThumbnail] = useState(currentRecipe.thumbnail);
  const [content, setContent] = useState(currentRecipe.content);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const handleEditorStateChange = (newContent) => {
    setContent(newContent);
  };

  const handleSaveClick = async () => {
    try {
      const saving = await handleSave(currentRecipe.id, title, shortDesc, content, thumbnail);
      if (saving) {
        alert('Update success');
        navigate('/home');
        setIsConfirmationVisible(false);
      } else {
        alert('Update failed');
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
        <h3>Title</h3>
        <TextField
          inputProps={{ maxLength: 50 }}
          required
          id="outlined-required"
          label="Required"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '10px', width: '80%' }}
        />
        <h3>Short Description</h3>
        <TextField
          inputProps={{ maxLength: 150 }}
          required
          id="outlined-required"
          label="Required"
          defaultValue={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          style={{ marginBottom: '10px', width: '80%' }}
        />
        <ImageUploadHandler onThumbnailSelected={handleThumbnailSelected} deleteThumbnail={deleteThumbnail} thumbnail={thumbnail} />
        <RichTextEditor content={content} handleEditorStateChange={handleEditorStateChange} /> {/* Replaced the Editor with RichTextEditor */}
        <Button variant="contained" onClick={checkEmptyFunc} style={{marginTop: 20}}>
          Update Recipe
        </Button>
      </Box>
      <SaveModal open={isConfirmationVisible} handleClose={handleClose} handleSave={handleSaveClick} />
    </div>
  );
};

export default RecipeEditor;
