import styled from 'styled-components'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const StyledDiv = styled.div`
  padding: 10px;
  margin: 20px;
  border: 2px dashed #ccc;
`
const uploadToApi = async (files) => {
  const formData = new FormData();

  Array.from(files).forEach(file => {
    const name = file.name
    formData.append(name, file);
  });

  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  await axios.post('/api/slack', formData, config);
}

export default function Home() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: files => uploadToApi(files)
  })

  return (
    <>
      <StyledDiv {...getRootProps({ refKey: 'innerRef' })}>
        <input {...getInputProps()} />
        <p>Drag and drop a meme to get it to slack voting</p>
      </StyledDiv>
    </>
  )
}
