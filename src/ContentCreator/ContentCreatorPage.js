import React, { useEffect, useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useLocation hook
import { handleSave, checkEmpty } from '../Functions/ContentCreatorFunc';
import SaveModal from '../Components/Modal/SaveModal';
import ImageUploadHandler from '../Components/ImageUploadHandler';
import {MenuItem, ListItemText, Checkbox, FormControl, InputLabel, OutlinedInput, Select} from '@mui/material';
import { getFirestore, collection, getDocs} from 'firebase/firestore';
import RichTextEditor from '../Components/RichTextEditor/TinyMce';


const RecipeCreator = () => {
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState('');
  const [content, setContent] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const navigate = useNavigate();

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

  const handleEditorStateChange = (newContent) => {
    setContent(newContent);
  };

  const handleSaveClick = async () => {
    try {
      const saving = await handleSave(title, shortDesc, category, content, thumbnail);
      if (saving) {
        alert('Save success');
        navigate('/');
        setIsConfirmationVisible(false);
      } else {
        alert('Save failed');
        setIsConfirmationVisible(false);
      }
    } catch (error) {
      console.error('Error handling save:', error);
    }
  };


  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const checkEmptyFunc = () => {
    const checking = checkEmpty(title, shortDesc, category, thumbnail, content);
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
      <h1 style={{display:'flex', justifyContent:'center', padding: 10}}>Create Recipe</h1>
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
