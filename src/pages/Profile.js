import { Box, Heading, Flex, Spinner } from "@chakra-ui/core";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Profile = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  return (
    <Box>
      <Heading as="h1">Profile</Heading>
      <Box p={10}>
        <Flex
          align="center"
          justify="center"
          direction="column"
          h="full"
          border="1px dashed"
          borderColor={isDragReject ? "danger.500" : "primary.500"}
          borderRadius="lg"
          backgroundColor={isDragAccept || isLoading ? "primary.100" : "#fff"}
          px={10}
          py={60}
          {...getRootProps()}
        >
          {/* {error && (
          <Flex
            color="danger.500"
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            fontSize="sm"
            mb={4}
          >
            <Icon name="warning" size="24px" mb={2} />
            {error}
          </Flex>
        )} */}
          <input
            disabled={isLoading}
            aria-label="Drag and drop your files here or click to browse files"
            {...getInputProps()}
          />
          {isLoading ? (
            <Spinner centered w="24px" h="24px" />
          ) : isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag 'n' drop a new profile picture here, or click to select</p>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Profile;
