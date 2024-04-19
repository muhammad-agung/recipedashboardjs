import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box } from '@mui/material';

const TinyMCE = ({ handleEditorStateChange, content }) => {
    const fileInputRef = useRef(null);

    // Function to handle file upload
    const handleFileUpload = (callback, value, meta) => {
        fileInputRef.current.click();
        
        // Callback with file URL when file is selected
        fileInputRef.current.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileUrl = e.target.result;
                callback(fileUrl, { text: file.name });
            };
            reader.readAsDataURL(file);
        });
    };

    // Function to handle editor content change
    const handleEditorChange = (content, editor) => {
        // Call the parent component's function to handle editor state change
        handleEditorStateChange(content);
    };
    
    return (
        <Box>
            <input
                type="file"
                accept="image/*, .pdf, .doc, .docx"
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <Editor
                apiKey= {process.env.REACT_APP_FIREBASE_TINYMCE_ID}
                init={{
                    plugins: 'anchor autolink charmap codesample emoticons image link lists searchreplace visualblocks wordcount checklist casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate mentions tableofcontents footnotes mergetags autocorrect inlinecss markdown',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image | spellcheckdialog | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    file_picker_callback: handleFileUpload,
                    selector: 'textarea',
                    height: 800,
                }}
                value={content}
                onEditorChange={handleEditorChange} // Handle editor content change
            />
        </Box>
    );
}

export default TinyMCE;
