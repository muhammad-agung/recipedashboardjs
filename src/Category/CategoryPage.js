import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { collection, getDocs, getDoc, setDoc, deleteDoc, doc, getFirestore } from 'firebase/firestore';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10); // Set the number of categories per page

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleAddCategory = async () => {
    try {
      // Ensure newCategoryName is not empty
      if (!newCategoryName.trim()) {
        return;
      }
      const firestore = getFirestore();
      const categoryRef = doc(firestore, 'recipeCategories', newCategoryName.trim());
    
      // Check if the category already exists
      const docSnap = await getDoc(categoryRef);
      if (docSnap.exists()) {
        // Category already exists
        alert('Category already exists.');
        return;
      }
    
      // Add the category to the Firestore collection with the same ID as its name
      await setDoc(categoryRef, { name: newCategoryName.trim() });
  
      // Update categories state to include the newly added category
      setCategories(prevCategories => [...prevCategories, { id: categoryRef.id, name: newCategoryName.trim() }]);
    
      // Clear the input field after adding the category
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  

  const handleRemoveCategory = async (categoryId) => {
    try {
      const firestore = getFirestore();
      await deleteDoc(doc(firestore, 'recipeCategories', categoryId));
      setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  // Calculate index of the last category on the current page
  const indexOfLastCategory = currentPage * categoriesPerPage;
  // Calculate index of the first category on the current page
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  // Get current categories to display based on pagination
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box backgroundColor={'#FBE9E7'} minHeight={1000}>
      <Box mb={2} paddingTop={10} display="flex" justifyContent="center" minWidth={400}>
        <TextField
          label="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddCategory}>Add</Button>
      </Box>
      <TableContainer component={Paper} style={{ backgroundColor: '#FBE9E7', padding:10 }} >
        <Table size='lg'>
          <TableHead style={{ backgroundColor: '#f0ada5', borderColor: 'grey', borderWidth: 2 }}>
            <TableRow style={{fontWeight:'bold'}}>
              <TableCell style={{fontWeight:'bold'}}>Category Name</TableCell>
              <TableCell align='right' style={{fontWeight:'bold'}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCategories.map(category => (
              <TableRow key={category.id} style={{borderColor: 'grey', borderWidth: 2}}>
                <TableCell style={{ fontWeight: 'bold' }}>{category.name}</TableCell>
                <TableCell align='right'>
                  <Button onClick={() => handleRemoveCategory(category.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
          <Button key={i} onClick={() => paginate(i + 1)}>{i + 1}</Button>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryManagementPage;
