import { Box, Stack, Avatar, Divider, Text } from "@chakra-ui/core";
import React from "react";

import StaticRating from "components/StaticRating";

// TODO - rename ReviewItem
const CommentItem = ({ review, refreshData, ...rest }) => {
  const { reviewer, comment, visitDate, rating, reply } = review;
  const { avatarFilename, username } = reviewer;

  const formattedDate = new Date(visitDate).toDateString();

  const avatarImageUrl = `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

  return (
    <Box {...rest}>
      <Stack direction="row" spacing="10">
        <Avatar name={username} mr={4} src={avatarImageUrl} />
        <Box>
          <Text>{comment}</Text>
          <StaticRating value={rating} />
          <Text fontSize="xs" fontStyle="italic" color="grey.500">
            {formattedDate}
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

export default CommentItem;
