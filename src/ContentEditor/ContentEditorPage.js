import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation hook
import { handleSave, checkEmpty } from '../Functions/ContentEditorFunc';
import SaveModal from '../Components/Modal/SaveModal';
import RichTextEditor from '../Components/RichTextEditor/TinyMceEditor'; // Import RichTextEditor component
import {MenuItem, ListItemText, Checkbox, FormControl, InputLabel, OutlinedInput, Select} from '@mui/material';
import ImageUploadHandler from '../Components/ImageUploadHandler';
import { getFirestore, collection, getDocs} from 'firebase/firestore';

const RecipeEditor = () => {
  const location = useLocation(); // Initialize useLocation hook
  const currentRecipe = location.state && location.state.currentRecipe;
  const navigate = useNavigate();

  const [title, setTitle] = useState(currentRecipe.title);
  const [shortDesc, setShortDesc] = useState(currentRecipe.shortDesc);
  const [thumbnail, setThumbnail] = useState(currentRecipe.thumbnail);
  const [content, setContent] = useState(currentRecipe.content);
  const [category, setCategory] = useState(currentRecipe.category);
  const [categories, setCategories] = useState([]);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const firestore = getFirestore();
        const querySnapshot = await getDocs(collection(firestore, 'recipeCategories'));
        const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(typeof value === 'string' ? value.split(',') : value);
    console.log(category)
  };

  const handleSaveClick = async () => {
    try {
      const saving = await handleSave(currentRecipe.id, title, shortDesc, category, content, thumbnail);
      if (saving) {
        alert('Update success');
        navigate('/');
        setIsConfirmationVisible(false);
      } else {
        alert('Update failed');
        setIsConfirmationVisible(false);
      }
    } catch (error) {
      console.error('Error handling save:', error);
    }
  };

  const handleEditorStateChange = (newContent) => {
    setContent(newContent);
  };

  const checkEmptyFunc = () => {
    const checking = checkEmpty(title, shortDesc, category, thumbnail, content, category);
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
      <h1 style={{display:'flex', justifyContent:'center', padding: 10}}>Edit Recipe</h1>
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
                <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={category}
          onChange={handleCategoryChange}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) => selected.join(', ')}
          // MenuProps={MenuProps}
        >
          {categories.map((name) => (
            <MenuItem key={name.id} value={name.id}>
              <Checkbox checked={category.includes(name.id)} />
              <ListItemText primary={name.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        <ImageUploadHandler onThumbnailSelected={handleThumbnailSelected} deleteThumbnail={deleteThumbnail} thumbnail={thumbnail} />
        <RichTextEditor content={content} handleEditorStateChange={handleEditorStateChange} />
        <Button variant="contained" onClick={checkEmptyFunc} style={{marginTop: 20}}>
          Update Recipe
        </Button>
      </Box>
      <SaveModal open={isConfirmationVisible} handleClose={handleClose} handleSave={handleSaveClick} />
    </div>
  );
};

export default RecipeEditor;
