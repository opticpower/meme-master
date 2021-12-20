import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const StyledDiv = styled.div`
  padding: 10px;
  margin: 20px;
  border: 2px dashed #ccc;
`;

const StyledButton = styled.button`
  height: 40px;
  background: #4c4ff1;
  margin-top: 40px;
  margin-left: 20px;
  color: white;
  border-radius: 8px;
`;

export default function Home() {
  // Loading State
  const [loading, setLoading] = useState(false);
  const [background, setBackground] = useState('#D391FA');
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: files => uploadToApi(files),
  });

  const uploadToApi = async files => {
    const formData = new FormData();

    Array.from(files).forEach(file => {
      const name = file.name;
      formData.append(name, file);
    });

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted > 16 && percentCompleted < 32) {
            setBackground('#C364FA');
          } else if (percentCompleted > 32 && percentCompleted < 48) {
            setBackground('#A230ED');
          } else if (percentCompleted > 48 && percentCompleted < 64) {
            setBackground('#6B00D7');
          } else if (percentCompleted > 64 && percentCompleted < 80) {
            setBackground('#3B00B3');
          } else if (percentCompleted > 80 && percentCompleted < 99) {
            setBackground('#I90087');
          } else {
            setBackground('#D391FA');
          }
          console.log('Percent is ', percentCompleted);
        }
      },
    };

    await axios.post('/api/slack', formData, config);
  };

  const getMemeScore = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/memeScore');
      console.log('response', response);
    } catch (e) {
      console.log('e', e, e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          background: ${background};
        }
      `}</style>
      <StyledDiv {...getRootProps({ refKey: 'innerRef' })}>
        <input {...getInputProps()} />
        <p>{background === '#D391FA' ? 'Drag a meme to start voting' : 'Uploading...'}</p>
      </StyledDiv>
      <StyledButton disabled={loading} onClick={getMemeScore}>
        Get Last Message Score
      </StyledButton>
    </>
  );
}
