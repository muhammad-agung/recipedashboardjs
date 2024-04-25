import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Resizer from 'react-image-file-resizer';

const UploadScreen = ({ onThumbnailSelected, thumbnail, deleteThumbnail }) => {
  const [image, setImage] = useState(thumbnail ? { uri: thumbnail } : null);


  const pickImage = useCallback(async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const resizeImage = await resizeFile(file);
        setImage(resizeImage);
        onThumbnailSelected(resizeImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  }, [onThumbnailSelected]);

  const deleteImage = () => {
    setImage(null);
    deleteThumbnail();
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        400,
        450,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve({ uri });
        },
        'base64'
      );
    });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '5vh',
        paddingBottom: '5vh'// Ensure the component takes up the entire viewport height
      }}
    >
      <Button onClick={deleteImage} style={{backgroundColor: '#FBE9E7', color: 'black', margin:20, padding: 10}}>
      <label for="file-upload" class="custom-file-upload">
        Upload Image 
      </label>
      </Button>
      <input id="file-upload" type="file" accept="image/*" onChange={pickImage} hidden/>
      <Button onClick={deleteImage} style={{backgroundColor: '#FBE9E7', color: 'black', margin:20, padding: 10}}>
        Delete Image
      </Button>
      <div>
        {image && <img src={image.uri} alt="Thumbnail" style={{ width: 400, height: 450 }} />}
      </div>
    </Box>
  );
};

export default UploadScreen;
