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
import { collection, getDocs, getDoc, setDoc, query, where, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import ImageUploadHandler from '../Components/ImageUploadHandler';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
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
      // Ensure newCategoryName and categoryImage are not empty
      if (!newCategoryName.trim() || !categoryImage) {
        alert('Category name and image cannot be empty.');
        return;
      }
      
      const firestore = getFirestore();
  
      // Check if the category already exists
      const querySnapshot = await getDocs(
        query(collection(firestore, 'recipeCategories'), where('name', '==', newCategoryName.trim()))
      );
      if (!querySnapshot.empty) {
        // Category already exists
        alert('Category already exists.');
        return;
      }
  
      // Add the category to Firestore if it doesn't exist
      await setDoc(doc(collection(firestore, 'recipeCategories'), newCategoryName.trim()), {
        name: newCategoryName.trim(),
        image: categoryImage,
      });
  
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  

  const handleRemoveCategory = async (categoryId, categoryName) => {
    try {
      const firestore = getFirestore();
      const categoryDoc = doc(firestore, 'recipeCategories', categoryId);
      const categorySnapshot = await getDoc(categoryDoc);
      const categoryData = categorySnapshot.data();
  
      if (categoryData.imageURL) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `categoryImages/${categoryName}`);
        await deleteObject(imageRef);
      }
  
      await deleteDoc(categoryDoc);
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

  const handleCategoryImageSelected = (uri) => {
    setCategoryImage(uri); // Set the resized image URI to the thumbnail state
  };

  const deleteCategoryImage = () => {
    setCategoryImage(null); // Set thumbnail state to null to delete the image
  };

  return (
    <Box backgroundColor={'#FBE9E7'} minHeight={1000}>
      <Box mb={2} paddingTop={10} display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <ImageUploadHandler onThumbnailSelected={handleCategoryImageSelected} deleteThumbnail={deleteCategoryImage} thumbnail={categoryImage} />
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
                  <Button onClick={() => handleRemoveCategory(category.id, category.name)}>Remove</Button>
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
