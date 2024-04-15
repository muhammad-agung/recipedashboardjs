import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, doc, deleteDoc, getDocs} from 'firebase/firestore';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import DeleteModal from '../Components/Modal/DeleteModal';
import {TextField, Stack,Divider, Radio, RadioGroup, FormControlLabel, Pagination, Button, Table, TableBody, TableRow, TableCell, IconButton, Checkbox} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';

import { Link as RouterLink } from 'react-router-dom';
import {db} from '../Firebase/Firebase'


const Homepage = () => {
  const [originalContents, setOriginalContents] = useState([]);
  const [contents, setContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const pageNumbers = [];
  const [recipesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteItemId, setDeleteItemId] = useState(null); // Add state to store the id of the item to be deleted

  useEffect(() => {
    const fetchContent = async () => {
      const firestore = getFirestore();
      let q = query(collection(firestore, 'users'));

      const querySnapshot = await getDocs(q);

      const fetchedContents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp.toDate();
        fetchedContents.push({
          id: doc.id,
          title: data.title,
          shortDesc: data.shortDesc,
          timestamp: timestamp,
          content: data.content,
          thumbnail: data.thumbnail
        });
      });
      setOriginalContents(fetchedContents);
      setContents(fetchedContents);
    };

    fetchContent();
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchQuery(searchTerm);
    // Filter recipes based on search term
    const filteredRecipes = originalContents.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm)
    );
    // Update the contents state with the filtered recipes
    setContents(filteredRecipes);
    // Reset current page to 1 when search term changes
    setCurrentPage(1);
  };


  const handleDeleteModalOpen = (itemId) => {
    // Implement your delete logic 
    setDeleteItemId(itemId);
    setDeleteModalOpen(true); // Open the delete modal
  };

  const handleDeleteClick = async () => {
    try {
      const firestore = getFirestore();
      await deleteDoc(doc(firestore, 'users', deleteItemId)); // Delete the document with the specified id
      setDeleteModalOpen(false); // Close the modal after deletion
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Function to sort contents by date
  const sortByDate = () => {
    const sortedContents = [...contents].sort((a, b) => a.timestamp - b.timestamp);
    setContents(sortedContents);
  };

  // Function to sort contents by title alphabetically
  const sortByTitle = () => {
    const sortedContents = [...contents].sort((a, b) => a.title.localeCompare(b.title));
    setContents(sortedContents);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = contents.slice(indexOfFirstRecipe, indexOfLastRecipe);

  for (let i = 1; i <= Math.ceil(contents.length / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <DeleteModal open={deleteModalOpen} handleClose={() => setDeleteModalOpen(false)} handleDelete={handleDeleteClick} />
      <div style={{ textAlign: 'center' }}>
        <TextField id="outlined-search" label="Search field" type="search" value={searchQuery} onChange={handleSearchChange} style={{ width: '100%', maxWidth: '300px', margin: 10, backgroundColor: '#FBE9E7' }} />
      </div>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} textAlign={'center'}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="female" control={<Radio onClick={sortByTitle}/>} label="Sort by Title" />
          <FormControlLabel value="male" control={<Radio onClick={sortByDate}/>} label="Sort by Date" />
        </RadioGroup>
      </Stack>
      <Table>
        <TableBody>
          {currentRecipes.map((recipe) => (
            <TableRow key={recipe.id} style={{ backgroundColor: '#FBE9E7', borderRadius: 100 }}>
              <TableCell>
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{recipe.title}</div>
                  Created: {recipe.timestamp.toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell align='right'>
              <IconButton component={RouterLink} to={`/recipe/${recipe.id}`}  state={{ currentRecipe: recipe }}>
                  <Visibility />
                </IconButton>
                <IconButton component={RouterLink} to={`/recipeEditor/${recipe.id}`}  state={{ currentRecipe: recipe }}>
                  <EditIcon />
                </IconButton>
                <IconButton  onClick={() => handleDeleteModalOpen(recipe.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack spacing={2} sx={{ display:"flex" , justifyContent:"center", alignItems:"center", marginTop : 10, paddingBottom: 5 }}>
        <Pagination count={pageNumbers.length} variant="outlined" color="primary" onChange={handleChange} style={{backgroundColor: 'white'}}/>
      </Stack>
    </div>
  );
};

export default Homepage;
