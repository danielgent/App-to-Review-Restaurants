import { Box, Stack, Divider, Text } from "@chakra-ui/core";
import React from "react";

import StaticRating from "components/StaticRating";
import Avatar from "components/Avatar";

// TODO - rename ReviewItem
const CommentItem = ({ review, refreshData, ...rest }) => {
  const { reviewer, comment, visitDate, rating, reply } = review;
  const { name } = reviewer;

  const formattedDate = new Date(visitDate).toDateString();

  return (
    <Box {...rest}>
      <Stack isInline spacing="10">
        <Stack spacing="2">
          <Avatar user={reviewer} />
          <Text fontStyle="italic" fontSize="xs">
            {name}
          </Text>
        </Stack>
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
