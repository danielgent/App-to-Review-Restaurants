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
const CommentItem = ({ review, ...rest }) => {
  const { comment, dateOfVisit, rating, reply } = review;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = () => {
    // TODO - tell parent to refetch all
    onClose();
  };

  return (
    <Box {...rest}>
      <Stack direction="row" spacing="10">
        {/* TODO - from where to get this Url? Etc. */}
        <Avatar name="Dan Abrahmov" mr={4} src="https://bit.ly/dan-abramov" />
        <Box>
          <Text>{comment}</Text>
          {/* TODO - review star component ASAP */}
          <Text fontSize="lg" fontWeight="bold">
            {rating}
          </Text>
          <Text fontSize="sm">
            {/* TODO - format */}
            {dateOfVisit}
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
          <Button onClick={onOpen}>Leave Review</Button>
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
