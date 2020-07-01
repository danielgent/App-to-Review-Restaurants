import {
  Box,
  Stack,
  Avatar,
  Divider,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/core";

import React from "react";

import AddReplyModal from "components/AddReplyModal";

// TODO - rename ReviewItem
const CommentItem = ({ review, refreshData, ...rest }) => {
  const { reviewer, comment, visitDate, rating, reply } = review;
  const { avatarFilename, username } = reviewer;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = () => {
    refreshData();
    onClose();
  };

  const formattedDate = new Date(visitDate).toDateString();

  const avatarImageUrl = `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

  return (
    <Box {...rest}>
      <Stack direction="row" spacing="10">
        <Avatar name={username} mr={4} src={avatarImageUrl} />
        <Box>
          <Text>{comment}</Text>
          {/* TODO - review star component ASAP */}
          <Text fontSize="lg" fontWeight="bold">
            {rating}
          </Text>
          <Text fontSize="xs" fontStyle="italic" color="grey.500">
            {formattedDate}
          </Text>
        </Box>
      </Stack>
      {reply ? (
        <>
          <Divider my={4} />
          <Box textAlign="right">
            <Text fontSize="xs">owner's reply</Text>
            <Text fontStyle="italic" fontSize="sm" color="gray.600">
              {reply}
            </Text>
          </Box>
        </>
      ) : (
        // TODO - won't be like this. Should only appear on owner's restaurant detail page under a list of unreplied reviews
        <Box>
          <Button onClick={onOpen}>Reply</Button>
          <AddReplyModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            reviewId={review._id}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;
