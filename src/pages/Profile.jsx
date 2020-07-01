import { Box, Heading } from "@chakra-ui/core";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Profile = (props) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Box>
      <Heading as="h1">Profile</Heading>
      <Box {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
      </Box>
    </Box>
  );
};

export default Profile;
