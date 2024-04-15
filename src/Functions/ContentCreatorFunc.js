import {ref, uploadBytesResumable, getStorage, getDownloadURL  } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

async function firebaseUpload(localImageFile) {
  try {
    if (!localImageFile) {
      throw new Error('Invalid file.');
    }

    console.log(localImageFile)
    const storage = getStorage();
    const storageRef = ref(storage, `images/${localImageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, localImageFile);
    // Wait for the upload to complete
    return await new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress tracking (if needed)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          } catch (urlError) {
            console.error('Error getting download URL:', urlError);
            reject(urlError);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw error;
  }
}

export const imageHandler = (file) =>{
  return new Promise(
      (resolve, reject) => {
          console.log('Uploading image...');
          firebaseUpload(file)
              .then(link => {
                  resolve({ data: { link } });
              })
              .catch(error => {
                  reject(error);
              })
      }
  );
}

export const checkEmpty = (title, shortDesc, thumbnail, content) => {
  console.log(content)
  if (!title.trim() || !shortDesc.trim() || !content.trim() || !thumbnail) {
    // If any of the fields are empty, show an alert
    alert('Items cannot be empty');
    return false;
  } else {
    // If all fields are not empty, show the confirmation modal
    return true;
  }
};


export const handleSave = async (title, shortDesc, content, thumbnail) => {
  try {
    const firestore = getFirestore();
    const docRef = await addDoc(collection(firestore, 'users'), {
      'title': title,
      'shortDesc': shortDesc,
      'content': content,
      'timestamp': new Date(),
      'thumbnail': thumbnail,
    });
    console.log('Document written with ID: ', docRef.id);
    return true;
  } catch (error) {
    console.error('Error adding document: ', error);
    return false;
  }
};