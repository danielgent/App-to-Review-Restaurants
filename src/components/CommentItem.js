import { Box, Stack, Avatar, Divider, Text } from "@chakra-ui/core";

import React from "react";

// TODO - rename ReviewItem
const CommentItem = ({ review, ...rest }) => {
  const { comment, dateOfVisit, rating, reply } = review;

  return (
    <Box {...rest}>
      <Stack direction="row" spacing="10">
        {/* TODO - from where to get this Url? Etc. */}
        <Avatar name="Dan Abrahmov" mr={4} src="https://bit.ly/dan-abramov" />
        <Box>
          <Text>{comment}</Text>
          {/* TODO - star component ASAP */}
          <Text fontSize="lg" fontWeight="bold">
            {rating}
          </Text>
          <Text fontSize="sm">
            {/* TODO - format */}
            {dateOfVisit}
          </Text>
        </Box>
      </Stack>
      {reply && (
        <>
          <Divider my={4} />
          <Box textAlign="right">
            <Text fontSize="xs">owner's reply</Text>
            <Text fontStyle="italic" fontSize="sm" color="gray.600">
              {reply}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

CommentItem.propTypes = {};

export default CommentItem;
