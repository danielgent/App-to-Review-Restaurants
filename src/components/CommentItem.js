import { Box, Stack, Avatar, Divider, Text } from "@chakra-ui/core";

import React from "react";

const CommentItem = ({ review }) => {
  const { comment, date, rating, reply } = review;

  return (
    <Box>
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
            {date}
          </Text>
        </Box>
      </Stack>
      {reply && (
        <>
          <Divider mb={4} />
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
