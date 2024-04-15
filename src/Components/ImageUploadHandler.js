import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Resizer from 'react-image-file-resizer';
import { Source } from '@mui/icons-material';

const UploadScreen = ({ onThumbnailSelected, thumbnail, deleteThumbnail }) => {
  const [image, setImage] = useState(thumbnail ? { uri: thumbnail } : null);


  // useEffect(() => {
  // if(thumbnail != undefined){
  //   setImage(thumbnail);
  // }
  // }) 

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
        350,
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
        minHeight: '100vh', // Ensure the component takes up the entire viewport height
      }}
    >
      <input type="file" accept="image/*" onChange={pickImage} />
      <p></p>
      <Button variant="contained" onClick={deleteImage}>
        <p>Delete Image</p>
      </Button>
      <div>
        {image && <img src={image.uri} alt="Thumbnail" style={{ width: 350, height: 450 }} />}
      </div>
    </Box>
  );
};

export default UploadScreen;
