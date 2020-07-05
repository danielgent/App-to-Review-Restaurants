import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Box, Flex, Text, Alert, Icon } from "@chakra-ui/core";

const Dropzone = ({
  onDropAccepted,
  onDropRejected,
  file,
  setFile,
  ...rest
}) => {
  const [error, setError] = React.useState(null);

  const handleDropAccepted = (acceptedFiles) => {
    const imageBlob = acceptedFiles[0];
    setFile(imageBlob);
    setError();
  };

  const handleDropRejected = (rejectedFiles) => {
    setError("Please check uploaded images and try again");
    onDropRejected(rejectedFiles);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,
    multiple: false,
    maxSize: 1e6,
  });

  return (
    <Box p={10} {...rest}>
      {!file ? (
        <Flex
          align="center"
          justify="center"
          direction="column"
          h="full"
          border="1px dashed"
          borderColor={isDragReject ? "danger.500" : "primary.500"}
          borderRadius="lg"
          backgroundColor={isDragAccept ? "primary.100" : "#fff"}
          px={10}
          py={60}
          {...getRootProps()}
        >
          <input
            aria-label="Drag and drop your files here or click to browse files"
            {...getInputProps()}
          />
          {isDragActive ? (
            <Text>Drop the file here ...</Text>
          ) : (
            <>
              <Text>
                Drag 'n' drop a new profile picture here, or click to select
              </Text>
              <Text fontSize="xs">Max image size is 1mb</Text>
            </>
          )}
        </Flex>
      ) : (
        <Flex align="center" justify="center" direction="column">
          <Text fontSize="lg" mb={6}>
            File Uploaded
          </Text>
          <Text fontStyle="italic">{file.name}</Text>
          <Button variant="ghost" onClick={() => setFile()}>
            Clear
          </Button>
        </Flex>
      )}
      {error && (
        <Alert
          status="error"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <Icon name="warning" size="32px" color="red.500" />
          <Text maxWidth="sm">{error}</Text>
        </Alert>
      )}
    </Box>
  );
};

export default Dropzone;
